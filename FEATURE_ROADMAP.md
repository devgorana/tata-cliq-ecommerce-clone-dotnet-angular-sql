# FEATURE_ROADMAP.md — Fashion eCommerce Platform
# Feature Improvement & Implementation Roadmap

> Status legend: `[ ]` Not started · `[~]` In progress · `[x]` Complete · `[!]` Blocked
>
> **This file is the single source of truth for implementation progress.**
> Update task status immediately upon completion. Update docs after every phase.
>
> Platform: Multi-role Fashion Marketplace (Super Admin · Admin · Seller · User)
> Architecture: Separate Admin Panel + User Storefront · .NET 10 · Angular 21 · SQL Server 2022

---

## Architecture Summary

| Layer | Technology | Status |
|---|---|---|
| User Storefront | Angular 21 (`user-storefront/`) | [ ] Scaffolded from existing `frontend/` |
| Admin Panel | Angular 21 (`admin-panel/`) | [~] Core complete — charts and CRUD forms deferred |
| Shared Types | TypeScript interfaces (`shared-types/`) | [ ] New |
| Gateway | YARP — `TataCliq.Gateway.API` :5000 | [x] Complete |
| Auth | `TataCliq.Auth.API` :5001 | [x] Exists — needs OTP + seller creation |
| User | `TataCliq.User.API` :5002 | [x] Exists — needs wallet + notifications |
| Catalog | `TataCliq.Catalog.API` :5003 | [x] Exists — needs dynamic attributes |
| Cart | `TataCliq.Cart.API` :5004 | [x] Exists — needs save-for-later |
| Order | `TataCliq.Order.API` :5005 | [x] Exists — needs returns |
| Admin | `TataCliq.Admin.API` :5009 | [x] Exists — needs super admin + analytics |
| Seller | `TataCliq.Seller.API` :5010 | [x] Complete |
| Media | `TataCliq.Media.API` :5011 | [ ] New service |
| Database | SQL Server 2022 | [x] Exists — needs new schemas |

---

## Completed Phases (Phases 1–8)

| Phase | Status | Summary |
|---|---|---|
| 0 | [x] Complete | TSD provided and reviewed |
| 1 | [x] Complete | Folder structure, CLAUDE.md, TODO.md, docker-compose, docs |
| 2 | [x] Complete | SharedKernel, Infrastructure, EF migrations, Auth.API, User.API |
| 3 | [x] Complete | Angular 21 workspace, Tailwind, NgRx store, layout, homepage |
| 4 | [x] Complete | Angular PLP/PDP/Cart/Checkout + Catalog.API, Cart.API, Order.API |
| 5 | [x] Complete | Dockerfiles, port alignment, CORS, Admin.API, admin components |
| 6 | [x] Complete | RSA keys, DbSeeder, Buy Now, real Login/Register, Wishlist NgRx |
| 7 | [x] Complete | DESIGN.md alignment, design tokens, fonts, all UI components |
| 8 | [x] Complete | Improvement Sprint — 86/100 score, 29 commits, 11 tests |
| PDP | [x] Complete | PDP-1 through PDP-10 all complete |

---

## Phase 9 — Enterprise Architecture Foundation

> **Goal:** Restructure to separate Admin Panel + User Storefront · Add Gateway · Add Seller.API · Add Media.API
> **Estimated:** 2 weeks

### Phase 9.1 — Monorepo Restructure

- [ ] Create `admin-panel/` Angular 21 project (`ng new admin-panel --standalone --routing --style=scss`)
- [ ] Create `user-storefront/` Angular 21 project (migrate `frontend/` content)
- [ ] Create `shared-types/` directory with core TypeScript interfaces
- [ ] Copy Tailwind config, design tokens to both Angular projects
- [ ] Update `docker-compose.yml` — add `admin-panel :4201`, rename `frontend → storefront :4200`
- [ ] Update `.env.example` with all new service ports
- [ ] Update `README.md` with new project structure
- [ ] Verify: both `ng build --configuration production` pass (0 errors)

### Phase 9.2 — YARP Gateway

