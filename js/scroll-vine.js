/*!
 * Scroll Vine — a vine/plant stem that grows down the page as you scroll.
 * Vanilla JS, zero dependencies, self-injects its own CSS. Drop in ONE file.
 *
 * QUICK START
 *   <script src="scroll-vine.js"></script>                       (starts automatically)
 *
 * OPTIONAL SETTINGS (as data-attributes on the script tag)
 *   <script src="scroll-vine.js"
 *           data-color="#09AD2A"        stem + leaf colour
 *           data-accent="#E6BD54"       bud colour
 *           data-side="auto"            auto | start | end | left | right   (auto follows dir="rtl")
 *           data-start="header"         CSS selector where the vine begins   (default: top of page)
 *           data-end="footer"           CSS selector where it ends           (default: bottom of page)
 *           data-anchors="section"      elements that get a bud + a slight bulge (default: section)
 *           data-min-width="900"        hide below this viewport width (px)  (default: 900)
 *           data-edge="20"              distance from the screen edge (px)   (default: 20)
 *           data-width="3"              stem thickness (px)                  (default: 3)
 *           data-z-index="3"            stacking order                       (default: 3)
 *           data-seed="7"               change for a different leaf pattern></script>
 *
 * MANUAL CONTROL
 *   <script>window.SCROLL_VINE_MANUAL = true;</script>   (before the script, disables auto-start)
 *   const vine = ScrollVine.init({ color: '#2e7d32', side: 'end', start: '#hero', end: '#footer' });
 *   vine.refresh();   // after you change page height yourself
 *   vine.destroy();   // remove it completely
 */
