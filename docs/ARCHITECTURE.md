# ARCHITECTURE.md — Tata CLiQ E-Commerce Clone

## Solution Overview

```
tatacliq-clone/
├── CLAUDE.md                    ← Project rules. Read every session.
├── TODO.md                      ← Phase-level task checklist
├── .env.example                 ← Required environment variables
├── docker-compose.yml           ← Full local dev stack
├── docs/
│   ├── DESIGN.md                ← Design system (colours, typography, breakpoints)
│   ├── ARCHITECTURE.md          ← This file
│   └── skills/
│       ├── angular.md           ← Angular patterns (Phase 3)
│       └── dotnet.md            ← .NET patterns (Phase 2)
├── backend/
│   ├── tatacliq-clone.sln
│   └── src/
│       ├── Services/
│       │   ├── TataCliq.Auth.API/       ← JWT, Identity, OTP
│       │   ├── TataCliq.User.API/       ← Profile, addresses, wishlist
│       │   ├── TataCliq.Catalog.API/    ← Products, categories, brands
│       │   ├── TataCliq.Cart.API/       ← Cart, coupons
│       │   ├── TataCliq.Order.API/      ← Order lifecycle, tracking
│       │   ├── TataCliq.Payment.API/    ← Razorpay (Phase 5)
│       │   ├── TataCliq.Notification.API/
│       │   ├── TataCliq.Seller.API/
│       │   └── TataCliq.Admin.API/      ← CMS, banners, coupons
│       └── Shared/
│           ├── TataCliq.SharedKernel/   ← BaseEntity, Result<T>, IRepository<T>
│           └── TataCliq.Infrastructure/ ← EF Core DbContext, EfRepository<T>
└── frontend/                    ← Angular 21 SPA
    └── src/app/
        ├── core/                ← Guards, interceptors, services, config
        ├── shared/              ← Reusable components, pipes, directives
        ├── features/            ← Lazy-loaded pages (home, catalog, cart, checkout…)
        │   ├── home/
        │   ├── catalog/
        │   ├── cart/
        │   ├── checkout/
        │   ├── orders/
        │   ├── account/
        │   └── admin/
        ├── layout/              ← Header, footer, mega-menu, bottom-nav
        └── store/               ← NgRx: actions, reducers, selectors, effects
            ├── auth/
            ├── cart/
            ├── catalog/
            └── ui/
```

---

## Backend Architecture: Clean Architecture per Service

Each .NET microservice follows the same internal structure:

```
TataCliq.<Name>.API/
├── Controllers/         ← HTTP entry points; delegate to Services
├── Services/            ← Business logic; call Repositories
├── Repositories/        ← Data access via EF Core (implements IRepository<T>)
├── DTOs/                ← Request + Response DTOs
├── Validators/          ← FluentValidation validators for request DTOs
├── Mapping/             ← AutoMapper profiles (Entity ↔ DTO)
├── Middleware/          ← Service-specific middleware (if any)
├── Program.cs           ← Minimal API bootstrap, DI registrations
├── appsettings.json
├── appsettings.Development.json
└── Dockerfile
```

---

## Frontend Architecture: Feature Modules

Angular 21 uses standalone components (no NgModules). All pages are lazy-loaded.

### Routing Structure

```
/                        → features/home (lazy)
/search                  → features/catalog/plp (lazy) [?category&brand&price&sort&page]
/product/:id             → features/catalog/pdp (lazy)
/cart                    → features/cart (lazy)
/checkout                → features/checkout (lazy) [auth guard]
/orders                  → features/orders/list (lazy) [auth guard]
/orders/:id              → features/orders/detail (lazy) [auth guard]
/account                 → features/account (lazy) [auth guard]
/admin                   → features/admin (lazy) [admin role guard]
/login                   → features/auth/login (lazy)
/register                → features/auth/register (lazy)
```

### NgRx State Shape

```ts
AppState {
  auth: {
    user: User | null,
    accessToken: string | null,   // memory only — NEVER localStorage
    isLoading: boolean,
    error: string | null
  },
  cart: {
    items: CartItem[],
    coupon: Coupon | null,
    isLoading: boolean
  },
  catalog: {
    products: Product[],
    totalCount: number,
    filters: FilterState,
    sortBy: SortOption,
    isLoading: boolean
  },
  ui: {
    isGlobalLoading: boolean,
    snackbar: SnackbarState | null
  }
}
```

---

## Database Schemas (SQL Server — EF Core)

| Schema       | Tables |
|-------------|--------|
| `[auth]`    | Users, Roles, UserRoles, RefreshTokens, Addresses |
| `[catalog]` | Categories, Brands, Products, ProductVariants, ProductImages |
| `[commerce]`| Carts, CartItems, Wishlists, WishlistItems |
| `[orders]`  | Orders, OrderItems, OrderStatusHistory |
| `[payments]`| Payments, Refunds |
| `[admin]`   | Banners, Coupons, AuditLogs |

---

## API Port Map (Local Dev)

| Service          | Port  | Swagger URL                    |
|------------------|-------|-------------------------------|
| Auth.API         | 5001  | http://localhost:5001/swagger  |
| User.API         | 5002  | http://localhost:5002/swagger  |
| Catalog.API      | 5003  | http://localhost:5003/swagger  |
| Cart.API         | 5004  | http://localhost:5004/swagger  |
| Order.API        | 5005  | http://localhost:5005/swagger  |
| Admin.API        | 5009  | http://localhost:5009/swagger  |
| Angular SPA      | 4200  | http://localhost:4200          |
| SQL Server       | 1433  | —                              |

---

## Sequence Diagrams

### Login Flow

