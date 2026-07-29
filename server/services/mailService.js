import { sendMail } from "./sendMail.js";
import { verifyEmailTemplate } from "../templates/verfication-email.js";
import { getScheduleCreatedEmailTemplate } from "../templates/schedule.js";
import { getScheduleReminderEmailTemplate } from "../templates/schedule-reminder.js";
import {
  getLightEmailHtml,
  getWelcomeEmailTemplate,
  getTaskCreatedEmailTemplate,
  getTaskCompletedEmailTemplate,
  getTaskReminderEmailTemplate,
  getNoteCreatedEmailTemplate,
  getProfileUpdatedEmailTemplate,
} from "../templates/emailTemplate.js";

// 1. Auth Registration & Verification Email
export const sendAuthVerificationEmail = async ({
  to,
  name,
  verificationToken,
  actionUrl,
}) => {
  const verifyUrl = actionUrl ?? `${process.env.CLIENT_URL || "http://localhost:5173"}/verify-email?token=${verificationToken}`;
  const html = verifyEmailTemplate({
    name,
    verifyUrl,
  });

  return sendMail({
    to,
    subject: "Verify your Email Address - DevHub Workspace",
    html,
  });
};

// 2. Welcome Email (Post-Verification)
export const sendWelcomeEmail = async ({ to, name, actionUrl }) => {
  const html = getWelcomeEmailTemplate({ name, actionUrl: actionUrl || `${process.env.CLIENT_URL || "http://localhost:5173"}/dashboard` });
  return sendMail({
    to,
    subject: "Welcome to DevHub Workspace! 🎉",
    html,
  });
};

// 3. Schedule Created Email
export const sendScheduleCreatedEmail = async (data) => {
  const actionUrl = data.actionUrl || `${process.env.CLIENT_URL || "http://localhost:5173"}/schedules`;
  const html = getScheduleCreatedEmailTemplate({ ...data, actionUrl });
  return sendMail({
    to: data.to,
    subject: `Schedule Created - ${data.title}`,
    html,
  });
};

// 4. Schedule Reminder Email
export const sendScheduleReminderEmail = async (data) => {
  const actionUrl = data.actionUrl || `${process.env.CLIENT_URL || "http://localhost:5173"}/schedules`;
  const html = getScheduleReminderEmailTemplate({ ...data, actionUrl });
  return sendMail({
    to: data.to,
    subject: `⏰ Upcoming Schedule Reminder - ${data.title}`,
    html,
  });
};

export const sendScheduleReminderEmailTemplate = sendScheduleReminderEmail;

// 5. Task Created Email
export const sendTaskCreatedEmail = async ({ to, name, text, priority, category, actionUrl }) => {
  const html = getTaskCreatedEmailTemplate({ name, text, priority, category, actionUrl });
  return sendMail({
    to,
    subject: `New Task Added - "${text}"`,
    html,
  });
};

// 6. Task Completed Email
export const sendTaskCompletedEmail = async ({ to, name, text, actionUrl }) => {
  const html = getTaskCompletedEmailTemplate({ name, text, actionUrl });
  return sendMail({
    to,
    subject: `✅ Task Completed - "${text}"`,
    html,
  });
};

// 7. Task Reminder Digest Email
export const sendTaskReminderEmail = async ({ to, name, count, taskListHtml, actionUrl }) => {
  const html = getTaskReminderEmailTemplate({ name, count, taskListHtml, actionUrl });
  return sendMail({
    to,
    subject: `⏰ Sprint Tasks Reminder (${count} pending)`,
    html,
  });
};

// 8. Note Created Email
export const sendNoteCreatedEmail = async ({ to, name, title, tag, actionUrl }) => {
  const html = getNoteCreatedEmailTemplate({ name, title, tag, actionUrl });
  return sendMail({
    to,
    subject: `Note Saved - "${title}"`,
    html,
  });
};

// 9. Profile Updated Security Email
export const sendProfileUpdatedEmail = async ({ to, name, actionUrl }) => {
  const html = getProfileUpdatedEmailTemplate({ name, actionUrl });
  return sendMail({
    to,
    subject: `Security Alert: Profile Information Updated`,
    html,
  });
};

// 10. General System Notification Email
export const sendNotificationEmail = async ({
  to,
  subject,
  title,
  body,
  actionUrl,
  badgeText,
}) => {
  const html = getLightEmailHtml({
    title,
    body,
    actionUrl,
    badgeText,
  });
  return sendMail({
    to,
    subject,
    html,
  });
};