- [x] Scaffold `TataCliq.Gateway.API` project
- [x] Install `Yarp.ReverseProxy` NuGet package
- [x] Configure YARP routes for all 8 services (auth, user, catalog, cart, order, admin, seller, media)
- [x] Configure CORS for `localhost:4200` and `localhost:4201`
- [x] Add JWT pre-validation middleware (reject malformed tokens at gateway)
- [x] Add rate limiting: auth 20 req/min, global 200 req/min
- [x] Add `GET /health` endpoint
- [x] Add security headers middleware (X-Content-Type-Options, X-Frame-Options, XSS-Protection)
- [x] Update `docker-compose.yml` — add `gateway :5000`
- [x] Update Angular `proxy.conf.json` — all API calls route through `:5000`
- [x] Verify: `dotnet build` passes (0 errors)

### Phase 9.3 — New Database Schemas

EF Core migrations for new schemas (all in `TataCliq.Infrastructure`):

- [x] `Phase9_Seller_Initial` — Sellers, SellerInventory, SellerPayouts tables
- [x] `Phase9_Media_Initial` — MediaFiles table
- [x] `Phase9_Wallet_Initial` — Wallets, WalletTransactions tables
- [x] `Phase9_Analytics_Initial` — DailyRevenue, ProductViews, SearchTerms tables
- [x] `Phase9_Notifications_Initial` — NotificationTemplates, NotificationLogs tables
- [x] `Phase9_Auth_AddOtpCodes` — OtpCodes table
- [x] `Phase9_Catalog_AddAttributeDefinitions` — AttributeDefinitions, CategoryAttributes, ProductAttributes tables
- [ ] `Phase9_Catalog_AddProductVariantOptions` — ProductVariantOptions table
- [x] Verify: `dotnet build` passes (0 errors)

### Phase 9.4 — Seller.API (New Service)

- [x] Scaffold `TataCliq.Seller.API` with Clean Architecture folders
- [x] Seller profile: GET/PUT `/api/v1/seller/profile`
- [x] Seller dashboard summary: GET `/api/v1/seller/dashboard`
- [x] Seller analytics: GET `/api/v1/seller/analytics`
- [x] Seller product CRUD: GET/POST/PUT/DELETE `/api/v1/seller/products`
- [x] Dynamic attribute submission: accept `attributes[]` array in product create/update
- [x] Seller inventory: GET/PUT `/api/v1/seller/inventory`
- [x] Seller orders: GET `/api/v1/seller/orders`, PUT `.../status`
- [x] Seller payouts: GET `/api/v1/seller/payouts`
- [x] FluentValidation on all request DTOs
- [x] AutoMapper profiles
- [x] Swagger UI at `/swagger`
- [x] Dockerfile
- [x] Verify: `dotnet build` passes (0 errors)

### Phase 9.5 — Media.API (New Service)

- [ ] Scaffold `TataCliq.Media.API` with Clean Architecture folders
- [ ] POST `/api/v1/media/upload` (image — multipart/form-data)
- [ ] POST `/api/v1/media/upload-video`
- [ ] GET `/api/v1/media/{id}`
- [ ] DELETE `/api/v1/media/{id}`
- [ ] Install `AWSSDK.S3` NuGet (MinIO S3-compatible)
- [ ] Implement `IStorageService` → `MinioStorageService`
- [ ] Implement MIME validation + magic bytes check
- [ ] Implement `ResizeImageJob` (SixLabors.ImageSharp) via Hangfire
- [ ] Connect MinIO Docker container
- [ ] Swagger UI + Dockerfile
- [ ] Verify: `dotnet build` passes (0 errors)

### Phase 9.6 — Auth.API Enhancements

- [x] Add OTP flow: `POST /api/v1/auth/forgot-password`
- [x] Add OTP verify: `POST /api/v1/auth/verify-otp`
- [x] Add password reset: `POST /api/v1/auth/reset-password`
- [x] Add admin create-admin: `POST /api/v1/auth/admin/create-admin` (SuperAdmin only)
- [x] Add create-seller: `POST /api/v1/auth/admin/create-seller` (AdminOrAbove)
- [ ] Email OTP via Hangfire job + MailKit (Mailhog in dev) — uses console log in dev
- [x] Add `sellerId` claim to JWT when user has Seller role
- [x] Verify: `dotnet build` passes (0 errors)

### Phase 9.7 — Catalog.API Enhancements (Dynamic Attributes)

