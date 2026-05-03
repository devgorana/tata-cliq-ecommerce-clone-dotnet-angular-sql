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
- [x] catalog/product-card.component.ts
- [x] catalog/filter-sidebar.component.ts
- [x] catalog/applied-filters.component.ts
- [x] catalog/sort-dropdown.component.ts
- [x] catalog/results-grid.component.ts
- [x] features/catalog/plp.component.ts (page wrapper)

### Angular — Product Detail Page (PDP)
- [x] catalog/product-images.component.ts (gallery + zoom)
- [x] catalog/product-info.component.ts (name, price, rating)
- [x] catalog/size-selector.component.ts
- [x] catalog/colour-selector.component.ts
- [x] catalog/add-to-cart-panel.component.ts
- [x] catalog/product-description.component.ts
- [x] catalog/product-reviews.component.ts
- [x] features/catalog/pdp.component.ts (page wrapper)

### Angular — Cart Page
- [x] cart/cart-item.component.ts
- [x] cart/cart-summary.component.ts
- [x] cart/coupon-input.component.ts
- [x] features/cart/cart.component.ts (page wrapper)

### Angular — Checkout Flow
- [x] checkout/address-step.component.ts
- [x] checkout/payment-step.component.ts
- [x] checkout/order-summary.component.ts
- [x] checkout/order-confirmation.component.ts
- [x] features/checkout/checkout.component.ts (page wrapper)

### .NET API Stubs
- [x] TataCliq.Catalog.API scaffolded
  - [x] GET /api/products (with query params: category, brand, minPrice, maxPrice, sort, page)
  - [x] GET /api/products/{id}
  - [x] GET /api/categories
  - [x] GET /api/brands
- [x] TataCliq.Cart.API scaffolded
  - [x] GET /api/cart
  - [x] POST /api/cart/items
  - [x] PUT /api/cart/items/{id}
  - [x] DELETE /api/cart/items/{id}
  - [x] POST /api/cart/coupon
- [x] TataCliq.Order.API scaffolded
  - [x] POST /api/orders (place order)
  - [x] GET /api/orders (list user orders)
  - [x] GET /api/orders/{id} (order detail + tracking)
  - [x] POST /api/orders/{id}/cancel

### Angular Services (wired to API stubs)
- [x] core/services/catalog.service.ts
- [x] core/services/cart.service.ts
- [x] core/services/order.service.ts
- [x] core/services/auth.service.ts
- [x] core/services/user.service.ts

- [x] Phase 4 committed to git

---

## Phase 5 — Full-Stack Integration

### Docker & Local Dev
- [x] docker-compose.yml completed (SQL Server, all APIs, Angular dev)
- [x] Dockerfile for each .NET API (Auth, User, Catalog, Cart, Order, Admin — multi-stage)
- [x] Dockerfile.dev for Angular (Node 22, ng serve with docker proxy config)
- [x] proxy.conf.docker.json — Angular dev proxy using Docker service names
- [x] All API launchSettings.json aligned to ports 5001–5009

### Angular ↔ API Wiring
- [x] auth.interceptor.ts injects JWT from NgRx store (memory only — never localStorage)
- [x] error.interceptor.ts handles 401 → refresh → retry
- [x] All NgRx Effects make real HTTP calls via services
- [x] Product search / filter / sort wired to Catalog.API (catalog.effects.ts)
- [x] Cart operations wired to Cart.API (cart.effects.ts)
- [x] Auth login/register wired to Auth.API (auth.effects.ts)
- [x] environment.ts ports aligned to 5001–5009 (matches docker-compose host ports)
- [x] environment.prod.ts uses /api base URL (API gateway pattern)

### Admin Skeleton
- [x] TataCliq.Admin.API scaffolded (Banners + Coupons CRUD — full Clean Architecture)
- [x] features/admin/admin-dashboard.component.ts
- [x] features/admin/banner-list.component.ts
- [x] features/admin/coupon-list.component.ts
- [x] Admin route guard (Admin role required — adminGuard via selectIsAdmin selector)
- [x] core/services/admin.service.ts

### Final Checks
- [x] dotnet build — all 7 projects pass (0 errors 0 warnings)
- [x] TypeScript strict check — npx tsc --noEmit passes (0 errors)
- [x] Swagger UI at /swagger for all APIs
- [x] README.md updated with full setup instructions
- [x] ng build --configuration production — 0 errors 0 warnings (Node 25.7 via nvm)
- [x] Mobile layout verified at 375px for admin pages (mobile-first Tailwind: single-col table, hidden md: columns)

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
| 2026-05-02 | Phase 3 complete. Angular 21 SPA: NgRx store (auth/cart/catalog/ui), layout components (header/footer/bottom-nav), homepage (hero-carousel, category-banners, flash-sale, promo-banners), shared components (skeleton, star-rating, badge, currency-inr pipe), lazy routes, auth/error interceptors, auth guard. Phase 3 committed. |
| 2026-05-02 | Phase 4 complete. Angular: PLP (product-card, filter-sidebar, applied-filters, sort-dropdown, results-grid), PDP (product-images, product-info, size-selector, colour-selector, add-to-cart-panel, product-description, product-reviews), Cart (cart-item, coupon-input, cart-summary), Checkout (address-step, payment-step, order-summary, order-confirmation). Backend: Catalog.API (4 endpoints, CatalogService, CatalogMappingProfile, ProductQueryValidator, Program.cs), Cart.API (5 endpoints, CartService with coupon validation, CartController, validators, Program.cs), Order.API (4 endpoints, OrderService with cart→order conversion + coupon usage, PlaceOrderValidator, Program.cs). Full solution builds 0 errors 0 warnings. Phase 4 committed. |
| 2026-05-03 | Phase 5 in progress. Docker: Dockerfiles for all 6 APIs + frontend Dockerfile.dev + proxy.conf.docker.json. Port alignment: environment.ts/proxy.conf.json/launchSettings.json all set to 5001–5009. CORS added to Auth.API and User.API. Admin.API fully scaffolded (BannersController, CouponsController, AdminService, DTOs, Validators, AutoMapper, Program.cs). Angular: adminGuard, admin.routes.ts, admin-dashboard, banner-list, coupon-list components, admin.service.ts. README.md rewritten with full setup guide. .NET solution builds 0 errors 0 warnings. TypeScript strict check passes. |
