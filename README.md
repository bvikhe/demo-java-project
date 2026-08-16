### -----> Demo Full-Stack (React + Fastify + Postgres)
A minimal, opinionated full-stack demo that is intentionally small in code but structured like a production project: containerized services, a compose file, a GitHub Actions CI pipeline, and a clear path to Kubernetes.

### ----> Capabilities
Frontend ("Hello World") :- `frontend/src/App.jsx` | `curl http://localhost:8080` | `curl http://localhost:8080/api/hello`

Backend ("Hello World") :- `backend/index.js` | `curl http://localhost:3000/api/hello`

Database ("Hello World") :- `backend/db/index.js` | `curl http://localhost:3000/api/db`

CRUD (create) :- `backend/index.js` | `curl -X POST -H "Content-Type: application/json" -d '{"text":"hello"}' http://localhost:3000/api/messages`

CRUD (list) :- `backend/index.js` | `curl http://localhost:3000/api/messages`

CRUD (update) :- `backend/index.js` | `curl -X PUT -H "Content-Type: application/json" -d '{"text":"updated"}' http://localhost:3000/api/messages/<id>`

CRUD UI :- `frontend/src/App.jsx` | `http://localhost:8080`

Postgres service :- `docker-compose.yaml` (DB image import)
Backend DB access :- `backend/db/index.js`
Container images :- `backend/Dockerfile` + `frontend/Dockerfile`
Local orchestration :- `docker-compose.yaml`|docker-compose up --build
CI pipeline :- `.github/workflows/ci.yml`
Environment config :- `.env.example`

### ----> Stack and pragmatic choices

Frontend — React + Vite + Nginx :- Vite gives a fast dev/build loop with almost no config, and Nginx serves the static bundle in production.

Backend — Fastify :- Lightweight, fast Node.js framework.

Database — Postgress :- The requirement allowed SQLite or PGlite, 
or another simple stack. We chose Postgres as the allowed alternative because an independent database service is needed for multi-replica deployments and a clearer path to Kubernetes.

Containers :- `docker-compose.yaml` builds all three services and wires them together, so the same setup works locally.

CI — GitHub Actions :- `.github/workflows/ci.yml` runs backend tests and builds the frontend on every PR to `main`.

### ----> SDLC, tooling, and engineering practices
Version control (Git) :-
Short-lived feature branches, protected `main`, and required PR reviews.

Continuous Integration :- 
`.github/workflows/ci.yml` runs backend tests and the frontend build on every push/PR to `main`.

Container parity :-
`backend/Dockerfile` and `frontend/Dockerfile` build the same images used locally and in the pipeline.

Configuration by environment :-
`DATABASE_URL`, `PORT`, `HOST`, and `NODE_ENV` are injected, not hard-coded.

Testability :-
`backend/test/test.js` validates the Postgres connection and basic CRUD.

Reproducible builds :-
`package.json` and `package-lock.json` pin dependencies.

### ----> How this setup evolves for Kubernetes
The Docker Compose setup is intentionally close to a Kubernetes deployment. The mapping below shows how each concept translates.

Replicas (Deployment) :-
for both frontend and backend. The frontend is stateless and the backend is now stateless because it talks to a separate Postgres service, so both can scale horizontally with `replicas` and `HorizontalPodAutoscaler`

Services (ClusterIP) :-
for the backend and for Postgres; `Ingress` (or `LoadBalancer`) for the frontend. Path-based routing sends `/api/*` to the backend service.

PVCs :-
Postgres data needs durable storage. Use a `StatefulSet` with `volumeClaimTemplates` to give each Postgres pod a `PersistentVolumeClaim`, or replace it with a managed Postgres service.

Secrets / Config :-
Move `DATABASE_URL` and credentials into `Secret` objects. Non-sensitive config like `NODE_ENV`, `PORT`, and `HOST` can live in `ConfigMap` objects. Both are injected as environment variables.

Rolling updates :-
`Deployment` rolling update strategy with `maxSurge` and `maxUnavailable` ensures zero-downtime deploys and safe traffic shifting.