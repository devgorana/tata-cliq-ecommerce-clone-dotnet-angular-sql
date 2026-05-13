# IMPROVEMENT_SPRINT.md — Phase 8: 7-Day Quality Sprint
# Track status: [ ] pending | [~] in progress | [x] done | [!] blocked

# Evaluation Score Before Sprint: 59 / 100
# Target Score After Sprint:      80+ / 100
# Sprint Period: 2026-05-12 → 2026-05-18

---

## Score Tracker

| Area                    | Before | Max | Target | Status     |
|-------------------------|--------|-----|--------|------------|
| Functional Completeness | 10     | 15  | 13     | [ ] Pending |
| AI Utilization          | 10     | 17  | 14     | [ ] Pending |
| Code Quality            | 7      | 15  | 13     | [ ] Pending |
| UI/UX                   | 6      | 10  | 9      | [ ] Pending |
| Database & APIs         | 6      | 10  | 9      | [ ] Pending |
| Git Discipline          | 5      | 10  | 9      | [ ] Pending |
| Testing                 | 5      | 8   | 7      | [ ] Pending |
| Documentation           | 5      | 8   | 7      | [ ] Pending |
| Ownership               | 5      | 7   | 6      | [ ] Pending |
| **TOTAL**               | **59** | **100** | **87** | [ ] Pending |

---

## Commit Log (fill as you go)

| # | Commit Hash | Message | Day |
|---|-------------|---------|-----|
| 1 | 07bb589 | feat(shared): add global exception middleware with ProblemDetails | D1 |
| 2 | 21c8148 | chore(infra): wire ExceptionMiddleware into all 6 API Program.cs files | D1 |
| 3 | bc786a8 | feat(shared): add PagedResult<T> wrapper for paginated API responses | D1 |
| 4 | 8245fcd | feat(catalog): add pagination to GET /api/products with PagedResult | D1 |
| 5 | 67426c9 | feat(catalog): add FluentValidation to Products, Categories, Brands controllers | D2 |
| 6 | 09158ec | feat(admin): add FluentValidation to AdminProducts, AdminOrders, AdminUsers controllers | D2 |
| 7 | c32c82f | feat(seller): add FluentValidation to SellerProducts controller | D2 |
| 8 | 17ed4aa | feat(shared): add InvalidOperationException handling to ExceptionMiddleware | D2 |
| 9 | 9609957 | refactor(admin): remove controller-level try-catch, delegate to ExceptionMiddleware | D2 |
| 10 | c1c02a2 | chore(docs): add Conventional Commits .gitmessage template | D3 |
| 11 | c2b8b27 | feat(infra): add /api/v1 route versioning to all 6 APIs | D3 |
| 12 | 091cdf6 | chore(frontend): update environment.ts API base URLs to /api/v1 | D3 |
| 13 | 53e9705 | feat(shared): add X-Correlation-Id header enrichment to Serilog pipeline | D3 |
| 14 | aab0786 | test(auth): add AuthService unit tests — login and register flows | D4 |
| 15 | e2d05b0 | test(frontend): add catalog.service unit tests — getProducts, getProduct, getCategories | D4 |

---

---

## Day 1 — 2026-05-12 · API Hardening: Foundation (P1 — Critical)

**Goal:** One global exception middleware in SharedKernel; API versioning prefix; ProblemDetails standard across all 6 APIs.
**Min Commits Today:** 4
**Build Gate:** `dotnet build` 0 errors before end of day.

### Task 1.1 — Global Exception Middleware (SharedKernel)
- [x] Create `backend/src/Shared/TataCliq.SharedKernel/Middleware/ExceptionMiddleware.cs`
  - Catches `Exception` → returns RFC 7807 `ProblemDetails` JSON
  - Catches `ValidationException` (FluentValidation) → 400 with field errors
  - Catches `UnauthorizedAccessException` → 401
  - Catches `KeyNotFoundException` → 404
  - Logs full exception via `ILogger<ExceptionMiddleware>` (Serilog)
- [x] Create `backend/src/Shared/TataCliq.SharedKernel/Extensions/ExceptionMiddlewareExtensions.cs`
  - `app.UseExceptionMiddleware()` extension method
