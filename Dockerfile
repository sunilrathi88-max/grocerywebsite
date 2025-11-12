# Simple static file server for pre-built Vite app
FROM caddy:2-alpine

# Copy pre-built dist folder from GitHub Actions
COPY dist /usr/share/caddy

# Configure Caddy to serve on Railway's PORT
COPY <<EOF /etc/caddy/Caddyfile
:$PORT {
    root * /usr/share/caddy
    try_files {path} /index.html
    file_server
    
    # Enable gzip compression
    encode gzip
    
    # Add security headers
    header {
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}
EOF

# Caddy will automatically use PORT from environment
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
