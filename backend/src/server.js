import "dotenv/config";

import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { createMailer } from "./mailer.js";

try {
  const config = loadConfig();
  const mailer = createMailer(config);
  const app = createApp({
    sendContactEmail: mailer.sendContactEmail,
    frontendOrigins: config.frontendOrigins,
    isProduction: config.isProduction,
  });

  app.listen(config.port, () => {
    console.log(`API de contacto disponible en http://localhost:${config.port}`);
  });

  mailer
    .verify()
    .then(() => console.log("Conexión SMTP verificada."))
    .catch((error) =>
      console.error("No se pudo verificar la conexión SMTP:", error.message),
    );
} catch (error) {
  console.error("No se pudo iniciar la API:", error.message);
  process.exitCode = 1;
}
