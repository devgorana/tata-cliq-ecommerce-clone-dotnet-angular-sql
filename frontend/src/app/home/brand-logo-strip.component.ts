import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Brand {
  name:    string;
  slug:    string;
  logoUrl: string;
}

@Component({
  selector: 'app-brand-logo-strip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- DESIGN.md §4.8 Brand Logo Strip -->
    <section class="py-6 md:py-10 px-4 max-w-layout mx-auto" aria-label="Top brands">

      <!-- Section header — DESIGN.md §4.7 -->
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <p class="text-[11px] tracking-widest uppercase text-red font-medium mb-0.5">Featured</p>
          <h2 class="font-display text-xl md:text-2xl font-semibold text-dark">Top Brands</h2>
          <!-- 2px red divider line -->
          <div class="mt-1.5 w-10 h-0.5 bg-red"></div>
        </div>
        <a routerLink="/products" [queryParams]="{ category: 'brands' }" class="text-sm font-medium text-red hover:underline" aria-label="View all brands">
          View All
        </a>
      </div>

      <!-- Scrollable brand logo row — DESIGN.md: 160×80px bordered box, grayscale → color on hover -->
      <div
        class="flex gap-4 overflow-x-auto pb-2"
        style="scrollbar-width: none; -ms-overflow-style: none;"
        role="list"
        aria-label="Brand logos"
      >
        @for (brand of brands; track brand.slug) {
          <a
            [routerLink]="['/products']"
            [queryParams]="{ brand: brand.slug }"
            class="flex-shrink-0 flex items-center justify-center border border-border rounded-md bg-white hover:shadow-sm transition-all duration-300 group"
            style="width: 160px; height: 80px;"
            role="listitem"
            [attr.aria-label]="'Shop ' + brand.name"
          >
            @if (brand.logoUrl) {
              <img
                [src]="brand.logoUrl"
                [alt]="brand.name"
                class="max-w-[120px] max-h-[48px] object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            } @else {
              <!-- Fallback text logo when no image available -->
              <span class="text-sm font-semibold text-mid-gray group-hover:text-dark transition-colors tracking-wide">
                {{ brand.name }}
              </span>
            }
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
export class BrandLogoStripComponent {
  readonly brands: Brand[] = [
    { name: 'Puma',      slug: 'puma',      logoUrl: '' },
    { name: 'Nike',      slug: 'nike',      logoUrl: '' },
    { name: 'Adidas',    slug: 'adidas',    logoUrl: '' },
    { name: 'H&M',       slug: 'hm',        logoUrl: '' },
    { name: 'Zara',      slug: 'zara',      logoUrl: '' },
    { name: 'Levis',     slug: 'levis',     logoUrl: '' },
    { name: 'Tommy',     slug: 'tommy',     logoUrl: '' },
    { name: 'Fossil',    slug: 'fossil',    logoUrl: '' },
  ];
}
