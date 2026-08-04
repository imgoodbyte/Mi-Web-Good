const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function containsHeaderBreak(value) {
  return /[\r\n]/.test(value);
}

export function validateContact(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { error: "Los datos enviados no son válidos." };
  }

  const contact = {
    name: normalizeText(payload.name),
    email: normalizeText(payload.email).toLowerCase(),
    message: normalizeText(payload.message),
    website: normalizeText(payload.website),
  };

  if (contact.website) {
    return { isSpam: true };
  }

  if (contact.name.length < 2 || contact.name.length > 100) {
    return { error: "El nombre debe tener entre 2 y 100 caracteres." };
  }

  if (
    contact.email.length > 254 ||
    !EMAIL_PATTERN.test(contact.email) ||
    containsHeaderBreak(contact.email)
  ) {
    return { error: "Ingresa un correo electrónico válido." };
  }

  if (containsHeaderBreak(contact.name)) {
    return { error: "El nombre contiene caracteres no permitidos." };
  }

  if (contact.message.length < 10 || contact.message.length > 3000) {
    return { error: "El mensaje debe tener entre 10 y 3000 caracteres." };
  }

  return { contact };
}

export function escapeHtml(value) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character],
  );
}

export function buildContactMessage(contact) {
  const safeName = escapeHtml(contact.name);
  const safeEmail = escapeHtml(contact.email);
  const safeMessage = escapeHtml(contact.message).replace(/\n/g, "<br>");

  return {
    subject: `Nuevo contacto desde Good — ${contact.name}`,
    text: [
      "Nuevo contacto desde el portafolio Good",
      "",
      `Nombre: ${contact.name}`,
      `Email: ${contact.email}`,
      "",
      "Mensaje:",
      contact.message,
    ].join("\n"),
    html: `
      <h2>Nuevo contacto desde el portafolio Good</h2>
      <p><strong>Nombre:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${safeMessage}</p>
    `,
  };
}
