# DESIGN.md — Tata CLiQ Fashion Website Replica
> A comprehensive skill/design-spec file for implementing a production-grade replica of tatacliq.com

---

## 1. Brand Overview

**Platform**: Tata CLiQ Fashion (rebranded from Tata CLiQ in late 2024)
**Parent**: Tata Digital Private Limited (Tata Group)
**Category**: Premium Indian fashion & lifestyle e-commerce
**Positioning**: Curated, trust-led, phygital (physical + digital) shopping experience
**Audience**: Middle and upper-middle income, tech-savvy, 22–45 year olds in Tier-I & Tier-II cities
**Tagline feel**: "Magic & Joy in Shopping" — premium but accessible, authentic, curated

---

## 2. Visual Identity

### 2.1 Color Palette

```css
:root {
  /* Primary Brand */
  --cliq-red:        #E31837;   /* Primary CTA, logo accent, sale badges */
  --cliq-dark:       #1A1A1A;   /* Primary text, headers */
  --cliq-white:      #FFFFFF;   /* Backgrounds, cards */

  /* Secondary */
  --cliq-navy:       #1C2B4A;   /* Nav bar background, footer */
  --cliq-gold:       #C9A84C;   /* Luxury accents, CLiQ Luxury sub-brand, NeuCoins */
  --cliq-light-gray: #F5F5F5;   /* Page background, section fills */
  --cliq-mid-gray:   #9E9E9E;   /* Secondary text, placeholders, borders */
  --cliq-border:     #E0E0E0;   /* Dividers, card outlines */

  /* Functional */
  --cliq-success:    #2E7D32;   /* In stock, order confirmed */
  --cliq-warning:    #F57C00;   /* Low stock, expiring offer */
  --cliq-error:      #C62828;   /* Out of stock, errors */
  --cliq-discount:   #E31837;   /* Discount % badge */

  /* Gradients */
  --cliq-hero-gradient: linear-gradient(135deg, #1C2B4A 0%, #2C3E70 100%);
  --cliq-sale-gradient: linear-gradient(90deg, #E31837 0%, #FF6B35 100%);
}
```

### 2.2 Typography

```css
/* Import from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  /* Display / Headings — editorial feel */
  --font-display: 'Playfair Display', Georgia, serif;

  /* Body / UI — clean and modern */
  --font-body: 'DM Sans', -apple-system, sans-serif;

  /* Scale */
  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 15px;
  --text-md:   17px;
  --text-lg:   20px;
  --text-xl:   24px;
  --text-2xl:  32px;
  --text-3xl:  42px;

  /* Weight */
  --weight-light:   300;
  --weight-regular: 400;
  --weight-medium:  500;
  --weight-semi:    600;
  --weight-bold:    700;

  /* Line heights */
  --leading-tight:  1.2;
  --leading-normal: 1.5;
  --leading-loose:  1.8;

  /* Letter spacing */
  --tracking-wide:    0.05em;  /* Navigation labels, badges */
  --tracking-widest:  0.12em;  /* All-caps labels, category tags */
}
```

---

## 3. Layout System

### 3.1 Grid & Spacing

```css
:root {
  --container-max:    1280px;
  --container-pad:    24px;     /* Desktop side padding */
  --container-pad-sm: 16px;     /* Mobile side padding */

  /* Spacing scale (8px base) */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;

  /* Section spacing */
  --section-gap: 48px;   /* Desktop gap between page sections */
  --section-gap-sm: 32px;

  /* Card grid columns */
  --grid-cols-4: repeat(4, 1fr);   /* Product listing desktop */
  --grid-cols-3: repeat(3, 1fr);   /* Featured / collection desktop */
  --grid-cols-2: repeat(2, 1fr);   /* Mobile product grid */
  --grid-cols-1: 1fr;              /* Mobile single column */

  /* Breakpoints */
  --bp-mobile:  480px;
  --bp-tablet:  768px;
  --bp-desktop: 1024px;
  --bp-wide:    1280px;
}
```

### 3.2 Border Radius

```css
:root {
  --radius-sm:   4px;   /* Badges, tags, small chips */
  --radius-md:   8px;   /* Cards, buttons, inputs */
  --radius-lg:   12px;  /* Modal corners, image cards */
  --radius-xl:   20px;  /* Pill buttons, featured cards */
  --radius-full: 9999px;/* Circular elements, round badges */
}
```

