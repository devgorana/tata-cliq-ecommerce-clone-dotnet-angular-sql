# CLAUDE.md — Tata CLiQ E-Commerce Clone (.NET / Angular / SQL)
# Read this file at the start of EVERY Claude Code session. No exceptions.

## Project
Multi-category retail marketplace clone of Tata CLiQ.
Angular 21 SPA · .NET Core 10 Web API · SQL Server 2022 · Azure.

## Approved Stack

### V1 — Frontend (Phases 1–3)
- @angular/core@21
- @angular/router@21
- @angular/forms@21
- @angular/material@21
- @angular/cdk@21
- rxjs@7
- @ngrx/store@21
- @ngrx/effects@21
- @ngrx/entity@21
- tailwindcss@3
- lucide-angular

### V1 — Backend (Phases 1–3)
- dotnet 10
- Microsoft.EntityFrameworkCore (EF Core 9)
- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.AspNetCore.Identity.EntityFrameworkCore
- AutoMapper
- FluentValidation
- Serilog
- Swashbuckle.AspNetCore (Swagger/OpenAPI)
- Microsoft.AspNetCore.Authentication.JwtBearer

### V2 — Cloud Scale (Phase 5+ — DO NOT install before Phase 5)
- Azure.ServiceBus
- Azure.Storage.Blobs
- Azure.Extensions.AspNetCore.Configuration.Secrets (Key Vault)
- StackExchange.Redis
- Azure.Search.Documents (Cognitive Search)
- Razorpay .NET SDK
- Azure.AI.OpenAI
- Microsoft.ApplicationInsights.AspNetCore

## Design Tokens
| Token            | Hex       | CSS Variable        |
|------------------|-----------|---------------------|
| primary-navy     | #1A1A6B   | --color-navy        |
| accent-red       | #E4002B   | --color-red         |
| cta-blue         | #0071C2   | --color-blue        |
| bg               | #F5F5F5   | --color-bg          |
| card-white       | #FFFFFF   | --color-card        |
| text-dark        | #212121   | --color-text        |
| text-muted       | #757575   | --color-muted       |
| cliq-cash-gold   | #F9A825   | --color-gold        |
| success-green    | #2E7D32   | --color-success     |

## Responsive Breakpoints (Tailwind)
- default (mobile-S): 320px–479px — single column, bottom nav
- sm:  480px — 2-col grid option
- md:  768px — top nav, 3-col grid, filter drawer
- lg:  1024px — mega-menu, 4-col grid, sticky filter sidebar
- xl:  1280px — full layout, 4–5 col grid
- 2xl: 1440px — max-width 1440px centred

## Code Rules — Angular
- TypeScript strict mode — ZERO `any` anywhere
- No HttpClient calls inside components — Services ONLY
- Every component: standalone: true + ChangeDetectionStrategy.OnPush
- One component per file, one responsibility per component
- No subscribe() in component classes — use AsyncPipe only
- NgRx: all side effects in Effects, never in components or services directly
- Mobile-first: every component must include responsive Tailwind classes
- Lazy-load every feature module via loadComponent / loadChildren

## Code Rules — .NET Core
- C# nullable reference types enabled — ZERO #nullable disable
- No raw SQL — EF Core LINQ only; all schema changes via Migrations
- One controller per resource, one service per domain concern
- Repository pattern: IRepository<T> → EfRepository<T>
- DTOs for all API inputs/outputs — never expose entities directly
- FluentValidation for all request DTOs
- AutoMapper profiles for entity ↔ DTO mapping
- Serilog structured logging with correlation IDs on every request
- Do NOT modify anything outside the file being generated

## EF Core Migration Naming
Pattern: `dotnet ef migrations add <Phase>_<Context>_<Change>`
Example: `Phase2_Auth_AddUsers`

## Current Phase
**Phase 1 — Project Foundation (In Progress)**

## Phase Progress Log
| Phase | Status      | Summary |
|-------|-------------|---------|
| 0     | Complete    | TSD provided and reviewed |
| 1     | In Progress | Scaffolding folder structure, CLAUDE.md, TODO.md, docker-compose |
| 2     | Pending     | Backend data layer + Auth.API + User.API |
| 3     | Pending     | Angular SPA foundation + Layout + Homepage |
| 4     | Pending     | Core feature pages (PLP, PDP, Cart, Checkout) + API stubs |
| 5     | Pending     | Full-stack integration + Docker wiring + Admin skeleton |

## Vibe Coding Guards (READ BEFORE EVERY PROMPT)
1. One component / one controller per prompt — never batch
2. Review every generated file before `dotnet run` or `ng serve`
3. Commit at every phase milestone
4. V2 libraries are FORBIDDEN before Phase 5
5. Never modify files outside the scope of the current prompt
6. Test at 375px mobile on every Angular component
7. If context window grows large: new session → open with "Read CLAUDE.md"
