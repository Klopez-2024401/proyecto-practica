import nodemailer from 'nodemailer';
import { config } from '../configs/config.js';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.username,
    pass: config.smtp.password,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n📧 [DEV] Correo a ${to} — asunto: "${subject}"\n${html}\n`);
  }

  try {
    await transporter.sendMail({
      from: `"${config.email.fromName}" <${config.email.from}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Error enviando correo:', error.message);
  }
};