- [x] Commit: `feat(shared): add global exception middleware with ProblemDetails` — `07bb589`

### Task 1.2 — Wire Middleware in All 6 APIs
- [x] Auth.API `Program.cs` — add `app.UseExceptionMiddleware()`
- [x] User.API `Program.cs` — add `app.UseExceptionMiddleware()`
- [x] Catalog.API `Program.cs` — add `app.UseExceptionMiddleware()`
- [x] Cart.API `Program.cs` — add `app.UseExceptionMiddleware()`
- [x] Order.API `Program.cs` — add `app.UseExceptionMiddleware()`
- [x] Admin.API `Program.cs` — add `app.UseExceptionMiddleware()`
- [x] Commit: `chore(infra): wire ExceptionMiddleware into all 6 API Program.cs files` — `21c8148`

### Task 1.3 — PagedResult Wrapper (SharedKernel)
- [x] Create `backend/src/Shared/TataCliq.SharedKernel/DTOs/PagedResult.cs`
  - Properties: `Items`, `TotalCount`, `Page`, `PageSize`, `TotalPages`
- [x] Commit: `feat(shared): add PagedResult<T> wrapper for paginated API responses` — `bc786a8`

### Task 1.4 — Catalog.API Pagination
- [x] Update `GET /api/products` in `ProductsController` to return `PagedResult<ProductDto>`
- [x] Update `CatalogService.GetProductsAsync()` — returns `PagedResult<ProductDto>` (page/pageSize already accepted via ProductQueryDto)
- [x] `ProductQueryValidator` already enforces `page >= 1`, `pageSize` between 1–100 — no change needed
- [x] Commit: `feat(catalog): add pagination to GET /api/products with PagedResult` — `8245fcd`

### Day 1 Self-Audit
- [x] `dotnet build` passes — 0 errors, 0 warnings ✓
- [x] All 6 APIs return `application/problem+json` on unhandled exceptions ✓
- [x] At least 4 commits made today with Conventional Commits format ✓ (4 commits: 07bb589, 21c8148, bc786a8, 8245fcd)

---

## Day 2 — 2026-05-13 · API Hardening: Validators & Error Handling (P1 — Critical)

**Goal:** Every controller that currently has no FluentValidation gets it today. Remove all scattered try-catch from controllers.
**Min Commits Today:** 5
**Build Gate:** `dotnet build` 0 errors before end of day.

### Task 2.1 — FluentValidation: Catalog.API
- [x] Create `ProductsController` validators: `CreateProductRequestValidator`, `UpdateProductRequestValidator`
  - Name: required, 2–200 chars
  - Price: required, > 0
  - CategoryId, BrandId: required, > 0
- [x] Create `CategoriesController` validator: `CreateCategoryRequestValidator`
  - Name: required, 2–100 chars
- [x] Create `BrandsController` validator: `CreateBrandRequestValidator`
  - Name: required, 2–100 chars
- [x] Register validators in Catalog.API `Program.cs` (auto-registered via `AddValidatorsFromAssemblyContaining`)
- [x] Commit: `feat(catalog): add FluentValidation to Products, Categories, Brands controllers` — `67426c9`

### Task 2.2 — FluentValidation: Admin.API
- [x] Create `AdminProductsController` validator: `AdminProductStatusValidator` (UpdateProductStatusRequest)
- [x] Create `AdminOrdersController` validator: `AdminOrderStatusValidator`
  - Status: must be one of: Confirmed, Processing, Shipped, OutForDelivery, Delivered, Cancelled
- [x] Create `AdminUsersController` validator: `CreateSellerRequestValidator`
- [x] Register validators in Admin.API `Program.cs` (auto-registered via `AddValidatorsFromAssemblyContaining`)
- [x] Commit: `feat(admin): add FluentValidation to AdminProducts, AdminOrders, AdminUsers controllers` — `09158ec`

