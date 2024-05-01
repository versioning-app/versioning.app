FROM ghcr.io/timowilhelm/local-neon-http-proxy:main

WORKDIR /app
COPY $PWD/Caddyfile Caddyfile

ENTRYPOINT ["./start.sh"]