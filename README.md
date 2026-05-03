# Tata CLiQ E-Commerce Clone

A full-stack retail marketplace clone of Tata CLiQ, built with **Angular 21**, **.NET Core 10** microservices, and **SQL Server 2022**.

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | Angular 21, NgRx 21, Tailwind CSS 3, Angular Material 21 |
| Backend   | .NET 10, ASP.NET Core Web API, EF Core 9        |
| Database  | SQL Server 2022                                 |
| Auth      | JWT RS256 (ASP.NET Core Identity)               |
| Container | Docker / docker-compose                         |

---

## Services & Ports

| Service         | Local Port | Description                       |
|-----------------|------------|-----------------------------------|
| Auth.API        | 5001       | Register, login, refresh, logout  |
| User.API        | 5002       | Profile, addresses, wishlist      |
| Catalog.API     | 5003       | Products, categories, brands      |
| Cart.API        | 5004       | Cart items, coupon apply          |
| Order.API       | 5005       | Place order, order history        |
| Admin.API       | 5009       | Banners & coupons CRUD (Admin)    |
| Angular SPA     | 4200       | Frontend dev server               |
| SQL Server      | 1433       | Shared database                   |

---

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js v22.12+](https://nodejs.org/) (Angular CLI requirement)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (for containerised setup)
- SQL Server 2022 (local or via Docker)

---

## Quick Start — Docker (recommended)

```bash
# 1. Copy env file and set passwords / JWT keys
cp .env.example .env

# 2. Start full stack (SQL Server + all APIs + Angular)
docker compose up --build
```

Open [http://localhost:4200](http://localhost:4200).

> **Note:** The first run applies EF Core migrations automatically.  
> JWT RS256 keys must be set in `.env` — see `.env.example` for variable names.

---

## Quick Start — Local (without Docker)

### 1. Database
Start SQL Server locally (or run only the DB container):
```bash
docker compose up sqlserver -d
```

### 2. Backend — generate RSA keys
```bash
# PowerShell — generate key pair and paste into appsettings.json / env
openssl genrsa -out rsa_private.pem 2048
openssl rsa -in rsa_private.pem -pubout -out rsa_public.pem
```
Set `Jwt:PublicKey` in every API's `appsettings.json` and `Jwt:PrivateKey` + `Jwt:PublicKey` in `Auth.API/appsettings.json`.

### 3. Apply migrations
```bash
cd backend
dotnet ef database update --project src/Shared/TataCliq.Infrastructure --startup-project src/Services/TataCliq.Auth.API
```

### 4. Run APIs (each in a separate terminal)
```bash
cd backend && dotnet run --project src/Services/TataCliq.Auth.API    # :5001
cd backend && dotnet run --project src/Services/TataCliq.User.API    # :5002
cd backend && dotnet run --project src/Services/TataCliq.Catalog.API # :5003
cd backend && dotnet run --project src/Services/TataCliq.Cart.API    # :5004
cd backend && dotnet run --project src/Services/TataCliq.Order.API   # :5005
cd backend && dotnet run --project src/Services/TataCliq.Admin.API   # :5009
```

### 5. Run Angular dev server
```bash
cd frontend
npm install
npx ng serve --proxy-config proxy.conf.json
```
Open [http://localhost:4200](http://localhost:4200).

---

## Swagger / OpenAPI

Each API exposes Swagger UI at `/swagger`:

| API       | Swagger URL                    |
|-----------|-------------------------------|
| Auth      | http://localhost:5001/swagger  |
| User      | http://localhost:5002/swagger  |
| Catalog   | http://localhost:5003/swagger  |
| Cart      | http://localhost:5004/swagger  |
| Order     | http://localhost:5005/swagger  |
| Admin     | http://localhost:5009/swagger  |

---

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── Services/
│   │   │   ├── TataCliq.Auth.API/
│   │   │   ├── TataCliq.User.API/
│   │   │   ├── TataCliq.Catalog.API/
│   │   │   ├── TataCliq.Cart.API/
│   │   │   ├── TataCliq.Order.API/
│   │   │   └── TataCliq.Admin.API/
│   │   └── Shared/
│   │       ├── TataCliq.Infrastructure/   # EF Core, DbContext, migrations
│   │       └── TataCliq.SharedKernel/     # BaseEntity, IRepository, Result<T>
│   └── tatacliq-clone.slnx
├── frontend/
│   └── src/app/
│       ├── core/          # Guards, interceptors, services, models
│       ├── store/         # NgRx (auth, cart, catalog, ui)
│       ├── features/      # Home, catalog, cart, checkout, auth, account, admin
│       ├── layout/        # Header, footer, bottom-nav
│       └── shared/        # Reusable components, pipes
├── docker-compose.yml
└── .env.example
```

---

## Admin Access

Register a user, then assign the `Admin` role directly in SQL:

```sql
INSERT INTO [auth].[UserRoles] (UserId, RoleId)
SELECT u.Id, r.Id
FROM [auth].[Users] u, [auth].[Roles] r
WHERE u.Email = 'admin@example.com' AND r.Name = 'Admin';
```

Navigate to [http://localhost:4200/admin](http://localhost:4200/admin).

---

## Phase Progress

| Phase | Status   | Summary                                                       |
|-------|----------|---------------------------------------------------------------|
| 1     | Complete | Project foundation — folder structure, docker-compose, docs  |
| 2     | Complete | Backend — SharedKernel, Infrastructure, Auth.API, User.API   |
| 3     | Complete | Angular SPA — NgRx store, layout, homepage                   |
| 4     | Complete | Feature pages — PLP, PDP, Cart, Checkout + API stubs         |
| 5     | Complete | Full-stack integration — Dockerfiles, Admin.API, admin UI    |
