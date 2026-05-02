# TODO.md — Tata CLiQ E-Commerce Clone
# Phase-level task checklist. Mark: [ ] pending | [~] in progress | [x] done

---

## Phase 1 — Project Foundation
- [x] CLAUDE.md created and reviewed
- [x] TODO.md created
- [x] .gitignore updated for .NET Core + Angular
- [x] Folder structure scaffolded (frontend/, backend/, docs/, infra/)
- [x] .env.example created with all env variables
- [x] docker-compose.yml skeleton created (SQL Server + Redis + APIs)
- [x] docs/DESIGN.md created (design tokens, breakpoints, typography)
- [x] docs/ARCHITECTURE.md created (module map, naming conventions)
- [x] Phase 1 committed to git

---

## Phase 2 — Backend Data Layer & Auth

### .NET Solution Setup
- [x] tatacliq-clone.slnx created (note: .NET 10 generates .slnx format)
- [x] TataCliq.SharedKernel project scaffolded
  - [x] BaseEntity<TId> with audit fields
  - [x] Result<T> / Error types
  - [x] IRepository<T> interface
- [x] TataCliq.Infrastructure project scaffolded
  - [x] AppDbContext with all DbSets (all 6 schemas: auth, catalog, commerce, orders, payments, admin)
  - [x] EfRepository<T> implementation
  - [x] SaveChangesAuditInterceptor (CreatedAt / UpdatedAt auto-set)
  - [x] Global query filters (IsDeleted soft-delete on all entities)

### SQL Server Schema (EF Core Code-First)
- [x] Phase2_Auth_AddUsers migration — consolidated initial schema (all 24 tables, 6 schemas, all FKs + indexes in one migration)
- [x] Phase2_Auth_AddRoles migration — covered by initial schema
- [x] Phase2_Auth_AddRefreshTokens migration — covered by initial schema
- [x] Phase2_Auth_AddAddresses migration — covered by initial schema
- [x] Phase2_Catalog_AddCategories migration — covered by initial schema
- [x] Phase2_Catalog_AddBrands migration — covered by initial schema
- [x] Phase2_Catalog_AddProducts migration — covered by initial schema
- [x] Phase2_Catalog_AddProductVariants migration — covered by initial schema
- [x] Phase2_Commerce_AddWishlists migration — covered by initial schema
- [x] Phase2_Commerce_AddCart migration — covered by initial schema
- [x] Phase2_Orders_AddOrders migration — covered by initial schema
- [x] Phase2_Orders_AddOrderItems migration — covered by initial schema
- [x] Phase2_Payments_AddPayments migration — covered by initial schema
- [x] Phase2_Admin_AddBanners migration — covered by initial schema
- [x] Phase2_Admin_AddCoupons migration — covered by initial schema

### Auth.API
- [x] Project scaffolded with Clean Architecture folders (Controllers, Services, Repositories, DTOs, Validators, Mapping, Middleware)
- [x] ASP.NET Core Identity wired to AppDbContext
- [x] JWT RS256 token issuance endpoint (POST /api/auth/login)
- [x] User registration endpoint (POST /api/auth/register)
- [x] Refresh token endpoint (POST /api/auth/refresh)
- [x] Logout endpoint (POST /api/auth/logout)
- [x] FluentValidation for LoginDto + RegisterDto
- [x] Swagger UI at /swagger (Swashbuckle 10.x + ASP.NET Core OpenAPI — endpoint: /openapi/v1.json)

### User.API
- [x] Project scaffolded (Clean Architecture: Controllers, Services, DTOs, Validators, Mapping)
- [x] GET /api/users/me (profile)
- [x] PUT /api/users/me (update profile)
- [x] GET /api/users/me/addresses
- [x] POST /api/users/me/addresses
- [x] DELETE /api/users/me/addresses/{id}
- [x] GET /api/users/me/wishlist
- [x] POST /api/users/me/wishlist/{productId}
- [x] DELETE /api/users/me/wishlist/{productId}
- [x] Swagger UI at /swagger (OpenAPI at /openapi/v1.json)

- [x] Phase 2 committed to git

---

## Phase 3 — Angular SPA Foundation

