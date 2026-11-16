# Portfólio — Mateus Guimarães

Portfólio em **Next.js 15 + TypeScript + Tailwind CSS 4** com interface
futurista e reativa: aurora que acompanha o cursor, painéis de vidro com borda
que acende, números que contam ao aparecer, cards que inclinam em 3D e um
**configurador** onde o visitante monta o próprio projeto e recebe uma
estimativa na hora.

Formulário de contato envia leads para `mateussadev@gmail.com`.
Seção de GitHub puxa dados ao vivo do perfil público.

---

## 1. Rodar localmente

```bash
npm install
copy .env.example .env.local   # Linux/macOS: cp .env.example .env.local
npm run dev
```

Abre em <http://localhost:3100> (a porta está fixada no `package.json` para não
brigar com outros projetos na 3000).

---

## 2. O que a interface tem de diferente

| Recurso | Onde mexer |
| --- | --- |
| Aurora de fundo + luz que segue o cursor | `src/components/fx/backdrop.tsx` |
| Botões que "puxam" na direção do mouse | `src/components/fx/magnetic.tsx` |
| Títulos que se decodificam ao entrar na tela | `src/components/fx/scramble.tsx` |
| Números que contam de zero | `src/components/fx/count-up.tsx` |
| Cards que inclinam em 3D | `src/components/fx/tilt.tsx` |
| Barra de progresso no topo + trilha lateral | `shell/top-bar.tsx` · `shell/progress-rail.tsx` |
| Busca com teclado (⌘K / Ctrl+K) | `shell/command-palette.tsx` |
| Cabeçalho padrão das seções | `shell/section-block.tsx` |
| Cores, fontes e materiais | `src/app/globals.css` |

**Para trocar a cor do site inteiro**, mude `--accent` e `--cyan` nos blocos
`:root` (tema claro) e `.dark` (tema escuro) em `globals.css`. Todo o resto
deriva desses valores.

Fontes: **Space Grotesk** na interface, **Inter** nos parágrafos longos,
**JetBrains Mono** nos rótulos e números.

Tudo que se mexe respeita `prefers-reduced-motion`, e os efeitos de cursor são
desligados em telas de toque.

### O configurador "Monte seu projeto"

É o coração interativo do site e o principal qualificador de leads. O visitante
clica no que precisa, vê um resumo ao vivo do escopo com uma estimativa de
prazo, e o botão leva ao formulário **já preenchido** com tudo isso.

**Ele não mostra preço, de propósito.** Faixa de valor fixa num site vira
âncora contra você na negociação: o cliente chega preso ao número menor, e dois
projetos com o mesmo rótulo podem custar coisas completamente diferentes. Em
vez de estimar o valor, a última pergunta pede a faixa que o *visitante* tem em
mente — isso qualifica o lead antes da reunião e mantém tudo negociável.

O que se calcula é só prazo: `(semanas do tipo + extras) × fator do porte`.
Ajuste as semanas em `src/data/configurator.ts` para o seu ritmo real.

---

## 3. Fazer o formulário enviar e-mail (5 minutos)

