import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../shared/components/star-rating.component';
import { Review } from '../core/models/review.model';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, StarRatingComponent],
  template: `
    <section class="border-t border-gray-100 pt-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-semibold text-dark">
          Customer Reviews
          @if (reviewCount > 0) { <span class="text-muted font-normal">({{ reviewCount }})</span> }
        </h2>
        @if (overallRating > 0) {
          <app-star-rating [rating]="overallRating" [showCount]="false" />
        }
      </div>

      @if (reviews.length === 0) {
        <p class="text-sm text-muted py-4">No reviews yet. Be the first to review this product.</p>
      } @else {
        <ul class="space-y-5">
          @for (review of reviews; track review.id) {
            <li class="border-b border-gray-50 pb-5 last:border-0">
              <div class="flex items-start justify-between gap-3 mb-1">
                <div>
                  <p class="text-sm font-semibold text-dark">{{ review.author }}</p>
                  <app-star-rating [rating]="review.rating" [showCount]="false" />
                </div>
                <time class="text-xs text-muted flex-shrink-0">{{ review.date }}</time>
              </div>
              <p class="text-sm font-medium text-dark mt-1">{{ review.title }}</p>
              <p class="text-sm text-dark/80 mt-1 leading-relaxed">{{ review.body }}</p>
            </li>
          }
        </ul>
      }
    </section>
  `,
})
export class ProductReviewsComponent {
  @Input({ required: true }) reviews: Review[] = [];
  @Input() overallRating = 0;
  @Input() reviewCount   = 0;
}
