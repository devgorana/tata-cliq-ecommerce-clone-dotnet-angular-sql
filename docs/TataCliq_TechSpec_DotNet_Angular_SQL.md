 

**TECHNICAL SPECIFICATION DOCUMENT**

**Tata CLiQ E-Commerce Platform — Full-Stack Clone**

.NET Core  ·  Angular  ·  SQL Server  ·  Azure

 

| Document Type | Technical Specification — Vibe Coding Build |
| :---- | :---- |
| **Project Code** | ECM-TCLIQ-2026-001 |
| **Version** | v1.0 — Initial Release |
| **Date** | May 2026 |
| **Stack** | .NET Core 10 · Angular 21 · TypeScript · SQL Server · Azure |
| **Approach** | Vibe Coding via Claude Code |
| **Status** | FINAL — Approved for Development |
| **Classification** | CONFIDENTIAL — Internal Use Only |

ECM-TCLIQ-2026-001  |  E-Commerce Platform Technical Specification  |  CONFIDENTIAL

 

# **1\. Introduction & Purpose**

This Technical Specification Document (TSD) translates the Statement of Work (SOW) for the Tata CLiQ E-Commerce Clone into a concrete, developer-ready blueprint. It defines every architectural decision, data model, API contract, component hierarchy, and phase-by-phase build sequence required to deliver a production-grade multi-category retail marketplace.

The build uses .NET Core 10 for backend microservices, Angular 21 for the single-page application frontend, and SQL Server 2022 as the primary relational database — all hosted on Microsoft Azure. The Vibe Coding approach powered by Claude Code compresses development timelines by 40–60% while maintaining production-quality output.

## **1.1 Document Scope**

This specification covers two interleaved layers of detail:

•       Functional Architecture: What the platform does — every user-facing feature including authentication, catalog, cart, checkout, order management, promotions, admin CMS, and seller portal.

•       Vibe Coding Implementation Blueprint: How the platform is built — the Claude Code phase structure, CLAUDE.md rule system, prompt discipline, and component patterns.

 

## **1.2 Reference Documents**

| Document | Key Contribution |
| :---- | :---- |
| TataCLiQ\_SOW.docx | All functional scope, milestones, commercial terms, and NFRs |
| bookingclonetechspec.pdf | Vibe Coding methodology template — Claude Code phase structure, CLAUDE.md system, design tokens |

 

 

# **2\. Vibe Coding Methodology with Claude Code**

Vibe Coding is a prompt-driven development paradigm where Claude Code acts as the primary code generator, and human engineers act as architects, reviewers, and orchestrators. The methodology is structured around a CLAUDE.md control file, phase-gated prompts, and a strict review-before-run discipline.

## **2.1 Core Principles**

| Principle | Implementation Rule |
| :---- | :---- |
| One component per prompt | Never ask Claude to generate more than one controller, service, component, or module per prompt. Broad prompts produce half-correct outputs. |
| CLAUDE.md-first | CLAUDE.md is auto-read at every Claude Code session start. Contains approved stack, code rules, design tokens, forbidden libraries, and current phase. Must be authored before any code generation. |
| Review before run | Every generated file must be reviewed before dotnet run or ng serve. AI-generated code is treated as a PR from a junior developer. |
| Commit at every milestone | A git commit is required at every deliverable milestone to prevent a single bad prompt from wiping hours of working code. |
| Phase gating | V2 libraries (Azure Service Bus, Stripe, SignalR, etc.) are listed in CLAUDE.md but gated. Claude must never install them before the phase that introduces them. |
| Mobile-first always | Every Angular component prompt must include responsive breakpoints using Tailwind or Angular CDK breakpoints. Desktop-only layouts are project failures, not polish items. |

 

## **2.2 CLAUDE.md Control File**

The CLAUDE.md file is the single most critical project artefact. It is auto-read at the start of every Claude Code session and prevents context drift across all phases and all developers.

| \# CLAUDE.md — Tata CLiQ E-Commerce Clone (.NET / Angular / SQL) \# Read this file at the start of every Claude Code session.   \#\# Project Multi-category retail marketplace clone of Tata CLiQ. Angular 21 SPA · .NET Core 10 Web API · SQL Server 2022 · Azure.   \#\# Approved Stack \#\#\# V1 — Frontend (Phases 0–2) @angular/core@21, @angular/router, @angular/forms, @angular/material, rxjs@7, @ngrx/store@21, @ngrx/effects, tailwindcss@3, lucide-angular \#\#\# V1 — Backend (Phases 1–2) dotnet@10, Microsoft.EntityFrameworkCore, EF Core SQL Server, AutoMapper, FluentValidation, Serilog, Swagger/OpenAPI, Microsoft.AspNetCore.Identity \#\#\# V2 — Cloud Scale (Phase 3+  — do NOT use before Phase 3\) Azure Service Bus, Azure Blob Storage, Azure Redis Cache, Azure Cognitive Search, Razorpay SDK, Azure Application Insights, Microsoft.Azure.OpenAI \#\# Design Tokens primary-navy: \#1A1A6B | accent-red: \#E4002B | bg: \#F5F5F5 \#\# Code Rules \- TypeScript strict mode — no \`any\` anywhere in Angular code \- C\# nullable reference types enabled — no \#nullable disable \- No HttpClient calls in Angular components — use Services only \- EF Core — no raw SQL queries; use Migrations for all schema changes \- One component per file, one responsibility per controller \#\# Current Phase: Phase 0 — Project Documents |
| :---- |

 

