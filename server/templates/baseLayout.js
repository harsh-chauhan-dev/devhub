// templates/emails/baseLayout.js

export const baseLayout = ({
  title = "DevHub",
  content,
  footer = "You're receiving this email because you have an account on DevHub.",
}) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
</head>

<body
style="
margin:0;
padding:40px 0;
background:#F8FAFC;
font-family:Inter,Segoe UI,Arial,sans-serif;
color:#0F172A;
">

<table
width="100%"
cellpadding="0"
cellspacing="0"
border="0"
style="background:#F8FAFC;"
>

<tr>

<td align="center">

<table
width="620"
cellpadding="0"
cellspacing="0"
border="0"
style="
background:#FFFFFF;
border:1px solid #E2E8F0;
border-radius:14px;
overflow:hidden;
box-shadow:0 8px 25px rgba(0,0,0,.05);
"
>

<!-- Header -->

<tr>

<td
style="
padding:28px 35px;
background:#4F7CFF;
text-align:center;
"
>

<h1
style="
margin:0;
color:#FFFFFF;
font-size:28px;
font-weight:700;
"
>
 DevHub
</h1>

<p
style="
margin-top:8px;
color:#E0E7FF;
font-size:14px;
"
>
Developer Workspace & Productivity Platform
</p>

</td>

</tr>

<!-- Title -->

<tr>

<td
style="
padding:35px 35px 0;
"
>

<h2
style="
margin:0;
font-size:24px;
font-weight:700;
color:#0F172A;
"
>
${title}
</h2>

</td>

</tr>

<!-- Body -->

<tr>

<td
style="
padding:25px 35px 40px;
font-size:16px;
line-height:1.8;
color:#334155;
"
>

${content}

</td>

</tr>

<!-- Divider -->

<tr>

<td
style="
padding:0 35px;
"
>

<hr
style="
border:none;
border-top:1px solid #E2E8F0;
margin:0;
"
/>

</td>

</tr>

<!-- Footer -->

<tr>

<td
style="
padding:25px 35px 35px;
text-align:center;
"
>

<p
style="
margin:0;
font-size:14px;
color:#64748B;
"
>
${footer}
</p>

<p
style="
margin-top:18px;
font-size:13px;
color:#94A3B8;
"
>
© ${new Date().getFullYear()} DevHub • Built for Developers 
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
