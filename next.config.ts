import type { NextConfig } from 'next';

/**
 * Política de segurança de conteúdo (CSP).
 *
 * Declara de onde o navegador pode carregar cada tipo de recurso. Tudo que não
 * estiver listado é bloqueado — então se um script estranho for injetado na
 * página, ele não consegue nem carregar nem mandar dados para fora.
 *
 * LIMITAÇÃO CONHECIDA: `script-src` precisa de 'unsafe-inline' porque a página
 * tem dois scripts embutidos (o que aplica o tema antes da primeira pintura e
 * o JSON-LD de SEO). A alternativa — nonce gerado por middleware — obrigaria
 * o site inteiro a ser renderizado a cada acesso, perdendo a geração estática
 * e ficando mais lento. Para um site sem conteúdo enviado por visitante, a
 * troca não compensa. Se um dia houver área logada ou comentários, migre para
 * nonce (next.js: "Content Security Policy with nonces").
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  // Logos de tecnologia e avatares do GitHub
  "img-src 'self' data: blob: https://cdn.simpleicons.org https://avatars.githubusercontent.com",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  // O formulário só pode ser enviado para o próprio site
  "form-action 'self'",
  // Ninguém pode embutir este site dentro de um iframe (anti-clickjacking)
  "frame-ancestors 'none'",
  // Qualquer recurso pedido em http vira https automaticamente
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },

  /**
   * HSTS: depois da primeira visita, o navegador recusa abrir este domínio em
   * http por 2 anos — nem permite o clique em "prosseguir mesmo assim". Mata
   * ataque de downgrade em wi-fi público.
   * A Vercel já serve tudo em https; isto garante que o navegador também exija.
   */
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },

  // Impede o navegador de "adivinhar" o tipo de um arquivo e executá-lo
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // Redundante com frame-ancestors, mantido para navegadores antigos
  { key: 'X-Frame-Options', value: 'DENY' },

  // Não vaza a URL completa ao sair do site
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

  // Nega acesso a câmera, microfone e localização para a página e seus iframes
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },

  // Isola a aba de outras janelas abertas pelo site
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },

  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig: NextConfig = {
  /**
   * Monta um servidor autossuficiente em .next/standalone, com apenas os
   * pacotes usados em produção. É o que o Dockerfile copia — sem isso a
   * imagem levaria o node_modules inteiro junto.
   */
  output: 'standalone',

  reactStrictMode: true,
  // Não anuncia "X-Powered-By: Next.js" — menos informação para quem varre alvos
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