## **2.3 Version Philosophy: V1 vs V2**

| Dimension | V1 — Showcase Build | V2 — Production Extension |
| :---- | :---- | :---- |
| **Goal** | Demo-ready Angular SPA with mock catalog data | Real backend, auth, payments, live inventory |
| **Data** | 100% mock — TypeScript constants (50 products) | Live SQL Server / MongoDB, real SKU inventory |
| **Auth** | Bypassed — guest session assumed | Full JWT \+ OTP \+ Google OAuth (.NET Identity) |
| **Payments** | Simulated — Order Placed confirmation screen | Razorpay integration, real UPI/card/EMI flows |
| **AI Features** | None in V1 | Azure OpenAI — smart search, product summaries, recommendations |
| **Team** | 2–3 developers across 7 phases (\~2 weeks) | Full squad, 36-week multi-sprint delivery |

 

 

# **3\. Design System & Tokens**

All UI components across every phase must apply these design tokens consistently. Tokens are registered in tailwind.config.ts in Phase 1 and documented in docs/DESIGN.md before any Angular component is written.

## **3.1 Color Tokens**

| Token Name | Hex Value | CSS Variable | Usage |
| :---- | :---- | :---- | :---- |
| **Primary Navy** | \#1A1A6B | \--color-navy | Header, mega-menu, primary CTAs, review badges |
| **Accent Red** | \#E4002B | \--color-red | Sale labels, promo badges, Flash Sale timers |
| **CTA Blue** | \#0071C2 | \--color-blue | Add to Cart, Buy Now, secondary CTA hover states |
| **Background** | \#F5F5F5 | \--color-bg | Page background, PLP sidebar |
| **Card White** | \#FFFFFF | \--color-card | All card surfaces, modals, drawers |
| **Text Dark** | \#212121 | \--color-text | All body copy, product names, headings |
| **Text Muted** | \#757575 | \--color-muted | Labels, secondary text, breadcrumbs, captions |
| **CLiQ Cash Gold** | \#F9A825 | \--color-gold | Loyalty wallet balance, reward point displays |
| **Success Green** | \#2E7D32 | \--color-success | Order delivered, stock available, payment success |

 

## **3.2 Responsive Breakpoints**

| Breakpoint | Range | Layout Behaviour |
| :---- | :---- | :---- |
| Mobile S (default) | 320px – 479px | Single column, bottom nav bar, stacked product cards |
| Mobile L (sm:) | 480px – 767px | Single column, 2-column product grid option |
| Tablet (md:) | 768px – 1023px | Top nav, 3-column grid, side filter drawer, expanded PDP |
| Laptop (lg:) | 1024px – 1279px | Full mega-menu, 4-column grid, sticky filter sidebar |
| Desktop (xl:) | 1280px – 1439px | Full layout, 4–5 column grid, extended hero carousel |
| Wide (2xl:) | 1440px+ | Max-width 1440px centred; ambient gutter space used |

 

 

# **4\. Technology Stack**

## **4.1 Frontend — Angular 21 SPA (V1: Phases 0–2)**

| Layer | Technology | Version | Rationale |
| :---- | :---- | :---- | :---- |
| Framework | Angular | 17 | Component-based SPA; SSR with Angular Universal for PLP/PDP; built-in routing |
| Language | TypeScript | 5+ | Type-safe components, services, and API DTOs; strict mode enforced |
| Styling | Tailwind CSS \+ SCSS | 3+ | Utility-first responsive styling; design token support; scoped component styles |
| Component Library | Angular Material | 17 | Polished accessible UI kit; consistent theming with CDK |
| Icons | Lucide Angular | Latest | Consistent icon set with typed imports; tree-shakeable |
| State Management | NgRx Store \+ Effects | 17+ | Redux pattern for cart, filters, auth; devtools integration |
| HTTP Layer | Angular HttpClient \+ Interceptors | 17 | JWT token injection; global error handling; retry logic |
| Routing | Angular Router | 17 | Lazy-loaded feature modules; route guards; resolver-based data fetching |
| Forms | Reactive Forms | 17 | Checkout, auth, address forms; FluentValidation-compatible error mapping |
| Hosting | Azure Static Web Apps | — | One-command deploy; API integration; custom domain \+ HTTPS |

 

## **4.2 Backend — .NET Core 10 Web API (V1: Phases 1–2)**

| Layer | Technology | Purpose |
| :---- | :---- | :---- |
| Runtime | .NET 10 (LTS) | Cross-platform; minimal APIs \+ controller-based routing; native AOT support |
| API Framework | ASP.NET Core Web API | RESTful APIs; controller/service/repository pattern; attribute-based routing |
| ORM | Entity Framework Core 8 | Code-first migrations; LINQ queries; relationship mapping; change tracking |
| Auth | ASP.NET Core Identity \+ JWT | User management; password hashing; JWT RS256 access tokens; refresh token rotation |
| Validation | FluentValidation | Request DTO validation; custom rules; async validators for uniqueness checks |
| Mapping | AutoMapper | DTO ↔ Entity mapping; profile-based configuration; projection queries |
| API Docs | Swashbuckle / OpenAPI 3 | Auto-generated Swagger UI at /swagger; DTO schema generation |
| Logging | Serilog \+ Azure App Insights | Structured logging; correlation IDs; distributed tracing in V2 |
| Testing | xUnit \+ Moq \+ TestServer | \> 80% unit \+ integration test coverage; in-memory EF Core for unit tests |

 

