import nodemailer from "nodemailer";
import path from "path";

export async function sendPurchaseEmail({ to, productTitle, productFile, orderId }: { to: string; productTitle: string; productFile: string; orderId: string }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM_EMAIL;

  if (!host || !user || !pass || !from) {
    throw new Error("Missing SMTP_HOST, SMTP_USER, SMTP_PASS, or SMTP_FROM_EMAIL environment variable");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const pdfDir = path.join(process.cwd(), "private", "pdfs");

  const files = productFile === "MATH%20MAGIC.pdf" && productTitle.includes("Bundle")
    ? ["MATH%20MAGIC.pdf", "Speak%20English.pdf"]
    : [productFile];

  const attachments = files.map((encodedFile) => {
    const actualFileName = decodeURIComponent(encodedFile);
    const filePath = path.join(pdfDir, actualFileName);
    return {
      filename: actualFileName,
      path: filePath,
      contentType: "application/pdf",
    };
  });

  const info = await transporter.sendMail({
    from,
    to,
    subject: `Your pdfDuniya PDF: ${productTitle}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#171323"><h2>Your PDFs are ready</h2><p>Thank you for purchasing <strong>${productTitle}</strong>.</p><p>Your PDF(s) are attached to this email.</p><p>Order ID: ${orderId}</p><p>You can return to the product page to submit a review after your purchase.</p></div>`,
    attachments,
  });

  return info.messageId;
}

export async function sendReferralApprovalEmail({ to, name, referralCode }: { to: string; name: string; referralCode: string }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM_EMAIL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!host || !user || !pass || !from) {
    throw new Error("Missing SMTP environment variables");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const referralLink = `${siteUrl}/buy?p=bundle&ref=${referralCode}`;
  const statsLink = `${siteUrl}/referral/stats/${referralCode}`;

  const info = await transporter.sendMail({
    from,
    to,
    subject: "Update regarding your pdfDuniya Referral Program status",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#171323">
        <h2>Congratulations ${name}!</h2>
        <p>Your request for the pdfDuniya Referral Program has been approved.</p>
        <p>Your unique referral code is: <strong>${referralCode}</strong></p>
        <p>Share this link to start earning:</p>
        <p><a href="${referralLink}" style="color:#fa2e8c;font-weight:bold">${referralLink}</a></p>
        <p>You can monitor your performance and earnings here:</p>
        <p><a href="${statsLink}" style="display:inline-block;padding:10px 15px;background:#2678ff;color:#fff;text-decoration:none;border-radius:4px">View Analytics Dashboard</a></p>
        <br>
        <p>Happy promoting!</p>
      </div>`,
  });

  return info.messageId;
}

export async function sendReferralRemovalEmail({ to, name }: { to: string; name: string }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM_EMAIL;

  if (!host || !user || !pass || !from) {
    throw new Error("Missing SMTP environment variables");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const info = await transporter.sendMail({
    from,
    to,
    subject: "Update regarding your pdfDuniya Referral Program status",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#171323">
        <h2>Hello ${name},</h2>
        <p>This is to inform you that your participation in the pdfDuniya Referral Program has been terminated, and your referral code has been deactivated.</p>
        <p>If you have any questions regarding this decision, you can contact our support team.</p>
        <br>
        <p>Thank you,</p>
        <p>The pdfDuniya Team</p>
      </div>`,
  });

  return info.messageId;
}
