/**
 * Modular Light-Theme HTML Email Templates for DevHub Workspace
 */

// Base Light Theme Container Layout Generator
export const getLightEmailHtml = ({ title, body, actionUrl, badgeText = "DevHub Notification" }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      margin: 0;
      padding: 32px 16px;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #ffffff;
      padding: 24px 32px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      text-decoration: none;
    }
    .brand-accent {
      color: #2563eb;
    }
    .badge {
      display: inline-block;
      background-color: #eff6ff;
      color: #2563eb;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: 1px solid #dbeafe;
    }
    .content {
      padding: 32px;
    }
    .title {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 16px 0;
      line-height: 1.3;
    }
    .body-text {
      font-size: 15px;
      color: #475569;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .btn-wrapper {
      text-align: left;
      margin: 28px 0 12px;
    }
    .btn {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      padding: 12px 24px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
    }
    .footer {
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 20px 32px;
      font-size: 12px;
      color: #94a3b8;
      text-align: center;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="brand"> Dev<span class="brand-accent">Hub</span></span>
    </div>
    <div class="content">
      ${badgeText ? `<div class="badge">${badgeText}</div>` : ""}
      <h1 class="title">${title}</h1>
      <div class="body-text">${body}</div>
      ${actionUrl ? `<div class="btn-wrapper"><a href="${actionUrl}" class="btn">View in DevHub Dashboard</a></div>` : ""}
    </div>
    <div class="footer">
      <p>© 2026 DevHub Developer Workspace • Light Theme Notification Service</p>
    </div>
  </div>
</body>
</html>
  `;
};

// 1. Auth Registration & Email Verification Template
export const getAuthVerificationEmailTemplate = ({ name, email, verificationToken, actionUrl }) => {
  const verifyLink = actionUrl || `http://localhost:5173/verify-email?token=${verificationToken}`;
  return getLightEmailHtml({
    title: `Verify Your Email Address`,
    badgeText: "Account Verification",
    body: `
      <p>Hello <strong>${name || "Developer"}</strong>,</p>
      <p>Thanks for signing up for <strong>DevHub Workspace</strong>! Please verify your email address by clicking the button below.</p>
      <p style="font-size: 13px; color: #64748b; margin-top: 12px;">This verification link will expire in <strong>24 hours</strong>.</p>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 20px; word-break: break-all;">
        If the button doesn't work, copy and paste this URL into your browser:<br>
        <a href="${verifyLink}" style="color: #2563eb;">${verifyLink}</a>
      </p>
    `,
    actionUrl: verifyLink,
  });
};

// 2. Welcome Email Template (Post-Verification)
export const getWelcomeEmailTemplate = ({ name, actionUrl }) => {
  return getLightEmailHtml({
    title: `Welcome to DevHub Workspace, ${name || "Developer"}! 🎉`,
    badgeText: "Welcome Onboard",
    body: `
      <p>Hello <strong>${name || "Developer"}</strong>,</p>
      <p>Your email address has been successfully verified! You now have full access to your developer productivity suite:</p>
      <ul style="color: #475569; padding-left: 20px; line-height: 1.8;">
        <li>⚡ <strong>Sprint Task Backlog</strong>: Manage and track developer tasks.</li>
        <li>📝 <strong>Dev Notebook</strong>: Write code snippets, notes, and technical specs.</li>
        <li>📅 <strong>Upcoming Schedule Manager</strong>: Set calendar events & automated reminders.</li>
        <li>🔔 <strong>Live Notification Bell</strong>: Receive real-time workspace updates.</li>
      </ul>
    `,
    actionUrl: actionUrl || "http://localhost:5173/dashboard",
  });
};

// 3. Schedule Created Confirmation Template
export const getScheduleCreatedEmailTemplate = ({ name, title, scheduledDate, description, actionUrl }) => {
  return getLightEmailHtml({
    title: `Schedule Created: ${title}`,
    badgeText: "Schedule Confirmation",
    body: `
      <p>Hi <strong>${name || "Developer"}</strong>,</p>
      <p>You have successfully scheduled an upcoming event on DevHub:</p>
      <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; margin: 16px 0; border-radius: 6px;">
        <p style="margin: 0 0 8px 0; font-weight: 700; color: #0f172a;">"${title}"</p>
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #475569;">📅 Date & Time: <strong>${scheduledDate}</strong></p>
        ${description ? `<p style="margin: 0; font-size: 13px; color: #64748b;"><em>Description: ${description}</em></p>` : ""}
      </div>
    `,
    actionUrl: actionUrl || "http://localhost:5173/schedules",
  });
};

