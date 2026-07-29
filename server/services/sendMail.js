import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_PORT === "465",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const getFromDetails = () => {
  return `"${process.env.FROM_NAME || "DevHub Workspace"}" <${
    process.env.FROM_EMAIL || process.env.SMTP_USER
  }>`;
};

export const sendMail = async ({ to, subject, html }) => {
  if (
    !process.env.SMTP_USER ||
    process.env.SMTP_USER === "your_email@gmail.com"
  ) {
    return {
      success: true,
      simulated: true,
    };
  }

  try {
    const info = await transporter.sendMail({
      from: getFromDetails(),
      to,
      subject,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Mail Error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};