## **4.3 Database — SQL Server 2022 (Primary) \+ Supporting Stores**

| Store | Technology | Responsibilities |
| :---- | :---- | :---- |
| Primary DB | SQL Server 2022 (Azure SQL) | Users, Orders, Payments, Inventory, Addresses; EF Core migrations; Always Encrypted for PII |
| Catalog DB | Azure Cosmos DB for MongoDB API | Flexible product schemas; variant attributes; rich media metadata; geo-replication |
| Cache | Azure Cache for Redis 7 | Session state; rate limiting; cart state (cross-device); search result caching; 15-min TTL |
| Search | Azure Cognitive Search | Full-text, faceted filtering, autocomplete, synonyms, fuzzy matching; semantic ranking |
| File Storage | Azure Blob Storage \+ Azure CDN | Product images, seller assets, PDF invoices; LQIP strategy; lifecycle management |
| Message Bus | Azure Service Bus (queues \+ topics) | Async order events; notification fan-out; Cosmos DB change feed integration |

 

## **4.4 V2 Cloud & Microservices Stack (Phase 3+ — DO NOT install before Phase 3\)**

| Layer | Technology & Notes |
| :---- | :---- |
| Payments | Razorpay SDK (.NET) \+ PayU failover; webhook reconciliation; COD; BNPL; PCI-DSS tokenised storage |
| Notifications | Azure Communication Services (email/SMS); FCM (push); WhatsApp via partner API; per-user preferences |
| AI / ML | Azure OpenAI (GPT-4o) \+ Azure Cognitive Search semantic ranking — product summaries, smart search, personalised feeds |
| Monitoring | Azure Application Insights APM \+ Sentry \+ Azure Monitor — distributed traces, error tracking, SLA alerting |
| IaC | Bicep / Terraform (Azure) — all Azure resources version-controlled; AKS, Azure SQL, CDN, App Gateway |
| CI/CD | GitHub Actions → Azure Container Registry → Azure Kubernetes Service — blue/green deployments; lint → test → deploy |

 

 

# **5\. Database Architecture & Schema**

The primary database is SQL Server 2022 (Azure SQL Hyperscale) managed entirely through Entity Framework Core Code-First migrations. All schema changes must be committed as EF Core migration files — direct ALTER TABLE statements against the production database are strictly forbidden.

## **5.1 Entity Relationship Overview**

The SQL Server schema is organised into six bounded-context schemas that mirror the microservice boundaries:

•       \[auth\] 	— Users, Roles, RefreshTokens, UserSessions

•       \[catalog\]  — Products, Variants, Categories, Brands (V1 mock; V2 Cosmos DB for catalog)

•       \[commerce\] — Cart, CartItems, Wishlists, WishlistItems

•       \[orders\]   — Orders, OrderItems, OrderStatusHistory, DeliveryTracking

•       \[payments\] — Payments, Refunds, TokenisedCards, CLiQCashLedger

•       \[admin\]	— Banners, Coupons, SellerProfiles, AuditLogs

 

## **5.2 Core SQL Server Tables (EF Core Code-First)**

**Users Table — \[auth\].\[Users\]**

| Column | SQL Type | Constraints | Notes |
| :---- | :---- | :---- | :---- |
| Id | UNIQUEIDENTIFIER | PK, DEFAULT NEWID() | Maps to Guid in C\# entity |
| Email | NVARCHAR(256) | UNIQUE, NOT NULL | Lowercase-normalised; used as username |
| PasswordHash | NVARCHAR(MAX) | NOT NULL | ASP.NET Core Identity Argon2id hash |
| PhoneNumber | VARCHAR(15) | NULLABLE | E.164 format; used for OTP auth |
| FirstName | NVARCHAR(100) | NOT NULL |   |
| LastName | NVARCHAR(100) | NOT NULL |   |
| IsEmailVerified | BIT | NOT NULL, DEFAULT 0 | Set true after OTP / magic-link flow |
| CliqCashBalance | DECIMAL(18,2) | NOT NULL, DEFAULT 0 | Loyalty wallet; updated via CLiQCashLedger |
| CreatedAt | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | UTC timestamp |
| UpdatedAt | DATETIME2 | NOT NULL | Updated by EF Core SaveChanges interceptor |
| IsDeleted | BIT | NOT NULL, DEFAULT 0 | Soft delete; GDPR right-to-erasure sets TRUE |

 

**Orders Table — \[orders\].\[Orders\]**