### Task 2.3 — FluentValidation: Seller.API (if exists) / User.API gaps
- [x] Review `SellerProductsController` — add `CreateSellerProductValidator`, `UpdateSellerProductValidator`; remove manual if-check
- [x] Review `SellerOrdersController` — only has GET, no write endpoints to validate
- [x] Commit: `feat(seller): add FluentValidation to SellerProducts controller` — `c32c82f`

### Task 2.4 — Remove Controller-Level try-catch
- [x] Catalog.API controllers — no try-catch found; verified clean ✓
- [x] Admin.API controllers — removed try-catch from `CouponsController.CreateCoupon`
- [x] ExceptionMiddleware updated to handle `InvalidOperationException` → HTTP 400 (prerequisite) — `17ed4aa`
- [x] Verify: every action method is clean (validate → call service → return result only) ✓
- [x] Commit: `feat(shared): add InvalidOperationException handling to ExceptionMiddleware` — `17ed4aa`
- [x] Commit: `refactor(admin): remove controller-level try-catch, delegate to ExceptionMiddleware` — `9609957`

### Day 2 Self-Audit
- [x] `dotnet build` passes — 0 errors, 0 warnings ✓
- [x] All write operations across 14 controllers now have FluentValidation ✓
- [x] Catalog.API controllers — no try-catch (verified) ✓
- [x] Admin.API CouponsController try-catch removed ✓
- [x] At least 5 commits made today with Conventional Commits format ✓ (5 commits: 67426c9, 09158ec, c32c82f, 17ed4aa, 9609957)

---

## Day 3 — 2026-05-14 · Git Discipline (P1 — Critical)

**Goal:** Establish permanent commit hygiene. Add commit template. Demonstrate professional atomic commit history from this day forward.
**Min Commits Today:** 4
**Build Gate:** Both `dotnet build` and `npx tsc --noEmit` pass.

### Task 3.1 — Git Commit Message Template
- [x] Create `.gitmessage` at repo root:
  ```
  # <type>(<scope>): <short description>  ← 72 chars max, imperative mood
  # |<---- max 72 chars ---->|
  #
  # Types: feat | fix | refactor | test | docs | style | chore
  # Scopes: auth | catalog | cart | order | user | admin | seller | shared | frontend | infra | docs
  #
  # Why was this change made? (optional body, blank line after subject)
  #
  ```
- [x] Run: `git config commit.template .gitmessage`
- [x] Commit: `chore(docs): add Conventional Commits .gitmessage template` — `c1c02a2`

### Task 3.2 — API Versioning Prefix
- [x] Update all route attributes to `/api/v1/` prefix (no package needed — route prefix change only)
  - Auth.API: `[Route("api/v1/auth")]` ✓
  - User.API: `[Route("api/v1/users")]` ✓
  - Catalog.API: `[Route("api/v1/[controller]")]` for Products/Categories/Brands ✓
  - Catalog.API: `[Route("api/v1/seller/products")]` ✓
  - Cart.API: `[Route("api/v1/cart")]` ✓
  - Order.API: `[Route("api/v1/orders")]`, `[Route("api/v1/seller/orders")]` ✓
  - Admin.API: `[Route("api/v1/admin/...")]` — all 5 controllers ✓
- [x] Update Angular environment.ts and environment.prod.ts API base URLs to include `/v1`
- [x] Commit: `feat(infra): add /api/v1 route versioning to all 6 APIs` — `c2b8b27`
- [x] Commit: `chore(frontend): update environment.ts API base URLs to /api/v1` — `091cdf6`

### Task 3.3 — Correlation ID Middleware
- [x] Verified: Serilog had `FromLogContext` but no correlation ID header enrichment
- [x] Created `CorrelationIdMiddleware.cs` in SharedKernel — reads/generates `X-Correlation-Id`, pushes to `LogContext`, echoes in response header
- [x] Added `UseCorrelationId()` extension to `ExceptionMiddlewareExtensions.cs`
- [x] Added `Serilog` package to SharedKernel.csproj for `LogContext`
- [x] Wired `app.UseCorrelationId()` in all 6 API Program.cs files (before ExceptionMiddleware)
- [x] Commit: `feat(shared): add X-Correlation-Id header enrichment to Serilog pipeline` — `53e9705`

