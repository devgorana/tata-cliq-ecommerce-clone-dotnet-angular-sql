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
| 1 |             |         | D1  |
| 2 |             |         | D1  |
| 3 |             |         | D1  |
| 4 |             |         | D1  |
| 5 |             |         | D2  |
| 6 |             |         | D2  |
| 7 |             |         | D2  |
| 8 |             |         | D2  |
| 9 |             |         | D3  |
| 10 |            |         | D3  |

---

---

## Day 1 — 2026-05-12 · API Hardening: Foundation (P1 — Critical)

**Goal:** One global exception middleware in SharedKernel; API versioning prefix; ProblemDetails standard across all 6 APIs.
**Min Commits Today:** 4
**Build Gate:** `dotnet build` 0 errors before end of day.

### Task 1.1 — Global Exception Middleware (SharedKernel)
- [ ] Create `backend/src/Shared/TataCliq.SharedKernel/Middleware/ExceptionMiddleware.cs`
  - Catches `Exception` → returns RFC 7807 `ProblemDetails` JSON
  - Catches `ValidationException` (FluentValidation) → 400 with field errors
  - Catches `UnauthorizedAccessException` → 401
  - Catches `KeyNotFoundException` → 404
  - Logs full exception via `ILogger<ExceptionMiddleware>` (Serilog)
- [ ] Create `backend/src/Shared/TataCliq.SharedKernel/Extensions/ExceptionMiddlewareExtensions.cs`
  - `app.UseExceptionMiddleware()` extension method
- [ ] Commit: `feat(shared): add global exception middleware with ProblemDetails`

### Task 1.2 — Wire Middleware in All 6 APIs
- [ ] Auth.API `Program.cs` — replace existing try-catch patterns; add `app.UseExceptionMiddleware()`
- [ ] User.API `Program.cs` — add `app.UseExceptionMiddleware()`
- [ ] Catalog.API `Program.cs` — add `app.UseExceptionMiddleware()`
- [ ] Cart.API `Program.cs` — add `app.UseExceptionMiddleware()`
- [ ] Order.API `Program.cs` — add `app.UseExceptionMiddleware()`
- [ ] Admin.API `Program.cs` — add `app.UseExceptionMiddleware()`
- [ ] Commit: `chore(infra): wire ExceptionMiddleware into all 6 API Program.cs files`

### Task 1.3 — PagedResult Wrapper (SharedKernel)
- [ ] Create `backend/src/Shared/TataCliq.SharedKernel/DTOs/PagedResult.cs`
  - Properties: `Items`, `TotalCount`, `Page`, `PageSize`, `TotalPages`
- [ ] Commit: `feat(shared): add PagedResult<T> wrapper for paginated API responses`

### Task 1.4 — Catalog.API Pagination
- [ ] Update `GET /api/products` in `ProductsController` to return `PagedResult<ProductDto>`
- [ ] Update `CatalogService.GetProductsAsync()` to accept `page` and `pageSize` params
- [ ] Update `ProductQueryValidator` — validate `page >= 1`, `pageSize` between 1–100
- [ ] Commit: `feat(catalog): add pagination to GET /api/products with PagedResult`

### Day 1 Self-Audit
- [ ] `dotnet build` passes — 0 errors, 0 warnings
- [ ] All 6 APIs return `application/problem+json` on unhandled exceptions
- [ ] At least 4 commits made today with Conventional Commits format

---

## Day 2 — 2026-05-13 · API Hardening: Validators & Error Handling (P1 — Critical)

**Goal:** Every controller that currently has no FluentValidation gets it today. Remove all scattered try-catch from controllers.
**Min Commits Today:** 5
**Build Gate:** `dotnet build` 0 errors before end of day.

### Task 2.1 — FluentValidation: Catalog.API
- [ ] Create `ProductsController` validators: `CreateProductRequestValidator`, `UpdateProductRequestValidator`
  - Name: required, 2–200 chars
  - Price: required, > 0
  - CategoryId, BrandId: required, > 0
