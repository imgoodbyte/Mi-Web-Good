import assert from "node:assert/strict";
import test from "node:test";

import { createApp } from "../src/app.js";

async function startTestServer(sendContactEmail = async () => {}) {
  const app = createApp({
    sendContactEmail,
    frontendOrigins: ["https://portfolio.example"],
  });
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();

  return {
    url: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

test("GET /api/health informa que la API está disponible", async (context) => {
  const server = await startTestServer();
  context.after(server.close);

  const response = await fetch(`${server.url}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("POST /api/contact valida y entrega el contacto al servicio de correo", async (context) => {
  let deliveredContact;
  const server = await startTestServer(async (contact) => {
    deliveredContact = contact;
  });
  context.after(server.close);

  const response = await fetch(`${server.url}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://portfolio.example",
    },
    body: JSON.stringify({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Quiero conversar sobre un proyecto tecnológico.",
      website: "",
    }),
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), "https://portfolio.example");
  assert.equal(deliveredContact.email, "ada@example.com");
});

test("POST /api/contact devuelve 400 cuando los datos son inválidos", async (context) => {
  const server = await startTestServer();
  context.after(server.close);

  const response = await fetch(`${server.url}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "A", email: "correo", message: "corto" }),
  });

  assert.equal(response.status, 400);
  assert.equal((await response.json()).ok, false);
});

test("POST /api/contact no entrega mensajes detectados por el honeypot", async (context) => {
  let deliveryCount = 0;
  const server = await startTestServer(async () => {
    deliveryCount += 1;
  });
  context.after(server.close);

  const response = await fetch(`${server.url}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Spam Bot",
      email: "bot@example.com",
      message: "Mensaje automatizado suficientemente largo.",
      website: "https://spam.example",
    }),
  });

  assert.equal(response.status, 200);
  assert.equal(deliveryCount, 0);
});
