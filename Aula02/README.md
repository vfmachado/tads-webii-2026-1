# Aula02 - TypeScript + Express with Docker

Simple Express API written in TypeScript, containerized for both development and production.

## Prerequisites

- Docker
- Docker Compose (v2, via `docker compose`)

## Project Port

The app runs on port `3333`.

## Run in Development (with hot reload)

This uses the `app-dev` service and mounts your local source code into the container.

```bash
docker compose --profile dev up --build app-dev
```

Or via npm script:

```bash
npm run dev:docker
```

Then access:

- http://localhost:3333

## Run in Production mode

This builds and runs the optimized runtime image (`runtime` stage).

```bash
docker compose up --build app
```

Then access:

- http://localhost:3333

## Stop containers

```bash
docker compose down
```

For dev profile only:

```bash
npm run dev:docker:down
```

## Rebuild from scratch (no cache)

```bash
docker compose build --no-cache
```

## Services summary

- `app`: production-like container (`target: runtime`)
- `app-dev`: development container (`target: dev`) with hot reload (`ts-node-dev --poll`)

Note: both services map `3333:3333`, so run one at a time.
