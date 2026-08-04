import assert from "node:assert/strict";
import test from "node:test";

import { buildContactMessage, escapeHtml, validateContact } from "../src/contact.js";

test("validateContact normaliza un contacto válido", () => {
  const result = validateContact({
    name: "  Ada Lovelace  ",
    email: "  ADA@EXAMPLE.COM ",
    message: "  Quiero conversar sobre un proyecto tecnológico.  ",
  });

  assert.deepEqual(result.contact, {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "Quiero conversar sobre un proyecto tecnológico.",
    website: "",
  });
});

test("validateContact rechaza datos inválidos", () => {
  assert.match(
    validateContact({ name: "A", email: "correo", message: "corto" }).error,
    /nombre/i,
  );
  assert.match(
    validateContact({ name: "Ada", email: "correo", message: "Mensaje suficientemente largo" }).error,
    /correo/i,
  );
});

test("validateContact detecta el campo honeypot", () => {
  assert.equal(
    validateContact({
      name: "Ada",
      email: "ada@example.com",
      message: "Mensaje suficientemente largo",
      website: "https://spam.example",
    }).isSpam,
    true,
  );
});

test("buildContactMessage escapa contenido HTML", () => {
  const contact = {
    name: "<Ada>",
    email: "ada@example.com",
    message: "Hola <script>alert('x')</script>",
  };
  const message = buildContactMessage(contact);

  assert.equal(escapeHtml("<&>"), "&lt;&amp;&gt;");
  assert.doesNotMatch(message.html, /<script>/);
  assert.match(message.text, /<script>/);
});
