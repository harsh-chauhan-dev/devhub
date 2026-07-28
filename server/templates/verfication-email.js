export const verifyEmailTemplate = (firstName, verificationUrl) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
              <td align="center" style="padding:40px 20px;">

                  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;padding:40px;">

                      <tr>
                          <td align="center">
                              <h2 style="margin:0;color:#333;">
                                  Verify Your Email
                              </h2>
                          </td>
                      </tr>

                      <tr>
                          <td style="padding-top:25px;color:#555;font-size:16px;line-height:1.6;">

                              <p>Hello <strong>${firstName}</strong>,</p>

                              <p>
                                  Thanks for signing up.
                                  Please verify your email address by clicking the button below.
                              </p>

                              <div style="text-align:center;margin:35px 0;">
                                  <a
                                      href="${verificationUrl}"
                                      style="
                                          background:#2563eb;
                                          color:#ffffff;
                                          text-decoration:none;
                                          padding:14px 28px;
                                          border-radius:6px;
                                          display:inline-block;
                                          font-weight:bold;
                                      "
                                  >
                                      Verify Email
                                  </a>
                              </div>

                              <p>
                                  This verification link will expire in
                                  <strong>15 minutes</strong>.
                              </p>

                              <p>
                                  If the button doesn't work, copy and paste this link into your browser:
                              </p>

                              <p style="word-break:break-all;color:#2563eb;">
                                  ${verificationUrl}
                              </p>

                              <p>
                                  If you didn't create an account, you can safely ignore this email.
                              </p>

                              <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;">

                              <p style="font-size:13px;color:#888;text-align:center;">
                                  Authentication Service
                              </p>

                          </td>
                      </tr>

                  </table>

              </td>
          </tr>
      </table>

  </body>
  </html>
  `;
};