- [ ] Create `CategoriesController` validator: `CreateCategoryRequestValidator`
  - Name: required, 2–100 chars
- [ ] Create `BrandsController` validator: `CreateBrandRequestValidator`
  - Name: required, 2–100 chars
- [ ] Register validators in Catalog.API `Program.cs`
- [ ] Commit: `feat(catalog): add FluentValidation to Products, Categories, Brands controllers`

### Task 2.2 — FluentValidation: Admin.API
- [ ] Create `AdminProductsController` validator: `AdminUpdateProductValidator`
- [ ] Create `AdminOrdersController` validator: `AdminUpdateOrderStatusValidator`
  - Status: must be one of: Placed, Confirmed, Shipped, Delivered, Cancelled
- [ ] Create `AdminUsersController` validator: `AdminUpdateUserRoleValidator`
- [ ] Register validators in Admin.API `Program.cs`
- [ ] Commit: `feat(admin): add FluentValidation to AdminProducts, AdminOrders, AdminUsers controllers`

### Task 2.3 — FluentValidation: Seller.API (if exists) / User.API gaps
- [ ] Review `SellerProductsController` — add `CreateSellerProductValidator`, `UpdateSellerProductValidator`
- [ ] Review `SellerOrdersController` — add `SellerUpdateOrderStatusValidator`
- [ ] Commit: `feat(seller): add FluentValidation to SellerProducts and SellerOrders controllers`

### Task 2.4 — Remove Controller-Level try-catch
- [ ] Catalog.API controllers — remove try-catch blocks; rely on ExceptionMiddleware
- [ ] Admin.API controllers — remove try-catch blocks
- [ ] Verify: every action method is clean (validate → call service → return result only)
- [ ] Commit: `refactor(catalog): remove controller-level try-catch, delegate to ExceptionMiddleware`
- [ ] Commit: `refactor(admin): remove controller-level try-catch, delegate to ExceptionMiddleware`

### Day 2 Self-Audit
- [ ] `dotnet build` passes — 0 errors, 0 warnings
- [ ] All 14 controllers now have FluentValidation on write operations
- [ ] No controller contains a try-catch block
- [ ] At least 5 commits made today with Conventional Commits format

---

## Day 3 — 2026-05-14 · Git Discipline (P1 — Critical)

**Goal:** Establish permanent commit hygiene. Add commit template. Demonstrate professional atomic commit history from this day forward.
**Min Commits Today:** 4
**Build Gate:** Both `dotnet build` and `npx tsc --noEmit` pass.

### Task 3.1 — Git Commit Message Template
- [ ] Create `.gitmessage` at repo root:
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
- [ ] Run: `git config commit.template .gitmessage`
- [ ] Commit: `chore(docs): add Conventional Commits .gitmessage template`

### Task 3.2 — API Versioning Prefix
- [ ] Add `Microsoft.AspNetCore.Mvc.Versioning` package to SharedKernel or each API
- [ ] Update all route attributes to `/api/v1/` prefix
  - Auth.API: `[Route("api/v1/auth")]`
  - User.API: `[Route("api/v1/users")]`
  - Catalog.API: `[Route("api/v1/products")]`, `[Route("api/v1/categories")]`, `[Route("api/v1/brands")]`
  - Cart.API: `[Route("api/v1/cart")]`
  - Order.API: `[Route("api/v1/orders")]`
  - Admin.API: `[Route("api/v1/admin/...")]`
- [ ] Update Angular environment.ts API base URLs to include `/v1`
- [ ] Commit: `feat(infra): add /api/v1 route versioning to all 6 APIs`
- [ ] Commit: `chore(frontend): update environment.ts API base URLs to /api/v1`

### Task 3.3 — Correlation ID Middleware
- [ ] Verify Serilog correlation ID is present in all API requests (check `appsettings.json`)
- [ ] If missing: add `X-Correlation-Id` header enrichment to Serilog pipeline in SharedKernel
- [ ] Commit: `feat(shared): add X-Correlation-Id header enrichment to Serilog pipeline`

