import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
    <header class="bg-navy text-white sticky top-0 z-50 shadow-md">
      <!-- Top bar -->
      <div class="max-w-layout mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4">

        <!-- Mobile: hamburger -->
        <button
          class="md:hidden p-2 rounded hover:bg-white/10 transition"
          aria-label="Open navigation"
          (click)="openMobileNav()"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <!-- Logo -->
        <a routerLink="/" class="flex-shrink-0">
          <span class="text-xl md:text-2xl font-bold tracking-tight">
            TATA <span class="text-[#E4002B]">CLiQ</span>
          </span>
        </a>

        <!-- Search bar (md+) -->
        <div class="hidden md:flex flex-1 max-w-xl mx-4">
          <div class="flex w-full rounded-full overflow-hidden border border-white/30 bg-white/10">
            <input
              type="search"
              placeholder="Search for brands, products…"
              class="flex-1 bg-transparent text-white placeholder-white/60 px-4 py-2 text-sm outline-none"
              aria-label="Search"
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
            />
            <button 
              class="px-4 bg-[#E4002B] hover:bg-red-700 transition" 
              aria-label="Submit search"
              (click)="onSearch()"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Right actions -->
        <div class="flex items-center gap-2 md:gap-4">

          <!-- Wishlist -->
          <a routerLink="/account/wishlist" class="hidden md:flex flex-col items-center text-xs hover:text-[#F9A825] transition" aria-label="Wishlist">
            <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            Wishlist
          </a>

          <!-- Cart -->
          <a routerLink="/cart" class="relative flex flex-col items-center text-xs hover:text-[#F9A825] transition" aria-label="Cart">
            <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            @if ((cartCount$ | async) ?? 0; as count) {
              @if (count > 0) {
                <span class="absolute -top-1 -right-1 bg-[#E4002B] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {{ count > 9 ? '9+' : count }}
                </span>
              }
            }
            <span class="hidden md:block">Bag</span>
          </a>

          <!-- Auth -->
          @if (isLoggedIn$ | async) {
            <div class="hidden md:flex flex-col items-center text-xs group relative cursor-pointer">
              <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              {{ (currentUser$ | async)?.firstName ?? 'Account' }}
              <div class="absolute top-full right-0 mt-1 w-40 bg-white text-dark shadow-lg rounded py-2 hidden group-hover:block z-50 text-sm">
                <a routerLink="/account" class="block px-4 py-2 hover:bg-bg">My Account</a>
                <a routerLink="/account/orders" class="block px-4 py-2 hover:bg-bg">Orders</a>
                <button class="w-full text-left px-4 py-2 hover:bg-bg text-red" (click)="logout()">Logout</button>
              </div>
            </div>
          } @else {
            <a routerLink="/auth/login" class="hidden md:flex flex-col items-center text-xs hover:text-[#F9A825] transition">
              <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Sign In
            </a>
          }
        </div>
      </div>

      <!-- Mobile search bar -->
      <div class="md:hidden px-4 pb-3">
        <div class="flex rounded-full overflow-hidden border border-white/30 bg-white/10">
          <input
            type="search"
            placeholder="Search…"
            class="flex-1 bg-transparent text-white placeholder-white/60 px-4 py-2 text-sm outline-none"
            aria-label="Search"
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
          />
          <button 
            class="px-4 bg-[#E4002B]" 
            aria-label="Search"
            (click)="onSearch()"
          >
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Category nav (md+) -->
      <nav class="hidden md:block border-t border-white/20">
        <div class="max-w-layout mx-auto px-4 flex gap-6 text-sm font-medium overflow-x-auto">
          @for (cat of navCategories; track cat.label) {
            <a
              [routerLink]="['/products']"
              [queryParams]="{ category: cat.slug }"
              class="py-2 whitespace-nowrap hover:text-[#F9A825] transition"
            >
              {{ cat.label }}
            </a>
          }
        </div>
      </nav>
    </header>
  `,
})
export class HeaderComponent {
  private readonly store  = inject(Store);
  private readonly router = inject(Router);

  searchQuery = '';

  readonly isLoggedIn$  = this.store.select(selectIsLoggedIn);
  readonly currentUser$ = this.store.select(selectCurrentUser);
  readonly cartCount$   = this.store.select(selectCartCount);

  readonly navCategories = [
    { label: 'Electronics', slug: 'electronics' },
    { label: 'Men',         slug: 'men' },
    { label: 'Women',       slug: 'women' },
    { label: 'Beauty',      slug: 'beauty' },
    { label: 'Kids',        slug: 'kids' },
    { label: 'Footwear',    slug: 'footwear' },
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
      queryParamsHandling: 'merge'
    });
    
    this.searchQuery = '';
  }
}
