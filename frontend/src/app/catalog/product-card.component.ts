import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { Product } from '../core/models/product.model';
import { CartActions } from '../store/cart/cart.actions';
import { CurrencyInrPipe } from '../shared/pipes/currency-inr.pipe';
import { BadgeComponent } from '../shared/components/badge.component';
import { StarRatingComponent } from '../shared/components/star-rating.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, CurrencyInrPipe, BadgeComponent, StarRatingComponent],
  template: `
    <article
      class="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative"
      [attr.aria-label]="product.name"
    >
      <!-- Wishlist button -->
      <button
        class="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-1.5 hover:bg-white transition"
        aria-label="Add to wishlist"
        (click)="onWishlist($event)"
      >
        <svg class="w-4 h-4 text-muted hover:text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      </button>

      <!-- Discount badge -->
      @if (discountPercent > 0) {
        <div class="absolute top-2 left-2 z-10">
          <app-badge variant="red">{{ discountPercent }}% off</app-badge>
        </div>
      }

      <!-- Product image -->
      <a [routerLink]="['/products', product.id]" class="block aspect-[3/4] overflow-hidden bg-gray-100">
        @if (product.imageUrls.length > 0) {
          <img
            [src]="product.imageUrls[0]"
            [alt]="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        } @else {
          <div class="w-full h-full flex items-center justify-center text-5xl bg-gray-50">🛍️</div>
        }
      </a>

      <!-- Product info -->
      <div class="p-3">
        <p class="text-xs text-muted truncate mb-0.5">{{ product.brandName }}</p>
        <a [routerLink]="['/products', product.id]">
          <h3 class="text-sm text-dark font-medium leading-snug line-clamp-2 hover:text-blue transition mb-1">
            {{ product.name }}
          </h3>
        </a>

        <!-- Price -->
        <div class="flex items-center gap-2 mb-1.5">
          <span class="font-bold text-dark text-sm">{{ product.salePrice ?? product.price | currencyInr }}</span>
          @if (product.salePrice != null && product.salePrice < product.price) {
            <span class="text-xs text-muted line-through">{{ product.price | currencyInr }}</span>
          }
        </div>

        <!-- Rating -->
        @if (product.reviewCount > 0) {
          <app-star-rating [rating]="product.rating" [reviewCount]="product.reviewCount" />
        }

        <!-- Add to cart -->
        <button
          class="mt-2 w-full bg-navy text-white text-xs font-semibold py-2 rounded hover:bg-blue transition"
          [disabled]="!product.inStock"
          (click)="addToCart()"
        >
          {{ product.inStock ? 'ADD TO BAG' : 'OUT OF STOCK' }}
        </button>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() wishlistToggle = new EventEmitter<string>();

  private readonly store = inject(Store);

  get discountPercent(): number {
    if (!this.product.salePrice || this.product.salePrice >= this.product.price) return 0;
    return Math.round((1 - this.product.salePrice / this.product.price) * 100);
  }

  addToCart(): void {
    this.store.dispatch(CartActions.addItem({
      productId: this.product.id,
      variantId: null,
      quantity: 1,
    }));
  }

  onWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.wishlistToggle.emit(this.product.id);
  }
}
