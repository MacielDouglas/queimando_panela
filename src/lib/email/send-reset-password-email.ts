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
  // Substitua por Resend, Nodemailer ou outro provider real.
  // Exemplo inicial:
  console.log("Enviar e-mail de reset", {
    to,
    subject: "Redefina sua senha",
    name,
    resetUrl,
  });
}
