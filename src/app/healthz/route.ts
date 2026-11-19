/**
 * Endpoint de saúde consumido pelo Traefik (Cubeship → Networking → Health check).
 *
 * O proxy bate aqui a cada 10 segundos. Enquanto responder 200, o app é
 * considerado vivo; se parar de responder, o Cubeship reinicia o container
 * sozinho em vez de deixar o visitante olhando para um erro.
 *
 * Precisa ser dinâmico e sem cache: uma resposta cacheada continuaria dizendo
 * "ok" mesmo com o processo travado, que é exatamente o caso que esta rota
 * existe para detectar.
 */
export const dynamic = 'force-dynamic';

export function GET() {
  return new Response('ok', {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store, no-cache, must-revalidate',
    },
  });
}
