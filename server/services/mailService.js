import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {
  getLightEmailHtml,
  getScheduleCreatedEmailTemplate,
  getScheduleReminderEmailTemplate,
} from "../templates/emailTemplate.js";
import { verifyEmailTemplate } from "../templates/verfication-email.js";

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

const getFromDetails = () => {
  const fromName = process.env.FROM_NAME || "DevHub Workspace";
  const fromEmail = process.env.FROM_EMAIL || "notifications@devhub.com";
  return `"${fromName}" <${fromEmail}>`;
};

// Generic Light Theme Notification Dispatcher
export const sendNotificationEmail = async ({ to, subject, title, body, actionUrl, badgeText }) => {
  const htmlContent = getLightEmailHtml({ title, body, actionUrl, badgeText });

  if (!process.env.SMTP_USER || process.env.SMTP_USER === "your_email@gmail.com") {
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: getFromDetails(),
      to,
      subject,
      html: htmlContent,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 1. Auth Email Verification Mailer
export const sendAuthVerificationEmail = async ({ to, name, verificationToken, actionUrl }) => {
  const verifyUrl = actionUrl || `http://localhost:5173/verify-email?token=${verificationToken}`;
  const htmlContent = verifyEmailTemplate(name || "Developer", verifyUrl);

  if (!process.env.SMTP_USER || process.env.SMTP_USER === "your_email@gmail.com") {
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: getFromDetails(),
      to,
      subject: "Verify Your Email - DevHub",
      html: htmlContent,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 2. Schedule Created Confirmation Mailer
export const sendScheduleCreatedEmail = async ({ to, name, title, scheduledDate, description, actionUrl }) => {
  const htmlContent = getScheduleCreatedEmailTemplate({ name, title, scheduledDate, description, actionUrl });

  if (!process.env.SMTP_USER || process.env.SMTP_USER === "your_email@gmail.com") {
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: getFromDetails(),
      to,
      subject: `⏰ Upcoming Schedule Set: ${title}`,
      html: htmlContent,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 3. Schedule Reminder Mailer
export const sendScheduleReminderEmail = async ({ to, name, title, scheduledDate, description, actionUrl }) => {
  const htmlContent = getScheduleReminderEmailTemplate({ name, title, scheduledDate, description, actionUrl });

  if (!process.env.SMTP_USER || process.env.SMTP_USER === "your_email@gmail.com") {
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: getFromDetails(),
      to,
      subject: `⏰ Scheduled Event Reminder: ${title}`,
      html: htmlContent,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