### Day 3 Self-Audit
- [ ] `git log --oneline -15` shows clean, descriptive Conventional Commits
- [ ] `.gitmessage` file exists at repo root
- [ ] All API routes use `/api/v1/` prefix
- [ ] Angular environment.ts URLs are updated to match
- [ ] At least 4 commits made today

---

## Day 4 — 2026-05-15 · Testing Coverage (P2 — High)

**Goal:** Go from 0 tests to 15+ meaningful tests across .NET and Angular.
**Min Commits Today:** 5
**Build Gate:** `dotnet test` runs (even if some tests fail initially). `ng test --watch=false` runs.

### Task 4.1 — .NET Test Project: Auth.API
- [ ] Create `backend/tests/TataCliq.Auth.Tests/` xUnit project
- [ ] Add project reference to `tatacliq-clone.slnx`
- [ ] Install: `xunit`, `Moq`, `FluentAssertions`, `Microsoft.EntityFrameworkCore.InMemory`
- [ ] Write `AuthServiceTests.cs`:
  - [ ] `LoginAsync_ValidCredentials_ReturnsToken`
  - [ ] `LoginAsync_WrongPassword_ReturnsFailureResult`
  - [ ] `LoginAsync_UserNotFound_ReturnsFailureResult`
  - [ ] `RegisterAsync_NewUser_CreatesUserAndReturnsToken`
  - [ ] `RegisterAsync_DuplicateEmail_ReturnsFailureResult`
- [ ] Commit: `test(auth): add AuthService unit tests — login and register flows`

### Task 4.2 — .NET Test Project: Catalog.API
- [ ] Create `backend/tests/TataCliq.Catalog.Tests/` xUnit project
- [ ] Write `ProductQueryValidatorTests.cs`:
  - [ ] `Validate_ValidQuery_PassesValidation`
  - [ ] `Validate_NegativePage_FailsValidation`
  - [ ] `Validate_PageSizeOver100_FailsValidation`
- [ ] Write `CatalogServiceTests.cs`:
  - [ ] `GetProductsAsync_ReturnsPagedResult`
  - [ ] `GetProductByIdAsync_ValidId_ReturnsProduct`
  - [ ] `GetProductByIdAsync_InvalidId_ThrowsKeyNotFoundException`
- [ ] Commit: `test(catalog): add CatalogService and ProductQueryValidator unit tests`

### Task 4.3 — Angular Spec: AuthService
- [ ] Create `frontend/src/app/core/services/auth.service.spec.ts`
  - [ ] `login() should dispatch success action on valid credentials`
  - [ ] `login() should dispatch failure action on 401 response`
  - [ ] `register() should call POST /api/v1/auth/register`
- [ ] Commit: `test(frontend): add auth.service unit tests`

### Task 4.4 — Angular Spec: Auth Effects
- [ ] Create `frontend/src/app/store/auth/auth.effects.spec.ts`
  - [ ] `login$ effect should call authService.login and dispatch loginSuccess`
  - [ ] `login$ effect should dispatch loginFailure on error`
- [ ] Commit: `test(frontend): add auth NgRx effects unit tests`

### Task 4.5 — Angular Spec: CartService
- [ ] Create `frontend/src/app/core/services/cart.service.spec.ts`
  - [ ] `addToCart() should call POST /api/v1/cart/items`
  - [ ] `removeFromCart() should call DELETE /api/v1/cart/items/{id}`
- [ ] Commit: `test(frontend): add cart.service unit tests`

### Day 4 Self-Audit
- [ ] `dotnet test` runs with at least 11 passing .NET tests
- [ ] `ng test --watch=false` runs with at least 4 Angular specs
- [ ] Test projects added to solution file
- [ ] At least 5 commits made today

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
| 1   | 2026-05-12 | Exception middleware, pagination  | 4           | [ ]    |
| 2   | 2026-05-13 | FluentValidation, remove try-catch| 5           | [ ]    |
| 3   | 2026-05-14 | Git discipline, API versioning    | 4           | [ ]    |
| 4   | 2026-05-15 | Testing — .NET + Angular          | 5           | [ ]    |
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
