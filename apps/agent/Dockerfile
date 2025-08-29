# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/agent/package.json apps/agent/
RUN npm i -g pnpm && pnpm install --filter @graham/agent... --prod=false

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app /app
RUN npm i -g pnpm && pnpm -C apps/agent build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/agent/dist ./dist
COPY apps/agent/package.json ./package.json
RUN npm i -g pnpm && pnpm install --prod --ignore-scripts
EXPOSE 8787
CMD ["node", "dist/index.js"]
