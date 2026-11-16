import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema } from '@/lib/contact-schema';
import { site } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Rate limit simples em memória: 3 envios por IP a cada 10 minutos. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 3;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const previous = hits.get(ip) ?? [];
  const recent = previous.filter((timestamp) => now - timestamp < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  // Limpeza preventiva para o Map não crescer indefinidamente.
  if (hits.size > 5000) {
    for (const [key, value] of hits) {
      if (value.every((timestamp) => now - timestamp >= WINDOW_MS)) {
        hits.delete(key);
      }
    }
  }

  return false;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildEmailHtml(data: {
  name: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
  receivedAt: string;
}): string {
  const rows: Array<[string, string]> = [
    ['Nome', data.name],
    ['E-mail', data.email],
    ['Empresa', data.company],
    ['Telefone', data.phone],
    ['Tipo de projeto', data.projectType],
    ['Orçamento', data.budget],
    ['Recebido em', data.receivedAt],
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join('');

  return `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,.08);" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="background:linear-gradient(100deg,#06b6d4,#8b5cf6);padding:26px 28px;">
          <p style="margin:0;color:#ffffff;font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.85;">Portfólio · Novo lead</p>
          <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;">${escapeHtml(data.name)} entrou em contato</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 28px 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
            ${tableRows}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px 28px;">
          <p style="margin:0 0 8px;color:#64748b;font-size:13px;">Mensagem</p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;color:#0f172a;font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
          <a href="mailto:${escapeHtml(data.email)}" style="display:inline-block;margin-top:20px;background:#0f172a;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-size:14px;font-weight:600;">Responder para ${escapeHtml(data.name)}</a>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
        { status: 429 },
      );
    }

    const body: unknown = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Dados inválidos. Revise os campos e tente novamente.' },
        { status: 400 },
      );
    }

    // Bot preencheu o honeypot: responde 200 sem enviar nada.
    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error('[contato] RESEND_API_KEY não configurada.');
      return NextResponse.json(
        {
          ok: false,
          error: 'O envio de e-mail ainda não está configurado neste servidor.',
        },
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);
    const { name, email, company, phone, projectType, budget, message } = parsed.data;

    const receivedAt = new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'America/Bahia',
    }).format(new Date());

    const html = buildEmailHtml({
      name,
      email,
      company: company || '—',
      phone: phone || '—',
      projectType,
      budget,
      message,
      receivedAt,
    });

    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO_EMAIL ?? site.email],
      replyTo: email,
      subject: `Novo lead — ${name}${company ? ` (${company})` : ''} · ${projectType}`,
      html,
      text: [
        `Nome: ${name}`,
        `E-mail: ${email}`,
        `Empresa: ${company || '—'}`,
        `Telefone: ${phone || '—'}`,
        `Tipo de projeto: ${projectType}`,
        `Orçamento: ${budget}`,
        `Recebido em: ${receivedAt}`,
        '',
        'Mensagem:',
        message,
      ].join('\n'),
    });

    if (error) {
      console.error('[contato] Falha no envio pelo Resend:', error);
      return NextResponse.json(
        { ok: false, error: 'Não consegui enviar o e-mail agora. Tente novamente.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contato] Erro inesperado:', error);
    return NextResponse.json(
      { ok: false, error: 'Erro inesperado. Tente novamente em instantes.' },
      { status: 500 },
    );
  }
}