| Column | SQL Type | Constraints | Notes |
| :---- | :---- | :---- | :---- |
| Id | UNIQUEIDENTIFIER | PK |   |
| OrderNumber | VARCHAR(30) | UNIQUE, NOT NULL | Format: CLQ-YYYYMMDD-XXXXXXXX |
| UserId | UNIQUEIDENTIFIER | FK → auth.Users | Indexed; nullable for guest checkout |
| Status | TINYINT | NOT NULL | Enum: 0=Placed 1=Confirmed 2=Packed 3=Shipped 4=OutForDelivery 5=Delivered 6=Completed |
| Subtotal | DECIMAL(18,2) | NOT NULL | Sum of OrderItems.SalePrice |
| TotalDiscount | DECIMAL(18,2) | NOT NULL, DEFAULT 0 | Coupon \+ CLiQ Cash deduction |
| DeliveryCharge | DECIMAL(18,2) | NOT NULL, DEFAULT 0 | 0 if free shipping threshold met |
| GstAmount | DECIMAL(18,2) | NOT NULL | Calculated at line-item level; summed here |
| NetPayable | DECIMAL(18,2) | NOT NULL | Subtotal \- TotalDiscount \+ DeliveryCharge \+ GstAmount |
| DeliveryAddressId | UNIQUEIDENTIFIER | FK → auth.Addresses | Snapshot copied to OrderDeliveryAddress on place |
| PlacedAt | DATETIME2 | NOT NULL | UTC; indexed for reporting queries |
| DeliveredAt | DATETIME2 | NULLABLE | Set by logistics webhook |

 

## **5.3 EF Core Migration Strategy**

| Rule | Detail |
| :---- | :---- |
| Migration naming | dotnet ef migrations add \<Phase\>\_\<Context\>\_\<Change\> — e.g. Phase1\_Auth\_AddUsers |
| Never edit applied migrations | Create a new corrective migration instead; never manually edit migration files in source control |
| Seed data | Use IEntityTypeConfiguration\<T\>.HasData() for static lookup data (Roles, Categories) |
| Indexes | Declare via HasIndex() in Fluent API; never add via raw SQL; include common query patterns |
| Computed columns | Use HasComputedColumnSql() for derived fields (e.g. DiscountPercent) |
| Soft deletes | Implement via global query filter: modelBuilder.Entity\<T\>().HasQueryFilter(e \=\> \!e.IsDeleted) |
| Audit fields | Use SaveChangesInterceptor to auto-set CreatedAt / UpdatedAt on all entities |
| Concurrency | Add RowVersion byte\[\] with IsRowVersion() on all high-contention entities (Cart, Inventory) |

 

 

# **6\. Backend API Architecture — .NET Core 10**

The backend is organised as a Clean Architecture solution with 10 independently deployable .NET Core Web API projects. All services share a common NuGet package (TataCliq.SharedKernel) containing base entities, result types, and middleware. Communication between services is via Azure Service Bus for async events and direct HTTP calls (via Refit) for synchronous queries.

## **6.1 Solution Structure**

| tatacliq-clone.sln ├── src/ │   ├── Services/ │   │   ├── TataCliq.Auth.API/            ← Auth microservice │   │   ├── TataCliq.User.API/            ← User profile, addresses, wishlist │   │   ├── TataCliq.Catalog.API/         ← Products, categories, brands │   │   ├── TataCliq.Search.API/          ← Azure Cognitive Search integration │   │   ├── TataCliq.Cart.API/            ← Cart, coupon validation, CLiQ Cash │   │   ├── TataCliq.Order.API/           ← Order lifecycle, tracking, invoices │   │   ├── TataCliq.Payment.API/         ← Razorpay, webhooks, refunds │   │   ├── TataCliq.Notification.API/   ← Email, SMS, push, WhatsApp │   │   ├── TataCliq.Seller.API/          ← KYC, inventory, payouts │   │   └── TataCliq.Admin.API/           ← CMS, coupons, reporting │   ├── Shared/ │   │   ├── TataCliq.SharedKernel/        ← Base entities, Result\<T\>, exceptions │   │   └── TataCliq.Infrastructure/     ← EF Core DbContext, Redis, Blob, Bus │   └── Frontend/                     	← Angular 21 SPA (separate repo or workspace) ├── tests/                            	← xUnit integration \+ unit tests ├── infra/                            	← Bicep / Terraform Azure IaC ├── CLAUDE.md                         	← Project rules (≤350 lines) └── docker-compose.yml               	← Local dev: SQL Server \+ Redis \+ all APIs |
| :---- |

 

## **6.2 Microservice Breakdown**

| Service | Database | Responsibilities |
| :---- | :---- | :---- |
| TataCliq.Auth.API | SQL Server \[auth\] | JWT RS256 issuance, OTP (MSG91), Google/Facebook OAuth, ASP.NET Identity, refresh token rotation, multi-device logout |
| TataCliq.User.API | SQL Server \[auth\] | User profile CRUD, address book, wishlist, notification preferences, CLiQ Cash balance, GDPR right-to-erasure |
| TataCliq.Catalog.API | Cosmos DB \+ SQL Server \[catalog\] | Products, categories, brands, variant management, media pipeline (Azure Blob), bulk CSV import, authenticity badge |
| TataCliq.Search.API | Azure Cognitive Search | Index management, full-text DSL, faceted filtering, autocomplete, fuzzy matching, voice search, search analytics |
| TataCliq.Cart.API | Azure Redis Cache | Persistent cart (cross-device sync), guest cart \+ login merge, real-time price recalculation, coupon validation |
| TataCliq.Order.API | SQL Server \[orders\] | Order state machine (7 states), split shipments, cancellation, returns, GST PDF invoice, Shiprocket/Delhivery integration |
| TataCliq.Payment.API | SQL Server \[payments\] | Razorpay orchestration, PayU failover, webhook handling, refund reconciliation, COD, BNPL, PCI-DSS tokenised card storage |
| TataCliq.Notification.API | Azure Service Bus consumer | Email (Azure Comms), SMS (MSG91), push (FCM), WhatsApp fan-out; per-channel per-event preference enforcement |
| TataCliq.Seller.API | SQL Server \[admin\] | KYC onboarding, GST/MSME verification, product listing, inventory, fulfilment dashboard, settlement payout, analytics |
| TataCliq.Admin.API | SQL Server \[admin\] | CMS APIs (banners, modals, promotions), reporting aggregations, user management, coupon engine, order operations, GDPR export |

 