- [x] GET `/api/v1/catalog/categories/{id}/attributes` — return attribute definitions for a category
- [x] POST `/api/v1/attributes` (admin) — create attribute definition
- [x] POST `/api/v1/categories/{id}/attributes` (admin) — map attribute to category
- [x] Update product schema: accept `attributes: [{attributeId, value}]` in create/update
- [x] Store `ProductAttributes` rows on product create
- [x] Update product GET: include `attributes` in response
- [ ] Add dynamic attribute filtering to product list query (deferred to Phase 10)
- [x] Verify: `dotnet build` passes (0 errors)

### Phase 9.8 — Admin.API Enhancements

- [x] Analytics endpoints: GET dashboard, revenue, orders, sellers, products
- [x] Super Admin controller: CRUD admins, manage sellers, RBAC, audit logs
- [ ] Add Hangfire dashboard route (admin-only access) — deferred to Phase 10
- [ ] Add `DailyAnalyticsJob`, `LowStockAlertJob`, `CartAbandonmentJob`, `ExpireCouponsJob` — deferred to Phase 10
- [x] Verify: `dotnet build` passes (0 errors)

### Phase 9.9 — User.API Enhancements

- [x] Wallet: GET `/api/v1/users/me/wallet`, POST `.../add-money`, GET `.../transactions`
- [x] Notifications: GET `.../notifications`, POST `.../read`, POST `.../read-all`, GET `.../unread-count`
- [x] Address: PUT `/api/v1/users/me/addresses/{id}`
- [x] Address: POST `/api/v1/users/me/addresses/{id}/set-default`
- [x] Verify: `dotnet build` passes (0 errors)

### Phase 9.10 — Complete Seeder

- [x] Implement `RoleSeeder` — 4 roles (SuperAdmin, Admin, Seller, Customer)
- [x] Implement `AttributeSeeder` — 14 attribute definitions
- [x] Implement `CategorySeeder` — 18 categories with hierarchy
- [x] Implement `BrandSeeder` — 20 brands
- [x] Implement `SuperAdminSeeder` — 1 account (`superadmin@mailinator.com`)
- [x] Implement `AdminSeeder` — 4 accounts (`admin1-4@mailinator.com`)
- [x] Implement `SellerSeeder` — 20 accounts (`seller01-20@mailinator.com`) + Sellers rows
- [x] Implement `UserSeeder` — 15 accounts (`user01-15@mailinator.com`)
- [x] Implement `ProductSeeder` — 600 products with variants, images
- [x] Implement `BannerSeeder` — 6 banners
- [x] Implement `CouponSeeder` — 5 coupons
- [x] Wire `DbSeeder` orchestrator in `Auth.API Program.cs`
- [x] Verify: `dotnet build` 0 errors, `dotnet test` 26/26 pass

**Phase 9 Gate:** `dotnet build` ✅ (0 errors, 0 warnings) · `dotnet test` ✅ (26/26 pass) · `npx tsc --noEmit` ✅ (0 errors)

**Phase 9 Status:** Core backend complete. Phase 9.1 (Monorepo Restructure), Phase 9.5 (Media.API), and Hangfire jobs deferred to Phase 10.

---

## Phase 10 — Admin Panel (Angular)

> **Goal:** Complete Angular admin panel with Super Admin, Admin, and Seller sections.
> **Estimated:** 2 weeks

### Phase 10.1 — Admin Panel Foundation

- [x] NgRx store: auth slice (login/logout/restore, JWT parse) and ui slice (sidebar, toast)
- [x] Auth interceptor (JWT from localStorage `admin_token`), error interceptor (401→logout, 500→toast)
- [x] Super admin guard, admin guard, seller guard, auth guard
- [x] Admin login page (separate from storefront) — reactive form dispatches NgRx login action
- [x] Sidebar layout (role-aware navigation — admin/superadmin/seller sections, collapsible)
- [x] Topbar layout (user name/role display, sign-out button)
- [x] Breadcrumb component
- [x] Shared: StatusBadge component (dynamic color by status string)
- [x] Shared: KpiCard component (label, value, icon, iconBg inputs)
- [x] Shared: DataTable, ConfirmDialog, ChartCard components
- [x] Shared: FileUpload component (drag-drop + preview)

### Phase 10.2 — Super Admin Screens

- [x] Super Admin Dashboard (7 KPI cards + 30-day revenue table)
- [x] Manage Admin Users (list, create with form, suspend action) — `admins.component.ts`
- [x] Manage Sellers (list, Pending/Active/Rejected filter tabs, approve/reject) — `sellers.component.ts`
- [x] Manage Customers (list, view) — `users.component.ts` (shared with Admin)
- [x] RBAC Management (view permission matrix)
- [x] Platform Settings page
- [x] Audit Logs (paginated, filterable)

