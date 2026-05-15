# IMPROVEMENTS.md — Tata CLiQ E-Commerce Clone
# Feature improvement backlog. Mark: [ ] pending | [~] in progress | [x] done
# Grouped by priority tier. Pick any item and create a spec to implement it.

---

## Tier 1 — High Impact / Low Effort (Quick Wins)

### 1.1 — API Rate Limiting
- [ ] Add `AspNetCoreRateLimit` middleware to all 6 APIs
- [ ] Configure per-IP limits: 100 req/min for public endpoints, 30 req/min for auth endpoints
- [ ] Return `429 Too Many Requests` with `Retry-After` header
- [ ] Add rate-limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`) to all responses

### 1.2 — Product Review Submission
- [ ] Add `POST /api/v1/products/{id}/reviews` endpoint to Catalog.API (auth required)
- [ ] Add `ReviewDto` (rating 1–5, title, body, verifiedPurchase flag)
- [ ] Add `ReviewValidator` (rating required, body 10–500 chars)
- [ ] Wire `product-reviews.component.ts` to submit real reviews via `catalog.service.ts`
- [ ] Add NgRx `ReviewActions` (submit, submitSuccess, submitFailure)
- [ ] Show "Verified Purchase" badge when reviewer has a delivered order for that product

### 1.3 — Address Default Toggle
- [ ] Add `PUT /api/v1/users/me/addresses/{id}/set-default` endpoint to User.API
- [ ] Update `address-step.component.ts` to show a "Set as Default" button per address
- [ ] Auto-select default address on checkout load

### 1.4 — Order Status Email Notifications (stub)
- [ ] Add `INotificationService` interface to SharedKernel
- [ ] Add `ConsoleNotificationService` stub implementation (logs to Serilog — no real email yet)
- [ ] Wire into Order.API: send notification on `Placed`, `Shipped`, `Delivered`, `Cancelled`
- [ ] Add `NotificationLog` entity to track sent notifications (orderId, type, sentAt)

### 1.5 — Inventory / Stock Tracking
- [ ] Add `StockQuantity` field to `ProductVariant` entity (already in schema — wire the logic)
- [ ] Decrement stock on order placement in Order.API
- [ ] Return `409 Conflict` when requested quantity exceeds available stock
- [ ] Show "Only N left" badge on PDP when stock ≤ 5
- [ ] Show "Out of Stock" state on product card and disable ATC button

### 1.6 — CI/CD Pipeline (GitHub Actions)
- [ ] Create `.github/workflows/backend-ci.yml` — `dotnet build` + `dotnet test` on PR
- [ ] Create `.github/workflows/frontend-ci.yml` — `npx tsc --noEmit` + `ng build --configuration production` on PR
- [ ] Add branch protection rule instructions to README.md
- [ ] Add build status badges to README.md

---

## Tier 2 — Medium Impact / Medium Effort (Feature Completions)

### 2.1 — Seller Onboarding & Dashboard
- [ ] Implement `TataCliq.Seller.API` (currently scaffolded but empty)
  - [ ] `POST /api/v1/seller/register` — seller application form
  - [ ] `GET /api/v1/seller/dashboard` — revenue, orders, top products
  - [ ] `GET /api/v1/seller/products` — seller's own product listings
  - [ ] `POST /api/v1/seller/products` — create product listing
  - [ ] `PUT /api/v1/seller/products/{id}` — update listing
  - [ ] `DELETE /api/v1/seller/products/{id}` — remove listing
- [ ] Add `features/seller/` Angular module with lazy routes
  - [ ] `seller-dashboard.component.ts` — revenue chart, order count, top 5 products
  - [ ] `seller-products.component.ts` — product list with inline status toggle
  - [ ] `seller-product-form.component.ts` — create/edit product form
- [ ] Add Seller role guard (`sellerGuard`) in Angular core
- [ ] Wire `POST /api/v1/admin/users/create-seller` to Admin UI (currently API-only)

### 2.2 — Return & Refund Flow
- [ ] Add `ReturnRequest` entity to Orders schema (orderId, itemId, reason, status, requestedAt)
- [ ] Add `POST /api/v1/orders/{id}/return` endpoint — initiate return (within 7 days of delivery)
- [ ] Add `GET /api/v1/orders/{id}/return` endpoint — get return status
- [ ] Add `PUT /api/v1/admin/orders/{id}/return/approve` — admin approves/rejects return
- [ ] Add `return-request.component.ts` in `features/orders/` with reason dropdown
- [ ] Show return status on `order-detail.component.ts`

### 2.3 — Product Search Autocomplete
- [ ] Add `GET /api/v1/products/search/suggestions?q=` endpoint to Catalog.API
  - [ ] Returns top 5 matching product names + 3 matching category names
  - [ ] Debounced at 300ms, min 2 chars
- [ ] Update `header.component.ts` search bar to show dropdown suggestions
- [ ] Add keyboard navigation (↑↓ arrows, Enter to navigate, Escape to close)
- [ ] Add `SearchSuggestionsComponent` as a standalone overlay component

### 2.4 — Recently Viewed Products
- [ ] Add `RecentlyViewed` entity to Commerce schema (userId, productId, viewedAt)
- [ ] Add `POST /api/v1/users/me/recently-viewed/{productId}` to User.API (upsert, keep last 10)
- [ ] Add `GET /api/v1/users/me/recently-viewed` to User.API
- [ ] Add `recently-viewed.component.ts` on PDP (horizontal scroll strip below description)
- [ ] Add NgRx `recentlyViewedSlice` — load on PDP init, persist in store

### 2.5 — Admin Product Management (Full CRUD)
- [ ] Add `POST /api/v1/admin/products` — create product with variants (currently only PUT status exists)
- [ ] Add `DELETE /api/v1/admin/products/{id}` — soft-delete product
- [ ] Add `admin-product-form.component.ts` — create/edit form with variant management
- [ ] Add `admin-product-detail.component.ts` — view product with all variants and stock levels
- [ ] Wire `admin-products.component.ts` to show full CRUD actions (currently read-only)

### 2.6 — Pagination & Infinite Scroll on PLP
- [ ] Replace current page-based pagination with URL-synced query params (`?page=2`)
- [ ] Add `PaginationComponent` (prev/next + page numbers) to `results-grid.component.ts`
- [ ] Sync active page to Angular Router query params so browser back/forward works
- [ ] Add `totalCount` display ("Showing 21–40 of 100 results")

### 2.7 — Unit & Integration Test Coverage
- [ ] Add xUnit tests for `CartService` (add item, update quantity, apply coupon, remove item)
- [ ] Add xUnit tests for `OrderService` (place order, buy-now, cancel, stock decrement)
- [ ] Add xUnit tests for `UserService` (profile update, address CRUD, wishlist toggle)
- [ ] Add Angular component tests for `product-card.component.spec.ts` (wishlist toggle, price display)
- [ ] Add Angular component tests for `cart-summary.component.spec.ts` (discount calculation)
- [ ] Target: 80%+ line coverage on all service classes

---

## Tier 3 — High Impact / High Effort (Phase 5+ Cloud Features)

### 3.1 — Razorpay Payment Integration
- [ ] Implement `TataCliq.Payment.API` (currently scaffolded)
  - [ ] `POST /api/v1/payments/create-order` — create Razorpay order, return `razorpay_order_id`
  - [ ] `POST /api/v1/payments/verify` — verify `razorpay_payment_id` + `razorpay_signature`
  - [ ] `POST /api/v1/payments/refund` — initiate refund via Razorpay API
- [ ] Add `Payment` entity status transitions: `Pending → Paid → Refunded`
- [ ] Update `checkout/payment-step.component.ts` to load Razorpay checkout.js and handle callback
- [ ] Update Order.API to set order status `Confirmed` only after payment verification
- [ ] Add `PaymentActions` NgRx slice (initiate, verify, success, failure)

### 3.2 — Redis Caching
- [ ] Uncomment Redis service in `docker-compose.yml`
- [ ] Add `StackExchange.Redis` to Cart.API and Catalog.API
- [ ] Cache cart by userId in Redis (TTL: 24h) — fall back to SQL on cache miss
- [ ] Cache product list responses in Redis (TTL: 5min, invalidate on product update)
- [ ] Cache category and brand lists (TTL: 1h)
- [ ] Add cache-aside pattern helper in `TataCliq.Infrastructure`

### 3.3 — Azure Blob Storage for Product Images
- [ ] Add `Azure.Storage.Blobs` to Catalog.API and Admin.API
- [ ] Add `POST /api/v1/admin/images/upload` — accept multipart/form-data, store in Azure Blob, return CDN URL
- [ ] Add image upload field to `admin-product-form.component.ts`
- [ ] Replace Picsum placeholder URLs with real uploaded image URLs in seeder
- [ ] Add image resize/optimization pipeline (thumbnail 300×400, full 800×1067)

### 3.4 — Azure Cognitive Search
- [ ] Add `Azure.Search.Documents` to Catalog.API
- [ ] Create search index with fields: name, description, brandName, categoryName, tags, price
- [ ] Sync products to search index on create/update via background job
- [ ] Replace SQL LIKE search in `GET /api/v1/products` with Cognitive Search query
- [ ] Add faceted search support (category, brand, price range as facets)
- [ ] Add typo tolerance and synonym support

### 3.5 — Real Email Notifications
- [ ] Add `Azure.Communication.Email` (or SendGrid) to Notification.API
- [ ] Implement `INotificationService` with real email sending
- [ ] Create HTML email templates: order confirmation, shipping update, delivery confirmation
- [ ] Add `POST /api/v1/notifications/send` internal endpoint (called by Order.API via HTTP)
- [ ] Add unsubscribe token and `GET /api/v1/notifications/unsubscribe/{token}` endpoint

### 3.6 — OTP / Phone Authentication
- [ ] Add `POST /api/v1/auth/otp/send` — send OTP to phone number via MSG91
- [ ] Add `POST /api/v1/auth/otp/verify` — verify OTP, return JWT tokens
- [ ] Add `PhoneNumber` field to `ApplicationUser` entity
- [ ] Add OTP login tab to `login.component.ts` (toggle between email/phone)
- [ ] Add `OtpInputComponent` — 6-digit input with auto-advance and paste support

### 3.7 — Product Recommendations (AI)
- [ ] Add `Azure.AI.OpenAI` to Catalog.API
- [ ] Add `GET /api/v1/products/{id}/recommendations` — returns 4 similar products
  - [ ] Use embeddings to find semantically similar products by description
  - [ ] Fall back to same-category products if AI unavailable
- [ ] Add `recommendations.component.ts` on PDP ("You may also like" section)
- [ ] Add `GET /api/v1/users/me/recommendations` — personalised picks based on wishlist + order history

### 3.8 — Azure Key Vault & Application Insights
- [ ] Add `Azure.Extensions.AspNetCore.Configuration.Secrets` to all APIs
- [ ] Move JWT keys, DB connection string, and API keys to Key Vault
- [ ] Add `Microsoft.ApplicationInsights.AspNetCore` to all APIs
- [ ] Configure custom telemetry: track order placement, search queries, cart abandonment
- [ ] Add Application Insights dashboard link to README.md

---

## Tier 4 — UX & Accessibility Improvements

### 4.1 — Dark Mode
- [ ] Add `darkMode: 'class'` to `tailwind.config.ts`
- [ ] Add `dark:` variants to all layout and shared components
- [ ] Add theme toggle button to header (sun/moon icon)
- [ ] Persist preference in `localStorage` and sync to NgRx `ui` store
- [ ] Respect `prefers-color-scheme` media query on first load

### 4.2 — Progressive Web App (PWA)
- [ ] Add `@angular/pwa` to frontend (`ng add @angular/pwa`)
- [ ] Configure `ngsw-config.json`: cache static assets + API GET responses
- [ ] Add `manifest.webmanifest` with app name, icons, theme colour
- [ ] Add "Add to Home Screen" prompt component
- [ ] Test offline mode: cached product pages should load without network

### 4.3 — Skeleton Loading States (Complete Coverage)
- [ ] Add skeleton to `order-list.component.ts` (currently shows empty state immediately)
- [ ] Add skeleton to `account/profile.component.ts`
- [ ] Add skeleton to `admin-dashboard.component.ts` (metric cards)
- [ ] Add skeleton to `mega-menu.component.ts` (brand tiles)
- [ ] Ensure all skeletons use `shimmer` animation from `styles.scss`

### 4.4 — Keyboard & Screen Reader Accessibility
- [ ] Audit all modal dialogs — ensure focus trap and `aria-modal="true"`
- [ ] Add `role="status"` live region for snackbar notifications
- [ ] Add `aria-live="polite"` to cart badge count updates
- [ ] Ensure all form error messages are linked via `aria-describedby`
- [ ] Add `tabindex` management for mega-menu (Tab through sub-items, Escape closes)
- [ ] Run axe-core audit and fix all critical violations

### 4.5 — Performance Optimisation
- [ ] Add `NgOptimizedImage` directive to all `<img>` tags (Angular built-in)
- [ ] Add `loading="lazy"` to product card images below the fold
- [ ] Enable Angular `withComponentInputBinding()` for route params (remove manual `ActivatedRoute` subscriptions)
- [ ] Add `trackBy` functions to all `*ngFor` / `@for` loops
- [ ] Audit bundle size with `ng build --stats-json` + `webpack-bundle-analyzer`
- [ ] Split large NgRx effects files into smaller domain-specific files

---

## Tier 5 — Developer Experience

### 5.1 — E2E Tests (Playwright)
- [ ] Install Playwright (`npm init playwright@latest` in `frontend/`)
- [ ] Write E2E test: user registration → login → add to cart → checkout
- [ ] Write E2E test: admin login → create coupon → apply coupon in cart
- [ ] Write E2E test: product search → filter by category → add to wishlist
- [ ] Add Playwright run to GitHub Actions CI workflow

### 5.2 — API Contract Tests
- [ ] Add `Microsoft.AspNetCore.Mvc.Testing` to a new `TataCliq.IntegrationTests` project
- [ ] Write integration tests for Auth.API: register, login, refresh, logout flow
- [ ] Write integration tests for Cart.API: add item, apply coupon, place order
- [ ] Use `WebApplicationFactory<Program>` with in-memory SQLite for test isolation

### 5.3 — OpenAPI Code Generation
- [ ] Add `NSwag` or `Kiota` to generate TypeScript client from OpenAPI specs
- [ ] Replace hand-written Angular services with generated typed clients
- [ ] Add `npm run generate-api` script to `package.json`
- [ ] Add generation step to CI pipeline to catch API contract drift

### 5.4 — Database Migrations Safety
- [ ] Add `dotnet ef migrations script` step to CI to generate idempotent SQL scripts
- [ ] Add migration validation: fail CI if pending migrations exist on main branch
- [ ] Add `HasData()` seeding to migrations instead of runtime DbSeeder (for reproducibility)

### 5.5 — Structured Logging Dashboard
- [ ] Add Seq (free tier) container to `docker-compose.yml` for local log aggregation
- [ ] Configure Serilog sink to write to Seq in development
- [ ] Add correlation ID propagation across service calls (pass `X-Correlation-Id` header)
- [ ] Document Seq dashboard URL in README.md

---

## Notes

- Items in **Tier 1** can be picked up immediately — no new infrastructure required.
- Items in **Tier 3** require Azure subscription or local emulators (Azurite for Blob/Queue).
- Each item above is sized for a single spec session. Create a spec in `.kiro/specs/` before starting.
- Follow `CLAUDE.md` rules: no `any` in TypeScript, no raw SQL, mobile-first Tailwind, EF Core migrations for all schema changes.