### 3.3 Shadows & Elevation

```css
:root {
  --shadow-xs:  0 1px 2px rgba(0,0,0,0.06);
  --shadow-sm:  0 2px 8px rgba(0,0,0,0.08);
  --shadow-md:  0 4px 16px rgba(0,0,0,0.10);
  --shadow-lg:  0 8px 32px rgba(0,0,0,0.12);
  --shadow-xl:  0 16px 48px rgba(0,0,0,0.16);
  --shadow-card-hover: 0 8px 24px rgba(0,0,0,0.14);
}
```

---

## 4. Component Specifications

### 4.1 Top Announcement Bar

```
Height:        36px
Background:    var(--cliq-red) or dark promo color (rotates)
Text:          13px DM Sans Medium, white, centered
Content:       "Free Shipping on orders above ₹499 | Use code CLIQ10 for extra 10% off"
Dismissible:   Yes (× icon, right-aligned)
```

### 4.2 Primary Navigation (Sticky)

```
Height:          64px desktop, 56px mobile
Background:      var(--cliq-white)
Border-bottom:   1px solid var(--cliq-border)
Box-shadow:      var(--shadow-xs) on scroll
Position:        sticky, top: 0, z-index: 1000

Layout (left → right):
  [Logo] ···· [Category Nav] ···· [Search Bar] ···· [Icons: Wishlist | Cart | Account]

Logo:
  - "CLiQ" wordmark in red + dark navy
  - Height: 32px

Search Bar:
  - Width: 480px desktop, full-width mobile (collapsed to icon)
  - Placeholder: "Search for products, brands and more"
  - Background: var(--cliq-light-gray)
  - Border-radius: var(--radius-xl)
  - Icon: magnifier, left-inset

Category Nav (horizontal tabs):
  - Labels: Women | Men | Kids | Beauty | Home | Brands | Sale
  - Font: 14px DM Sans Medium, var(--cliq-dark)
  - Active/hover: underline in var(--cliq-red)
  - Dropdown: mega-menu on hover (see 4.3)

Icon buttons (right cluster):
  - Size: 24px icons
  - Labels below icon: 11px, tracking-widest
  - Cart badge: circular var(--cliq-red) with count
```

### 4.3 Mega Menu Dropdown

```
Trigger:        Hover on category tab
Width:          100vw (full bleed)
Max-width:      var(--container-max)
Background:     white
Box-shadow:     var(--shadow-lg)
Padding:        32px var(--container-pad)
Columns:        Left sidebar (sub-categories) | Center (featured brands) | Right (promo image)

Left column:
  - Sub-category links, 14px DM Sans
  - Bold headers (e.g. "Clothing", "Footwear")
  - Hover: var(--cliq-red) color

Center:
  - "Top Brands" grid (3-4 brand logo tiles)
  - 80x80px brand logos, bordered circle

Right:
  - Promotional editorial image (400×280px)
  - "Shop Now" CTA overlaid
```

### 4.4 Hero Banner / Carousel

```
Height:         480px desktop | 240px mobile
Type:           Full-width auto-sliding carousel
Slide duration: 5 seconds
Transition:     Fade or horizontal slide (300ms ease)
Controls:       Dot indicators centered below | Arrow chevrons on sides

Image overlay:  Semi-transparent gradient left-to-right for text legibility
Text block:     Bottom-left aligned
  - Eyebrow:    12px DM Sans, ALL CAPS, tracking-widest, white/gold
  - Headline:   40px Playfair Display Bold, white
  - Sub-text:   16px DM Sans Light, white, 70% opacity
  - CTA button: "Shop Now" → solid var(--cliq-red), white text, rounded-md

Aspect ratio:   Desktop 16:5 | Mobile 4:3
```

### 4.5 Category Shortcut Strip

```
Layout:     Horizontal scroll strip (8–12 circular icons with labels)
Item:       72px circle image | 12px DM Sans label below
Gap:        16px between items
Scroll:     Horizontal, no scrollbar visible (overflow-x: auto)
Hover:      Scale(1.05) + shadow-sm on circle
```

### 4.6 Product Card

