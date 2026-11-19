import { NextResponse, type NextRequest } from 'next/server';

/**
 * ============================================================================
 *  HTTPS OBRIGATÓRIO E ENDEREÇO ÚNICO
 * ============================================================================
 *
 *  Dois problemas que este arquivo resolve:
 *
 *  1. Quem digita "mateussadev.com.br" sem escrever "https://" chega pelo
 *     endereço sem criptografia e fica lá. O cabeçalho HSTS que o site manda
 *     só vale para quem JÁ visitou uma vez por https — ou seja, não protege
 *     justamente o primeiro acesso de um visitante novo.
 *
 *  2. O site responde em dois endereços, com e sem "www". Para o Google são
 *     dois sites iguais, e ele divide a relevância entre os dois em vez de
 *     somar. Escolher um endereço oficial e mandar o outro para ele resolve.
 *
 *  O redirecionamento é 308 (permanente): o navegador guarda e nas próximas
 *  vezes já vai direto, sem passar pelo endereço errado. Como é permanente,
 *  trocar o endereço oficial depois é trabalhoso — navegador que guardou o
 *  redirecionamento continua obedecendo por um bom tempo.
 * ============================================================================
 */

/** O endereço oficial. Todo o resto do domínio é mandado para cá. */
const CANONICAL_HOST = 'mateussadev.com.br';

export function middleware(request: NextRequest): NextResponse {
  /**
   * O Traefik termina o https e conversa com o container em http puro — por
   * isso `request.nextUrl.protocol` aqui dentro é SEMPRE http, mesmo quando o
   * visitante está numa conexão segura. Quem sabe a verdade é este cabeçalho,
   * escrito pelo proxy.
   *
   * Pode vir encadeado ("https, http") quando passou por mais de um proxy; o
   * primeiro valor é o do visitante.
   */
  const forwardedProto = request.headers.get('x-forwarded-proto');

  /**
   * Sem o cabeçalho, ninguém está na frente: é `npm run dev` na sua máquina,
   * ou a checagem de saúde que o Traefik faz direto no container. Nos dois
   * casos, redirecionar para https quebraria o acesso.
   */
  if (!forwardedProto) return NextResponse.next();

  const isSecure = forwardedProto.split(',')[0]?.trim() === 'https';

  /** Vem com a porta junto às vezes ("exemplo.com:443"); só o nome interessa. */
  const host = (request.headers.get('host') ?? '').split(':')[0]?.toLowerCase() ?? '';

  /**
   * Só mexe no domínio próprio. O endereço sslip.io que o Cubeship cria
   * continua funcionando como está — é a rota de emergência para quando algo
   * der errado no DNS, e forçar https nele poderia derrubar justamente o
   * acesso que a gente usaria para consertar.
   */
  const isOwnDomain = host === CANONICAL_HOST || host === `www.${CANONICAL_HOST}`;
  if (!isOwnDomain) return NextResponse.next();

  const needsRedirect = !isSecure || host !== CANONICAL_HOST;
  if (!needsRedirect) return NextResponse.next();

  /**
   * Monta o destino como texto em vez de mexer no objeto da URL. Alterar
   * `protocol` e `host` separadamente deixa a porta interna (3000) grudada no
   * endereço, e o visitante acaba em "https://mateussadev.com.br:3000".
   */
  const { pathname, search } = request.nextUrl;
  return NextResponse.redirect(`https://${CANONICAL_HOST}${pathname}${search}`, 308);
}

export const config = {
  /**
   * Fora da regra:
   *  - `_next/static` e `_next/image`: arquivos que o próprio Next serve e que
   *    a página já pede pelo mesmo endereço em que foi aberta.
   *  - `healthz`: a checagem do Traefik, que bate no container por dentro.
   */
  matcher: ['/((?!_next/static|_next/image|healthz).*)'],
};