## **6.3 API Security Architecture**

•       All microservices deployed in private Azure VNet subnets — only Azure API Management (APIM) is publicly exposed.

•       JWT RS256 asymmetric signing — public keys distributed to all services; private key held only by Auth.API.

•       Access token: 15-minute expiry, returned in response body; Angular stores in NgRx memory only — never localStorage (XSS safe).

•       Refresh token: 7-day expiry, httpOnly cookie only — never in response body. Redis-based revocation list for logout.

•       Azure API Management WAF: rate limiting, bot detection, IP reputation block-lists on all public endpoints.

•       Azure Key Vault: all credentials exclusively via Key Vault references — zero plaintext environment variables in containers.

•       RBAC: fine-grained permission scopes for Admin, Seller, Support Agent, and Customer roles via ASP.NET Core policy-based auth.

 

 

# **7\. Frontend Component Specification — Angular 21**

Every component below must be generated by Claude Code as a single file with a single responsibility. Claude must read docs/skills/angular.md before writing any component. No component prompt should request more than one component. All components use OnPush change detection and standalone component pattern (Angular 21+).

## **7.1 Layout Components**

| Component File | Key Behaviour & Rules |
| :---- | :---- |
| layout/header.component.ts | sticky top-0 z-50 bg-primary-navy. Logo left, mega-menu nav centre, search bar \+ cart badge \+ wishlist count \+ profile menu right. Mobile: hamburger collapse (aria-label set). Sticky add-to-cart notification strip when item added. Standalone component. |
| layout/mega-menu.component.ts | Dropdown on hover/focus. Categories: Fashion, Electronics, Luxury, Home. Brand spotlights per category. WCAG keyboard navigable — full tab/arrow key support via Angular CDK FocusTrap. |
| layout/footer.component.ts | 4-column links grid (Help, Policies, Categories, About). App download CTAs. Social icons. Newsletter signup reactive form. bg-primary-navy text-white. |
| layout/bottom-nav.component.ts | Mobile only (md:hidden). 5 items: Home, Categories, Search, Wishlist, Account. Active state via RouterLinkActive. Fixed bottom-0. Thumb-zone placement. |

 

## **7.2 Homepage Components**

| Component File | Key Behaviour & Rules |
| :---- | :---- |
| home/hero-carousel.component.ts | CMS-managed slides from NgRx store. Auto-play 4s via RxJS interval. Swipe support (HammerJS). Pause on hover. Dot indicators. Lazy-load images with LQIP placeholders. Uses AsyncPipe only — no subscribe() in component class. |
| home/category-banners.component.ts | 4 category tiles: Fashion, Electronics, Luxury, Home. Each links to /search?category=X via RouterLink. Hover overlay animation (200ms). Mobile: horizontal scroll with CSS scroll-snap. |
| home/flash-sale.component.ts | Countdown timer (HH:MM:SS) via RxJS timer. Limited quantity progress bar. Horizontal product scroll. Only renders if sale is active (endTime \> now). accent-red theme. |
| home/promo-banners.component.ts | CLiQ Cash loyalty strip. 4 deal cards. Brand spotlights section. Trending Now horizontal scroll. All data from NgRx store selectors. |

 

## **7.3 Product Listing Page (PLP) Components**

| Component File | Key Behaviour & Rules |
| :---- | :---- |
| catalog/product-card.component.ts | 200px image (object-cover). Brand name above product name. Star rating row. Discount badge (accent-red). Original MRP strikethrough \+ sale price. Wishlist heart toggle (aria-label). Add to Cart on hover. hover:shadow-md 200ms transition. Standalone; OnPush. |
| catalog/filter-sidebar.component.ts | sticky top-20. Sections: Price range slider (Angular CDK), Brand checkboxes, Size pills, Colour swatches, Rating, Discount %, Material, Gender. All dispatch NgRx filter actions. 'Clear all' resets store AND visual states. Mobile: Angular CDK overlay drawer. |
| catalog/applied-filters.component.ts | Chips for each active filter. Individual × removal. 'Clear All' button. Dispatches filter removal actions to NgRx. Animates in/out via Angular animations. |
| catalog/sort-dropdown.component.ts | Angular Material Select. Options: Recommended, Price Low–High, Price High–Low, Newest Arrivals, Top Rated, Highest Discount. Dispatches setSortBy action. Persists via Angular Router query params. |
| catalog/results-grid.component.ts | Count badge. Grid/List view toggle. \*ngFor over filteredProducts$ observable. Empty state with category links. Infinite scroll via IntersectionObserver directive. Skeleton via @angular/material skeleton. Quick-view modal via Angular CDK Dialog. |

 

 