```
Width:        auto (grid-defined)
Aspect ratio: Image 3:4 (portrait, fashion standard)

Structure (top → bottom):
  [Image Container]
    - Product image (object-fit: cover)
    - Wishlist icon (heart, top-right overlay, appears on hover)
    - "Sale" / "New" badge (top-left, pill shape, var(--cliq-red) or navy)
  [Info Block] — padding: 12px 4px
    - Brand name: 11px DM Sans, UPPERCASE, tracking-widest, var(--cliq-mid-gray)
    - Product name: 14px DM Sans Medium, var(--cliq-dark), 2-line clamp
    - Price row:
        Selling price: 15px DM Sans SemiBold, var(--cliq-dark)
        MRP:           13px DM Sans, strikethrough, var(--cliq-mid-gray)
        Discount %:    13px DM Sans Medium, var(--cliq-red)
    - Rating row (optional): ★ stars + count, 12px

Hover state:
  - Image: Scale(1.03), transition 300ms ease
  - Card: box-shadow var(--shadow-card-hover)
  - "Quick View" button slides up from bottom of image

Mobile:
  - 2 columns
  - Reduced font sizes (brand: 10px, name: 13px)
```

### 4.7 Section Headers

```
Layout:     Flex row → [Title left] [View All link right]
Title:      24px Playfair Display SemiBold, var(--cliq-dark)
Eyebrow:    11px DM Sans, ALL CAPS, tracking-widest, var(--cliq-red) — above title
View All:   13px DM Sans Medium, var(--cliq-red), underline on hover
Divider:    Optional thin 2px var(--cliq-red) line under title (40px wide, left-aligned)
```

### 4.8 Brand Logo Strip

```
Layout:     Horizontal scroll or static row of 6–8 brand logos
Item:       160×80px bordered box (1px var(--cliq-border))
Background: white
Logo:       Grayscale by default → Full color on hover
Border-radius: var(--radius-md)
Transition: filter 300ms ease
```

### 4.9 Promotional Banners (2-up / 3-up)

```
Layout:     CSS Grid, 2 or 3 equal columns
Gap:        16px
Height:     200px (2-up) | 160px (3-up)
Image:      Full cover, border-radius var(--radius-lg)
Overlay:    Bottom gradient for text
Text:       White headline + CTA link
```

### 4.10 Add to Cart / Buy Now Buttons

```
Add to Cart:
  Background:   var(--cliq-white)
  Border:       2px solid var(--cliq-red)
  Text color:   var(--cliq-red)
  Hover:        bg var(--cliq-red), text white

Buy Now:
  Background:   var(--cliq-red)
  Text color:   white
  Hover:        background darken 10%

Both:
  Height:       48px
  Border-radius: var(--radius-md)
  Font:         15px DM Sans SemiBold, letter-spacing 0.03em
  Width:        100% (PDP) or fixed 160px (card)
  Transition:   all 200ms ease
```

### 4.11 Size Selector

```
Type:   Pill chips (horizontal flex wrap)
Size:   36×36px (square) or auto-width (text sizes: XS/S/M/L/XL)
State:
  Default:    Border var(--cliq-border), text var(--cliq-dark)
  Selected:   Border var(--cliq-red), bg var(--cliq-red), text white
  Disabled:   Diagonal strikethrough, text var(--cliq-mid-gray), reduced opacity
```

### 4.12 Toast / Snackbar

```
Position:    Bottom-center, 24px from edge
Width:       Max 400px
Padding:     12px 20px
Background:  var(--cliq-dark) (dark mode feel)
Text:        14px DM Sans, white
Duration:    3 seconds → slide up to dismiss
Animation:   Slide up from bottom + fade in
Icon:        ✓ check for success, ⚠ for warning
```

### 4.13 Footer

```
Background:  var(--cliq-navy)
Text color:  white / #B0BEC5 for secondary

Columns (4):
  1. Brand / About — Logo, tagline, social icons
  2. Shopping — Help, Track Orders, Returns, Size Guide
  3. Policies — Privacy, T&Cs, Accessibility, Sitemap
  4. Download App — QR code or app store badges

Bottom bar:
  - "© 2024 Tata CLiQ. All rights reserved."
  - Payment icons: Visa, Mastercard, UPI, PayTM, NB
  - 14px DM Sans, #78909C

Padding:     48px var(--container-pad) 24px
```

