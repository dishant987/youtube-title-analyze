import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: Number(process.env.EMAIL_SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASS,
  },
});

export async function sendVideoLinkEmail(
  to: string,
  subject: string,
  html: string
) {
  return transport.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
}
