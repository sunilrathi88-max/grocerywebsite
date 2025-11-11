# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --prefer-offline --no-audit

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM caddy:2-alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/caddy

# Copy Caddyfile
COPY <<EOF /etc/caddy/Caddyfile
:$PORT {
    root * /usr/share/caddy
    try_files {path} /index.html
    file_server
}
EOF

# Expose port
EXPOSE 3000

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
