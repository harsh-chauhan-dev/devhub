import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection when the server starts
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Failed");
    console.error(error);
  } else {
    console.log("✅ SMTP Server is ready to send emails.");
  }
});

const getFromDetails = () => {
  return `"${process.env.FROM_NAME || "DevHub Workspace"}" <${
    process.env.FROM_EMAIL || process.env.SMTP_USER
  }>`;
};

export const sendMail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error(
      "SMTP credentials are missing. Check SMTP_USER and SMTP_PASS."
    );
  }

  try {
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
    console.error("❌ Email Sending Failed");
    console.error(error);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    throw error;
  }
};