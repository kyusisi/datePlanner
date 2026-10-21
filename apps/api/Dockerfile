FROM node:22.14-bookworm-slim
WORKDIR /repo
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11.25.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY tsconfig.base.json ./tsconfig.base.json
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --frozen-lockfile && pnpm --filter @date-planner/api build
ENV NODE_ENV=production
WORKDIR /repo/apps/api
EXPOSE 3000
CMD ["node", "dist/main.js"]