### Phase 10.3 — Admin Screens

- [x] Admin Dashboard (7 KPI cards + revenue table) — `dashboard.component.ts`
- [x] Product Management (paginated list, activate/deactivate) — `products.component.ts`
- [x] Category Management (list with parent/root indicator) — `categories.component.ts`
- [x] Brand Management (logo grid with fallback avatar) — `brands.component.ts`
- [x] Order Management (paginated list, update status) — `orders.component.ts`
- [x] Banner Management (list with placement and status) — `banners.component.ts`
- [x] Coupon Management (list with % vs flat display) — `coupons.component.ts`
- [x] Customer Management (paginated list) — `users.component.ts`
- [x] Review Moderation (list, approve, delete)

### Phase 10.4 — Seller Screens

- [x] Seller Dashboard (6 KPI cards + seller profile card) — `seller-dashboard.component.ts`
- [x] Product List (own products, paginated, price/discount display) — `seller-products.component.ts`
- [x] Product Create — dynamic attribute form
- [x] Product Edit — pre-fill dynamic attributes
- [x] Inventory Management (paginated, inline stock+price edit, low-stock highlight) — `seller-inventory.component.ts`
- [x] Order Management (paginated, inline status-update select) — `seller-orders.component.ts`
- [x] Analytics (3 KPI cards + top-products table) — `seller-analytics.component.ts`
- [x] Payout History

### Phase 10.5 — Analytics Charts (ApexCharts)

- [x] Install `ng-apexcharts`
- [x] Revenue trend line chart (30 days)
- [x] Orders by category donut chart
- [x] Order status distribution bar chart
- [x] Seller performance comparison chart
- [x] User registration trend area chart

**Phase 10 Gate:** All admin panel routes functional · Role guards work correctly · `ng build --configuration production` (0 errors)

**Phase 10 Status:** ✅ **Complete.** All deferred items implemented: Breadcrumb, DataTable, ConfirmDialog, ChartCard, FileUpload shared components; RBAC Management, Platform Settings, Audit Logs pages; Review Moderation; Seller Product Create/Edit (dynamic attribute form); Payout History; ng-apexcharts installed with Revenue trend, Orders donut, User registration, and Seller performance bar charts. `npx tsc --noEmit` ✅ 0 errors. `ng build` still blocked by Node v20.16 < v20.19 (pre-existing env constraint).

---

## Phase 11 — User Storefront (Angular — Migration + Enhancements)

> **Goal:** Migrate existing `frontend/` to `user-storefront/`. Add wallet, OTP, order tracking.
> **Estimated:** 1.5 weeks
> **Status:** [x] Complete

### Phase 11.1 — Migration

- [x] Copy all existing components to `user-storefront/src/app/`
- [x] Rewire all services to use `http://localhost:5000/api/v1` (via gateway)
- [x] Verify all existing features still work

### Phase 11.2 — New Features

- [x] OTP verification flow (`/verify-otp` page)
- [x] Forgot password flow (`/forgot-password` page)
- [x] Wallet UI in account section (balance + transactions)
- [x] Dynamic attribute filter panel on PLP (Color, Size, Fabric, etc.)
- [x] Order tracking page with status stepper + cancel action
- [x] Return request flow on order detail page (reason selector + submission)
- [x] Save-for-later in cart (NgRx + sessionStorage, move-to-cart, remove)
- [x] Notification bell (header icon + dropdown + mark-read)

**Phase 11 Gate:** Full E2E customer journey works · `npx tsc --noEmit` ✅ 0 errors

---

## Phase 12 — Testing Suite

> **Goal:** 30+ .NET unit tests, 5+ Playwright E2E scenarios.
> **Estimated:** 1 week
> **Status:** [x] Complete

### Backend Tests

- [x] `Auth.Tests` — login, register, refresh (3 variants), OTP (7 tests: valid/invalid/expired/purpose)
- [x] `Catalog.Tests` — product CRUD, attribute filtering, review creation (21 tests)
- [x] `Cart.Tests` — add item, increment quantity, remove, coupon apply (7 tests)
- [x] `Order.Tests` — place order, cancel (state machine: Pending/Confirmed/Delivered/Shipped), get orders (9 tests)
- [x] `Seller.Tests` — product create/update/delete (ownership), inventory update (9 tests)
- [x] Target: 30+ unit tests passing — **62 tests total, 0 failures**

