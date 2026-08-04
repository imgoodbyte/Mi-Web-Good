import nodemailer from "nodemailer";

import { buildContactMessage } from "./contact.js";

export function createMailer(config) {
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    requireTLS: !config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.password,
    },
    disableFileAccess: true,
    disableUrlAccess: true,
  });

  return {
    verify: () => transporter.verify(),
    sendContactEmail: async (contact) => {
      const message = buildContactMessage(contact);

      return transporter.sendMail({
        from: {
          name: config.mailFromName,
          address: config.smtp.user,
        },
        to: config.contactEmail,
        replyTo: {
          name: contact.name,
          address: contact.email,
        },
        subject: message.subject,
        text: message.text,
        html: message.html,
      });
    },
  };
}
