import { ChangeDetectionStrategy, Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Product } from '../core/models/product.model';
import { CartActions } from '../store/cart/cart.actions';

@Component({
  selector: 'app-add-to-cart-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="space-y-3">
      <!-- Quantity -->
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-dark">Qty:</span>
        <div class="flex items-center border border-gray-200 rounded overflow-hidden">
          <button
            class="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-lg font-medium disabled:opacity-40"
            [disabled]="quantity() <= 1"
            (click)="decrement()"
            aria-label="Decrease quantity"
          >−</button>
          <span class="w-10 text-center text-sm font-semibold">{{ quantity() }}</span>
          <button
            class="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-lg font-medium disabled:opacity-40"
            [disabled]="quantity() >= 10"
            (click)="increment()"
            aria-label="Increase quantity"
          >+</button>
        </div>
      </div>

      <!-- CTA buttons -->
      <div class="flex gap-3">
        <button
          class="flex-1 bg-navy text-white font-semibold py-3 rounded-lg hover:bg-blue transition disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="!product.inStock || !canAddToCart"
          (click)="addToCart()"
        >
          {{ product.inStock ? 'ADD TO BAG' : 'OUT OF STOCK' }}
        </button>
        <button
          class="flex-1 border-2 border-navy text-navy font-semibold py-3 rounded-lg hover:bg-navy hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="!product.inStock || !canAddToCart"
          (click)="buyNow()"
        >
          BUY NOW
        </button>
      </div>

      <!-- Delivery / return note -->
      <div class="flex gap-4 text-xs text-muted">
        <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
          </svg>
          Free Delivery
        </span>
        <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          30-Day Returns
        </span>
      </div>
    </div>
  `,
})
export class AddToCartPanelComponent {
  @Input({ required: true }) product!: Product;
  @Input() selectedSize: string | null = null;
  @Input() selectedColour: string | null = null;
  @Input() variantId: string | null = null;
  @Input() requiresSize = false;
  @Input() requiresColour = false;

  private readonly store = inject(Store);
  readonly quantity = signal(1);

  get canAddToCart(): boolean {
    if (this.requiresSize && !this.selectedSize) return false;
    if (this.requiresColour && !this.selectedColour) return false;
    return true;
  }

  increment(): void { this.quantity.update((q) => Math.min(q + 1, 10)); }
  decrement(): void { this.quantity.update((q) => Math.max(q - 1, 1)); }

  addToCart(): void {
    this.store.dispatch(CartActions.addItem({
      productId: this.product.id,
      variantId: this.variantId,
      quantity:  this.quantity(),
    }));
  }

  buyNow(): void {
    this.addToCart();
  }
}