### Workspace Setup
- [x] Angular 21 workspace created (ng new frontend --standalone --routing --style=scss) — Node v25.7.0 via nvm required
- [x] Tailwind CSS 3 installed and configured (postcss.config.js + tailwind.config.ts)
- [x] tailwind.config.ts updated with design tokens (all 9 tokens + breakpoints)
- [x] Angular Material 21 installed and themed (azure palette)
- [x] Lucide Angular installed
- [x] NgRx Store + Effects + Entity + Devtools installed (@ngrx/*@21)
- [x] environments/environment.ts + environment.prod.ts configured
- [x] Proxy config for local API (proxy.conf.json) — 5 API targets wired

### Core Module
- [x] app.config.ts (provideRouter, provideHttpClient, provideStore, provideEffects, provideStoreDevtools)
- [x] core/interceptors/auth.interceptor.ts (JWT injection from NgRx store — never localStorage)
- [x] core/interceptors/error.interceptor.ts (401 → refresh token dispatch)
- [x] core/guards/auth.guard.ts
- [x] app.routes.ts (all lazy routes defined — home, products, PDP, cart, checkout, auth, account)

### NgRx Store
- [x] store/auth/auth.actions.ts
- [x] store/auth/auth.reducer.ts
- [x] store/auth/auth.selectors.ts
- [x] store/auth/auth.effects.ts
- [x] store/cart/cart.actions.ts
- [x] store/cart/cart.reducer.ts
- [x] store/cart/cart.selectors.ts
- [x] store/cart/cart.effects.ts
- [x] store/catalog/catalog.actions.ts
- [x] store/catalog/catalog.reducer.ts
- [x] store/catalog/catalog.selectors.ts
- [x] store/catalog/catalog.effects.ts
- [x] store/ui/ui.actions.ts (loading, snackbar, modal, mobile nav states)
- [x] store/ui/ui.reducer.ts
- [x] store/ui/ui.selectors.ts

### Layout Components
- [x] layout/header.component.ts (sticky navy, search, cart badge, auth menu, category nav)
- [ ] layout/mega-menu.component.ts (deferred — integrated into header for Phase 3)
- [x] layout/footer.component.ts (4-column grid, responsive)
- [x] layout/bottom-nav.component.ts (mobile only, fixed bottom)

### Homepage Components
- [x] home/hero-carousel.component.ts (auto-play, 3 slides, prev/next/dots)
- [x] home/category-banners.component.ts (8 categories, 4-col mobile grid)
- [x] home/flash-sale.component.ts (countdown timer, 5 deals, CLiQ Cash colours)
- [x] home/promo-banners.component.ts (3 promo cards — CLiQ Cash, Try & Buy, Returns)
- [x] features/home/home.component.ts (page wrapper)

### Shared Components
- [x] shared/components/skeleton-loader.component.ts
- [x] shared/components/star-rating.component.ts
- [x] shared/components/badge.component.ts
- [x] shared/pipes/currency-inr.pipe.ts

- [x] Phase 3 committed to git

---

## Phase 4 — Core Feature Pages & API Stubs

### Angular — Product Listing Page (PLP)
- [ ] catalog/product-card.component.ts
- [ ] catalog/filter-sidebar.component.ts
- [ ] catalog/applied-filters.component.ts
- [ ] catalog/sort-dropdown.component.ts
- [ ] catalog/results-grid.component.ts
- [ ] features/catalog/plp.component.ts (page wrapper)

### Angular — Product Detail Page (PDP)
- [ ] catalog/product-images.component.ts (gallery + zoom)
- [ ] catalog/product-info.component.ts (name, price, rating)
- [ ] catalog/size-selector.component.ts
- [ ] catalog/colour-selector.component.ts
- [ ] catalog/add-to-cart-panel.component.ts
- [ ] catalog/product-description.component.ts
- [ ] catalog/product-reviews.component.ts
- [ ] features/catalog/pdp.component.ts (page wrapper)

### Angular — Cart Page
- [ ] cart/cart-item.component.ts
- [ ] cart/cart-summary.component.ts
- [ ] cart/coupon-input.component.ts
- [ ] features/cart/cart.component.ts (page wrapper)

### Angular — Checkout Flow
- [ ] checkout/address-step.component.ts
- [ ] checkout/payment-step.component.ts
- [ ] checkout/order-summary.component.ts
- [ ] checkout/order-confirmation.component.ts
- [ ] features/checkout/checkout.component.ts (page wrapper)

### .NET API Stubs
- [ ] TataCliq.Catalog.API scaffolded
  - [ ] GET /api/products (with query params: category, brand, minPrice, maxPrice, sort, page)
  - [ ] GET /api/products/{id}
  - [ ] GET /api/categories
  - [ ] GET /api/brands
- [ ] TataCliq.Cart.API scaffolded
  - [ ] GET /api/cart
  - [ ] POST /api/cart/items
  - [ ] PUT /api/cart/items/{id}
  - [ ] DELETE /api/cart/items/{id}
  - [ ] POST /api/cart/coupon
- [ ] TataCliq.Order.API scaffolded
  - [ ] POST /api/orders (place order)
  - [ ] GET /api/orders (list user orders)
  - [ ] GET /api/orders/{id} (order detail + tracking)
  - [ ] POST /api/orders/{id}/cancel

### Angular Services (wired to API stubs)
- [ ] core/services/catalog.service.ts
- [ ] core/services/cart.service.ts
- [ ] core/services/order.service.ts
- [ ] core/services/auth.service.ts
- [ ] core/services/user.service.ts

- [ ] Phase 4 committed to git

---

## Phase 5 — Full-Stack Integration

### Docker & Local Dev
- [ ] docker-compose.yml completed (SQL Server, Redis, all APIs, Angular dev)
- [ ] Dockerfile for each .NET API
- [ ] Dockerfile for Angular
- [ ] All API appsettings.Development.json use docker service names
- [ ] `docker compose up` starts full stack successfully

### Angular ↔ API Wiring
- [ ] auth.interceptor.ts injects JWT from NgRx store (memory only — never localStorage)
- [ ] error.interceptor.ts handles 401 → refresh → retry
- [ ] All NgRx Effects make real HTTP calls via services
- [ ] Product search / filter / sort wired to Catalog.API
- [ ] Cart operations wired to Cart.API
- [ ] Checkout placement wired to Order.API
- [ ] Auth login/register wired to Auth.API

### Admin Skeleton
- [ ] TataCliq.Admin.API scaffolded (banners, coupons CRUD)
- [ ] features/admin/admin-dashboard.component.ts
- [ ] features/admin/banner-list.component.ts
- [ ] features/admin/coupon-list.component.ts
- [ ] Admin route guard (Admin role required)

### Final Checks
- [ ] ng build --configuration production passes with no errors
- [ ] dotnet build passes for all projects
- [ ] Swagger UI accessible for all APIs
- [ ] Mobile layout tested at 375px for all pages
- [ ] README.md updated with setup instructions

- [ ] Phase 5 committed to git

---

## Blocked / Assumptions
- Azure resources (Blob, Redis, Cognitive Search) deferred to post-Phase 5
- Razorpay integration deferred to Phase 5 (V2 gate)
- OTP (MSG91) auth deferred — email/password only in V1
- Cosmos DB for catalog deferred — SQL Server used for V1
- ~~[BLOCKER — Phase 2]~~ .NET 10 SDK 10.0.203 installed — blocker resolved.

---

## Session Log
| Date       | Session Summary |
|------------|-----------------|
| 2026-05-02 | Phase 1 audit complete — all tasks verified [x], Phase 1 commit confirmed (f96ed3f). Phase 2 blocker identified: .NET 10 SDK missing, only .NET 8.0.202 installed. Options presented to user (install SDK or proceed with net8.0 temporarily). |
| 2026-05-02 | .NET 10 SDK 10.0.203 installed. Phase 2 .NET Solution Setup complete: tatacliq-clone.slnx, TataCliq.SharedKernel (BaseEntity, Result<T>, IRepository<T>), TataCliq.Infrastructure (15 entities across 6 schemas, AppDbContext, EfRepository<T>, SaveChangesAuditInterceptor). Both projects build 0 errors. |
| 2026-05-02 | Phase 2 EF Core migrations and Auth.API complete. dotnet-ef 9.0.15 installed. Phase2_Auth_AddUsers initial schema migration generated (all 24 tables). TataCliq.Auth.API scaffolded with Clean Architecture: DTOs, FluentValidation, TokenService (RS256), AuthService (register/login/refresh/logout), AuthController, Program.cs (Identity + JWT + Serilog + OpenAPI). Builds 0 errors. |
| 2026-05-02 | Phase 2 complete. TataCliq.User.API scaffolded: 8 endpoints (profile GET/PUT, addresses GET/POST/DELETE, wishlist GET/POST/DELETE), FluentValidation, AutoMapper profile, UserService, UsersController, Program.cs (JWT verify-only, Serilog, OpenAPI). Full solution builds 0 errors 0 warnings. Phase 2 committed. |