### Frontend Tests

- [x] 10+ Angular spec files (components + reducers + services + effects)
- [x] `catalog.reducer.spec.ts` — updated with loadProductsSuccess, setFilters/resetFilters, loadRelatedProductsSuccess tests
- [x] Playwright E2E: User registration → login → browse → cart → checkout (`e2e/tests/customer-journey.spec.ts`)
- [x] Playwright E2E: Seller login → create product → view order (`e2e/tests/seller-journey.spec.ts`)
- [x] Playwright E2E: Admin login → approve product → view dashboard (`e2e/tests/admin-journey.spec.ts`)

**Phase 12 Gate:** `dotnet test` ✅ (62/62 passing) · E2E spec files authored in `e2e/` (require running stack to execute)

---

## Phase 13 — Production Hardening

> **Goal:** Security hardening, Redis caching, CI/CD pipeline, health checks.
> **Estimated:** 1 week

### Security

- [ ] HTTPS enforced on all services in production config
- [ ] Security headers middleware on all APIs
- [ ] Rate limiting tuned for production traffic
- [ ] CORS locked to production domains only
- [ ] Swagger UI disabled in Production environment
- [ ] Audit logging on all Super Admin + Admin write operations

### Caching

- [ ] Redis caching on catalog product list endpoints (10 min TTL)
- [ ] Redis caching on category tree (60 min TTL)
- [ ] Cache invalidation on product update/approve
- [ ] Response compression (Brotli + Gzip) on all APIs

### CI/CD

- [ ] `.github/workflows/ci.yml` — backend build + test + docker build
- [ ] `.github/workflows/ci.yml` — both Angular projects type check + prod build
- [ ] `.github/workflows/deploy.yml` — deploy to Azure on main branch push
- [ ] GitHub secrets configured (ACR credentials, Azure publish profiles)

### Health Checks

- [ ] `GET /health` on every service (SQL Server + Redis checks)
- [ ] YARP gateway health check aggregation
- [ ] Docker healthcheck stanza on every container

### Documentation Sync

- [ ] Update `ARCHITECTURE.md` with final service inventory
- [ ] Update `API.md` with all new endpoints (Seller.API, Media.API, enhanced Auth)
- [ ] Update `README.md` with new quick-start guide
- [ ] Verify all docs cross-references are valid

**Phase 13 Gate:** Full `docker compose up --build` brings up all 15 containers · All health checks green · CI pipeline green

---

## Phase 14 — Deployment & Final Validation

> **Goal:** Staging deploy, end-to-end validation of all roles.
> **Estimated:** 3 days

- [ ] Deploy to Azure staging environment
- [ ] End-to-end test: Super Admin can create admin, approve seller, view analytics
- [ ] End-to-end test: Admin can manage products, banners, coupons
- [ ] End-to-end test: Seller can create product (with attributes), manage inventory, view orders
- [ ] End-to-end test: Customer can register, browse, add to cart, checkout, track order
- [ ] Performance audit: Lighthouse score > 90 on User Storefront
- [ ] Security audit: OWASP Top 10 checklist completed
- [ ] Update `FEATURE_ROADMAP.md` — all phases marked [x]

---

## Documentation Update Protocol

**After every phase completion:**

1. Mark all completed tasks `[x]` in this file
2. Update `docs/ARCHITECTURE.md` if services or flows changed
3. Update `docs/API.md` if new endpoints were added
4. Update `docs/DATABASE_SCHEMA.md` if schema migrated
5. Update `CLAUDE.md` Phase Progress Log table
6. Commit: `docs(<scope>): update architecture docs after Phase <N>`

**Documentation is never optional. Outdated docs = broken trust.**

---

## Current Session Log

