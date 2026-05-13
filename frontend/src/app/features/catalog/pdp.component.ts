import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CatalogActions } from '../../store/catalog/catalog.actions';
import { selectSelectedProduct, selectCatalogLoading } from '../../store/catalog/catalog.selectors';
import { ProductImagesComponent } from '../../catalog/product-images.component';
import { ProductInfoComponent } from '../../catalog/product-info.component';
import { SizeSelectorComponent } from '../../catalog/size-selector.component';
import { ColourSelectorComponent, ColourOption } from '../../catalog/colour-selector.component';
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
    CommonModule, AsyncPipe,
    ProductImagesComponent, ProductInfoComponent,
    SizeSelectorComponent, ColourSelectorComponent,
    AddToCartPanelComponent, ProductDescriptionComponent,
    ProductReviewsComponent, SkeletonLoaderComponent,
    BreadcrumbComponent,
  ],
  template: `
    <!-- DESIGN.md §5.3 PDP — breadcrumb + sticky mobile ATC bar -->
    <div class="max-w-layout mx-auto px-4 py-6 min-h-screen pb-24 md:pb-6">

      @if (isLoading$ | async) {
        <!-- Loading skeleton -->
        <div class="flex flex-col md:flex-row gap-8">
          <div class="md:w-1/2">
            <app-skeleton-loader height="500px" cssClass="rounded-lg" />
          </div>
          <div class="md:w-1/2 space-y-4">
            <app-skeleton-loader height="14px" width="55%" />
            <app-skeleton-loader height="20px" width="40%" />
            <app-skeleton-loader height="32px" />
            <app-skeleton-loader height="24px" width="30%" />
            <app-skeleton-loader height="16px" width="60%" />
            <app-skeleton-loader height="48px" />
          </div>
        </div>
      } @else if (product$ | async; as product) {

        <!-- Breadcrumb — DESIGN.md §4.17 -->
        <app-breadcrumb
          [crumbs]="[
            { label: 'Home',     link: '/' },
            { label: 'Products', link: '/products' },
            { label: product.categoryName, link: '/products' },
            { label: product.name }
          ]"
        />

        <div class="flex flex-col md:flex-row gap-8">

          <!-- Images — sticky on desktop -->
          <div class="md:w-3/5 md:sticky md:top-20 md:self-start">
            <app-product-images
              [images]="product.imageUrls"
              [productName]="product.name"
            />
          </div>

          <!-- Details panel -->
          <div class="md:w-2/5 space-y-5">
            <app-product-info [product]="product" />

            <!-- Size selector -->
            @if (getSizes(product); as availableSizes) {
              @if (availableSizes.length > 0) {
                <app-size-selector
                  [sizes]="availableSizes"
                  [selectedSize]="selectedSize()"
                  (sizeChange)="selectedSize.set($event)"
                />
              }
            }

            <!-- Colour selector -->
            @if (getColours(product); as availableColours) {
              @if (availableColours.length > 0) {
                <app-colour-selector
                  [colours]="availableColours"
                  [selectedColour]="selectedColour()"
                  (colourChange)="selectedColour.set($event)"
                />
              }
            }

            <!-- ATC panel — hidden on mobile (replaced by sticky bar below) -->
            <div class="hidden md:block">
              <app-add-to-cart-panel
                [product]="product"
                [selectedSize]="selectedSize()"
                [selectedColour]="selectedColour()"
                [requiresSize]="getSizes(product).length > 0"
                [requiresColour]="getColours(product).length > 0"
              />
            </div>

            <app-product-description [description]="product.description" />

            <app-product-reviews
              [reviews]="[]"
              [overallRating]="product.rating"
              [reviewCount]="product.reviewCount"
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
            [product]="product"
            [selectedSize]="selectedSize()"
            [selectedColour]="selectedColour()"
            [requiresSize]="getSizes(product).length > 0"
            [requiresColour]="getColours(product).length > 0"
          />
        </div>

      } @else {
        <div class="flex flex-col items-center justify-center py-24">
          <span class="text-6xl mb-4">🔍</span>
          <h2 class="text-xl font-semibold text-dark mb-2">Product not found</h2>
          <p class="text-muted text-sm">This product may have been removed or the link is incorrect.</p>
        </div>
      }
    </div>
  `,
})
export class PdpComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);

  readonly product$  = this.store.select(selectSelectedProduct);
  readonly isLoading$ = this.store.select(selectCatalogLoading);

  readonly selectedSize   = signal<string | null>(null);
  readonly selectedColour = signal<string | null>(null);

  getSizes(product: any): string[] {
    const sizes = product.variants
      .map((v: any) => v.size)
      .filter((s: string) => s !== 'ONE SIZE');
    return [...new Set(sizes)] as string[];
  }

  getColours(product: any): ColourOption[] {
    const colours = product.variants
      .map((v: any) => v.colour)
      .filter(Boolean);
    const unique = [...new Set(colours)] as string[];
    return unique.map(name => ({
      name,
      hex: this.getHexCode(name)
    }));
  }

  private getHexCode(colour: string): string {
    const map: Record<string, string> = {
      'Black':  '#212121',
      'White':  '#FFFFFF',
      'Navy':   '#1A1A6B',
      'Red':    '#E4002B',
      'Pink':   '#FFC0CB',
      'Blue':   '#0000FF',
      'Grey':   '#808080',
      'Green':  '#008000',
      'Yellow': '#FFFF00',
      'Brown':  '#A52A2A',
      'Silver': '#C0C0C0',
      'Regular': '#E0E0E0'
    };
    return map[colour] || '#E0E0E0';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(CatalogActions.loadProduct({ id }));
    }
  }
}
