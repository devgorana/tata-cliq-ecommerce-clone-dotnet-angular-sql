import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface CategoryBanner {
  label: string;
  slug: string;
  emoji: string;
  bgColor: string;
}

@Component({
  selector: 'app-category-banners',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-6 md:py-10 px-4 max-w-layout mx-auto" aria-label="Shop by category">
      <h2 class="text-lg md:text-2xl font-bold text-dark mb-4 md:mb-6">Shop By Category</h2>

      <!-- Mobile: 4-col scroll -->
      <div class="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
        @for (cat of categories; track cat.slug) {
          <a
            [routerLink]="['/products']"
            [queryParams]="{ category: cat.slug }"
            class="flex flex-col items-center gap-2 group"
          >
            <div
              class="w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-sm group-hover:scale-105 transition-transform"
              [style.background]="cat.bgColor"
            >
              {{ cat.emoji }}
            </div>
            <span class="text-[11px] md:text-sm text-dark text-center leading-tight">{{ cat.label }}</span>
          </a>
        }
      </div>
    </section>
  `,
})
export class CategoryBannersComponent {
  readonly categories: CategoryBanner[] = [
    { label: 'Women',       slug: 'women',       emoji: '👗', bgColor: '#FFF0F3' },
    { label: 'Men',         slug: 'men',         emoji: '👔', bgColor: '#F0F4FF' },
    { label: 'Kids',        slug: 'kids',        emoji: '🧸', bgColor: '#FFF9E6' },
    { label: 'Electronics', slug: 'electronics', emoji: '📱', bgColor: '#F0FFF4' },
    { label: 'Jewellery',   slug: 'jewellery',   emoji: '💍', bgColor: '#FFF8F0' },
    { label: 'Footwear',    slug: 'footwear',    emoji: '👟', bgColor: '#F5F0FF' },
    { label: 'Beauty',      slug: 'beauty',      emoji: '💄', bgColor: '#FFF0F8' },
    { label: 'Luxury',      slug: 'luxury',      emoji: '✨', bgColor: '#F7F7F0' },
  ];
}
