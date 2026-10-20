import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { env } from "./env";

let transporter: Transporter | null = null;

export function mailEnabled() {
  return Boolean(env.SMTP.host && env.SMTP.user && env.SMTP.pass && !env.SMTP.pass.startsWith("<"));
}

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP.host,
      port: env.SMTP.port,
      secure: env.SMTP.port === 465,
      auth: { user: env.SMTP.user, pass: env.SMTP.pass },
    });
  }
  return transporter;
}

/** Sends an email; returns false (and logs) instead of throwing so checkout never fails on SMTP issues. */
export async function sendMail(opts: { to: string; subject: string; html: string; text?: string }) {
  if (!mailEnabled()) {
    console.warn("[mail] SMTP not configured — skipping email to", opts.to);
    return false;
  }
  try {
    await getTransporter().sendMail({ from: env.SMTP.from, ...opts });
    return true;
  } catch (err) {
    console.error("[mail] failed to send", err);
    return false;
  }
}
