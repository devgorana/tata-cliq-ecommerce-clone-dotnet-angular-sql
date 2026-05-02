# DESIGN.md — Tata CLiQ Design System

## Colour Tokens

Register all tokens in `frontend/tailwind.config.ts` under `theme.extend.colors`.

| Token Name       | Hex       | CSS Variable        | Usage |
|------------------|-----------|---------------------|-------|
| `navy`           | `#1A1A6B` | `--color-navy`      | Header, mega-menu, primary CTAs, review badges |
| `red`            | `#E4002B` | `--color-red`       | Sale labels, promo badges, Flash Sale timers |
| `blue`           | `#0071C2` | `--color-blue`      | Add to Cart, Buy Now, secondary CTA hover states |
| `bg`             | `#F5F5F5` | `--color-bg`        | Page background, PLP sidebar |
| `card`           | `#FFFFFF` | `--color-card`      | All card surfaces, modals, drawers |
| `text`           | `#212121` | `--color-text`      | All body copy, product names, headings |
| `muted`          | `#757575` | `--color-muted`     | Labels, secondary text, breadcrumbs, captions |
| `gold`           | `#F9A825` | `--color-gold`      | CLiQ Cash loyalty wallet, reward point displays |
| `success`        | `#2E7D32` | `--color-success`   | Order delivered, stock available, payment success |

### tailwind.config.ts Reference
```ts
colors: {
  navy:    '#1A1A6B',
  red:     '#E4002B',
  blue:    '#0071C2',
  bg:      '#F5F5F5',
  card:    '#FFFFFF',
  text:    '#212121',
  muted:   '#757575',
  gold:    '#F9A825',
  success: '#2E7D32',
}
```

---

## Typography

| Role            | Font            | Weight | Size (base) |
|-----------------|-----------------|--------|-------------|
| Headings (H1–H3)| Inter / Roboto  | 700    | 24px–36px   |
| Body            | Inter / Roboto  | 400    | 14px–16px   |
| Price (sale)    | Inter           | 700    | 18px–20px   |
| Price (MRP)     | Inter           | 400    | 14px — line-through, muted |
| Badge / Label   | Inter           | 600    | 11px–12px   |
| Button          | Inter           | 600    | 14px        |

Use `font-sans` (Inter) via Tailwind. Load via Google Fonts in `index.html`.

---

## Spacing Scale

Follow Tailwind default 4px base unit. Key layout spacings:
- Section vertical padding: `py-12` (48px)
- Card padding: `p-4` (16px)
- Grid gap: `gap-4` (16px) mobile → `gap-6` (24px) desktop
- Header height: `h-16` (64px)
- Bottom nav height: `h-16` (64px) — mobile only

---

## Responsive Breakpoints

| Prefix  | Min Width | Layout |
|---------|-----------|--------|
| (none)  | 320px     | Single column, bottom nav, stacked cards |
| `sm:`   | 480px     | 2-column product grid option |
| `md:`   | 768px     | Top nav, 3-col grid, filter drawer |
| `lg:`   | 1024px    | Mega-menu, 4-col grid, sticky filter sidebar |
| `xl:`   | 1280px    | Full layout, 4–5 col grid |
| `2xl:`  | 1440px    | Max-width 1440px centred |

---

## Component Patterns

### Product Card
- Image: `aspect-[3/4]` with `object-cover`
- Brand name: text-muted text-xs uppercase
- Product name: text-text text-sm line-clamp-2
- Sale price: text-text font-bold text-base
- MRP: text-muted text-sm line-through
- Discount badge: bg-red text-white text-xs px-1.5 py-0.5 rounded

### Buttons
- Primary (Add to Cart): `bg-blue hover:bg-blue/90 text-white font-semibold py-2.5 px-6 rounded`
- Secondary (Wishlist): `border border-navy text-navy hover:bg-navy/5`
- Danger / Sale: `bg-red text-white`

### Angular Material Theme
- Primary palette: navy `#1A1A6B`
- Accent palette: blue `#0071C2`
- Warn palette: red `#E4002B`

---

## Accessibility Requirements

- All interactive elements: minimum 44×44px touch target
- Colour contrast: minimum 4.5:1 for normal text (WCAG AA)
- Focus rings: visible on all focusable elements (`ring-2 ring-blue ring-offset-2`)
- Images: always include descriptive `alt` text
- Mega-menu: fully keyboard navigable via Angular CDK FocusTrap
- Icons (Lucide): always paired with `aria-label` or visually hidden text
- Bottom nav: `aria-label` on each nav item
