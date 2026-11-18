import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema } from '@/lib/contact-schema';
import { site, whatsappLink } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------------ */
/* Limites                                                             */
/* ------------------------------------------------------------------ */

/** Corpo máximo aceito. O formulário cheio não chega a 4 KB. */
const MAX_BODY_BYTES = 16 * 1024;

/** Janela e teto de envios por IP. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_IP = 3;

/** Teto por endereço de e-mail, independente do IP (rede móvel troca de IP). */
const MAX_PER_EMAIL = 3;

/** Abaixo disto o preenchimento foi rápido demais para ser humano. */
const MIN_FILL_MS = 2500;

/* ------------------------------------------------------------------ */
/* Controle de frequência                                              */
/* ------------------------------------------------------------------ */

/**
 * IMPORTANTE — limitação real desta implementação.
 *
 * O controle abaixo vive na memória do processo. Em servidor serverless
 * (Vercel), cada instância tem a própria memória e elas somem quando ficam
 * ociosas: um atacante determinado consegue furar isso. Serve bem contra robô
 * bobo e clique repetido, que é a esmagadora maioria do spam de formulário.
 *
 * Para limite real, compartilhado entre instâncias, troque o Map por Vercel KV
 * ou Upstash Redis — a interface abaixo (`hit`) já isola isso, então a troca
 * mexe só nesta função.
 */
const hits = new Map<string, number[]>();

function hit(key: string, max: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);

  // Limpeza preventiva para o Map não crescer indefinidamente.
  if (hits.size > 5000) {
    for (const [existing, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(existing);
    }
  }

  return true;
}

function clientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    ''
  );
}

/**
 * O IP recebido identifica mesmo um visitante?
 *
 * Atrás de proxy reverso mal configurado, TODA requisição chega com o IP do
 * proxy — normalmente um endereço interno de container. Se a gente limitasse
 * por esse IP, 3 envios de qualquer pessoa travariam o formulário para o
 * mundo inteiro, e o site pareceria quebrado sem motivo aparente.
 *
 * Quando o endereço não serve para distinguir ninguém, o limite por IP é
 * ignorado e sobram as outras defesas: armadilha, tempo de preenchimento e
 * limite por e-mail. Degradar assim é melhor do que bloquear todo mundo.
 */
function isUsableIp(ip: string): boolean {
  if (!ip) return false;
  if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') return false;
  if (/^10\./.test(ip)) return false;
  if (/^192\.168\./.test(ip)) return false;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return false;
  return true;
}

/* ------------------------------------------------------------------ */
/* Saneamento                                                          */
/* ------------------------------------------------------------------ */

/**
 * Escapa os caracteres que teriam significado em HTML.
 *
 * Tudo que a pessoa digitou vai para dentro de um e-mail em HTML. Sem isto,
 * alguém poderia escrever uma tag no campo de mensagem e ela seria
 * interpretada pelo leitor de e-mail em vez de exibida como texto.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ------------------------------------------------------------------ */
/* Modelos de e-mail                                                   */
/* ------------------------------------------------------------------ */

type Lead = {
  name: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
  receivedAt: string;
};