---

## 5. Page Templates

### 5.1 Homepage

```
Order (top → bottom):
  1. Announcement Bar
  2. Primary Navigation (sticky)
  3. Hero Carousel
  4. Category Shortcut Strip
  5. Section: "New Arrivals" (4-column product grid)
  6. 2-up Promo Banner (Women's | Men's)
  7. Section: "Top Brands" (logo strip)
  8. Section: "Trending Now" (horizontal scroll product row)
  9. 3-up Promo Banner (seasonal/category)
  10. Section: "Sale Picks" (4-column grid, red discount badges)
  11. Editorial / Lifestyle Banner (full-width)
  12. Section: "Recently Viewed" (logged-in users)
  13. Footer
```

### 5.2 Product Listing Page (PLP)

```
Left sidebar (desktop, 260px):
  - Filters: Category, Brand, Price range slider, Size, Color swatches, Discount %
  - Sticky on scroll
  - Collapsible filter groups

Top bar:
  - Breadcrumb + result count
  - Sort dropdown: Relevance | Price (Low-High) | Newest | Discount

Grid: 4-col desktop, 3-col tablet, 2-col mobile

Pagination: Infinite scroll with "Load More" button fallback
```

### 5.3 Product Detail Page (PDP)

```
Layout:       2-column (60% image | 40% info) on desktop, stacked on mobile

Left (Image):
  - Primary image large (600px wide)
  - Thumbnail strip (vertical, left side) — 4–6 thumbs
  - Image zoom on hover
  - "360° View" or video badge if available

Right (Info):
  - Breadcrumb
  - Brand name (uppercase link → brand page)
  - Product title (Playfair Display 26px)
  - Rating row (stars + "124 Reviews")
  - Price block (MRP, selling price, discount %)
  - Offer tags (bank offers, coupon codes)
  - Color selector (visual swatches)
  - Size selector (chip buttons)
  - Size chart link
  - Quantity selector
  - [Add to Wishlist] [Add to Cart] [Buy Now] buttons
  - Delivery date estimator (pincode input)
  - "CLiQ Promise" trust badges (Genuine Products, Easy Returns, etc.)

Below fold:
  - Product Description (collapsible)
  - Size & Fit (collapsible)
  - Reviews section
  - "You May Also Like" product carousel
  - Recently Viewed
```

---

## 6. Motion & Interactions

```
Principles:
  - Purposeful — motion should communicate, not decorate
  - Fast — max 300ms for UI transitions, 500ms for page elements
  - Ease-out for enters (feels natural arriving)
  - Ease-in for exits (feels natural leaving)

Specific animations:
  Hero carousel:        Slide (400ms ease-in-out) or crossfade (300ms)
  Card hover:           Scale image (transform 300ms ease), shadow rise
  Dropdown open:        translateY(-8px → 0) + opacity(0 → 1), 200ms
  Button press:         Scale(0.97) on mousedown, release 100ms
  Skeleton loaders:     Animated shimmer (CSS gradient animation, 1.5s loop)
  Wishlist heart:       Pop + fill animation on click (scale 1→1.3→1, 300ms)
  Toast/snackbar:       translateY(100% → 0) + opacity, 250ms ease-out
  Add to cart:          Button shake → checkmark swap (300ms)
  Page transitions:     Fade (opacity 0→1, 200ms) on route change

Scroll behaviors:
  - Navbar compresses height on scroll (64px → 52px, transition 200ms)
  - "Back to top" button appears after 400px scroll
  - Lazy loading images: fade-in on intersection
```

---

## 7. Responsive Behavior

```
Desktop (≥1024px):
  - Full navigation with mega-menu
  - 4-column product grids
  - Side-by-side PDP layout
  - Visible filter sidebar

Tablet (768–1023px):
  - Hamburger menu
  - 3-column product grids
  - Collapsed filter panel (modal drawer)
  - PDP: stacked layout

Mobile (<768px):
  - Bottom navigation bar (Home | Categories | Search | Wishlist | Profile)
  - 2-column product grids
  - Full-screen search overlay
  - Sticky ATC button on PDP (bottom of screen)
  - Swipeable carousels and horizontal strips
  - Touch-optimized tap targets (min 44×44px)
```

