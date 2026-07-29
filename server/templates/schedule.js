import { baseLayout } from "./baseLayout.js";

export const getScheduleCreatedEmailTemplate = ({
  name,
  title,
  scheduledDate,
  description,
  actionUrl,
}) => {
  const content = `
    <p>Hello <strong>${name || "Developer"}</strong>,</p>

    <p>Your upcoming schedule event has been successfully created in DevHub Workspace.</p>

    <div style="background-color:#F1F5F9;border-left:4px solid #4F7CFF;padding:16px;margin:20px 0;border-radius:8px;">
      <h3 style="margin:0 0 8px 0;color:#0F172A;font-size:18px;">"${title}"</h3>
      <p style="margin:0 0 8px 0;color:#2563EB;font-size:14px;font-weight:bold;">📅 ${scheduledDate}</p>
      ${description ? `<p style="margin:0;color:#475569;font-size:13px;"><em>${description}</em></p>` : ""}
    </div>

    <p style="text-align:center;margin:30px 0 10px;">
      <a
        href="${actionUrl || "http://localhost:5173/schedules"}"
        style="
          background:#4F7CFF;
          color:#ffffff;
          text-decoration:none;
          padding:12px 24px;
          border-radius:8px;
          display:inline-block;
          font-weight:bold;
        "
      >
        View in Schedules Manager
      </a>
    </p>
  `;

  return baseLayout({
    title: "Upcoming Schedule Created",
    content,
  });
};