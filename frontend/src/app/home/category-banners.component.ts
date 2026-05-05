import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface CategoryItem {
  label:   string;
  slug:    string;
  emoji:   string;
  bgColor: string;
}

@Component({
  selector: 'app-category-banners',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- DESIGN.md §4.5 Category Shortcut Strip -->
    <section class="py-6 md:py-10 px-4 max-w-layout mx-auto" aria-label="Shop by category">

      <!-- Section header — DESIGN.md §4.7 -->
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <p class="text-[11px] tracking-widest uppercase text-red font-medium mb-0.5">Explore</p>
          <h2 class="font-display text-xl md:text-2xl font-semibold text-dark">Shop By Category</h2>
        </div>
        <a routerLink="/products" class="text-sm font-medium text-red hover:underline" aria-label="View all categories">View All</a>
      </div>

      <!-- Horizontal scroll strip — overflow-x auto, no scrollbar -->
      <div
        class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-between"
        style="scrollbar-width: none; -ms-overflow-style: none;"
        role="list"
        aria-label="Product categories"
      >
        @for (cat of categories; track cat.slug) {
          <a
            [routerLink]="['/products']"
            [queryParams]="{ category: cat.slug }"
            class="flex flex-col items-center gap-2 group flex-shrink-0"
            role="listitem"
            [attr.aria-label]="'Shop ' + cat.label"
          >
            <!-- 72px circle — DESIGN.md: 72px circle image, scale on hover -->
            <div
              class="w-[72px] h-[72px] rounded-full flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 group-hover:shadow-sm transition-all duration-300"
              [style.background]="cat.bgColor"
              aria-hidden="true"
            >
              {{ cat.emoji }}
            </div>
            <!-- Label — 12px DM Sans -->
            <span class="text-[12px] text-dark text-center leading-tight whitespace-nowrap">{{ cat.label }}</span>
          </a>
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    div::-webkit-scrollbar { display: none; }
  `],
})
export class CategoryBannersComponent {
  readonly categories: CategoryItem[] = [
    { label: 'Women',     slug: 'women',       emoji: '👗', bgColor: '#FFF0F3' },
    { label: 'Men',       slug: 'men',         emoji: '👔', bgColor: '#F0F4FF' },
    { label: 'Kids',      slug: 'kids',        emoji: '🧸', bgColor: '#FFF9E6' },
    { label: 'Beauty',    slug: 'beauty',      emoji: '💄', bgColor: '#FFF0F8' },
    { label: 'Footwear',  slug: 'footwear',    emoji: '👟', bgColor: '#F5F0FF' },
    { label: 'Jewellery', slug: 'jewellery',   emoji: '💍', bgColor: '#FFF8F0' },
    { label: 'Luxury',    slug: 'luxury',      emoji: '✨', bgColor: '#F7F7F0' },
    { label: 'Home',      slug: 'home',        emoji: '🏠', bgColor: '#F0FFF4' },
    { label: 'Sports',    slug: 'sports',      emoji: '⚽', bgColor: '#F0FAFF' },
    { label: 'Sale',      slug: 'sale',        emoji: '🏷️',  bgColor: '#FFF0F0' },
  ];
}