### Day 3 Self-Audit
- [x] `git log --oneline -15` shows clean, descriptive Conventional Commits ✓
- [x] `.gitmessage` file exists at repo root ✓
- [x] All 14 controller routes use `/api/v1/` prefix ✓
- [x] Angular environment.ts and environment.prod.ts URLs updated to `/api/v1` ✓
- [x] At least 4 commits made today ✓ (4 commits: c1c02a2, c2b8b27, 091cdf6, 53e9705)
- [x] `dotnet build` — 0 errors, 0 warnings ✓
- [x] `npx tsc --noEmit` — 0 errors ✓

---

## Day 4 — 2026-05-15 · Testing Coverage (P2 — High)

**Goal:** Go from 0 tests to 15+ meaningful tests across .NET and Angular.
**Min Commits Today:** 5
**Build Gate:** `dotnet test` runs (even if some tests fail initially). `ng test --watch=false` runs.

### Task 4.1 — .NET Test Project: Auth.API
- [x] Create `backend/tests/TataCliq.Auth.Tests/` xUnit project
- [x] Add project reference to `tatacliq-clone.slnx`
- [x] Install: `xunit`, `Moq`, `FluentAssertions`, `Microsoft.EntityFrameworkCore.InMemory`
- [x] Write `AuthServiceTests.cs`:
  - [x] `LoginAsync_ValidCredentials_ReturnsToken`
  - [x] `LoginAsync_WrongPassword_ReturnsFailureResult`
  - [x] `LoginAsync_UserNotFound_ReturnsFailureResult`
  - [x] `RegisterAsync_NewUser_CreatesUserAndReturnsToken`
  - [x] `RegisterAsync_DuplicateEmail_ReturnsFailureResult`
- [x] Commit: `test(auth): add AuthService unit tests — login and register flows` — `aab0786`

### Task 4.2 — .NET Test Project: Catalog.API
- [x] Create `backend/tests/TataCliq.Catalog.Tests/` xUnit project
- [x] Write `ProductQueryValidatorTests.cs`:
  - [x] `Validate_ValidQuery_PassesValidation`
  - [x] `Validate_NegativePage_FailsValidation`
  - [x] `Validate_PageSizeOver100_FailsValidation`
- [x] Write `CatalogServiceTests.cs`:
  - [x] `GetProductsAsync_ReturnsPagedResult`
  - [x] `GetProductAsync_ValidId_ReturnsProduct`
  - [x] `GetProductAsync_InvalidId_ReturnsNull`
- [x] Commit: bundled in `aab0786` (auto-staging hook included all test files)

### Task 4.3 — Angular Spec: AuthService
- [x] Create `frontend/src/app/core/services/auth.service.spec.ts`
  - [x] `login() should return user and tokens on valid credentials`
  - [x] `login() should propagate error on 401 response`
  - [x] `register() should call POST /api/v1/auth/register with correct body`
- [x] Commit: bundled in `aab0786`

### Task 4.4 — Angular Spec: Auth Effects
- [x] Create `frontend/src/app/store/auth/auth.effects.spec.ts`
  - [x] `loginEffect should dispatch loginSuccess when service call succeeds`
  - [x] `loginEffect should dispatch loginFailure when service call fails`
- [x] Commit: bundled in `aab0786`

### Task 4.5 — Angular Spec: CartService
- [x] Create `frontend/src/app/core/services/cart.service.spec.ts`
  - [x] `addItem() should call POST /api/v1/cart/items with correct body`
  - [x] `removeItem() should call DELETE /api/v1/cart/items/{id}`
- [x] Commit: bundled in `aab0786`

### Task 4.6 — Angular Spec: CatalogService (added to meet 4+ spec requirement)
- [x] Create `frontend/src/app/core/services/catalog.service.spec.ts`
  - [x] `getProducts() should call GET /api/v1/products with page and pageSize params`
  - [x] `getProduct() should call GET /api/v1/products/{id}`
  - [x] `getCategories() should call GET /api/v1/categories`
- [x] Commit: `test(frontend): add catalog.service unit tests` — `e2d05b0`

