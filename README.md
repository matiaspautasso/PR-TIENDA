# TiendaTec — Product Catalog Management System

> A full-stack REST API + portfolio-style web interface for managing a technology product catalog.  
> Built with Node.js, Express 5, PostgreSQL, and a complete TDD test suite.

![Node.js](https://img.shields.io/badge/Node.js-ES%20Modules-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Tested-Vitest%20%2B%20Playwright-6E9F18?logo=vitest&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## What Is This?

TiendaTec is a **product catalog management system** designed for tech retail. It exposes a clean REST API and a responsive web interface where operators can list, search, filter, create, edit, view, and delete products — without any external dependencies beyond Node.js, Docker, and a browser.

The project is built as a **portfolio piece** demonstrating production-level backend patterns: layered architecture, environment-based configuration, image upload handling, input validation, and a full three-layer test pyramid (unit → integration → E2E).

---

## What You Get

| Capability | Details |
|------------|---------|
| **Product listing** | Responsive card grid with live search and filters (category, status) |
| **CRUD operations** | Create, read, update, and delete products through a slide-in form panel |
| **Product detail view** | Modal with full product information including image |
| **Image uploads** | Multipart form handling via Multer; images served as static assets |
| **Input validation** | Client-side (JS) + server-side (controller) validation with clear error messages |
| **REST API** | 5 endpoints, consistent JSON responses `{ data }` / `{ mensaje }` |
| **Test suite** | 11 unit tests, 8 integration tests (19/19 passing), 7 E2E scenarios |
| **Containerized DB** | PostgreSQL 16 via Docker Compose — zero manual DB setup |
| **Idempotent migrations** | SQL migration script for existing databases |

---

## Business Impact

This system addresses a common problem for small-to-medium tech retailers: **managing product inventory without a bloated ERP**. By exposing a clean API, it can be integrated with any frontend or third-party system. The portfolio-style UI allows non-technical operators to manage the catalog directly.

**Key outcomes:**
- Reduces time-to-update for product listings from minutes (manual spreadsheets) to seconds
- Provides a single source of truth for product data (name, price, stock, category, status)
- Activating/deactivating products without deletion preserves inventory history
- Clean REST contract enables future integration with e-commerce platforms, mobile apps, or ERPs

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Runtime | **Node.js 20+** (ES Modules `.mjs`) | Native ESM, no transpilation needed |
| Framework | **Express 5** | Async error propagation built-in |
| Database | **PostgreSQL 16** | ACID compliance, CHECK constraints for data integrity |
| Containerization | **Docker Compose** | Reproducible local environment, zero manual DB setup |
| File uploads | **Multer 2** | Streaming multipart parsing |
| Unit/Integration testing | **Vitest + Supertest** | Native ESM support, fast execution |
| E2E testing | **Playwright** | Cross-browser, reliable selectors |
| Environment config | **dotenv** | Twelve-factor app configuration |

---

## Key Features

- **Layered MVC architecture** — model / controller / router / app factory clearly separated
- **App factory pattern** — `app.mjs` exports the Express app without calling `listen()`, enabling supertest imports in tests without side effects
- **Consistent API contract** — all responses follow `{ data }` for payloads and `{ mensaje }` for actions/errors
- **Enum validation** — product `estado` field enforced at both controller and DB level (`CHECK` constraint)
- **Optional image update** — `PUT` preserves existing image when no new file is uploaded (`CASE WHEN` in SQL)
- **Client-side filtering** — search, category, and status filters run on the local product array (no extra round trips)
- **XSS protection** — all user-generated content escaped with `escHtml()` before rendering into the DOM
- **Absolute path resolution** — image deletion uses `__dirname`-based absolute paths, avoiding working-directory bugs

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Browser                    │
│   index.html + app.js + formulario.js       │
│   (Vanilla JS ES6 modules — no bundler)     │
└────────────────────┬────────────────────────┘
                     │ HTTP fetch /api/productos
┌────────────────────▼────────────────────────┐
│              Express 5 App                  │
│  servidor.mjs → app.mjs → rutasAdmin.mjs    │
│        rutas.productos.mjs                  │
│        controlador.producto.mjs             │
│        modelo.productos.mjs                 │
└────────────────────┬────────────────────────┘
                     │ pg Pool
┌────────────────────▼────────────────────────┐
│         PostgreSQL 16 (Docker)              │
│         tabla: productos                    │
└─────────────────────────────────────────────┘
```

**Folder structure:**

```
PR-TIENDA/
├── db/
│   ├── init.sql                        ← Full schema (auto-run by Docker)
│   └── migration-add-fields.sql        ← Idempotent migration for existing DBs
├── tiendatec/
│   ├── app.mjs                         ← Express factory (testable, no listen)
│   ├── servidor.mjs                    ← Entry point (imports app, calls listen)
│   ├── api-crud/
│   │   ├── configuraciones/
│   │   │   └── baseDeDatos.mjs         ← PostgreSQL pool (reads from .env)
│   │   ├── modulos/productos/
│   │   │   ├── controlador.producto.mjs  ← Request handling, validation
│   │   │   ├── modelo.productos.mjs      ← SQL queries, file ops
│   │   │   └── rutas.productos.mjs       ← Route definitions
│   │   ├── rutas/
│   │   │   └── rutasAdmin.mjs
│   │   └── utilidades/
│   │       └── util.multer.mjs           ← Multer middleware config
│   ├── api/imagenes/                   ← Uploaded images (gitignored)
│   ├── vistas/portfolio/               ← Web UI
│   │   ├── index.html
│   │   ├── css/estilos.css
│   │   └── js/
│   │       ├── app.js                  ← Fetch, render, filters, CRUD actions
│   │       └── formulario.js           ← Validation + FormData building
│   └── test/
│       ├── unit/controlador.test.mjs     ← 11 tests (vi.mock model)
│       ├── integration/api.productos.test.mjs  ← 8 tests (supertest)
│       └── e2e/portfolio.spec.mjs        ← 7 Playwright scenarios
├── docker-compose.yml
├── vitest.config.mjs
├── playwright.config.mjs
└── .env.example
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- Docker + Docker Compose

### 1. Start the database

```bash
docker compose up -d
```

Starts PostgreSQL 16 on port `5433` and auto-runs `db/init.sql`.

### 2. Configure environment

```bash
cp .env.example .env
# Default values work with Docker out of the box
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
npm run dev        # Hot-reload via nodemon
```

Open **http://localhost:3000**

---

## API Reference

All endpoints under `/api/productos`. All responses are JSON.

| Method | Route | Description | Response |
|--------|-------|-------------|----------|
| `GET` | `/api/productos` | List all products | `{ data: Product[] }` |
| `GET` | `/api/productos/:id` | Get single product | `{ data: Product }` · 404 if not found |
| `POST` | `/api/productos` | Create product (`multipart/form-data`) | `{ mensaje }` · 201 |
| `PUT` | `/api/productos/:id` | Update product | `{ mensaje, data: Product }` |
| `DELETE` | `/api/productos/:id` | Delete product + image | `{ mensaje }` |

**Product schema:**

| Field | Type | Required | Constraint |
|-------|------|----------|-----------|
| `nombre` | text | Yes | Non-empty |
| `descripcion` | text | — | — |
| `precio` | number | Yes | `> 0` |
| `stock` | integer | Yes | `>= 0` |
| `categoria` | text | — | — |
| `imagen` | file | Yes (create) | Stored as static asset |
| `estado` | text | Yes | `'activo'` or `'inactivo'` |

**Error shape:** `{ mensaje: "description" }` with appropriate HTTP status code.

---

## Testing

```bash
npm test                  # Unit + integration (19 tests)
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
npm run test:e2e          # Playwright E2E (requires server + Docker)
```

**Test pyramid:**

| Layer | Tool | Tests | Status |
|-------|------|-------|--------|
| Unit | Vitest + `vi.mock` | 11 | ✅ Passing |
| Integration | Vitest + Supertest | 8 | ✅ Passing |
| E2E | Playwright | 7 scenarios | Requires `npx playwright install chromium` |

**E2E setup:**

```bash
npx playwright install chromium

# Terminal 1
docker compose up -d && npm run dev

# Terminal 2
npm run test:e2e
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with hot-reload |
| `npm test` | Unit + integration tests |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run test:e2e` | Playwright E2E tests |

---

## Migrating an Existing Database

If you have an existing `productos` table without the newer fields (`descripcion`, `categoria`, `estado`):

```bash
psql -U postgres -d tienda -f db/migration-add-fields.sql
```

The migration is idempotent (`ADD COLUMN IF NOT EXISTS`).

---

## Skills Demonstrated

`Node.js` · `Express.js` · `REST API Design` · `PostgreSQL` · `SQL` · `Docker` · `Docker Compose`  
`Test-Driven Development (TDD)` · `Vitest` · `Supertest` · `Playwright` · `JavaScript (ES2022)`  
`ES Modules` · `MVC Architecture` · `File Upload Handling` · `Environment Configuration`  
`Input Validation` · `XSS Prevention` · `Responsive CSS Grid` · `Vanilla JS`  
`Spec-Driven Development (SDD)` · `CI-ready test suite`

---

## License

MIT
