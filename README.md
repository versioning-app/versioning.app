# versioning.app

versioning.app simplifies the complex process of versioning software across many teams and environments.

## Authentication

For authentication, we use [Clerk](https://clerk.dev). Clerk is a secure, easy-to-use, and developer-friendly user management API that handles all your user authentication flows so you can focus on building your app.

## Billing

For billing, we use [Stripe](https://stripe.com). Stripe is a suite of payment APIs that powers commerce for online businesses of all sizes, including fraud prevention, and subscription management.

# Offline postgres development

To setup postgres locally, follow these very loose steps:

1. See instructions on https://github.com/neondatabase/serverless/issues/33 to get `neon` pulled and the proxy setup
2. In the `neon` directory (outside of this directory/project) run the following command:
```bash
openssl req -new -x509 -days 365 -nodes -text -out server.crt -keyout server.key -subj "/CN=*.localtest.me
```
3. Next add the following to your host file:
```bash
127.0.0.1 	db.localtest.me
::1		      db.localtest.me
```
5. Next, let's create a little script in the root of the `neon` project called `start-proxy.sh` with the following content. Note, if you do not use IPv6 please change the end of the command to `--wss='127.0.0.1:4444'`
```bash
#!/bin/bash
./target/debug/proxy -c server.crt -k server.key --auth-backend postgres --auth-endpoint=postgres://postgres:postgres@127.0.0.1:5432/main --wss='[::1]:4444'
```
6. Run `chmod +x ./start-proxy.sh`
7. Back in the your project directory, run the `docker compose up` file which will start a postgres server on port `5432` with username `postgres` and password `postgres` with the database `main`
8. In the `neon` directory run `./start-proxy.sh`
