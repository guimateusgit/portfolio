# syntax=docker/dockerfile:1

# ============================================================================
#  Dockerfile para deploy no Cubeship (ou qualquer plataforma Docker)
# ============================================================================
#  Três estágios, para a imagem final sair pequena: as dependências de
#  desenvolvimento e o código-fonte ficam para trás e não vão para produção.
#
#  Depende de `output: 'standalone'` no next.config.ts, que faz o Next montar
#  um servidor com apenas os pacotes realmente usados em tempo de execução.
# ============================================================================

# ---------- 1. dependências ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# `npm ci` instala exatamente o que está no lock — build reproduzível.
RUN npm ci

# ---------- 2. build ----------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- 3. execução ----------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# O servidor do Next lê estas duas. HOSTNAME 0.0.0.0 é obrigatório dentro de
# container: sem isso ele escuta só em localhost e o proxy não alcança.
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Rodar como root dentro do container é risco desnecessário.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# O Cubeship lê este EXPOSE para saber em qual porta falar com o container.
EXPOSE 3000

CMD ["node", "server.js"]
