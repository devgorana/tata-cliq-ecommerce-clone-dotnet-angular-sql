import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface HeroSlide {
  imageUrl: string;
  eyebrow:  string;
  title:    string;
  subtitle: string;
  ctaLabel: string;
  ctaLink:  string;
  bgColor:  string;
}

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- DESIGN.md §4.4 Hero Banner / Carousel -->
    <section
      class="relative w-full overflow-hidden"
      [style.height]="isMobile ? '240px' : '480px'"
      aria-label="Featured promotions"
      aria-roledescription="carousel"
    >
      <!-- Slides -->
      @for (slide of slides; track slide.title; let i = $index) {
        <div
          class="absolute inset-0 flex items-end transition-opacity duration-300"
          [class.opacity-100]="currentIndex() === i"
          [class.opacity-0]="currentIndex() !== i"
          [attr.aria-hidden]="currentIndex() !== i"
          role="group"
          [attr.aria-roledescription]="'slide ' + (i + 1) + ' of ' + slides.length"
          [attr.aria-label]="slide.title"
        >
          <!-- Background image -->
          @if (slide.imageUrl) {
            <img
              [src]="slide.imageUrl"
              [alt]="slide.title"
              class="absolute inset-0 w-full h-full object-cover -z-10"
              loading="eager"
            />
            <!-- Left-to-right gradient overlay for text legibility -->
            <div class="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent -z-10"></div>
          } @else {
            <div class="absolute inset-0 -z-10" [style.background]="slide.bgColor"></div>
          }

          <!-- Text block — bottom-left aligned -->
          <div class="max-w-layout mx-auto px-6 md:px-16 w-full pb-10 md:pb-16 relative z-10">
            <div class="max-w-sm md:max-w-lg">
              <!-- Eyebrow — DESIGN.md: 12px DM Sans ALL CAPS tracking-widest -->
              <p class="text-[12px] tracking-widest uppercase text-white/80 font-medium mb-2 md:mb-3">
                {{ slide.eyebrow }}
              </p>
              <!-- Headline — Playfair Display Bold -->
              <h2 class="font-display text-2xl md:text-[40px] font-bold text-white mb-3 md:mb-4 leading-tight">
                {{ slide.title }}
              </h2>
              <!-- Sub-text — DM Sans Light 70% opacity -->
              <p class="text-sm md:text-base text-white/70 font-light mb-5 md:mb-7 hidden sm:block">
                {{ slide.subtitle }}
              </p>
              <!-- CTA — red background per DESIGN.md §4.4 -->
              <a
                [routerLink]="slide.ctaLink"
                class="inline-block bg-red text-white font-semibold px-6 py-2.5 md:px-8 md:py-3 rounded-md text-sm md:text-base hover:bg-red/90 active:scale-[0.97] transition"
              >
                {{ slide.ctaLabel }}
              </a>
            </div>
          </div>
        </div>
      }

      <!-- Prev/Next chevrons -->
      <button
        class="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Previous slide"
        (click)="prev()"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <button
        class="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Next slide"
        (click)="next()"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>

      <!-- Dot indicators -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" role="tablist" aria-label="Slide indicators">
        @for (slide of slides; track slide.title; let i = $index) {
          <button
            [class.bg-white]="currentIndex() === i"
            [class.bg-white/40]="currentIndex() !== i"
            [class.w-6]="currentIndex() === i"
            [class.w-2]="currentIndex() !== i"
            class="h-2 rounded-full transition-all duration-300"
            role="tab"
            [attr.aria-selected]="currentIndex() === i"
            [attr.aria-label]="'Go to slide ' + (i + 1)"
            (click)="goTo(i)"
          ></button>
        }
      </div>
    </section>
  `,
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  readonly currentIndex = signal(0);
  private timer: ReturnType<typeof setInterval> | null = null;

  readonly isMobile = window.innerWidth < 768;

  readonly slides: HeroSlide[] = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
      eyebrow:  'New Season · Spring / Summer 2026',
      title:    'New Arrivals Are Here',
      subtitle: 'Up to 50% off on premium fashion — Limited time offer',
      ctaLabel: 'Shop Women',
      ctaLink:  '/products?category=women',
      bgColor:  'linear-gradient(135deg, #1C2B4A 0%, #2C3E70 100%)',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
      eyebrow:  'Curated · Authentic · Exclusive',
      title:    'Luxury Redefined',
      subtitle: 'Discover our handpicked collection of premium brands',
      ctaLabel: 'Shop Luxury',
      ctaLink:  '/products?category=luxury',
      bgColor:  'linear-gradient(135deg, #1A1A1A 0%, #424242 100%)',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2070&auto=format&fit=crop',
      eyebrow:  'Sale Picks · Up to 70% Off',
      title:    'The Big Fashion Sale',
      subtitle: 'Biggest discounts of the season across top brands',
      ctaLabel: 'Shop Sale',
      ctaLink:  '/products?category=sale',
      bgColor:  'linear-gradient(90deg, #E31837 0%, #FF6B35 100%)',
    },
  ];

  ngOnInit(): void {
    this.timer = setInterval(() => this.next(), 5000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  next(): void {
    this.currentIndex.update((i) => (i + 1) % this.slides.length);
  }

  prev(): void {
    this.currentIndex.update((i) => (i - 1 + this.slides.length) % this.slides.length);
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
  }
}
