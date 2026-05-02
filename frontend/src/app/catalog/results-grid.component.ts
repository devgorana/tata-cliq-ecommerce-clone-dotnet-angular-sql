import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../core/models/product.model';
import { ProductCardComponent } from './product-card.component';
import { SkeletonLoaderComponent } from '../shared/components/skeleton-loader.component';

@Component({
  selector: 'app-results-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ProductCardComponent, SkeletonLoaderComponent],
  template: `
    <!-- Loading skeletons -->
    @if (isLoading) {
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        @for (n of skeletons; track n) {
          <div class="bg-card rounded-lg overflow-hidden shadow-sm">
            <app-skeleton-loader height="260px" />
            <div class="p-3 space-y-2">
              <app-skeleton-loader height="12px" width="60%" />
              <app-skeleton-loader height="14px" />
              <app-skeleton-loader height="14px" width="80%" />
              <app-skeleton-loader height="16px" width="40%" />
            </div>
          </div>
        }
      </div>
    }

    <!-- Empty state -->
    @if (!isLoading && products.length === 0) {
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <span class="text-6xl mb-4">🔍</span>
        <h3 class="text-lg font-semibold text-dark mb-2">No products found</h3>
        <p class="text-muted text-sm mb-6">Try adjusting your filters or search terms.</p>
        <button class="bg-navy text-white px-6 py-2 rounded hover:bg-blue transition text-sm" (click)="clearFilters.emit()">
          Clear Filters
        </button>
      </div>
    }

    <!-- Product grid -->
    @if (!isLoading && products.length > 0) {
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        @for (product of products; track product.id) {
          <app-product-card
            [product]="product"
            (wishlistToggle)="wishlistToggle.emit($event)"
          />
        }
      </div>

      <!-- Pagination -->
      @if (totalCount > pageSize) {
        <div class="flex justify-center items-center gap-2 mt-8">
          <button
            class="px-3 py-1.5 border border-gray-200 rounded text-sm hover:border-navy hover:text-navy transition disabled:opacity-40"
            [disabled]="currentPage <= 1"
            (click)="pageChange.emit(currentPage - 1)"
          >← Prev</button>

          <span class="text-sm text-muted px-2">
            Page {{ currentPage }} of {{ totalPages }}
          </span>

          <button
            class="px-3 py-1.5 border border-gray-200 rounded text-sm hover:border-navy hover:text-navy transition disabled:opacity-40"
            [disabled]="currentPage >= totalPages"
            (click)="pageChange.emit(currentPage + 1)"
          >Next →</button>
        </div>
      }
    }
  `,
})
export class ResultsGridComponent {
  @Input({ required: true }) products: Product[] = [];
  @Input() totalCount   = 0;
  @Input() currentPage  = 1;
  @Input() pageSize     = 24;
  @Input() isLoading    = false;
  @Output() pageChange      = new EventEmitter<number>();
  @Output() wishlistToggle  = new EventEmitter<string>();
  @Output() clearFilters    = new EventEmitter<void>();

  readonly skeletons = Array.from({ length: 12 }, (_, i) => i);

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}