(function () {
  'use strict';
  if (window.ScrollVine) return;

  var NS = 'http://www.w3.org/2000/svg';
  var CSS_ID = 'scroll-vine-css';
  var SCRIPT = document.currentScript;

  var DEFAULTS = {
    color: '#09AD2A', accent: '#E6BD54', side: 'auto',
    start: null, end: null, anchors: 'section',
    minWidth: 900, edge: 20, width: 3, zIndex: 3, seed: 7,
    reducedMotion: 'static'          // 'static' = show the finished vine, no animation | 'hide'
  };

  /* ---------- helpers ---------- */
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function rng(seed) {               // tiny seeded RNG → leaves keep the same positions on every rebuild
    var s = seed >>> 0;
    return function () { s += 0x6D2B79F5; var t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function fromAttrs(el) {
    var o = {}; if (!el || !el.dataset) return o;
    var d = el.dataset, num = function (k) { return d[k] !== undefined && d[k] !== '' && !isNaN(+d[k]) ? +d[k] : undefined; };
    if (d.color) o.color = d.color;           if (d.accent) o.accent = d.accent;
    if (d.side) o.side = d.side;              if (d.start) o.start = d.start;
    if (d.end) o.end = d.end;                 if (d.anchors) o.anchors = d.anchors;
    if (d.reducedMotion) o.reducedMotion = d.reducedMotion;
    ['minWidth', 'edge', 'width', 'zIndex', 'seed'].forEach(function (k) { var n = num(k); if (n !== undefined) o[k] = n; });
    return o;
  }

  function injectCSS() {
    if (document.getElementById(CSS_ID)) return;
    var s = document.createElement('style'); s.id = CSS_ID;
    s.textContent =
      '.sv-wrap{position:absolute;left:0;width:100%;pointer-events:none;overflow:hidden;contain:layout paint}' +
      '.sv-wrap svg{display:block;overflow:visible}' +
      '.sv-guide,.sv-stem{fill:none;stroke:var(--sv-color);stroke-linecap:round}' +
      '.sv-guide{opacity:.12}.sv-stem{opacity:.6;will-change:stroke-dashoffset}' +
      '.sv-leaf,.sv-bud{transform-origin:0 0;transition:transform .9s cubic-bezier(.22,1.35,.36,1)}' +
      '.sv-leaf{fill:var(--sv-color);opacity:.8;transform:translate(var(--tx),var(--ty)) rotate(var(--r)) scale(0)}' +
      '.sv-leaf.on{transform:translate(var(--tx),var(--ty)) rotate(var(--r)) scale(var(--s))}' +
      '.sv-bud{fill:var(--sv-accent);transform:translate(var(--tx),var(--ty)) scale(0)}' +
      '.sv-bud.on{transform:translate(var(--tx),var(--ty)) scale(1)}' +
      '.sv-wrap.sv-static .sv-leaf,.sv-wrap.sv-static .sv-bud{transition:none}' +
      '@media (max-width:1199px){.sv-stem{opacity:.35}.sv-leaf{opacity:.55}}';
    document.head.appendChild(s);
  }

  /* ---------- main ---------- */
  function init(userOptions) {
    var o = {}, k;
    for (k in DEFAULTS) o[k] = DEFAULTS[k];
    for (k in (userOptions || {})) if (userOptions[k] !== undefined) o[k] = userOptions[k];

    injectCSS();
    var root = document.documentElement;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce && o.reducedMotion === 'hide') return { refresh: function () {}, destroy: function () {} };

    var wrap = document.createElement('div');
    wrap.className = 'sv-wrap' + (reduce ? ' sv-static' : '');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.zIndex = o.zIndex;
    wrap.style.setProperty('--sv-color', o.color);
    wrap.style.setProperty('--sv-accent', o.accent);
    wrap.innerHTML = '<svg xmlns="' + NS + '"><path class="sv-guide"/><path class="sv-stem"/><g></g></svg>';
    document.body.appendChild(wrap);

    var svg = wrap.firstChild, guide = svg.querySelector('.sv-guide'), stem = svg.querySelector('.sv-stem'), g = svg.querySelector('g');
    guide.style.strokeWidth = stem.style.strokeWidth = o.width + 'px';
    var L = 0, top = 0, H = 1, marks = [], destroyed = false, tick = false, hidden = false;

    var docY = function (el) { return el.getBoundingClientRect().top + window.pageYOffset; };
    var isRTL = function () { return root.dir === 'rtl' || getComputedStyle(document.body).direction === 'rtl'; };
    function physicalLeft() {                                    // resolve to a physical side
      var s = String(o.side).toLowerCase();
      if (s === 'left') return true;
      if (s === 'right') return false;
      var start = s === 'end' ? false : true;
      return isRTL() ? !start : start;
    }

    function build() {
      if (destroyed) return;
      var W = root.clientWidth;
      hidden = W < o.minWidth;
      wrap.style.display = hidden ? 'none' : '';
      if (hidden) return;

      var a = o.start ? document.querySelector(o.start) : null;
      var b = o.end ? document.querySelector(o.end) : null;
      top = a ? docY(a) : 0;
      var bottom = b ? docY(b) + b.offsetHeight : Math.max(root.scrollHeight, document.body.scrollHeight);
      H = Math.max(1, bottom - top);
      wrap.style.top = top + 'px'; wrap.style.height = H + 'px';
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('width', W); svg.setAttribute('height', H);

      var anchors = [];
      if (o.anchors) {
        [].forEach.call(document.querySelectorAll(o.anchors), function (el) {
          var y = docY(el) - top + 28; if (y > 0 && y < H) anchors.push(y);
        });
        if (anchors.length > 40) anchors = anchors.slice(0, 40);
      }

      var left = physicalLeft(), dir = left ? 1 : -1, x0 = left ? o.edge : W - o.edge, step = 180, pts = [], y, i;
      for (y = 0; y <= H + step; y += step) {                    // gentle sine wobble + bulge near each anchor
        var near = Infinity; for (i = 0; i < anchors.length; i++) near = Math.min(near, Math.abs(anchors[i] - y));
        pts.push([x0 + dir * (6 + (near < step * .6 ? 14 : 0) + Math.sin(y / step * 1.8) * 10), Math.min(y, H)]);
      }
      var d = 'M' + pts[0][0] + ' ' + pts[0][1];                 // Catmull-Rom → cubic Bézier
      for (i = 0; i < pts.length - 1; i++) {
        var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
                   (p2[0] - (p3[0] - p1[0]) / 6) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6) + ' ' + p2[0] + ' ' + p2[1];
      }
      guide.setAttribute('d', d); stem.setAttribute('d', d);
      L = stem.getTotalLength(); stem.style.strokeDasharray = L;

      g.textContent = ''; marks = [];
      var rand = rng(o.seed);
      var add = function (len, el) { g.appendChild(el); marks.push({ len: len, el: el }); };
      for (var len = 90, n = 0; len < L; len += 120 + rand() * 40, n++) {          // leaves along the stem
        var p = stem.getPointAtLength(len), leaf = document.createElementNS(NS, 'path');
        leaf.setAttribute('d', 'M0 0C-10-8-10-24 0-34C10-24 10-8 0 0z'); leaf.setAttribute('class', 'sv-leaf');
        leaf.style.cssText = '--tx:' + p.x + 'px;--ty:' + p.y + 'px;--r:' + (dir * (n % 2 ? 46 : -24)) + 'deg;--s:' + (.6 + rand() * .25);
        add(len, leaf);
      }
      anchors.forEach(function (ay) {                            // amber bud where the vine meets each anchor
        var l = 0; while (l < L && stem.getPointAtLength(l).y < ay) l += 6;
        var q = stem.getPointAtLength(l), bud = document.createElementNS(NS, 'circle');
        bud.setAttribute('r', 5.5); bud.setAttribute('class', 'sv-bud'); bud.style.cssText = '--tx:' + q.x + 'px;--ty:' + q.y + 'px';
        add(l, bud);
      });
      update();
    }

    function update() {
      if (destroyed || hidden) return;
      var p = reduce ? 1 : clamp((window.pageYOffset + window.innerHeight * .7 - top) / Math.max(1, H - window.innerHeight * .3), 0, 1)   /* reaches 100% exactly at the bottom of the page */;
      stem.style.strokeDashoffset = L * (1 - p);
      for (var i = 0; i < marks.length; i++) marks[i].el.classList.toggle('on', marks[i].len <= L * p);
    }
    function onScroll() { if (tick) return; tick = true; requestAnimationFrame(function () { tick = false; update(); }); }

    var timer;
    function refresh() { clearTimeout(timer); timer = setTimeout(build, 120); }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', refresh);
    window.addEventListener('load', refresh);
    var ro = 'ResizeObserver' in window ? new ResizeObserver(refresh) : null;      // page grows when images / content load
    if (ro) ro.observe(document.body);
    var mo = new MutationObserver(refresh);                                        // dir="rtl" ↔ "ltr" switch
    mo.observe(root, { attributes: true, attributeFilter: ['dir', 'lang'] });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

    build();

    return {
      refresh: build,
      destroy: function () {
        destroyed = true; clearTimeout(timer);
        window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', refresh); window.removeEventListener('load', refresh);
        if (ro) ro.disconnect(); mo.disconnect(); wrap.remove();
      }
    };
  }

  window.ScrollVine = { init: init, version: '1.0.0' };

  /* auto-start unless the page asked for manual control */
  if (!window.SCROLL_VINE_MANUAL) {
    var start = function () { window.__scrollVine = init(fromAttrs(SCRIPT)); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  }
})();