Usa o [Resend](https://resend.com) — gratuito até 3.000 e-mails/mês.

1. Crie conta em <https://resend.com>.
2. **API Keys → Create API Key**, copie a chave (`re_...`).
3. Cole em `RESEND_API_KEY` no `.env.local`.
4. Reinicie o `npm run dev` e teste.

> Enquanto não tiver domínio próprio verificado no Resend, mantenha
> `CONTACT_FROM_EMAIL=Portfolio <onboarding@resend.dev>`. Depois de verificar um
> domínio, troque para `Mateus Guimarães <contato@seudominio.com>`.

**Já protegido contra spam:** honeypot invisível + limite de 3 envios por IP a
cada 10 minutos + validação com Zod no servidor.

---

## 4. Seção GitHub

Em `src/lib/site.ts`, troque `githubUser` pelo seu usuário real. Enquanto
estiver `'SEU-USUARIO-AQUI'`, **a seção não aparece** — nada quebra.

`GITHUB_TOKEN` é opcional: habilita o número de alterações nos últimos 12 meses
e sobe o limite de 60 para 5.000 requisições por hora. Gere em
<https://github.com/settings/tokens> → "Generate new token (classic)" → **sem
marcar nenhum escopo**.

---

## 5. Publicar (Vercel — grátis)

```bash
git init && git add . && git commit -m "feat: portfolio"
git remote add origin https://github.com/SEU_USUARIO/portfolio.git
git push -u origin main
```

Em <https://vercel.com>: **Add New → Project**, importe o repositório, adicione
as variáveis de ambiente e clique em **Deploy**. A porta 3100 do `package.json`
é ignorada lá — a plataforma define a dela.

---

## 6. ⚠️ O que personalizar antes de divulgar

Dados de exemplo aparecem com **etiqueta roxa** no próprio site
(`preencher` / `exemplo — substituir`). Enquanto houver etiqueta roxa, o site
não está pronto para ir a um cliente.

| Arquivo | O que trocar | Prioridade |
| --- | --- | --- |
| `src/data/configurator.ts` | As faixas de prazo em semanas. Ajuste ao seu ritmo real. | 🔴 Alta |
| `src/data/experience.ts` | Seu timeline real. Remova `placeholder: true` de cada entrada preenchida. | 🔴 Alta |
| `src/data/projects.ts` | Os 3 projetos são modelos. Troque por trabalhos reais. | 🔴 Alta |
| `src/lib/site.ts` | `githubUser`, links do GitHub e LinkedIn, URL final do site. | 🔴 Alta |
| `src/data/pains.ts` | As cinco falas de cliente. Ajuste para o público que você quer atrair. | 🟡 Média |
| `src/lib/site.ts` → `aboutStats` | Os três números da seção Sobre. Só o que você sustenta numa entrevista. | 🟡 Média |
| `src/data/services.ts` | O campo `outcome` é o que o cliente lê primeiro. | 🟡 Média |
| `src/data/tech.ts` | Remova as tecnologias que você não usa de verdade. | 🟡 Média |
| `src/data/faq.ts` | Ajuste prazos, garantia e política ao que você pratica. | 🟡 Média |

**Por que importa:** empresas checam. Um case, cargo ou preço inventado que não
se sustenta numa reunião custa mais caro que um portfólio menor e honesto.

> **Regra de escrita do projeto:** `title`, `summary`, `outcome`, `hint`, os
> textos de `pains.ts` e os rótulos do configurador são lidos por quem NÃO
> programa. Nada de jargão neles. Termos técnicos vivem em `bullets` e `tech`,
> que são detalhe secundário, nunca a mensagem.

---

## 7. Estrutura

```
src/
├── app/
│   ├── api/contact/route.ts   → envio de e-mail (Resend) + anti-spam
│   ├── api/github/route.ts    → dados do GitHub, cache de 1h
│   ├── layout.tsx             → SEO, fontes, JSON-LD, tema
│   ├── page.tsx               → ordem das seções
│   └── globals.css            → cores, materiais, animações
├── components/
│   ├── fx/                    → efeitos reutilizáveis (aurora, tilt, scramble…)
│   ├── shell/                 → topo, trilha lateral, busca ⌘K, casca de seção
│   ├── hero.tsx               → topo com o núcleo orbital
│   ├── configurator.tsx       → "Monte seu projeto"
│   └── *.tsx                  → uma seção por arquivo
├── data/                      → todo o conteúdo editável
└── lib/                       → config, seções, schema do formulário, tipos
```

Arquivos marcados com `⚠️ ARQUIVO DESATIVADO` sobraram de versões anteriores e
**podem ser apagados**: `terminal-hero.tsx`, `nav.tsx`, `marquee.tsx`,
`stack.tsx`, `theme-toggle.tsx`, `whatsapp-button.tsx`,
`shell/section-file.tsx`, `shell/status-bar.tsx`, `ui/section-heading.tsx`,
`ui/typewriter.tsx` e `src/data/stack.ts`.

## 8. Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Desenvolvimento, porta 3100 |
| `npm run build` | Build de produção |
| `npm run start` | Roda o build localmente |
| `npm run lint` | ESLint |
| `npm run type-check` | Checagem de tipos sem build |

---

## 9. Acessibilidade e SEO

Todo o conteúdo é HTML real renderizado no servidor. Os efeitos são enfeite:
com `prefers-reduced-motion` ligado, nada se move e o texto aparece inteiro de
imediato. Navegação completa por teclado, foco visível, títulos decodificados
expõem o texto real para leitores de tela. Metadata completa, Open Graph
dinâmico, JSON-LD (`Person`), sitemap e robots.
