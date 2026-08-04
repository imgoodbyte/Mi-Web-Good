const REQUIRED_VARIABLES = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "CONTACT_EMAIL",
];

export function loadConfig(environment = process.env) {
  const missingVariables = REQUIRED_VARIABLES.filter(
    (name) => !environment[name]?.trim(),
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Faltan variables de entorno requeridas: ${missingVariables.join(", ")}`,
    );
  }

  const smtpPort = Number(environment.SMTP_PORT);
  const port = Number(environment.PORT || 3000);

  if (!Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) {
    throw new Error("SMTP_PORT debe ser un puerto válido.");
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT debe ser un puerto válido.");
  }

  const frontendOrigins = (environment.FRONTEND_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

  return {
    port,
    isProduction: environment.NODE_ENV === "production",
    frontendOrigins,
    smtp: {
      host: environment.SMTP_HOST.trim(),
      port: smtpPort,
      secure: environment.SMTP_SECURE === "true" || smtpPort === 465,
      user: environment.SMTP_USER.trim(),
      password: environment.SMTP_PASSWORD,
    },
    contactEmail: environment.CONTACT_EMAIL.trim(),
    mailFromName: environment.MAIL_FROM_NAME?.trim() || "Portafolio Good",
  };
}
