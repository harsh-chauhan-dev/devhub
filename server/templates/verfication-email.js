import { baseLayout } from "./baseLayout.js";

export const verifyEmailTemplate = ({ name, verifyUrl }) => {
  return baseLayout({
    title: "Verify Your Email Address",
    content: `
      <p>Hello <strong>${name || "Developer"}</strong>,</p>

      <p>
        Welcome to <strong>DevHub Workspace</strong>! Please verify your email address to activate your account and unlock full access to your developer productivity suite.
      </p>

      <p style="text-align:center;margin:35px 0;">
        <a
          href="${verifyUrl}"
          style="
            background:#4F7CFF;
            color:#ffffff;
            text-decoration:none;
            padding:14px 28px;
            border-radius:10px;
            display:inline-block;
            font-weight:bold;
            box-shadow: 0 4px 12px rgba(79, 124, 255, 0.3);
          "
        >
          Verify Email Address
        </a>
      </p>

      <p style="font-size:13px;color:#64748B;">
        This verification link will expire in <strong>24 hours</strong>. If you did not create a DevHub account, please ignore this email.
      </p>
    `,
  });
};