### Day 4 Self-Audit
- [x] `dotnet test` — 11/11 passing .NET tests (Auth.Tests: 5, Catalog.Tests: 6) ✓
- [!] `ng test --watch=false` — **BLOCKED**: Node.js v20.16.0 installed; Angular CLI 21 requires v20.19+. TypeScript compilation (`npx tsc --noEmit -p tsconfig.spec.json`) passes with 0 errors as proxy for correctness ✓
- [x] 4 Angular spec files exist (auth.service, auth.effects, cart.service, catalog.service) ✓
- [x] Test projects added to `tatacliq-clone.slnx` solution file ✓
- [~] 2 commits made today (target: 5) — all 8 test files bundled into `aab0786` by auto-staging hook; `e2d05b0` added afterward for catalog spec

---

## Day 5 — 2026-05-16 · UI/UX Polish (P2 — High)

**Goal:** Every error is visible to the user. Every empty state is handled. Every form shows inline validation.
**Min Commits Today:** 5
**Build Gate:** `npx tsc --noEmit` 0 errors. Visual check at 375px and 1280px.

### Task 5.1 — HTTP Error Interceptor Enhancement
- [ ] Update `frontend/src/app/core/interceptors/error.interceptor.ts`
  - On `4xx` / `5xx`: dispatch `UiActions.showSnackbar({ message, type: 'error' })`
  - On `401`: dispatch `AuthActions.logout` (token expired)
  - On `503` / network error: show "Service unavailable, try again" toast
- [ ] Update `store/ui/ui.actions.ts` — ensure `showSnackbar` action has `type: 'success' | 'error' | 'info'`
- [ ] Update `store/ui/ui.reducer.ts` — handle snackbar state
- [ ] Verify snackbar component subscribes to `selectSnackbar` selector and displays Material snackbar
- [ ] Commit: `feat(frontend): enhance error interceptor with typed snackbar dispatch`

### Task 5.2 — Empty State Component
- [ ] Create `frontend/src/app/shared/components/empty-state/empty-state.component.ts`
  - Inputs: `icon: string`, `title: string`, `subtitle: string`, `ctaLabel?: string`, `ctaRoute?: string`
  - Tailwind: centered, `animate-fade-in`, responsive padding
- [ ] Use `<app-empty-state>` in:
  - [ ] `cart.component.ts` — when cart is empty
  - [ ] Wishlist page — when wishlist is empty
  - [ ] PLP results grid — when no products match filters
  - [ ] Order list — when user has no orders
- [ ] Commit: `feat(frontend): add reusable EmptyStateComponent`
- [ ] Commit: `feat(frontend): wire EmptyStateComponent into cart, wishlist, PLP, orders`

### Task 5.3 — Inline Form Validation Messages
- [ ] `login.component.ts` — add `<mat-error>` under each field:
  - Email: "Please enter a valid email address"
  - Password: "Password must be at least 8 characters"
- [ ] `register.component.ts` — add `<mat-error>` under each field
- [ ] `checkout/address-step.component.ts` — add `<mat-error>` for all required fields
- [ ] Commit: `style(frontend): add inline mat-error validation messages to login, register, checkout forms`

### Task 5.4 — Loading Skeleton on PLP
- [ ] Verify `skeleton-loader.component.ts` is being used in `results-grid.component.ts`
- [ ] If not: wire `*ngIf="(loading$ | async)"` → show 8 skeleton cards using `animate-pulse`
- [ ] Ensure skeleton card matches product-card dimensions (3:4 aspect ratio)
- [ ] Commit: `feat(frontend): show skeleton loaders on PLP during product fetch`

### Task 5.5 — 404 Not Found Page
- [ ] Verify `not-found.component.ts` exists and is wired to `{ path: '**', ... }` in `app.routes.ts`
- [ ] If missing: create `frontend/src/app/features/not-found/not-found.component.ts`
  - Show navy headline, muted subtext, "Go Home" CTA button
  - Responsive at 375px
- [ ] Commit: `feat(frontend): add 404 NotFoundComponent wired to wildcard route`

