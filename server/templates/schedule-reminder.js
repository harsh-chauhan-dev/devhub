import { baseLayout } from "./baseLayout.js";

export const getScheduleReminderEmailTemplate = ({
  name,
  title,
  scheduledDate,
  description,
  actionUrl,
}) => {
  const content = `
    <p>Hello <strong>${name || "Developer"}</strong>,</p>

    <p>This is an automated reminder that your scheduled event is due soon!</p>

    <div style="background-color:#F0FDF4;border-left:4px solid #16A34A;padding:16px;margin:20px 0;border-radius:8px;">
      <h3 style="margin:0 0 8px 0;color:#14532D;font-size:18px;">⏰ "${title}"</h3>
      <p style="margin:0 0 8px 0;color:#15803D;font-size:14px;font-weight:bold;">📅 Scheduled Date: ${scheduledDate}</p>
      ${description ? `<p style="margin:0;color:#166534;font-size:13px;"><em>${description}</em></p>` : ""}
    </div>

    <p style="text-align:center;margin:30px 0 10px;">
      <a
        href="${actionUrl || "http://localhost:5173/schedules"}"
        style="
          background:#16A34A;
          color:#ffffff;
          text-decoration:none;
          padding:12px 24px;
          border-radius:8px;
          display:inline-block;
          font-weight:bold;
        "
      >
        Open Schedule Details
      </a>
    </p>
  `;

  return baseLayout({
    title: "⏰ Upcoming Schedule Reminder",
    content,
   
  });
};