# Tata CLiQ E-Commerce Clone

A production-grade retail marketplace clone of **Tata CLiQ Fashion**, built with Angular 21, .NET 10 microservices, SQL Server 2022, and Redis 7. Features an Angular admin panel, a user storefront, YARP API gateway, JWT RS256 auth, Redis caching, Docker orchestration, GitHub Actions CI/CD, and a full test suite.

---

## Tech Stack

| Layer      | Technology                                                                               |
|------------|------------------------------------------------------------------------------------------|
| Frontend   | Angular 21, NgRx 21, Tailwind CSS 3, Angular Material 21, ApexCharts                    |
| Backend    | .NET 10, ASP.NET Core Web API (9 microservices + YARP gateway), EF Core 9               |
| Database   | SQL Server 2022 (11 schemas, 30+ tables)                                                 |
| Cache      | Redis 7 — catalog product/category cache (10–60 min TTL)                                |
| Auth       | JWT RS256 via ASP.NET Core Identity + OTP flow                                           |
| Storage    | MinIO / Azure Blob Storage via Media.API                                                 |
| Container  | Docker / docker-compose (17 containers)                                                  |
| Testing    | xUnit + Moq + FluentAssertions (62 tests) · Playwright E2E (3 journeys)                 |
| CI/CD      | GitHub Actions — build, test, Docker push, Azure Container Apps deploy                   |

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| [.NET SDK](https://dotnet.microsoft.com/download/dotnet/10.0) | 10.0+ | `dotnet --version` |
| [Node.js](https://nodejs.org/) | 22.12+ | Angular CLI 21 requires ≥ 22. Use `nvm install 22` if needed. |
| [Docker Desktop](https://www.docker.com/products/docker-desktop) | Latest | Required for the Docker path |
| SQL Server 2022 | 2022 | Local install or use the Docker SQL container |
| Angular CLI | 21+ | `npm install -g @angular/cli@21` |

---

## Service & Port Map

| Service              | Port     | Swagger UI (Dev only)                  |
|----------------------|----------|----------------------------------------|
| Gateway.API (YARP)   | **5000** | —                                      |
| Auth.API             | **5001** | http://localhost:5001/swagger          |
| User.API             | **5002** | http://localhost:5002/swagger          |
| Catalog.API          | **5003** | http://localhost:5003/swagger          |
| Cart.API             | **5004** | http://localhost:5004/swagger          |
| Order.API            | **5005** | http://localhost:5005/swagger          |
| Admin.API            | **5009** | http://localhost:5009/swagger          |
| Seller.API           | **5010** | http://localhost:5010/swagger          |
| Media.API            | **5011** | http://localhost:5011/swagger          |
| User Panel           | **4200** | http://localhost:4200                  |
| Admin Panel          | **4201** | http://localhost:4201                  |
| SQL Server           | **1433** | —                                      |
| Redis                | **6379** | —                                      |
| MinIO Console        | **9001** | http://localhost:9001                  |

All API routes are versioned under `/api/v1/`. Swagger UI is disabled in Production (`ASPNETCORE_ENVIRONMENT=Production`).

> **Note:** `Notification.API` and `Payment.API` are scaffolded and reserved for a future phase.

### Health Checks

Every service exposes `GET /health` returning JSON:

```json
{ "status": "Healthy", "checks": [{ "name": "sqlserver", "status": "Healthy" }] }
```

---

## Local Setup — with Docker (recommended)

```bash
# 1. Clone the repo
git clone <repo-url>
cd tata-cliq-ecommerce-clone-dotnet-angular-sql

# 2. Copy the env template and fill in values
cp .env.example .env
# Edit .env: set SQLSERVER_SA_PASSWORD and JWT key paths

# 3. Start the full stack (SQL Server + Redis + MinIO + all APIs + Angular)
docker compose up --build
```

Open http://localhost:4200 (User Panel) or http://localhost:4201 (Admin Panel).

> **First run:** EF Core migrations run automatically on startup.  
> **JWT RS256 keys** must be generated and referenced in `.env` — see the Environment Variables section below.  
> **Redis** starts automatically — Catalog.API auto-detects and enables caching when `ConnectionStrings:Redis` is set.  
> **MinIO** starts automatically on ports `9000` (API) and `9001` (console).

---

## Local Setup — without Docker

### Step 1 — Start SQL Server

Option A — use only the SQL Server container:
```bash
docker compose up sqlserver -d
```

Option B — use a local SQL Server 2022 instance (Windows Auth or SA login).

### Step 2 — Generate RSA key pair (JWT RS256)

```bash
openssl genrsa -out keys/private.pem 2048
openssl rsa -in keys/private.pem -pubout -out keys/public.pem
```

Set paths in each API's `appsettings.Development.json`:
```json
{
  "Jwt": {
    "PrivateKeyPath": "./keys/private.pem",
    "PublicKeyPath":  "./keys/public.pem",
    "Issuer":   "https://tatacliq-auth.local",
    "Audience": "tatacliq-spa"
  }
}
```

> Only **Auth.API** needs `PrivateKeyPath`. All other APIs need only `PublicKeyPath`.

### Step 3 — Apply EF Core migrations

```bash
cd backend
dotnet ef database update \
  --project src/Shared/TataCliq.Infrastructure \
  --startup-project src/Services/TataCliq.Auth.API
```

This creates all schemas (`auth`, `catalog`, `commerce`, `orders`, `admin`) and seeds:
- 100 sample products across categories
- Default admin user: `admin@tatacliq.com` / `Admin@123`

### Step 4 — Run the APIs

Open terminals for each service (or use your IDE's multi-run config):

```bash
cd backend && dotnet run --project src/Services/TataCliq.Gateway.API   # :5000
cd backend && dotnet run --project src/Services/TataCliq.Auth.API      # :5001
cd backend && dotnet run --project src/Services/TataCliq.User.API      # :5002
cd backend && dotnet run --project src/Services/TataCliq.Catalog.API   # :5003
cd backend && dotnet run --project src/Services/TataCliq.Cart.API      # :5004
cd backend && dotnet run --project src/Services/TataCliq.Order.API     # :5005
cd backend && dotnet run --project src/Services/TataCliq.Admin.API     # :5009
cd backend && dotnet run --project src/Services/TataCliq.Seller.API    # :5010
cd backend && dotnet run --project src/Services/TataCliq.Media.API     # :5011
```

### Step 5 — Run the Angular applications

```bash
# User Panel (port 4200)
cd user-panel
npm install
npx ng serve --proxy-config proxy.conf.json

# Admin Panel (port 4201) — separate terminal
cd admin-panel
npm install
npx ng serve
```

Open http://localhost:4200 (user panel) or http://localhost:4201 (admin panel).

---

## Default Credentials

| Role       | Email                    | Password   | Notes |
|------------|--------------------------|------------|-------|
| Super Admin | admin@tatacliq.com      | Admin@123  | Seeded by DbSeeder on first migration |
| Seller     | seller@tatacliq.com      | Seller@123 | Seeded seller account |
| User       | (register via /register) | —          | Self-registration enabled |

---

## Running Tests

### .NET unit tests

```bash
cd backend
dotnet test
```

**62 tests pass** across 5 test projects:

| Project | Tests |
|---------|-------|
| TataCliq.Auth.Tests | 16 |
| TataCliq.Catalog.Tests | 21 |
| TataCliq.Cart.Tests | 7 |
| TataCliq.Order.Tests | 9 |
| TataCliq.Seller.Tests | 9 |

### Angular type-check (TypeScript compilation)

```bash
# User Panel
cd user-panel && npx tsc --noEmit

# Admin Panel
cd admin-panel && npx tsc --noEmit
```

### Angular unit tests

```bash
cd user-panel
npx ng test --watch=false --code-coverage
```

> **Note:** Angular CLI 21 requires Node.js ≥ 22. If on an older version, use `npx tsc --noEmit` as a compilation-check proxy.

### Playwright E2E tests

Playwright specs live in `e2e/tests/`. The full stack must be running first:

```bash
cd e2e
npm install
npx playwright test
```

Three journeys covered: user registration flow, product browse & add-to-cart, and checkout.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values. **Never commit `.env` to git.**

| Variable | Required | Description |
|----------|----------|-------------|
| `SQLSERVER_SA_PASSWORD` | Yes | SQL Server SA password |
| `SQLSERVER_HOST` | Yes | SQL Server hostname (default: `localhost`) |
| `SQLSERVER_PORT` | Yes | SQL Server port (default: `1433`) |
| `SQLSERVER_DB` | Yes | Database name (default: `TataCliqDb`) |
| `ConnectionStrings__DefaultConnection` | Yes | Full EF Core connection string |
| `ConnectionStrings__Redis` | No | Redis connection string (e.g. `localhost:6379`). Omit to disable catalog caching. |
| `AllowedOrigins__0` | Prod | First allowed CORS origin (e.g. `https://tatacliq.com`) |
| `AllowedOrigins__1` | Prod | Second allowed CORS origin (e.g. `https://admin.tatacliq.com`) |
| `Jwt__PrivateKeyPath` | Auth.API only | Path to RSA private key `.pem` |
| `Jwt__PublicKeyPath` | All APIs | Path to RSA public key `.pem` |
| `Jwt__Issuer` | Yes | JWT issuer claim (e.g. `https://tatacliq-auth.local`) |
| `Jwt__Audience` | Yes | JWT audience claim (e.g. `tatacliq-spa`) |
| `Jwt__AccessTokenExpiryMinutes` | No | Default: `15` |
| `Jwt__RefreshTokenExpiryDays` | No | Default: `7` |
| `MinIO__Endpoint` | No | MinIO endpoint (default: `localhost:9000`) |
| `MinIO__AccessKey` | No | MinIO access key |
| `MinIO__SecretKey` | No | MinIO secret key |

> **Production note:** Set `ASPNETCORE_ENVIRONMENT=Production` to disable Swagger UI and lock CORS to the `AllowedOrigins` list.

---

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── Services/
│   │   │   ├── TataCliq.Gateway.API/        # YARP reverse proxy — routes all client traffic
│   │   │   ├── TataCliq.Auth.API/           # Register, login, refresh, logout, OTP
│   │   │   ├── TataCliq.User.API/           # Profile, addresses, wishlist, wallet
│   │   │   ├── TataCliq.Catalog.API/        # Products, categories, brands, Redis cache
│   │   │   ├── TataCliq.Cart.API/           # Cart CRUD, coupon apply
│   │   │   ├── TataCliq.Order.API/          # Place order, buy-now, order history, cancel, tracking
│   │   │   ├── TataCliq.Admin.API/          # Banners, coupons, admin orders/products/users
│   │   │   ├── TataCliq.Seller.API/         # Seller products, analytics, onboarding
│   │   │   ├── TataCliq.Media.API/          # File upload pipeline (MinIO / Azure Blob)
│   │   │   ├── TataCliq.Notification.API/   # (scaffolded — future phase)
│   │   │   └── TataCliq.Payment.API/        # (scaffolded — future phase)
│   │   └── Shared/
│   │       ├── TataCliq.Infrastructure/     # EF Core DbContext, EfRepository<T>, migrations
│   │       └── TataCliq.SharedKernel/       # BaseEntity, Result<T>, IRepository<T>, middlewares
│   ├── tests/
│   │   ├── TataCliq.Auth.Tests/             # xUnit — AuthService (16 tests)
│   │   ├── TataCliq.Catalog.Tests/          # xUnit — CatalogService + Validators (21 tests)
│   │   ├── TataCliq.Cart.Tests/             # xUnit — CartService (7 tests)
│   │   ├── TataCliq.Order.Tests/            # xUnit — OrderService (9 tests)
│   │   └── TataCliq.Seller.Tests/           # xUnit — SellerService (9 tests)
│   └── tatacliq-clone.slnx
├── user-panel/
│   └── src/app/
│       ├── core/          # Guards, interceptors, services, models
│       ├── store/         # NgRx slices: auth, cart, catalog, wishlist, order, ui
│       ├── features/      # Lazy-loaded pages (home, catalog PLP/PDP, cart, checkout, auth, account)
│       ├── layout/        # Header, footer, bottom-nav, mega-menu
│       └── shared/        # Reusable components (empty-state, snackbar, skeleton, notification-bell)
├── admin-panel/
│   └── src/app/
│       ├── core/          # Guards, interceptors, admin API service
│       ├── store/         # NgRx slices: auth, ui
│       ├── features/      # Dashboard, products, orders, users, coupons, banners, seller, RBAC
│       ├── layout/        # Sidebar, topbar
│       └── shared/        # KPI cards, charts, status badge, confirm dialog, file upload
├── e2e/
│   └── tests/             # Playwright E2E — 3 user journey specs
├── docs/
│   ├── ARCHITECTURE.md    # System design, sequence diagrams, ADRs
│   ├── API.md             # Full endpoint reference (all controllers)
│   ├── DATABASE_SCHEMA.md # Complete SQL schema — all 11 schemas
│   ├── ROLES_RBAC.md      # Permission matrix, policy definitions
│   ├── DESIGN.md          # Design tokens, typography, breakpoints
│   ├── DEPLOYMENT.md      # Docker Compose, CI/CD, Azure architecture
│   ├── SECURITY.md        # Threat model, auth security, RBAC
│   ├── PERFORMANCE.md     # Redis caching, query optimization, Angular bundle
│   ├── MEDIA_UPLOAD.md    # File upload pipeline, MinIO, ImageSharp
│   └── SEEDER.md          # All seeded accounts (40+), categories, brands, products
├── docker-compose.yml
├── .env.example
└── CLAUDE.md              # AI coding rules (read every session)
```

---

## Swagger / OpenAPI

Each API exposes Swagger UI at `/swagger` in Development mode:

| API          | URL                             |
|--------------|---------------------------------|
| Auth.API     | http://localhost:5001/swagger   |
| User.API     | http://localhost:5002/swagger   |
| Catalog.API  | http://localhost:5003/swagger   |
| Cart.API     | http://localhost:5004/swagger   |
| Order.API    | http://localhost:5005/swagger   |
| Admin.API    | http://localhost:5009/swagger   |
| Seller.API   | http://localhost:5010/swagger   |
| Media.API    | http://localhost:5011/swagger   |

All error responses conform to **RFC 7807 ProblemDetails** (`application/problem+json`).

---

## Architecture Overview

```
Browser → Gateway.API (:5000, YARP)
              │
              ├── /api/v1/auth/**     → Auth.API    (:5001)
              ├── /api/v1/users/**    → User.API    (:5002)
              ├── /api/v1/catalog/**  → Catalog.API (:5003) → Redis cache
              ├── /api/v1/cart/**     → Cart.API    (:5004)
              ├── /api/v1/orders/**   → Order.API   (:5005)
              ├── /api/v1/admin/**    → Admin.API   (:5009)
              ├── /api/v1/seller/**   → Seller.API  (:5010)
              └── /api/v1/media/**    → Media.API   (:5011) → MinIO
```

All services share a single SQL Server 2022 instance via separate EF Core schemas. JWT RS256 tokens are issued by Auth.API and validated by every downstream service using the shared public key.

---

## Phase Progress

| Phase | Status   | Summary |
|-------|----------|---------|
| 1     | Complete | Project foundation — folder structure, docker-compose, docs |
| 2     | Complete | Backend — SharedKernel, Infrastructure, Auth.API, User.API |
| 3     | Complete | Angular SPA — NgRx store, layout, homepage components |
| 4     | Complete | Feature pages — PLP, PDP, Cart, Checkout + all API services |
| 5     | Complete | Full-stack integration — Dockerfiles, Admin.API, admin UI |
| 6     | Complete | RSA keys, DbSeeder, Buy Now, login/register forms, Wishlist NgRx |
| 7     | Complete | DESIGN.md alignment — design tokens, fonts, all UI components |
| 8     | Complete | Improvement Sprint — 86/100, 29 commits, 11 tests |
| 9     | Complete | Enterprise architecture — Gateway (YARP), Seller.API, Media.API, new schemas, DB seeder |
| 10    | Complete | Admin panel — NgRx, guards, 14 feature components, ApexCharts |
| 11    | Complete | User storefront — wallet, OTP, order tracking, notification bell |
| 12    | Complete | Testing suite — 62 .NET tests, 10+ Angular specs, 3 Playwright E2E |
| 13    | Complete | Production hardening — security headers, Redis cache, health checks, CI/CD |