---

## 8. Trust & Utility Elements

### 8.1 CLiQ Promise Badges

```
Display:   Horizontal row of 4 icon+text badges on PDP and cart
Icons:     Shield (Genuine), Truck (Free Delivery), Refresh (Easy Returns), Star (Quality)
Style:     Small icon (20px) + 2-line text, light gray background pill
```

### 8.2 Offer / Coupon Tags

```
Style:     Dashed border box, var(--cliq-light-gray) bg
Icon:      Discount tag icon (🏷)
Text:      "Use code CLIQ10 — Extra 10% off" (13px DM Sans)
CTA:       "Copy Code" link (var(--cliq-red))
```

### 8.3 NeuCoins Loyalty

```
Display:   Small gold coin icon + "Earn X NeuCoins on this order"
Color:     var(--cliq-gold)
Font:      12px DM Sans Medium
Position:  Below price block on PDP
```

---

## 9. Icon System

Use a consistent icon library throughout. Recommended: **Lucide Icons** (MIT licensed) or a custom SVG set.

```
Core icons needed:
  - Search, Menu (hamburger), X (close)
  - Heart (wishlist), ShoppingCart, User (account)
  - ChevronLeft, ChevronRight, ChevronDown
  - Star (rating), Tag (offer), Shield (trust)
  - Truck (delivery), RotateCcw (returns)
  - Share, ZoomIn, Eye (quick view)
  - Check, AlertCircle, Info
  - Facebook, Instagram, Twitter (social)

Size tokens:
  --icon-xs: 14px
  --icon-sm: 16px
  --icon-md: 20px
  --icon-lg: 24px
  --icon-xl: 32px
```

---

## 10. Accessibility Guidelines

```
Color contrast:
  - All body text must meet WCAG AA (4.5:1 ratio minimum)
  - Red on white (#E31837 on #FFF): ✓ 4.6:1 — just passes AA ✓
  - Use dark navy for text, not pure gray

Keyboard:
  - All interactive elements reachable by Tab key
  - Focus ring: 2px solid var(--cliq-red), 2px offset
  - Skip-to-content link (visually hidden, shows on focus)

Semantics:
  - <nav>, <main>, <aside>, <footer> landmarks
  - ARIA labels on icon-only buttons
  - role="dialog" on modals with focus trap
  - Product images: descriptive alt text (brand + product name)
  - aria-live region for cart updates, toast messages

Touch targets:
  - Minimum 44×44px for all tappable elements on mobile
```

---

## 11. Implementation Checklist

Use this to track component build status:

- [x] CSS variables & design tokens set up
- [x] Google Fonts imported (Playfair Display + DM Sans)
- [x] Announcement bar
- [x] Navigation (desktop mega-menu + mobile drawer)
- [x] Hero carousel with auto-slide
- [x] Category shortcut strip
- [x] Section header component
- [x] Product card (with wishlist, badges, hover states)
- [x] Product grid (4/3/2 col responsive)
- [x] Promotional banners (2-up & 3-up)
- [x] Brand logo strip
- [x] Footer (4-column + bottom bar)
- [x] PLP (filters + sort + grid)
- [x] PDP (image gallery + info panel + trust badges)
- [x] Cart drawer / page
- [x] Wishlist page
- [x] Toast / snackbar notifications
- [x] Skeleton loaders
- [x] Responsive behavior at all 3 breakpoints
- [ ] Accessibility audit (contrast, keyboard, ARIA)
- [x] Performance (lazy images, font loading)

---

## 12. Tech Stack Recommendations

```
Framework:       React 18 + Vite  (or Next.js for SSR/SEO)
Styling:         CSS Modules or Tailwind CSS (with custom theme tokens)
Icons:           lucide-react
Carousel:        Embla Carousel or Swiper.js
State:           Zustand (cart, wishlist)
Routing:         React Router v6
Images:          next/image (Next.js) or native lazy loading
Animations:      CSS transitions + Framer Motion (for complex sequences)
Fonts:           Google Fonts (self-host for performance)
```

---

*This DESIGN.md is a living document. Update it as components are built and design decisions evolve.*