/** E-mail que chega para o Mateus. */
function leadEmailHtml(data: Lead): string {
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
        <td style="background:linear-gradient(100deg,#a4e01f,#0e7490);padding:26px 28px;">
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

/**
 * Confirmação automática que vai para quem preencheu o formulário.
 *
 * ⚠️  NÃO ECOE A MENSAGEM AQUI — e não é descuido, é proteção.
 *
 * Este e-mail vai para o endereço que o visitante digitou, que ninguém
 * verificou. Alguém pode preencher com o e-mail de um terceiro: o seu servidor
 * entregaria o conteúdo escrito por quem preencheu, assinado pelo seu domínio.
 * Em escala, isso queima a reputação de envio do domínio e pode derrubar a
 * conta no provedor de e-mail.
 *
 * Por isso só entram aqui campos de LISTA FECHADA (`projectType` e `budget`,
 * validados contra os valores do schema) e o primeiro nome. O texto livre que
 * sobra é uma palavra — sem valor como veículo de spam.
 *
 * A mensagem completa continua indo no e-mail do lead, que vai para um
 * endereço fixo definido em variável de ambiente.
 */
function confirmationEmailHtml(data: Lead): string {
  const firstName = escapeHtml(data.name.split(' ')[0] ?? data.name);

  return `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" style="max-width:580px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,.08);" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:30px 30px 10px;">
          <h1 style="margin:0;color:#0f172a;font-size:21px;">Recebi sua mensagem, ${firstName}</h1>
          <p style="margin:14px 0 0;color:#475569;font-size:15px;line-height:1.65;">
            Obrigado pelo contato. Eu leio pessoalmente tudo que chega por aqui e
            <strong>respondo em até 24 horas em dias úteis</strong>.
          </p>
          <p style="margin:14px 0 0;color:#475569;font-size:15px;line-height:1.65;">
            Se for urgente, me chame direto no WhatsApp
            <a href="${whatsappLink}" style="color:#0e7490;">${escapeHtml(site.phone.display)}</a>
            — costumo ver mais rápido por lá.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 30px 6px;">
          <p style="margin:0 0 8px;color:#64748b;font-size:12px;letter-spacing:.1em;text-transform:uppercase;">O que você me enviou</p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;color:#334155;font-size:14px;line-height:1.65;">
            <p style="margin:0 0 6px;"><strong>Tipo de projeto:</strong> ${escapeHtml(data.projectType)}</p>
            <p style="margin:0;"><strong>Orçamento:</strong> ${escapeHtml(data.budget)}</p>
          </div>
          <p style="margin:14px 0 0;color:#94a3b8;font-size:13px;line-height:1.6;">
            Guardei o restante aqui comigo para a nossa conversa. Se esqueceu de
            alguma coisa, é só responder este e-mail.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:22px 30px 30px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(site.name)}</p>
          <p style="margin:3px 0 0;color:#94a3b8;font-size:13px;">${escapeHtml(site.shortRole)} · ${escapeHtml(site.location)}</p>
          <p style="margin:12px 0 0;color:#cbd5e1;font-size:11px;line-height:1.6;">
            Você recebeu este e-mail porque preencheu o formulário de contato no meu site.
            Seus dados são usados apenas para responder a esta solicitação e não são repassados a terceiros.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/* ------------------------------------------------------------------ */
/* Rota                                                                */
/* ------------------------------------------------------------------ */

/** Resposta curta e genérica: não entrega pistas sobre o que falhou. */
function fail(error: string, status: number): Response {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request): Promise<Response> {
  try {
    // 1. Só aceita JSON. Bloqueia envio de formulário vindo de outro site.
    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return fail('Requisição inválida.', 415);
    }

    // 2. Corpo gigante é recusado antes de ser lido para a memória.
    const declaredLength = Number(request.headers.get('content-length') ?? '0');
    if (declaredLength > MAX_BODY_BYTES) {
      return fail('Mensagem grande demais.', 413);
    }

    // 3. Frequência por IP — só quando o IP realmente identifica alguém.
    const ip = clientIp(request);
    if (isUsableIp(ip)) {
      if (!hit(`ip:${ip}`, MAX_PER_IP)) {
        return fail('Muitas tentativas. Tente novamente em alguns minutos.', 429);
      }
    } else if (process.env.NODE_ENV === 'production') {
      console.warn(
        '[contato] IP do visitante não identificável (recebido: %s). ' +
          'Confira se o proxy reverso envia X-Forwarded-For. ' +
          'O limite por IP está desativado; os demais continuam valendo.',
        ip || '(vazio)',
      );
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return fail('Mensagem grande demais.', 413);
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return fail('Requisição inválida.', 400);
    }

    // 4. Validação — a mesma do navegador, agora valendo de verdade.
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return fail('Dados inválidos. Revise os campos e tente novamente.', 400);
    }

    const { name, email, company, phone, projectType, budget, message, website, elapsedMs } =
      parsed.data;

    // 5. Armadilha do robô: responde 200 para ele achar que deu certo.
    if (website) {
      return NextResponse.json({ ok: true });
    }

    // 6. Preenchido rápido demais para ser gente.
    if (typeof elapsedMs === 'number' && elapsedMs < MIN_FILL_MS) {
      return NextResponse.json({ ok: true });
    }

    // 7. Frequência por e-mail — pega quem troca de IP.
    if (!hit(`email:${email.toLowerCase()}`, MAX_PER_EMAIL)) {
      return fail('Já recebi sua mensagem. Aguarde meu retorno.', 429);
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[contato] RESEND_API_KEY não configurada.');
      return fail('O envio de e-mail ainda não está configurado neste servidor.', 500);
    }

    const resend = new Resend(apiKey);
    const from = process.env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>';
    const to = process.env.CONTACT_TO_EMAIL ?? site.email;

    const receivedAt = new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'America/Bahia',
    }).format(new Date());

    const lead: Lead = {
      name,
      email,
      company: company || '—',
      phone: phone || '—',
      projectType,
      budget,
      message,
      receivedAt,
    };

    // 8. E-mail principal: o lead chega para o Mateus.
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Novo lead — ${name}${company ? ` (${company})` : ''} · ${projectType}`,
      html: leadEmailHtml(lead),
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
      return fail('Não consegui enviar o e-mail agora. Tente novamente.', 502);
    }

    /**
     * 9. Confirmação automática para quem preencheu.
     *
     * Falha aqui NÃO derruba a requisição: o lead já chegou, que é o que
     * importa. A pessoa só não recebe o aviso.
     *
     * ATENÇÃO: com o remetente de teste `onboarding@resend.dev`, o Resend só
     * entrega para o e-mail dono da conta — então esta confirmação só vai
     * funcionar de verdade depois que você verificar um domínio próprio.
     */
    try {
      const confirmation = await resend.emails.send({
        from,
        to: [email],
        replyTo: to,
        subject: `Recebi sua mensagem — ${site.name}`,
        html: confirmationEmailHtml(lead),
        text: [
          `Recebi sua mensagem, ${name.split(' ')[0] ?? name}.`,
          '',
          'Eu leio pessoalmente tudo que chega e respondo em até 24 horas em dias úteis.',
          `Se for urgente, me chame no WhatsApp ${site.phone.display}.`,
          '',
          '--- O que você me enviou ---',
          // Pelo mesmo motivo do HTML: só lista fechada, nada de texto livre.
          `Tipo de projeto: ${projectType}`,
          `Orçamento: ${budget}`,
          '',
          'Guardei o restante aqui comigo para a nossa conversa.',
          '',
          `${site.name} — ${site.shortRole}`,
        ].join('\n'),
      });

      if (confirmation.error) {
        console.warn('[contato] Confirmação para o lead não saiu:', confirmation.error);
      }
    } catch (confirmationError) {
      console.warn('[contato] Confirmação para o lead falhou:', confirmationError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contato] Erro inesperado:', error);
    return fail('Erro inesperado. Tente novamente em instantes.', 500);
  }
}
