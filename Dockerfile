# 1) build the static site from source
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx tsx src/build.tsx

# 2) serve dist/ with Caddy (clean URLs, 301s, 404s; see Caddyfile)
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
