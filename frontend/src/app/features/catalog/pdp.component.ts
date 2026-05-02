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
  ],
  template: `
    <div class="max-w-layout mx-auto px-4 py-6 min-h-screen">

      @if (isLoading$ | async) {
        <!-- Loading skeleton -->
        <div class="flex flex-col md:flex-row gap-8">
          <div class="md:w-1/2">
            <app-skeleton-loader height="500px" cssClass="rounded-lg" />
          </div>
          <div class="md:w-1/2 space-y-4">
            <app-skeleton-loader height="20px" width="40%" />
            <app-skeleton-loader height="32px" />
            <app-skeleton-loader height="24px" width="30%" />
            <app-skeleton-loader height="16px" width="60%" />
            <app-skeleton-loader height="48px" />
          </div>
        </div>
      } @else if (product$ | async; as product) {
        <div class="flex flex-col md:flex-row gap-8">

          <!-- Images -->
          <div class="md:w-1/2 md:sticky md:top-20 md:self-start">
            <app-product-images
              [images]="product.imageUrls"
              [productName]="product.name"
            />
          </div>

          <!-- Details panel -->
          <div class="md:w-1/2 space-y-5">
            <app-product-info [product]="product" />

            <!-- Size selector (shown for apparel categories) -->
            @if (sizes.length > 0) {
              <app-size-selector
                [sizes]="sizes"
                [selectedSize]="selectedSize()"
                (sizeChange)="selectedSize.set($event)"
              />
            }

            <!-- Colour selector -->
            @if (colours.length > 0) {
              <app-colour-selector
                [colours]="colours"
                [selectedColour]="selectedColour()"
                (colourChange)="selectedColour.set($event)"
              />
            }

            <app-add-to-cart-panel
              [product]="product"
              [selectedSize]="selectedSize()"
              [selectedColour]="selectedColour()"
              [requiresSize]="sizes.length > 0"
            />

            <app-product-description [description]="product.description" />

            <app-product-reviews
              [reviews]="[]"
              [overallRating]="product.rating"
              [reviewCount]="product.reviewCount"
            />
          </div>
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

  readonly sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  readonly colours: ColourOption[] = [
    { name: 'Black', hex: '#212121' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Navy',  hex: '#1A1A6B' },
    { name: 'Red',   hex: '#E4002B' },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(CatalogActions.loadProduct({ id }));
    }
  }
}