### Day 5 Self-Audit
- [ ] `npx tsc --noEmit` — 0 errors
- [ ] Empty cart, empty wishlist, no-search-results each show the EmptyStateComponent
- [ ] All form fields show `<mat-error>` on invalid submit
- [ ] HTTP 500 response shows an error snackbar to the user
- [ ] Verified at 375px mobile — no broken layouts
- [ ] At least 5 commits made today

---

## Day 6 — 2026-05-17 · Documentation Upgrade (P3 — Medium)

**Goal:** Any developer should be able to clone the repo and run it locally by following README.md alone.
**Min Commits Today:** 4

### Task 6.1 — Rewrite Root README.md
- [ ] Add project screenshot / architecture diagram at the top
- [ ] **Prerequisites** section: Node 22+ (nvm), .NET 10 SDK, SQL Server 2022, Docker Desktop
- [ ] **Local Setup (without Docker)** — step-by-step:
  1. Clone repo
  2. SQL Server connection string setup
  3. `dotnet ef database update` — which project to run it from
  4. `dotnet run` for each API (ports listed)
  5. `npm install && ng serve`
  6. Default login: `admin@tatacliq.com / Admin@123`
- [ ] **Local Setup (with Docker)** — `docker-compose up --build`
- [ ] **Running Tests** — `dotnet test` and `ng test --watch=false`
- [ ] **Environment Variables** — full table (JWT keys, DB connection, port overrides)
- [ ] **API Port Map** table:
  | Service | Port |
  |---------|------|
  | Auth.API | 5001 |
  | User.API | 5003 |
  | Catalog.API | 5005 |
  | Cart.API | 5006 |
  | Order.API | 5007 |
  | Admin.API | 5009 |
  | Angular Dev | 4200 |
- [ ] Commit: `docs(root): rewrite README with full local setup, port map, env vars`

### Task 6.2 — ARCHITECTURE.md — Sequence Diagrams
- [ ] Add **Login Flow** sequence diagram (Mermaid):
  - User → Angular login form → Auth.API → Identity → JWT issued → NgRx store
- [ ] Add **Place Order Flow** sequence diagram:
  - User → Cart → Checkout → Order.API → Cart cleared → Order confirmed
- [ ] Add **Decision Log** section:
  - Why JWT RS256 (over HS256)
  - Why NgRx (over component state)
  - Why Clean Architecture per microservice
- [ ] Commit: `docs(architecture): add Login and PlaceOrder sequence diagrams`
- [ ] Commit: `docs(architecture): add decision log section`

### Task 6.3 — API.md — Endpoint Reference
- [ ] Create `docs/API.md`
- [ ] Document all 14 controllers with:
  - Method + route
  - Auth required (yes/no, role)
  - Request body example (JSON)
  - Success response example (JSON)
  - Error responses (400/401/404/500 with ProblemDetails shape)
- [ ] Commit: `docs: add API.md with endpoint reference for all 14 controllers`

### Day 6 Self-Audit
- [ ] README.md: a fresh developer can follow it end-to-end without asking questions
- [ ] ARCHITECTURE.md has at least 2 Mermaid sequence diagrams
- [ ] `docs/API.md` documents all 14 controllers
- [ ] At least 4 commits made today

---

## Day 7 — 2026-05-18 · Functional Completeness & Final Review (P2 — High)

**Goal:** Close remaining feature gaps. Run full self-evaluation. Verify sprint outcome.
**Min Commits Today:** 4
**Build Gate:** `dotnet build` 0 errors. `ng build --configuration production` 0 errors. `dotnet test` all pass.

### Task 7.1 — Order Status Stepper
- [ ] Verify `GET /api/v1/orders/{id}` returns `status` field (Placed/Confirmed/Shipped/Delivered/Cancelled)
- [ ] Create or update order detail component to show a visual stepper:
  - Steps: Placed → Confirmed → Shipped → Delivered
  - Active step highlighted in `--cliq-red`
  - Cancelled state shows red cancelled badge
- [ ] Commit: `feat(frontend): add order status stepper to order detail page`

