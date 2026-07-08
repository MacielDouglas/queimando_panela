type ResetPasswordEmailTemplateParams = {
  name?: string | null;
  resetUrl: string;
};

export function renderResetPasswordEmail({
  name,
  resetUrl,
}: ResetPasswordEmailTemplateParams) {
  const greeting = name?.trim() ? `Olá, ${name.trim()}` : "Olá";

  const subject = "Redefina sua senha do Queimando Panela";

  const text = [
    `${greeting},`,
    "",
    "Recebemos um pedido para redefinir sua senha.",
    "Use o link abaixo para criar uma nova senha:",
    resetUrl,
    "",
    "Se você não solicitou essa alteração, ignore este email.",
    "",
    "Queimando Panela",
  ].join("\n");

  const html = `
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f5f4;font-family:Arial,Helvetica,sans-serif;color:#1c1917;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f4;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e7e5e4;">
            <tr>
              <td style="padding:32px 32px 16px 32px;">
                <p style="margin:0 0 12px 0;font-size:12px;line-height:18px;letter-spacing:0.18em;text-transform:uppercase;color:#f59e0b;font-weight:700;">
                  Queimando Panela
                </p>

                <h1 style="margin:0 0 16px 0;font-size:28px;line-height:34px;font-weight:700;color:#1c1917;">
                  Redefina sua senha
                </h1>

                <p style="margin:0 0 16px 0;font-size:16px;line-height:26px;color:#44403c;">
                  ${greeting},
                </p>

                <p style="margin:0 0 16px 0;font-size:16px;line-height:26px;color:#44403c;">
                  Recebemos um pedido para redefinir sua senha no Queimando Panela.
                </p>

                <p style="margin:0 0 24px 0;font-size:16px;line-height:26px;color:#44403c;">
                  Clique no botão abaixo para criar uma nova senha com segurança.
                </p>

                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 24px 0;">
                  <tr>
                    <td align="center" bgcolor="#f59e0b" style="background:#f59e0b;">
                      <a
                        href="${resetUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="display:inline-block;padding:14px 22px;font-size:16px;line-height:16px;font-weight:700;color:#1c1917;text-decoration:none;"
                      >
                        Redefinir senha
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 16px 0;font-size:14px;line-height:24px;color:#57534e;">
                  Se o botão não funcionar, copie e cole este link no navegador:
                </p>

                <p style="margin:0 0 24px 0;font-size:14px;line-height:24px;word-break:break-word;">
                  <a
                    href="${resetUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="color:#b45309;text-decoration:underline;"
                  >
                    ${resetUrl}
                  </a>
                </p>

                <p style="margin:0 0 8px 0;font-size:14px;line-height:24px;color:#57534e;">
                  Se você não solicitou essa alteração, ignore este email.
                </p>
              </td>
            </tr>

            <tr>
              <td style="border-top:1px solid #e7e5e4;padding:20px 32px;">
                <p style="margin:0;font-size:12px;line-height:20px;color:#78716c;">
                  Queimando Panela · Blog culinário amador aberto a todos
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();

  return {
    subject,
    text,
    html,
  };
}