# **8\. Project Directory Structure**

Developers must not deviate from this structure. Claude Code prompts must reference file paths exactly as specified here.

| tatacliq-clone/ ├── CLAUDE.md                 	← Project rules (≤350 lines). Auto-read by Claude Code. ├── TODO.md                   	← Phase checklist, assumptions, blocked items ├── TASK-TRACKER.md           	← Per-file generation log; mark \[\~\] starting, \[x\] done ├── .env.example              	← All required environment variables ├── docker-compose.yml        	← SQL Server \+ Redis \+ all APIs \+ Angular (local dev) ├── docs/ │   ├── DESIGN.md             	← Full design system (authored by UI/UX lead in Phase 0b) │   ├── ARCHITECTURE.md       	← Module structure \+ decisions (authored in Phase 1\) │   └── skills/ │   	├── angular.md        	← Angular component \+ service patterns (Phase 2\) │   	├── dotnet.md         	← .NET Core controller \+ entity patterns (Phase 2\) │   	└── subagents.md      	← Parallel task coordination (Phase 3\) ├── frontend/                 	← Angular 21 SPA │   ├── src/ │   │   ├── app/ │   │   │   ├── core/         	← Auth guards, HTTP interceptors, app config │   │   │   ├── shared/       	← Shared components, pipes, directives │   │   │   ├── features/     	← Lazy-loaded feature modules (home, catalog, cart...) │   │   │   └── store/        	← NgRx root store, actions, reducers, selectors, effects │   │   ├── assets/           	← Images, icons, fonts │   │   └── environments/     	← environment.ts, environment.prod.ts │   ├── angular.json │   └── tailwind.config.ts    	← Design tokens registered here ├── backend/                  	← .NET Core solution │   ├── tatacliq-clone.sln │   ├── src/ │   │   ├── Services/         	← 10 .NET Web API projects │   │   └── Shared/           	← SharedKernel, Infrastructure │   └── tests/                	← xUnit test projects ├── infra/                    	← Bicep / Terraform Azure IaC (Phase 4\) └── .github/workflows/        	← GitHub Actions CI/CD (Phase 5\) |
| :---- |

 

 

# **9\. Vibe Coding Phase Plan**

Each phase produces a committed, runnable deliverable. Every phase prompt is a single copyable block stored in MASTER-PROMPT.md. The developer copies the prompt for their phase, pastes it into Claude Code, attaches the input file noted, and reviews all output before running.

## **9.1 Phase Overview**

| Phase | Owner | Goal | Required Input | Output |
| :---- | :---- | :---- | :---- | :---- |
| 0a | Project Lead | Generate CLAUDE.md, TODO.md, TASK-TRACKER.md | Attach this TSD in Claude Code | Project tracking files |
| 0b | UI/UX Lead | Register design system tokens in tailwind.config.ts and CLAUDE.md | Commit docs/DESIGN.md to repo | CLAUDE.md updated with design reference |
| 1 | Developer A | Scaffold Angular SPA \+ .NET Core solution: types, mock data, NgRx stores, routing, config | Commit docs/ARCHITECTURE.md | Types, mock catalog (50 products), NgRx stores, Next.js routing, EF Core DbContext |
| 2 | Developer B | Build all Angular components and pages (Homepage, PLP, PDP, Cart, Checkout) \+ .NET API stubs | Commit docs/skills/angular.md \+ dotnet.md | Fully navigable V1 SPA \+ Swagger UI; Azure Static Web Apps deploy |
| 3 | Developer C | Build all .NET Core microservices; wire Angular to real APIs; Docker Compose full-stack | Commit docs/skills/dotnet.md \+ subagents.md | Full-stack app running via Docker Compose |
| 4a | Developer D | Admin CMS and Seller Portal (Angular \+ Admin.API \+ Seller.API) | Phase 3 backend running locally | Admin panel \+ Seller portal on staging |
| 4b | DevOps Lead | Azure OpenAI integration \+ Bicep/Terraform Azure deployment | Fill Azure target fields in prompt | Live app on Azure with AI features |
| 5 | QA Lead | QA, performance optimisation, security audit | Staging environment fully deployed | QA reports; VAPT sign-off; Core Web Vitals green |

 

## **9.2 Developer-Authored Files (Claude Does NOT Generate These)**

| File | Phase | Author | Contents |
| :---- | :---- | :---- | :---- |
| docs/DESIGN.md | 0b | UI/UX Lead | Component specs, colour tokens, spacing, typography, Angular Material theming, responsive breakpoints, accessibility requirements |
| docs/ARCHITECTURE.md | 1 | Architect | Full folder structure, module boundaries, naming conventions, EF Core schema decisions, Azure service communication patterns |
| docs/skills/angular.md | 2 | Lead Dev | Angular component patterns, NgRx conventions, Angular Material usage rules, standalone vs NgModule, OnPush change detection rules |
| docs/skills/dotnet.md | 2 | Lead Dev | Clean Architecture layers, controller/service/repository pattern, EF Core entity conventions, DTO/AutoMapper rules, FluentValidation setup |
| docs/skills/subagents.md | 3 | Lead Dev | Which microservice modules can be built in parallel, how to coordinate outputs, dependency ordering |

 

 

