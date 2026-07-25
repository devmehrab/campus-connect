FROM node:22-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm build

FROM node:22-slim AS runner

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --prod --no-frozen-lockfile

COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/.cache
ENV TRANSFORMERS_CACHE=/app/.cache

EXPOSE 3001

CMD ["pnpm", "start"]