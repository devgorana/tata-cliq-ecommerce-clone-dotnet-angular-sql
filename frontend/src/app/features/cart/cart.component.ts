import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { CartActions } from '../../store/cart/cart.actions';
import { selectCart, selectCartCount, selectCartItems, selectCartLoading } from '../../store/cart/cart.selectors';
import { CartItemComponent } from '../../cart/cart-item.component';
import { CartSummaryComponent } from '../../cart/cart-summary.component';
import { CouponInputComponent } from '../../cart/coupon-input.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, AsyncPipe,
    CartItemComponent, CartSummaryComponent,
    CouponInputComponent, SkeletonLoaderComponent,
    EmptyStateComponent,
  ],
  template: `
    <div class="max-w-layout mx-auto px-4 py-6 min-h-screen">
      <h1 class="text-xl md:text-2xl font-bold text-dark mb-6">
        My Bag
        @if ((cartCount$ | async) ?? 0; as count) {
          @if (count > 0) {
            <span class="text-base text-muted font-normal ml-2">({{ count }} items)</span>
          }
        }
      </h1>

      @if (isLoading$ | async) {
        <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-1 space-y-4">
            @for (n of [1, 2, 3]; track n) {
              <app-skeleton-loader height="120px" cssClass="rounded-lg" />
            }
          </div>
          <div class="lg:w-72">
            <app-skeleton-loader height="300px" cssClass="rounded-lg" />
          </div>
        </div>
      } @else if ((cartItems$ | async)?.length ?? 0; as itemCount) {
        @if (itemCount > 0) {
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- Items list -->
            <div class="flex-1">
              <div class="bg-card rounded-lg border border-gray-100 px-4">
                @for (item of cartItems$ | async; track item.id) {
                  <app-cart-item
                    [item]="item"
                    (quantityChange)="updateQuantity(item.id, $event)"
                    (remove)="removeItem(item.id)"
                  />
                }
              </div>

              <div class="mt-4">
                <app-coupon-input (applyCoupon)="applyCoupon($event)" />
              </div>
            </div>

            <!-- Summary -->
            <div class="lg:w-80">
              @if (cart$ | async; as cart) {
                <app-cart-summary [cart]="cart" [itemCount]="itemCount" />
              }
            </div>
          </div>
        } @else {
          <app-empty-state
            icon="🛍️"
            title="Your bag is empty"
            subtitle="Looks like you haven't added anything yet."
            ctaLabel="Start Shopping"
            ctaRoute="/products"
          />
        }
      } @else {
        <app-empty-state
          icon="🛍️"
          title="Your bag is empty"
          subtitle="Looks like you haven't added anything yet."
          ctaLabel="Start Shopping"
          ctaRoute="/products"
        />
      }
    </div>
  `,
})
export class CartComponent implements OnInit {
  private readonly store = inject(Store);

  readonly cart$      = this.store.select(selectCart);
  readonly cartItems$ = this.store.select(selectCartItems);
  readonly cartCount$ = this.store.select(selectCartCount);
  readonly isLoading$ = this.store.select(selectCartLoading);

  ngOnInit(): void {
    this.store.dispatch(CartActions.loadCart());
  }

  updateQuantity(itemId: string, quantity: number): void {
    this.store.dispatch(CartActions.updateItem({ itemId, quantity }));
  }

  removeItem(itemId: string): void {
    this.store.dispatch(CartActions.removeItem({ itemId }));
  }

  applyCoupon(couponCode: string): void {
    this.store.dispatch(CartActions.applyCoupon({ couponCode }));
  }
}