# **10\. Delivery Timeline & Milestones**

Total estimated duration: 36 weeks (\~9 months) from project kick-off. Timeline assumes prompt client feedback within 5 business days per review cycle and no scope changes post Phase 0 lock.

| Phase | Schedule | Scope | Key Deliverable |
| :---- | :---- | :---- | :---- |
| Phase 0 | Weeks 1–2 | Discovery, architecture, CLAUDE.md authoring, design system, DB schema, EF Core migrations, API contracts, Azure environment setup | CLAUDE.md, API Contracts, EF Core ERD, Design System, Angular workspace scaffold |
| Phase 1 | Weeks 3–8 | Auth.API \+ User.API (.NET Core Identity \+ JWT), SQL Server schema (EF Core), Angular SPA scaffold, Angular Material theming, NgRx root store, homepage skeleton, GitHub Actions CI/CD, Bicep IaC | Auth API, User API, SQL Server schema, Dev \+ Staging Environments |
| Phase 2 | Weeks 9–16 | Catalog.API, SQL Server product schema \+ Cosmos DB, Azure Cognitive Search indexing, PLP with full Angular filter/sort, PDP with all Angular components, Azure CDN pipeline, Cart.API, Wishlist module | PLP, PDP, Search, Cart — Fully Functional on Azure Staging |
| Phase 3 | Weeks 17–22 | Complete Angular checkout flow, Razorpay \+ PayU integration via Payment.API, Order.API state machine, Logistics webhook, Notification.API (Azure Comms \+ FCM), order tracking page | End-to-End Checkout and Order Flow on Azure Staging |
| Phase 4 | Weeks 23–27 | Admin CMS Angular dashboard (Admin.API), Seller portal (Seller.API), reporting dashboards, Azure OpenAI integration — product summaries \+ smart search | Admin Panel, Seller Portal, AI Features on Azure Staging |
| Phase 5 | Weeks 28–30 | Coupon engine, CLiQ Cash loyalty module, referral programme, personalised product feeds (Azure Personalizer), A/B testing framework | Promotions Engine and Loyalty Module Complete |
| Phase 6 | Weeks 31–34 | Full regression suite, Playwright E2E automation, k6 load test at 10K concurrent, OWASP penetration test, Core Web Vitals optimisation (Angular SSR / Universal), WCAG audit | QA Reports, VAPT Sign-off, Performance Baseline |
| Phase 7 | Weeks 35–36 | Client UAT on staging, dedicated bug-fix sprint, blue/green Azure deployment, DNS cutover, 24/7 hypercare monitoring for 2 weeks post-launch | Production Go-Live — Platform Live |

 

 

# **11\. Non-Functional Requirements**

## **11.1 Performance Targets**

| Category | Target | Implementation Strategy |
| :---- | :---- | :---- |
| LCP (Largest Contentful Paint) | \< 2.5s on 4G mobile | Angular Universal SSR \+ LQIP \+ Azure CDN \+ image optimisation (WebP, responsive srcset) |
| INP (Interaction to Next Paint) | \< 200ms | OnPush change detection; minimal zone.js triggers; NgRx memoised selectors; virtual scroll for long lists |
| CLS (Cumulative Layout Shift) | \< 0.1 | Fixed image dimensions; Angular CDK skeleton loaders; no FOUT via preloaded custom fonts |
| API Response (p95) | \< 300ms normal / \< 800ms peak | Azure Redis caching on catalog, cart, search; EF Core compiled queries; Azure SQL read replicas |
| Concurrent Users | 10,000 at launch → 100,000+ auto-scale | Azure AKS Horizontal Pod Autoscaler on CPU/memory thresholds; Azure SQL Hyperscale |
| Uptime SLA | 99.9% (\< 8.76 hrs downtime/year) | Multi-region Azure deployment; AKS health probes; blue/green deployments; Azure Monitor alerts |

 

## **11.2 Security Requirements**

| Requirement | Implementation |
| :---- | :---- |
| PCI-DSS Level 1 | Tokenised card storage via Razorpay — no raw PAN stored in SQL Server. SAQ-D completed. QSA auditor engaged by Week 8\. |
| OWASP Top 10 | Full remediation required before production go-live. Penetration test by certified VAPT consultant in Phase 6\. |
| Data Encryption | SQL Server Always Encrypted for PII columns (Email, Phone). Azure Blob Storage encryption at rest. TLS 1.3 for all traffic. |
| Access Tokens | JWT RS256. 15-minute expiry. Stored in NgRx memory only — never localStorage or sessionStorage. XSS safe. |
| Refresh Tokens | 7-day expiry. httpOnly cookie only. Rotated on every use. Azure Redis revocation list for logout across all devices. |
| PDPB / GDPR | Data minimisation. Right-to-erasure endpoint on User.API. Audit log via SQL Server Temporal Tables. Export user data on request. |

 

 

# **12\. Vibe Coding Pitfalls & Guards**

Every developer must read this section before beginning their phase.

