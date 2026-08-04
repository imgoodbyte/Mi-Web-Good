import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";

import { validateContact } from "./contact.js";

export function createApp({ sendContactEmail, frontendOrigins = [], isProduction = false }) {
  const app = express();
  const allowedOrigins = new Set(
    frontendOrigins.map((origin) => origin.replace(/\/$/, "")),
  );

  if (isProduction) {
    app.set("trust proxy", 1);
  }

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        const normalizedOrigin = origin?.replace(/\/$/, "");
        const isAllowed = !origin || allowedOrigins.has(normalizedOrigin);
        callback(null, isAllowed);
      },
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
    }),
  );
  app.use(express.json({ limit: "10kb", type: "application/json" }));

  app.get("/api/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });

  const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      ok: false,
      message: "Has enviado varios mensajes. Intenta nuevamente en unos minutos.",
    },
  });

  app.post("/api/contact", contactLimiter, async (request, response) => {
    if (!request.is("application/json")) {
      return response.status(415).json({
        ok: false,
        message: "El formato de la solicitud no es compatible.",
      });
    }

    const validation = validateContact(request.body);

    if (validation.isSpam) {
      return response.status(200).json({ ok: true, message: "Mensaje recibido." });
    }

    if (validation.error) {
      return response.status(400).json({
        ok: false,
        message: validation.error,
      });
    }

    try {
      await sendContactEmail(validation.contact);
      return response.status(200).json({
        ok: true,
        message: "¡Mensaje enviado! Te responderé pronto.",
      });
    } catch (error) {
      console.error("No se pudo enviar el correo de contacto:", error.message);
      return response.status(502).json({
        ok: false,
        message: "No se pudo enviar el mensaje. Intenta nuevamente más tarde.",
      });
    }
  });

  app.use((error, _request, response, _next) => {
    if (error instanceof SyntaxError && "body" in error) {
      return response.status(400).json({
        ok: false,
        message: "La solicitud contiene datos JSON no válidos.",
      });
    }

    console.error("Error inesperado en la API:", error.message);
    return response.status(500).json({
      ok: false,
      message: "Ocurrió un error inesperado.",
    });
  });

  return app;
}
