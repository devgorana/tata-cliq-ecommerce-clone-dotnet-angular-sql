import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn, selectCurrentUser } from '../store/auth/auth.selectors';
import { selectCartCount } from '../store/cart/cart.selectors';
import { AuthActions } from '../store/auth/auth.actions';
import { UiActions } from '../store/ui/ui.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AsyncPipe, RouterLink, FormsModule],
  template: `
    <!-- Skip-to-content — DESIGN.md §10 Accessibility -->
    <a href="#main-content" class="skip-to-content">Skip to main content</a>

    <header role="banner">

      <!-- Announcement Bar — DESIGN.md §4.1 -->
      @if (showAnnouncement()) {
        <div
          class="bg-red text-white text-center text-[13px] font-medium h-9 flex items-center justify-center relative px-10"
          role="alert"
          aria-live="polite"
        >
          <span>Free Shipping on orders above ₹499 &nbsp;|&nbsp; Use code <strong>CLIQ10</strong> for extra 10% off</span>
          <button
            class="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1 rounded transition"
            aria-label="Dismiss announcement"
            (click)="showAnnouncement.set(false)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }

      <!-- Primary Navigation — DESIGN.md §4.2 -->
      <div
        class="bg-white border-b border-border sticky top-0 z-50 transition-shadow"
        [class.shadow-xs]="scrolled()"
        role="navigation"
        aria-label="Primary navigation"
      >
        <!-- Top bar: Logo | Search | Icons -->
        <div class="max-w-layout mx-auto px-6 h-16 flex items-center gap-4">

          <!-- Mobile: hamburger -->
          <button
            class="md:hidden p-2 rounded-md hover:bg-bg transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open navigation menu"
            (click)="openMobileNav()"
          >
            <svg class="w-6 h-6 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <!-- Logo -->
          <a routerLink="/" class="flex-shrink-0" aria-label="Tata CLiQ Fashion — go to homepage">
            <span class="text-xl md:text-2xl font-bold tracking-tight font-display">
              <span class="text-navy">TATA</span>&nbsp;<span class="text-red">CLiQ</span>
            </span>
          </a>

          <!-- Search bar (md+) — DESIGN.md §4.2 -->
          <div class="hidden md:flex flex-1 max-w-xl mx-4">
            <div class="flex w-full rounded-full overflow-hidden bg-bg border border-border focus-within:border-red transition">
              <svg class="w-5 h-5 text-mid-gray ml-4 flex-shrink-0 self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="search"
                placeholder="Search for products, brands and more"
                class="flex-1 bg-transparent text-dark placeholder-mid-gray px-3 py-2.5 text-sm outline-none"
                aria-label="Search products and brands"
                [(ngModel)]="searchQuery"
                (keyup.enter)="onSearch()"
              />
              <button
                class="px-4 bg-red hover:bg-red/90 text-white text-sm font-medium transition"
                aria-label="Submit search"
                (click)="onSearch()"
              >
                Search
              </button>
            </div>
          </div>

          <!-- Right icon cluster -->
          <div class="flex items-center gap-1 md:gap-3 ml-auto md:ml-0">

            <!-- Wishlist -->
            <a
              routerLink="/account/wishlist"
              class="hidden md:flex flex-col items-center gap-0.5 px-2 py-1 rounded-md hover:bg-bg transition min-h-[44px] min-w-[44px] justify-center"
              aria-label="Wishlist"
            >
              <svg class="w-6 h-6 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span class="text-[11px] tracking-widest text-dark uppercase">Wishlist</span>
            </a>

            <!-- Cart -->
            <a
              routerLink="/cart"
              class="relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-md hover:bg-bg transition min-h-[44px] min-w-[44px] justify-center"
              aria-label="Shopping cart"
            >
              <div class="relative">
                <svg class="w-6 h-6 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                @if ((cartCount$ | async) ?? 0; as count) {
                  @if (count > 0) {
                    <span
                      class="absolute -top-1.5 -right-1.5 bg-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                      aria-label="{{ count }} items in cart"
                    >
                      {{ count > 9 ? '9+' : count }}
                    </span>
                  }
                }
              </div>
              <span class="hidden md:block text-[11px] tracking-widest text-dark uppercase">Bag</span>
            </a>

            <!-- Account -->
            @if (isLoggedIn$ | async) {
              <div class="hidden md:flex flex-col items-center gap-0.5 px-2 py-1 rounded-md hover:bg-bg transition group relative cursor-pointer min-h-[44px] min-w-[44px] justify-center">
                <svg class="w-6 h-6 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span class="text-[11px] tracking-widest text-dark uppercase truncate max-w-[56px]">
                  {{ (currentUser$ | async)?.firstName ?? 'Account' }}
                </span>
                <!-- Dropdown -->
                <div
                  class="absolute top-full right-0 mt-1 w-44 bg-white text-dark shadow-md rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-border text-sm"
                  role="menu"
                  aria-label="Account menu"
                >
                  <a routerLink="/account" class="block px-4 py-2 hover:bg-bg transition" role="menuitem">My Account</a>
                  <a routerLink="/account/orders" class="block px-4 py-2 hover:bg-bg transition" role="menuitem">Orders</a>
                  <a routerLink="/account/wishlist" class="block px-4 py-2 hover:bg-bg transition" role="menuitem">Wishlist</a>
                  <hr class="my-1 border-border" />
                  <button class="w-full text-left px-4 py-2 hover:bg-bg text-red transition" role="menuitem" (click)="logout()">Logout</button>
                </div>
              </div>
            } @else {
              <a
                routerLink="/auth/login"
                class="hidden md:flex flex-col items-center gap-0.5 px-2 py-1 rounded-md hover:bg-bg transition min-h-[44px] min-w-[44px] justify-center"
                aria-label="Sign in to your account"
              >
                <svg class="w-6 h-6 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span class="text-[11px] tracking-widest text-dark uppercase">Sign In</span>
              </a>
            }
          </div>
        </div>

        <!-- Mobile search bar -->
        <div class="md:hidden px-4 pb-3">
          <div class="flex rounded-full overflow-hidden bg-bg border border-border focus-within:border-red transition">
            <svg class="w-4 h-4 text-mid-gray ml-3 flex-shrink-0 self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="search"
              placeholder="Search for products, brands and more"
              class="flex-1 bg-transparent text-dark placeholder-mid-gray px-3 py-2 text-sm outline-none"
              aria-label="Search"
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
            />
          </div>
        </div>

        <!-- Category nav — DESIGN.md §4.2 -->
        <nav class="hidden md:block border-t border-border" aria-label="Category navigation">
          <div class="max-w-layout mx-auto px-6 flex gap-1 text-sm overflow-x-auto">
            @for (cat of navCategories; track cat.label) {
              <a
                [routerLink]="['/products']"
                [queryParams]="{ category: cat.slug }"
                class="py-2.5 px-3 whitespace-nowrap font-medium text-dark hover:text-red transition relative after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-red after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                {{ cat.label }}
              </a>
            }
          </div>
        </nav>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private readonly store  = inject(Store);
  private readonly router = inject(Router);

  searchQuery      = '';
  showAnnouncement = signal(true);
  scrolled         = signal(false);

  readonly isLoggedIn$  = this.store.select(selectIsLoggedIn);
  readonly currentUser$ = this.store.select(selectCurrentUser);
  readonly cartCount$   = this.store.select(selectCartCount);

  readonly navCategories = [
    { label: 'Women',     slug: 'women' },
    { label: 'Men',       slug: 'men' },
    { label: 'Kids',      slug: 'kids' },
    { label: 'Beauty',    slug: 'beauty' },
    { label: 'Home',      slug: 'home' },
    { label: 'Brands',    slug: 'brands' },
    { label: 'Sale',      slug: 'sale' },
    { label: 'Luxury',    slug: 'luxury' },
  ];

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  openMobileNav(): void {
    this.store.dispatch(UiActions.openMobileNav());
  }

  onSearch(): void {
    if (!this.searchQuery?.trim()) return;
    this.router.navigate(['/products'], {
      queryParams: { search: this.searchQuery.trim() },
      queryParamsHandling: 'merge',
    });
    this.searchQuery = '';
  }
}