| Pitfall | What Happens | Prevention |
| :---- | :---- | :---- |
| Prompt too broad | Claude generates 8 files, half incorrect structure | One component / one controller per prompt. Always. No exceptions. |
| Skipping CLAUDE.md | Claude installs wrong libraries, uses class components, adds unwanted NuGet packages | Invest 20 minutes in CLAUDE.md before first prompt. It is the most important file. |
| Not reviewing before running | Runtime errors crash the live demo or staging environment | Read every generated file before dotnet run or ng serve. Treat output as a junior dev PR. |
| No commit checkpoints | One bad prompt wipes hours of working code with no recovery | Commit at every deliverable milestone. No exceptions. |
| Access token in localStorage | XSS vulnerability exposes user sessions | Enforce NgRx memory-only in CLAUDE.md and Phase 3 prompt explicitly. |
| V2 libraries added too early | Azure Service Bus errors, broken Docker builds, EF Core migration conflicts | List V2 stack in CLAUDE.md with explicit 'Do not use before Phase 3' gate. |
| Claude refactors working code | Renames Angular modules, breaks adjacent components silently | Append 'do not modify anything else' to every prompt. |
| Mobile not tested | Desktop Angular looks great; mobile broken at demo | Add responsive classes in every layout prompt. Test Angular at 375px. |
| Context window fills up | Quality drops; Claude forgets .NET coding rules and stack constraints | Start new session; open with 'Read CLAUDE.md' \+ current status summary. |
| Hardcoded Azure credentials | Secret exposure, potential security breach | Phase 4 prompt requires Azure Managed Identity — never static connection strings. |

 

 

# **13\. Acceptance Criteria**

The platform will only be considered production-ready when all of the following criteria are verified and documented:

| Criterion | Pass Threshold |
| :---- | :---- |
| P0 \+ P1 User Stories | All P0 and P1 stories accepted and signed off during UAT. Zero open critical or high bugs at go-live. |
| Load Test | 10,000 concurrent users sustained with \< 1% error rate; API p95 response \< 300ms under load (k6) |
| Core Web Vitals | All green in Google Search Console on mobile: LCP \< 2.5s, INP \< 200ms, CLS \< 0.1 |
| PCI-DSS Compliance | SAQ-D fully completed; no raw PAN stored; Razorpay tokenisation confirmed by QSA |
| OWASP VAPT | No High or Critical findings outstanding at production go-live. All Medium findings documented with remediation plan. |
| WCAG 2.1 AA | Zero critical accessibility violations across all primary user journeys via Angular CDK a11y and axe-core |
| Test Coverage | \> 80% unit \+ integration tests (xUnit \+ Karma/Jest); \> 70% E2E coverage on critical paths (Playwright) |
| Browser Compatibility | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ — all primary journeys verified with BrowserStack |
| Mobile Responsiveness | All Angular pages tested at 320px, 375px, 480px, 768px, 1024px, 1280px, 1440px breakpoints |

 

 

# **14\. Risk Register**

| Risk | Prob. | Impact | Mitigation | Owner |
| :---- | :---- | :---- | :---- | :---- |
| Vibe coding prompt drift — Claude generates code outside approved .NET/Angular stack | **H** | **H** | CLAUDE.md investment before first prompt; V2 library gate; one-component-per-prompt rule | All Devs |
| Scope creep — uncontrolled additions post requirements lock | **H** | **H** | Strict Change Request process; Phase 0 lock; weekly scope review | PM / Client |
| EF Core migration conflicts in parallel development branches | **M** | **H** | Feature branch migration isolation; merge migrations in dependency order; no raw SQL on prod | Architect |
| Azure SQL performance under load | **M** | **H** | Early k6 load testing from Phase 2; Azure SQL Hyperscale auto-scale; Redis caching from Phase 1 | DevOps |
| Razorpay / logistics gateway instability | **M** | **H** | PayU fallback; retry with circuit breakers (Polly library); webhook idempotency | Architect |
| PCI-DSS compliance delays blocking go-live | **L** | **H** | QSA auditor engaged early; Razorpay tokenisation — no raw PAN stored at any point | Security |
| Angular bundle size exceeding performance budget | **M** | **M** | Lazy-loaded feature modules from Phase 1; tree-shaking audit in Phase 6; Angular bundle analyser | Dev B |
| Client feedback delays causing timeline drift | **H** | **M** | Contractual 5-day feedback SLA; escalation path defined; parallel workstreams planned | PM |

 

 

# **15\. Approvals & Sign-off**

By signing below, authorised representatives of both parties confirm agreement to all technical specifications, phase plans, build methodology, acceptance criteria, and risk mitigations set forth in this Technical Specification Document.

 

| Party | Name & Title | Signature | Date Signed |
| :---- | :---- | :---- | :---- |
| **Client — Authorised Representative** |   |   |   |
| **Development Partner — Lead Architect** |   |   |   |
| **QA / Compliance Signatory** |   |   |   |
| **UI/UX Design Lead** |   |   |   |

 

**This document is CONFIDENTIAL and PROPRIETARY.**

Unauthorised reproduction or distribution is strictly prohibited.

TSD v1.0  |  May 2026  |  Project Code: ECM-TCLIQ-2026-001  