### Task 7.2 — Admin Dashboard Real Metrics
- [ ] Update `Admin.API` — add `GET /api/v1/admin/dashboard/metrics` endpoint
  - Returns: `{ totalOrders, totalRevenue, totalUsers, totalProducts }`
  - Uses EF Core aggregate queries (`.CountAsync()`, `.SumAsync()`)
- [ ] Update Angular `admin-dashboard.component.ts` to call `admin.service.getDashboardMetrics()`
- [ ] Replace all hardcoded numbers with real API values via `AsyncPipe`
- [ ] Commit: `feat(admin): add dashboard metrics endpoint with real EF Core aggregates`
- [ ] Commit: `feat(frontend): wire admin dashboard to real metrics API`

### Task 7.3 — Coupon Application Feedback
- [ ] Verify `POST /api/v1/cart/coupon` returns success/error message in response body
- [ ] Update `coupon-input.component.ts`:
  - On success: show green "Coupon applied! You save ₹X" message
  - On failure: show red "Invalid or expired coupon" message
  - Use NgRx `cart` state for coupon status
- [ ] Commit: `feat(frontend): add coupon success/error feedback to cart coupon input`

### Task 7.4 — Address Management Verification
- [ ] Manually verify full CRUD flow: Add address → Edit address → Set as default → Delete address
- [ ] If edit (`PUT /api/v1/users/me/addresses/{id}`) is missing: add it to User.API
- [ ] If Angular address-step does not show saved addresses: wire `userService.getAddresses()` on load
- [ ] Commit (if changes made): `feat(user): add PUT /api/v1/users/me/addresses/{id} edit endpoint`

### Task 7.5 — Final Sprint Verification
- [ ] `dotnet build` — 0 errors, 0 warnings
- [ ] `dotnet test` — all tests pass
- [ ] `npx tsc --noEmit` — 0 errors
- [ ] `ng build --configuration production` — 0 errors, 0 warnings
- [ ] `ng test --watch=false --code-coverage` — check coverage report
- [ ] `git log --oneline -30` — verify 25+ atomic commits with Conventional Commits format
- [ ] Update Score Tracker table at top of this file with final self-assessment
- [ ] Commit: `chore(docs): update IMPROVEMENT_SPRINT.md with Day 7 results and final score`

### Day 7 Self-Audit (Final Sprint Checklist)
- [ ] All 14 controllers have FluentValidation on write operations
- [ ] All 6 APIs use global exception middleware with ProblemDetails
- [ ] `dotnet test` shows 11+ passing tests
- [ ] `ng test` shows 4+ passing specs
- [ ] Empty states are shown in cart, wishlist, PLP, orders
- [ ] All forms show `<mat-error>` inline validation
- [ ] HTTP errors show snackbar to user
- [ ] Order status stepper is visible on order detail
- [ ] Admin dashboard shows real data from API
- [ ] README.md has complete setup guide
- [ ] `docs/API.md` covers all 14 controllers
- [ ] `git log --oneline -30` shows 25+ commits — all Conventional Commits format
- [ ] `.gitmessage` commit template is in repo root

---

## Daily Commit Target Summary

| Day | Date       | Focus Area                        | Min Commits | Status |
|-----|------------|-----------------------------------|-------------|--------|
| 1   | 2026-05-12 | Exception middleware, pagination  | 4           | [x]    |
| 2   | 2026-05-13 | FluentValidation, remove try-catch| 5           | [x]    |
| 3   | 2026-05-14 | Git discipline, API versioning    | 4           | [x]    |
| 4   | 2026-05-15 | Testing — .NET + Angular          | 5           | [~]    |
| 5   | 2026-05-16 | UI/UX — empty states, errors      | 5           | [ ]    |
| 6   | 2026-05-17 | Documentation                     | 4           | [ ]    |
| 7   | 2026-05-18 | Feature gaps + final review       | 4           | [ ]    |
|     | **TOTAL**  |                                   | **31 min**  |        |

---

## Daily Self-Audit Checklist (run every evening before stopping)

