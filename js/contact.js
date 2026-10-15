document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const fileInput = form.querySelector('input[type="file"]');
  const uploadName = document.getElementById("uploadName");
  const status = document.getElementById("contactFormStatus");

  fileInput.addEventListener("change", () => {
    uploadName.textContent =
      fileInput.files?.[0]?.name || "Choose a file or drop it here";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const name = `${values.get("firstName")} ${values.get("lastName")}`.trim();
    const subject = `[Agrismart ${values.get("topic")}] ${values.get("subject")}`;
    const body = [
      `Name: ${name}`,
      `Email: ${values.get("email")}`,
      values.get("phone") ? `Phone: ${values.get("phone")}` : "",
      `Topic: ${values.get("topic")}`,
      "",
      values.get("message"),
      "",
      values.get("attachment")?.name
        ? `Please attach this file: ${values.get("attachment").name}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
    status.textContent =
      "Opening your email app with the request details. Add the selected attachment there before sending.";
    window.location.href = `mailto:alaafrihat52@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});
