# 1) build the static site from source
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx tsx src/build.tsx

# 2) Caddy serves dist/ (clean URLs, 301s, 404s) and proxies /api/* to the form handler
FROM node:22-alpine
RUN apk add --no-cache caddy
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
COPY server/api.mjs server/jobber.mjs /app/
CMD ["sh", "-c", "(while true; do node /app/api.mjs; sleep 2; done) & exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile"]
