const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
loadEnvFile(path.join(ROOT, '.env'));
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 4173);
const MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini';
const MAX_BODY_BYTES = 2_000_000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2'
};
const recentRequests = new Map();

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || Object.prototype.hasOwnProperty.call(process.env, match[1])) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

function send(res, status, body, contentType = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'content-type': contentType, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
  res.end(contentType.startsWith('application/json') ? JSON.stringify(body) : body);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let tooLarge = false;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        tooLarge = true;
        return;
      }
      if (!tooLarge) chunks.push(chunk);
    });
    req.on('end', () => {
      if (tooLarge) {
        reject(Object.assign(new Error('Request body is too large.'), { statusCode: 413 }));
        return;
      }
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { reject(Object.assign(new Error('Request body must be valid JSON.'), { statusCode: 400 })); }
    });
    req.on('error', reject);
  });
}

function rateLimited(req) {
  const now = Date.now();
  const key = req.socket.remoteAddress || 'local';
  const record = recentRequests.get(key) || { startedAt: now, count: 0 };
  if (now - record.startedAt > 60_000) { record.startedAt = now; record.count = 0; }
  record.count += 1;
  recentRequests.set(key, record);
  return record.count > 15;
}

function getCatalog() {
  return JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'ai-products.json'), 'utf8'));
}

function buildInstructions(language, city, catalog) {
  const languageName = language === 'ar' ? 'Arabic' : 'English';
  const cityContext = city ? `The user selected ${city} as their delivery city.` : 'The user has not selected a delivery city.';
  return [
    'You are Agrismart AI, a warm, practical plant-care and shopping assistant embedded in the Agrismart plant store.',
    `Reply in ${languageName}. Keep a natural conversational flow: answer the actual question, ask a concise follow-up when key context is missing, and remember earlier messages in this conversation. Do not behave like a fixed FAQ or only give canned checklists.`,
    'For plant-care questions, reason from symptoms, plant species, watering, light, soil, drainage, humidity, season, and recent changes. Clearly distinguish possibilities from confirmed facts; give safe, practical next checks. Never claim certainty from one symptom or image. Uploaded images may help you describe visible details, but do not invent what cannot be seen.',
    'Use the product catalog below as the only source for product names, prices, URLs, and IDs. Recommend zero to three relevant items only when genuinely useful. Never invent stock, a discount, a product, or a price. A catalog suggestion is not a medical treatment for a sick plant.',
    'Order records stay in the customer browser and are not sent to you. Do not claim to look up an order; ask them to use the Find an order tool in this page.',
    'There is no verified live store/branch directory or inventory feed connected. Do not invent a nearby store, distance, opening hours, pickup availability, or stock. You may use the selected delivery city for context and explain that online products are listed in the shop.',
    'Never request passwords, payment card details, or other secrets. If a condition might spread among plants, recommend isolating the plant while checking it. Be clear when professional horticulture advice would help.',
    cityContext,
    'Product catalog (authoritative; IDs must be returned exactly):',
    JSON.stringify(catalog.map(({ id, name, price, category, traits, url }) => ({ id, name, price, currency: 'USD', category, traits, url })))
  ].join('\n\n');
}

