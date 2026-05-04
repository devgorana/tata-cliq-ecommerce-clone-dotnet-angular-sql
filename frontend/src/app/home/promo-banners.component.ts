import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface PromoBanner {
  title:      string;
  subtitle:   string;
  ctaLabel:   string;
  ctaLink:    string;
  imageUrl:   string;
  bgFallback: string;
}

@Component({
  selector: 'app-promo-banners',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- DESIGN.md §4.9 Promotional Banners (2-up / 3-up) -->
    <section class="py-6 md:py-10 px-4 max-w-layout mx-auto" aria-label="Promotions">

      <!-- 2-up row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        @for (banner of twoBanners; track banner.title) {
          <a
            [routerLink]="banner.ctaLink"
            class="relative overflow-hidden rounded-lg group block"
            style="height: 200px"
            [attr.aria-label]="banner.title + ' — ' + banner.ctaLabel"
          >
            <!-- Background image -->
            <img
              [src]="banner.imageUrl"
              [alt]="banner.title"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <!-- Bottom gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <!-- Text -->
            <div class="absolute inset-0 flex flex-col justify-end p-4">
              <p class="text-white/80 text-xs mb-0.5">{{ banner.subtitle }}</p>
              <h3 class="font-display text-white text-lg md:text-xl font-semibold leading-tight mb-2">{{ banner.title }}</h3>
              <span class="text-white text-sm font-medium hover:underline">{{ banner.ctaLabel }} →</span>
            </div>
          </a>
        }
      </div>

      <!-- 3-up row -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        @for (banner of threeBanners; track banner.title) {
          <a
            [routerLink]="banner.ctaLink"
            class="relative overflow-hidden rounded-lg group block"
            style="height: 160px"
            [attr.aria-label]="banner.title + ' — ' + banner.ctaLabel"
          >
            <!-- Background image -->
            <img
              [src]="banner.imageUrl"
              [alt]="banner.title"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <!-- Bottom gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <!-- Text -->
            <div class="absolute inset-0 flex flex-col justify-end p-4">
              <h3 class="font-display text-white text-base md:text-lg font-semibold leading-tight mb-1">{{ banner.title }}</h3>
              <span class="text-white text-sm font-medium hover:underline">{{ banner.ctaLabel }} →</span>
            </div>
          </a>
        }
      </div>
    </section>
  `,
})
export class PromoBannersComponent {
  readonly twoBanners: PromoBanner[] = [
    {
      title:      "Women's New Season",
      subtitle:   'Exclusive Collection',
      ctaLabel:   "Shop Women's",
      ctaLink:    '/products?category=women',
      imageUrl:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
      bgFallback: '#1C2B4A',
    },
    {
      title:      "Men's Edit",
      subtitle:   'Style for Every Occasion',
      ctaLabel:   "Shop Men's",
      ctaLink:    '/products?category=men',
      imageUrl:   'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop',
      bgFallback: '#1A1A1A',
    },
  ];

  readonly threeBanners: PromoBanner[] = [
    {
      title:      'Earn NeuCoins',
      subtitle:   '',
      ctaLabel:   'Know More',
      ctaLink:    '/help/cliq-cash',
      imageUrl:   'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop',
      bgFallback: '#F9A825',
    },
    {
      title:      'Try & Buy',
      subtitle:   '',
      ctaLabel:   'How it Works',
      ctaLink:    '/help/try-and-buy',
      imageUrl:   'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop',
      bgFallback: '#2E7D32',
    },
    {
      title:      'Easy Returns',
      subtitle:   '',
      ctaLabel:   'Return Policy',
      ctaLink:    '/help/returns',
      imageUrl:   'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?q=80&w=800&auto=format&fit=crop',
      bgFallback: '#0071C2',
    },
  ];
}
