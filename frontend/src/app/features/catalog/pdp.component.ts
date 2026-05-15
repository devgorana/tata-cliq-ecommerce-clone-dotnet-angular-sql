import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CatalogActions } from '../../store/catalog/catalog.actions';
import { selectSelectedProduct, selectPdpLoading } from '../../store/catalog/catalog.selectors';
import { Product, ProductVariant } from '../../core/models/product.model';
import { getColourHex } from '../../core/utils/colour-map';
import { ColourOption } from '../../catalog/colour-selector.component';
import { ProductImagesComponent } from '../../catalog/product-images.component';
import { ProductInfoComponent } from '../../catalog/product-info.component';
import { SizeSelectorComponent } from '../../catalog/size-selector.component';
import { ColourSelectorComponent } from '../../catalog/colour-selector.component';
import { AddToCartPanelComponent } from '../../catalog/add-to-cart-panel.component';
import { ProductDescriptionComponent } from '../../catalog/product-description.component';
import { ProductReviewsComponent } from '../../catalog/product-reviews.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb.component';

@Component({
  selector: 'app-pdp',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    ProductImagesComponent, ProductInfoComponent,
    SizeSelectorComponent, ColourSelectorComponent,
    AddToCartPanelComponent, ProductDescriptionComponent,
    ProductReviewsComponent, SkeletonLoaderComponent,
    BreadcrumbComponent,
  ],
  template: `
    <!-- DESIGN.md §5.3 PDP -->
    <div class="max-w-layout mx-auto px-4 py-6 min-h-screen pb-24 md:pb-6">

      @if (isLoading()) {
        <!-- Loading skeleton -->
        <div class="flex flex-col md:flex-row gap-8">
          <div class="md:w-3/5">
            <app-skeleton-loader height="500px" cssClass="rounded-lg" />
          </div>
          <div class="md:w-2/5 space-y-4">
            <app-skeleton-loader height="14px" width="55%" />
            <app-skeleton-loader height="20px" width="40%" />
            <app-skeleton-loader height="32px" />
            <app-skeleton-loader height="24px" width="30%" />
            <app-skeleton-loader height="16px" width="60%" />
            <app-skeleton-loader height="48px" />
          </div>
        </div>
      } @else if (product()) {

        <!-- Breadcrumb — DESIGN.md §4.17 -->
        <app-breadcrumb
          [crumbs]="[
            { label: 'Home',     link: '/' },
            { label: 'Products', link: '/products' },
            { label: product()!.categoryName, link: '/products' },
            { label: product()!.name }
          ]"
        />

        <div class="flex flex-col md:flex-row gap-8">

          <!-- Images — sticky on desktop -->
          <div class="md:w-3/5 md:sticky md:top-20 md:self-start">
            <app-product-images
              [images]="product()!.imageUrls"
              [productName]="product()!.name"
            />
          </div>

          <!-- Details panel -->
          <div class="md:w-2/5 space-y-5">
            <app-product-info
              [product]="product()!"
              [variantPrice]="selectedVariant()?.priceOverride ?? null"
            />

            <!-- Size selector — variant-aware -->
            @if (product()!.variants.length > 0) {
              <app-size-selector
                [variants]="product()!.variants"
                [selectedSize]="selectedSize()"
                (sizeChange)="onSizeChange($event)"
                (sizeGuideClick)="openSizeGuide()"
              />
            }

            <!-- Colour selector — stock-aware for selected size -->
            @if (availableColours().length > 0) {
              <app-colour-selector
                [colours]="availableColours()"
                [selectedColour]="selectedColour()"
                [variants]="product()!.variants"
                [selectedSize]="selectedSize()"
                (colourChange)="selectedColour.set($event)"
              />
            }

            <!-- ATC panel — hidden on mobile (replaced by sticky bar below) -->
            <div class="hidden md:block">
              <app-add-to-cart-panel
                [product]="product()!"
                [selectedSize]="selectedSize()"
                [selectedColour]="selectedColour()"
                [requiresSize]="hasNonOneSize()"
                [requiresColour]="availableColours().length > 0"
                [quantity]="quantity()"
                [variantStock]="selectedVariant()?.stockQuantity ?? null"
                (quantityChange)="quantity.set($event)"
              />
            </div>

            <app-product-description [description]="product()!.description" />

            <app-product-reviews
              [reviews]="[]"
              [overallRating]="product()!.rating"
              [reviewCount]="product()!.reviewCount"
            />
          </div>
        </div>

        <!-- Sticky mobile ATC bar — DESIGN.md §5.3, §7 Mobile -->
        <div
          class="fixed bottom-0 inset-x-0 md:hidden z-40
                 bg-white border-t border-border px-4 py-3 shadow-xl"
          aria-label="Purchase actions"
        >
          <app-add-to-cart-panel
            [product]="product()!"
            [selectedSize]="selectedSize()"
            [selectedColour]="selectedColour()"
            [requiresSize]="hasNonOneSize()"
            [requiresColour]="availableColours().length > 0"
            [quantity]="quantity()"
            [variantStock]="selectedVariant()?.stockQuantity ?? null"
            (quantityChange)="quantity.set($event)"
          />
        </div>

      } @else {
        <div class="flex flex-col items-center justify-center py-24">
          <span class="text-6xl mb-4" aria-hidden="true">🔍</span>
          <h2 class="text-xl font-semibold text-dark mb-2">Product not found</h2>
          <p class="text-muted text-sm">This product may have been removed or the link is incorrect.</p>
        </div>
      }
    </div>
  `,
})
export class PdpComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private routeSub?: Subscription;

  /** Convert store observables to signals for template use. */
  readonly product$   = this.store.select(selectSelectedProduct);
  readonly product    = toSignal(this.product$, { initialValue: null });
  readonly isLoading  = toSignal(this.store.select(selectPdpLoading), { initialValue: false });

  /** Lifted quantity — shared by desktop + mobile ATC panel instances. */
  readonly quantity       = signal<number>(1);
  readonly selectedSize   = signal<string | null>(null);
  readonly selectedColour = signal<string | null>(null);

  /** Computed: unique colour options for the current product. */
  readonly availableColours = computed<ColourOption[]>(() => {
    const p = this.product();
    if (!p) return [];
    const seen = new Set<string>();
    const result: ColourOption[] = [];
    for (const v of p.variants) {
      if (v.colour && !seen.has(v.colour)) {
        seen.add(v.colour);
        result.push({ name: v.colour, hex: getColourHex(v.colour) });
      }
    }
    return result;
  });

  /** Computed: true when the product has sizes other than ONE SIZE. */
  readonly hasNonOneSize = computed<boolean>(() => {
    const p = this.product();
    if (!p) return false;
    return p.variants.some((v) => v.size !== 'ONE SIZE');
  });

  /** Computed: the variant matching the current size + colour selection. */
  readonly selectedVariant = computed<ProductVariant | null>(() => {
    const p = this.product();
    if (!p) return null;
    const size   = this.selectedSize();
    const colour = this.selectedColour();
    return (
      p.variants.find(
        (v) =>
          (size   === null || v.size   === size) &&
          (colour === null || v.colour === colour),
      ) ?? null
    );
  });

  ngOnInit(): void {
    // Reactive route param — handles navigation between PDPs without component re-creation
    this.routeSub = this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id') ?? '';
          if (id) {
            this.store.dispatch(CatalogActions.loadProduct({ id }));
            this.selectedSize.set(null);
            this.selectedColour.set(null);
            this.quantity.set(1);
          }
          return this.product$;
        }),
      )
      .subscribe((product) => {
        // Auto-select first available (in-stock) variant on product load
        if (product && this.selectedSize() === null) {
          this.autoSelectFirstVariant(product);
        }
      });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    // Clear stale product so next PDP visit doesn't flash previous product
    this.store.dispatch(CatalogActions.clearSelectedProduct());
  }

  onSizeChange(size: string): void {
    this.selectedSize.set(size);
    // If the currently selected colour is OOS for the new size, clear it
    const colour = this.selectedColour();
    if (colour) {
      const p = this.product();
      if (p) {
        const stillAvailable = p.variants.some(
          (v) => v.size === size && v.colour === colour && v.stockQuantity > 0,
        );
        if (!stillAvailable) this.selectedColour.set(null);
      }
    }
  }

  openSizeGuide(): void {
    // Placeholder — size-guide modal implemented in PDP-9
  }

  private autoSelectFirstVariant(product: Product): void {
    const firstInStock = product.variants.find((v) => v.stockQuantity > 0);
    if (!firstInStock) return;
    if (firstInStock.size !== 'ONE SIZE') this.selectedSize.set(firstInStock.size);
    if (firstInStock.colour) this.selectedColour.set(firstInStock.colour);
  }
}