async function assistantResponse(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    send(res, 503, { error: 'The AI service is not configured yet. Add OPENAI_API_KEY to the project .env file, then restart the server.' });
    return;
  }
  if (rateLimited(req)) {
    send(res, 429, { error: 'Too many messages were sent in a short time. Please wait a minute and try again.' });
    return;
  }

  try {
    const body = await parseJsonBody(req);
    if (!Array.isArray(body.messages) || body.messages.length < 1) {
      send(res, 400, { error: 'Send at least one conversation message.' });
      return;
    }
    const allowedRoles = new Set(['user', 'assistant']);
    const messages = body.messages.slice(-16).filter(message => allowedRoles.has(message?.role) && typeof message.content === 'string')
      .map(message => ({ role: message.role, content: message.content.slice(0, 4000) }));
    if (!messages.length || messages[messages.length - 1].role !== 'user' || !messages[messages.length - 1].content.trim()) {
      send(res, 400, { error: 'Your latest message is empty.' });
      return;
    }

    let imageUrl = '';
    if (body.image?.dataUrl) {
      const dataUrl = String(body.image.dataUrl);
      if (dataUrl.length > 1_500_000 || !/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(dataUrl)) {
        send(res, 400, { error: 'Attach a PNG, JPEG, or WebP photo smaller than 1 MB.' });
        return;
      }
      imageUrl = dataUrl;
    }

    const catalog = getCatalog();
    const city = ['Amman', 'Zarqa', 'Irbid', 'Salt', 'Aqaba', 'Madaba'].includes(body.city) ? body.city : '';
    const input = messages.map((message, index) => {
      if (imageUrl && index === messages.length - 1) {
        return { role: message.role, content: [{ type: 'input_text', text: message.content }, { type: 'input_image', image_url: imageUrl, detail: 'low' }] };
      }
      return { role: message.role, content: message.content };
    });
    const schema = {
      type: 'object', additionalProperties: false,
      properties: {
        reply: { type: 'string' },
        productIds: { type: 'array', items: { type: 'string' } }
      },
      required: ['reply', 'productIds']
    };

    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        instructions: buildInstructions(body.language === 'ar' ? 'ar' : 'en', city, catalog),
        input,
        max_output_tokens: 900,
        text: { format: { type: 'json_schema', name: 'agrismart_assistant_reply', strict: true, schema } }
      }),
      signal: AbortSignal.timeout(65_000)
    });
    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error(`OpenAI Responses API returned ${upstream.status}:`, result?.error?.message || 'No error details');
      send(res, upstream.status === 429 ? 429 : 502, { error: upstream.status === 429
        ? 'The AI service is busy or its usage limit was reached. Please try again shortly.'
        : 'The AI service could not complete this reply. Check the server key, model setting, and API account, then try again.' });
      return;
    }
    const outputText = result.output_text || result.output?.flatMap(item => item.content || []).find(item => item.type === 'output_text')?.text || '';
    let parsed;
    try { parsed = JSON.parse(outputText); }
    catch {
      send(res, 502, { error: 'The AI service returned an unreadable reply. Please try again.' });
      return;
    }
    const allowedIds = new Set(catalog.map(item => item.id));
    const products = [...new Set(Array.isArray(parsed.productIds) ? parsed.productIds : [])]
      .filter(id => allowedIds.has(id)).slice(0, 3)
      .map(id => catalog.find(item => item.id === id));
    send(res, 200, { reply: String(parsed.reply || ''), products, model: MODEL });
  } catch (error) {
    if (res.destroyed) return;
    if (error.statusCode) send(res, error.statusCode, { error: error.message });
    else {
      console.error('Assistant request failed:', error.message);
      send(res, 502, { error: 'Could not reach the AI service. Check your connection and try again.' });
    }
  }
}

function serveStatic(req, res, requestUrl) {
  let pathname;
  try { pathname = decodeURIComponent(requestUrl.pathname); }
  catch { send(res, 400, { error: 'Invalid URL path.' }); return; }
  if (pathname === '/') pathname = '/index.html';
  const file = path.resolve(ROOT, `.${pathname}`);
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) { send(res, 403, { error: 'Forbidden.' }); return; }
  fs.stat(file, (statError, stat) => {
    if (statError || !stat.isFile()) { send(res, 404, 'Not found.', 'text/plain; charset=utf-8'); return; }
    const contentType = MIME_TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'content-type': contentType, 'x-content-type-options': 'nosniff' });
    if (req.method === 'HEAD') { res.end(); return; }
    fs.createReadStream(file).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
  if (req.method === 'GET' && requestUrl.pathname === '/api/status') {
    send(res, 200, { configured: Boolean(process.env.OPENAI_API_KEY), model: MODEL });
    return;
  }
  if (req.method === 'POST' && requestUrl.pathname === '/api/chat') {
    assistantResponse(req, res);
    return;
  }
  if (!['GET', 'HEAD'].includes(req.method)) { send(res, 405, { error: 'Method not allowed.' }); return; }
  serveStatic(req, res, requestUrl);
});

server.listen(PORT, HOST, () => {
  console.log(`Agrismart is running at http://${HOST}:${PORT}`);
  console.log(`AI model: ${MODEL} · API key ${process.env.OPENAI_API_KEY ? 'configured' : 'not configured yet'}`);
});
