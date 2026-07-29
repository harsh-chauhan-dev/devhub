import nodemailer from "nodemailer";

const getTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const rawPass = process.env.SMTP_PASS || "";
  const pass = rawPass.replace(/\s+/g, "");

  // Use Nodemailer built-in Gmail service for Gmail addresses
  if (host.includes("gmail") || !process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });
};

const getFromDetails = () => {
  return `"${process.env.FROM_NAME || "DevHub Workspace"}" <${
    process.env.FROM_EMAIL || process.env.SMTP_USER || "noreply@devhub.com"
  }>`;
};

export const sendMail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️ SMTP credentials missing (SMTP_USER / SMTP_PASS). Skipping email dispatch.");
    return {
      success: false,
      simulated: true,
      error: "SMTP_USER or SMTP_PASS not configured.",
    };
  }

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: getFromDetails(),
      to,
      subject,
      html,
    });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email Sent Successfully");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Message ID:", info.messageId);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ Email Sending Failed / Timed Out:", error.message);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return {
      success: false,
      error: error.message,
    };
  }
};