import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LEAD_EMAIL = "acasadoscolchoes8@gmail.com";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(20),
  answers: z.array(z.string().max(300)).max(20),
  recommendations: z.array(z.string().max(200)).max(5),
});

const b64 = (s: string) =>
  btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(""));
const header = (v: string) => (/^[\x00-\x7F]*$/.test(v) ? v : `=?UTF-8?B?${b64(v)}?=`);

function buildRawEmail(to: string, subject: string, body: string): string {
  const email = [
    `To: ${to}`,
    `Subject: ${header(subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    body,
  ].join("\r\n");
  return b64(email).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export const sendQuizLead = createServerFn({ method: "POST" })
  .inputValidator((data) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const gmailKey = process.env["GOOGLE_MAIL_API_KEY"];
    if (!lovableKey || !gmailKey) {
      console.error("Credenciais de e-mail não configuradas no servidor.");
      return { sent: false };
    }

    const body = [
      "Novo lead do quiz 'Descubra o colchão ideal' no site!",
      "",
      `Nome: ${data.name}`,
      `WhatsApp/Telefone: ${data.phone}`,
      "",
      "Respostas:",
      ...data.answers.map((l) => `- ${l}`),
      "",
      "Colchões indicados:",
      ...data.recommendations.map((r, i) => `${i + 1}. ${r}`),
    ].join("\n");

    const response = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gmailKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: buildRawEmail(
          LEAD_EMAIL,
          `Novo lead do site: ${data.name}`,
          body,
        ),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Falha ao enviar e-mail [${response.status}]: ${errorBody}`);
      return { sent: false };
    }
    return { sent: true };
  });