```mermaid
sequenceDiagram
    actor User
    participant Angular as Angular SPA<br/>(login.component)
    participant NgRx as NgRx Store<br/>(auth.effects)
    participant Auth as Auth.API<br/>:5001
    participant DB as SQL Server<br/>[auth] schema

    User->>Angular: Enter email + password, click Login
    Angular->>NgRx: dispatch AuthActions.login({ email, password })
    NgRx->>Auth: POST /api/v1/auth/login { email, password }
    Auth->>DB: SELECT user WHERE email = ?
    DB-->>Auth: User record
    Auth->>Auth: Verify password hash (Identity PasswordHasher)
    Auth->>Auth: Sign JWT RS256 (AccessToken 15 min)
    Auth->>DB: INSERT RefreshToken (7-day expiry)
    Auth-->>NgRx: 200 { accessToken, refreshToken, user }
    NgRx->>NgRx: dispatch AuthActions.loginSuccess
    NgRx->>NgRx: Store accessToken in memory (never localStorage)
    NgRx->>NgRx: Store refreshToken in httpOnly-style cookie
    NgRx-->>Angular: Auth state updated (isAuthenticated: true)
    Angular-->>User: Redirect to / (home)

    Note over Angular,Auth: On 401 — error.interceptor dispatches<br/>AuthActions.logout + "session expired" snackbar
```

---

### Place Order Flow

```mermaid
sequenceDiagram
    actor User
    participant Angular as Angular SPA<br/>(checkout.component)
    participant NgRx as NgRx Store<br/>(order.effects / cart.effects)
    participant Cart as Cart.API<br/>:5004
    participant Order as Order.API<br/>:5005
    participant DB as SQL Server<br/>[commerce] + [orders]

    User->>Angular: Fill address + payment, click Place Order
    Angular->>NgRx: dispatch OrderActions.placeOrder({ address, paymentMethod })
    NgRx->>Cart: GET /api/v1/cart (fetch current cart)
    Cart->>DB: SELECT CartItems WHERE UserId = ?
    DB-->>Cart: Cart with items + applied coupon
    Cart-->>NgRx: CartDto { items, subTotal, discountAmount, total }
    NgRx->>Order: POST /api/v1/orders { addressLine1, city, state, pincode, paymentMethod, couponCode }
    Order->>DB: SELECT CartItems for user (via shared DbContext)
    Order->>DB: INSERT Order + OrderItems (status = Placed)
    Order->>DB: DELETE CartItems for user (cart cleared)
    DB-->>Order: Order persisted
    Order-->>NgRx: 201 OrderDto { id, orderNumber, status: "Placed", total, items }
    NgRx->>NgRx: dispatch OrderActions.placeOrderSuccess
    NgRx->>NgRx: dispatch CartActions.clearCart (local state)
    NgRx-->>Angular: Navigate to /order-confirmed?orderId={id}
    Angular-->>User: Show order confirmation page with order number
```

---

## Decision Log

### Why JWT RS256 (over HS256)?

RS256 uses an asymmetric key pair: only Auth.API holds the **private key** (for signing), while all other microservices hold only the **public key** (for verification). This means a compromised Catalog.API or Cart.API cannot forge tokens — they can only verify them. With HS256 (symmetric), every service that verifies tokens also has the ability to forge them, which violates the principle of least privilege in a microservices architecture.

### Why NgRx (over component-level state or a simple service)?

Three things drove this decision:

1. **Cross-component auth state**: The header, cart icon, checkout guard, and wishlist button all need to react to the same auth status. Lifting state to a service with a BehaviorSubject works, but the Effect/Reducer model gives us a single auditable event log and deterministic state transitions.
2. **Optimistic UI + error rollback**: Cart add-to-cart dispatches optimistically and rolls back on API error via a single `catchError` in Effects — no component needs to manage loading/error flags.
3. **DevTools time-travel debugging**: NgRx DevTools make it trivial to replay sequences (login → add to cart → checkout) during development, which accelerates debugging of multi-step flows.

### Why Clean Architecture per microservice (over a flat project)?

Each microservice has Controllers → Services → Repositories → DTOs layers with clear dependency direction. The main benefit in practice was being able to unit-test Services in isolation using `InMemory` EF Core and `Moq` without needing a running database — as demonstrated by the 11 xUnit tests added in Phase 8. The downside is boilerplate per service, which is acceptable for a domain as large as an e-commerce marketplace.

### Why a shared SQL Server database (over per-service databases)?

Per-service databases (database-per-microservice) is the textbook microservices pattern but adds significant operational overhead: multiple connection strings, cross-service joins via API calls, eventual consistency management. For a clone project running on a single developer machine, a single SQL Server instance with per-domain schemas (`[auth]`, `[catalog]`, `[commerce]`, `[orders]`, `[admin]`) gives schema isolation without the operational complexity. Migration to per-service databases in Phase 5+ is feasible by splitting the shared `TataCliq.Infrastructure` DbContext.

---

## Naming Conventions

### C# / .NET
- Classes: `PascalCase`
- Interfaces: `IPascalCase`
- Methods: `PascalCase`
- Private fields: `_camelCase`
- DTOs: `<Resource>RequestDto`, `<Resource>ResponseDto`
- Controllers: `<Resource>Controller`

### Angular / TypeScript
- Components: `kebab-case.component.ts` → class `KebabCaseComponent`
- Services: `kebab-case.service.ts` → class `KebabCaseService`
- NgRx actions: `[Feature] Action Name` string, camelCase creator name
- Interfaces/Models: `PascalCase` (e.g. `Product`, `CartItem`)
- No `any` — use typed models or `unknown`

### Database
- Tables: `PascalCase` singular (e.g. `Product`, `OrderItem`)
- Columns: `PascalCase`
- Indexes: `IX_<Table>_<Column>`
- Foreign keys: `FK_<ChildTable>_<ParentTable>_<Column>`