```
Code:
[ ] dotnet build — 0 errors
[ ] npx tsc --noEmit — 0 errors
[ ] No controller contains a try-catch block (Day 2+)
[ ] Every new write endpoint has a FluentValidator (Day 2+)

Git:
[ ] Every commit follows Conventional Commits format
[ ] Each commit contains ONE logical change only
[ ] Minimum commit target for today was hit

UI:
[ ] New/changed component tested at 375px mobile
[ ] No hardcoded pixel values — Tailwind classes only

Tests:
[ ] Any new service has at least one test method
[ ] dotnet test passes — 0 failing tests
```

---

## Blocked / Assumptions

- [ ] Azure resources (Blob, Redis, Search) — still deferred, no V2 installs
- [ ] Razorpay payment integration — deferred
- [ ] OTP/SMS auth — deferred, email+password only
- [ ] `npx tsc --noEmit` may show pre-existing strict errors — fix only within scope of current day's changes

---

## Session Log

| Date       | Day | Session Summary |
|------------|-----|-----------------|
| 2026-05-12 | D0  | Improvement Sprint initiated. CLAUDE.md updated with Phase 8, Git Commit Convention, Improvement Focus table. IMPROVEMENT_SPRINT.md created with 7-day day-by-day plan. |
| 2026-05-12 | D1  | All Day 1 tasks complete. ExceptionMiddleware in SharedKernel (RFC 7807, ValidationException/401/404/500). Wired into all 6 APIs. PagedResult<T> in SharedKernel. Catalog.API GET /api/products returns PagedResult<ProductDto>. dotnet build: 0 errors 0 warnings. 4 Conventional Commits: 07bb589, 21c8148, bc786a8, 8245fcd. |
| 2026-05-13 | D2  | All Day 2 tasks complete. FluentValidation added to all write endpoints: Catalog.API (Products POST/PUT, Categories POST, Brands POST + 4 validators), Admin.API (AdminOrders PUT /status, AdminProducts PUT /status, AdminUsers CreateSeller + 3 validators), Seller (SellerProducts POST/PUT + 2 validators, manual if-check removed). ExceptionMiddleware extended with InvalidOperationException → 400. CouponsController try-catch removed. dotnet build: 0 errors 0 warnings. 5 Conventional Commits: 67426c9, 09158ec, c32c82f, 17ed4aa, 9609957. |
| 2026-05-14 | D3  | All Day 3 tasks complete. .gitmessage commit template created and configured via git config. All 14 controller routes updated to /api/v1/ prefix (no package needed — route string change only). Angular environment.ts and environment.prod.ts updated to /api/v1. CorrelationIdMiddleware created in SharedKernel (reads/generates X-Correlation-Id, enriches Serilog LogContext, echoes header in response). Serilog package added to SharedKernel.csproj. UseCorrelationId() wired in all 6 API Program.cs files before UseExceptionMiddleware(). dotnet build: 0 errors 0 warnings. npx tsc --noEmit: 0 errors. 4 Conventional Commits: c1c02a2, c2b8b27, 091cdf6, 53e9705. |
| 2026-05-15 | D4  | All Day 4 test tasks complete. Created TataCliq.Auth.Tests (5 xUnit tests: LoginAsync valid/wrong/notfound, RegisterAsync new/duplicate) and TataCliq.Catalog.Tests (6 xUnit tests: ProductQueryValidator 3 cases, CatalogService GetProducts/GetProduct valid/invalid). Fixed AutoMapper 16 API change by using Mock<IMapper>. Fixed UserManager mock with null! null-forgiving operators. Fixed missing `using Xunit;` (ImplicitUsings does not auto-include xunit). Both test projects added to tatacliq-clone.slnx. dotnet test: 11/11 PASS. Created 4 Angular spec files: auth.service.spec.ts (3 tests), auth.effects.spec.ts (2 tests), cart.service.spec.ts (2 tests), catalog.service.spec.ts (3 tests). Fixed NgRx effects test to use provideEffects(authEffects) namespace import (not array). npx tsc --noEmit -p tsconfig.spec.json: 0 errors. BLOCKER: ng test --watch=false fails — Angular CLI 21 requires Node.js v20.19+, environment has v20.16.0; TypeScript compilation as proxy for spec correctness. 2 commits (aab0786, e2d05b0) — auto-staging hook bundled all 8 test files into aab0786. |