// 4. Upcoming Schedule Reminder Template
export const getScheduleReminderEmailTemplate = ({ name, title, scheduledDate, description, actionUrl }) => {
  return getLightEmailHtml({
    title: `⏰ Upcoming Event Reminder: ${title}`,
    badgeText: "Schedule Alert",
    body: `
      <p>Hi <strong>${name || "Developer"}</strong>,</p>
      <p>This is a reminder that your scheduled event <strong>"${title}"</strong> is coming up soon!</p>
      <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 16px 0; border-radius: 6px;">
        <p style="margin: 0 0 8px 0; font-weight: 700; color: #14532d;">📅 Scheduled For: ${scheduledDate}</p>
        ${description ? `<p style="margin: 0; font-size: 13px; color: #166534;"><em>${description}</em></p>` : ""}
      </div>
    `,
    actionUrl: actionUrl || "http://localhost:5173/schedules",
  });
};

// 5. Task Created Notification Template
export const getTaskCreatedEmailTemplate = ({ name, text, priority, category, actionUrl }) => {
  return getLightEmailHtml({
    title: `Task Added to Backlog: "${text}"`,
    badgeText: "Task Created",
    body: `
      <p>Hi <strong>${name || "Developer"}</strong>,</p>
      <p>A new task has been added to your DevHub backlog:</p>
      <div style="background-color: #f8fafc; border-left: 4px solid #38bdf8; padding: 16px; margin: 16px 0; border-radius: 6px;">
        <p style="margin: 0 0 6px 0; font-weight: 700; color: #0f172a;">${text}</p>
        <p style="margin: 0; font-size: 13px; color: #64748b;">Priority: <strong>${priority || "Medium"}</strong> • Category: <strong>${category || "General"}</strong></p>
      </div>
    `,
    actionUrl: actionUrl || "http://localhost:5173/tasks",
  });
};

// 6. Task Completed Notification Template
export const getTaskCompletedEmailTemplate = ({ name, text, actionUrl }) => {
  return getLightEmailHtml({
    title: `✅ Task Completed: "${text}"`,
    badgeText: "Sprint Activity",
    body: `
      <p>Hi <strong>${name || "Developer"}</strong>,</p>
      <p>Great progress! The following task was marked as completed in your backlog:</p>
      <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin: 16px 0; border-radius: 6px;">
        <p style="margin: 0; font-weight: 700; color: #14532d;">${text}</p>
      </div>
    `,
    actionUrl: actionUrl || "http://localhost:5173/tasks",
  });
};

// 7. Task Backlog Digest Reminder Template
export const getTaskReminderEmailTemplate = ({ name, count, taskListHtml, actionUrl }) => {
  return getLightEmailHtml({
    title: `⏰ Sprint Tasks Reminder — ${count} Pending Items`,
    badgeText: "Task Digest",
    body: `
      <p>Hi <strong>${name || "Developer"}</strong>,</p>
      <p>Here is your current pending sprint backlog update:</p>
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 10px; border: 1px solid #e2e8f0; margin: 16px 0;">
        ${taskListHtml}
      </div>
    `,
    actionUrl: actionUrl || "http://localhost:5173/tasks",
  });
};

// 8. Note Created Notification Template
export const getNoteCreatedEmailTemplate = ({ name, title, tag, actionUrl }) => {
  return getLightEmailHtml({
    title: `Note Saved: "${title}"`,
    badgeText: "Notebook Update",
    body: `
      <p>Hi <strong>${name || "Developer"}</strong>,</p>
      <p>You created a new note in your DevHub Notebook under the tag <strong>${tag || "General"}</strong>.</p>
    `,
    actionUrl: actionUrl || "http://localhost:5173/notebook",
  });
};

// 9. Profile Updated Security Notification Template
export const getProfileUpdatedEmailTemplate = ({ name, actionUrl }) => {
  return getLightEmailHtml({
    title: `Profile Information Updated`,
    badgeText: "Security & Account",
    body: `
      <p>Hi <strong>${name || "Developer"}</strong>,</p>
      <p>Your DevHub profile details were recently updated. If you did not make this change, please review your account settings immediately.</p>
    `,
    actionUrl: actionUrl || "http://localhost:5173/profile",
  });
};
