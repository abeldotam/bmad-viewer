FROM node:22-alpine AS builder

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/.output .output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
