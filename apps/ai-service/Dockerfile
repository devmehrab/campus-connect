FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:22-slim AS runner

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/.cache
ENV TRANSFORMERS_CACHE=/app/.cache

EXPOSE 3000

CMD ["npm", "start"]