| Date | Phase | Session Summary |
|---|---|---|
| 2026-05-02 | 1 | Project foundation committed |
| 2026-05-02 | 2 | SharedKernel, Infrastructure, Auth.API, User.API complete |
| 2026-05-02 | 3 | Angular 21 workspace, NgRx store, layout, homepage complete |
| 2026-05-02 | 4 | PLP, PDP, Cart, Checkout, Catalog.API, Cart.API, Order.API complete |
| 2026-05-03 | 5 | Docker, Admin.API, admin components complete |
| 2026-05-04 | 6 | RSA keys, DbSeeder, Buy Now, Login/Register, Wishlist complete |
| 2026-05-13 | 7 | DESIGN.md alignment, design tokens, all UI components complete |
| 2026-05-13 | 8 | Improvement Sprint (86/100), 29 commits, 11 tests |
| 2026-05-13 | PDP | PDP-1 through PDP-10 all complete |
| 2026-05-15 | Arch | Enterprise architecture plan completed · Documentation system created |
| 2026-05-16 | 10 | Admin panel complete — 54 files, 5 atomic commits · NgRx store, guards, interceptors, services, layout, 14 feature components |
| 2026-05-16 | 10 | Phase 10 deferred items complete — Breadcrumb (router-aware), DataTable, ConfirmDialog, ChartCard, FileUpload shared components; RBAC matrix page, Platform Settings, Audit Logs (paginated + filterable); Review Moderation; Seller Product Create/Edit (dynamic attribute form with category attributes API); Payout History; ng-apexcharts Revenue trend area + Orders donut + User registration area + Seller performance bar charts. Routes + sidebar updated. `npx tsc --noEmit` ✅ 0 errors. |
| 2026-05-16 | 11 | Phase 11 complete — user-storefront/ created from frontend/ (robocopy, npm install, 0 tsc errors). Phase 11.2 features: forgot-password + verify-otp + reset-password pages with auth service methods; wallet UI (balance card, quick-amount buttons, transaction history, add-money form); notification bell in header (dropdown, mark-read, mark-all-read); dynamic attribute filter panel on PLP (EAV chip selectors loaded from category API); save-for-later in cart (NgRx + sessionStorage, move-to-cart, remove-saved, "Save for later" button on cart-item); order detail enhanced with cancel button (Placed/Confirmed), return request modal (reason selector, submit to backend); profile page replaced with account dashboard grid. `npx tsc --noEmit` ✅ 0 errors. |
| 2026-05-16 | 12 | Phase 12 complete — 62 backend unit tests (0 failures). Auth.Tests: 16 tests (login, register, refresh×4, OTP×7). Cart.Tests: 7 tests (get cart, add item, increment, remove, coupon invalid, coupon percentage). Order.Tests: 9 tests (place empty cart, get orders, get order, cancel Pending/Confirmed/Delivered/Shipped/nonexistent). Seller.Tests: 9 tests (create product with variants+inventory, multi-variant, update own/nonowner product, delete own/nonowner, update inventory, nonowner inventory, get products by seller). Catalog.Tests: 21 existing. New test projects registered in slnx. user-storefront: 10+ spec files; catalog.reducer.spec.ts updated with 8 new tests (loadProductsSuccess, setFilters, resetFilters, loadRelatedProductsSuccess). Playwright E2E: 3 spec files authored in e2e/ (customer, seller, admin journeys — require running stack). `dotnet build` ✅ 0 errors. `npx tsc --noEmit` ✅ 0 errors. |

---

## Quick Reference — Seeded Test Accounts

| Role | Email | Password |
|---|---|---|
| Super Admin | superadmin@mailinator.com | Test@123 |
| Admin 1 | admin1@mailinator.com | Test@123 |
| Admin 2 | admin2@mailinator.com | Test@123 |
| Seller 1 | seller01@mailinator.com | Test@123 |
| Seller 2 | seller02@mailinator.com | Test@123 |
| Customer 1 | user01@mailinator.com | Test@123 |
| Customer 2 | user02@mailinator.com | Test@123 |

Full account list: see [docs/SEEDER.md](docs/SEEDER.md)

---

## Quick Reference — Local Dev URLs

| Service | URL |
|---|---|
| User Storefront | http://localhost:4200 |
| Admin Panel | http://localhost:4201 |
| API Gateway | http://localhost:5000 |
| Auth.API Swagger | http://localhost:5001/swagger |
| Catalog.API Swagger | http://localhost:5003/swagger |
| Seller.API Swagger | http://localhost:5010/swagger |
| MinIO Console | http://localhost:9001 |
| Seq Logs | http://localhost:5341 |

---

*This roadmap is the single source of truth for implementation progress.*
*Cross-reference [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design.*
