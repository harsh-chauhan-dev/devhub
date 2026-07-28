import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendNotificationEmail = async ({ to, subject, title, body, actionUrl }) => {
  const fromName = process.env.FROM_NAME || "DevHub Workspace";
  const fromEmail = process.env.FROM_EMAIL || "notifications@devhub.com";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0B0F19; color: #E2E8F0; margin: 0; padding: 20px; }
        .card { max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid #1E293B; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { text-align: center; border-bottom: 1px solid #1E293B; padding-bottom: 20px; margin-bottom: 24px; }
        .brand { font-size: 24px; font-weight: 800; color: #4F7CFF; letter-spacing: -0.5px; }
        .title { font-size: 18px; font-weight: 700; color: #F8FAFC; margin-bottom: 12px; }
        .body-text { font-size: 14px; color: #94A3B8; line-height: 1.6; margin-bottom: 24px; }
        .btn { display: inline-block; background-color: #4F7CFF; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 10px; }
        .footer { border-top: 1px solid #1E293B; margin-top: 32px; padding-top: 16px; font-size: 11px; color: #64748B; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="brand">⚡ DevHub Workspace</div>
        </div>
        <div class="title">${title}</div>
        <div class="body-text">${body}</div>
        ${actionUrl ? `<div style="text-align: center;"><a href="${actionUrl}" class="btn">View in DevHub Dashboard</a></div>` : ''}
        <div class="footer">
          <p>© 2026 DevHub Developer Productivity Portal • Automated Email Notification</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!process.env.SMTP_USER || process.env.SMTP_USER === "your_email@gmail.com") {
    // console.log(`✉️ [Mail Service Simulation] Email queued to: ${to} | Subject: "${subject}"`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html: htmlContent,
    });
    // console.log(`✅ [Mail Service] Email successfully sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // console.error(`❌ [Mail Service Error] Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};
