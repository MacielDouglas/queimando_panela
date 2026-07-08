import { resend } from "@/lib/email/resend";
import { renderResetPasswordEmail } from "@/lib/email/templates/reset-password-email";

type SendResetPasswordEmailParams = {
  to: string;
  name?: string | null;
  resetUrl: string;
};

export async function sendResetPasswordEmail({
  to,
  name,
  resetUrl,
}: SendResetPasswordEmailParams) {
  const from = process.env.EMAIL_FROM;
  const replyTo = process.env.EMAIL_REPLY_TO;
  const { subject, html, text } = renderResetPasswordEmail({
    name,
    resetUrl,
  });

  if (!from) {
    throw new Error("EMAIL_FROM não configurado.");
  }

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(error.message || "Falha ao enviar email de redefinição.");
  }
}
