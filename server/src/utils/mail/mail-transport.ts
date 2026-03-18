import { createTransport, Transporter } from "nodemailer";
import { env } from "../../config/env";

export class Mailer {
  private static transport: Transporter | null = null;

  static getTransport(): Transporter {
    if (this.transport) {
      return this.transport;
    }

    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_SECURE,
      SMTP_MAX_CONNECTIONS,
      SMTP_MAX_MESSAGES,
      SMTP_USER,
      SMTP_PASS,
    } = env;

    this.transport = createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Boolean(SMTP_SECURE),
      pool: true,
      maxConnections: Number(SMTP_MAX_CONNECTIONS),
      maxMessages: Number(SMTP_MAX_MESSAGES),
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    return this.transport;
  }
}
