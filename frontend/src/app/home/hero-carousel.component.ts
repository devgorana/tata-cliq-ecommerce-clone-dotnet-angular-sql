import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface HeroSlide {
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string;
  bgColor: string;
}

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  template: `
    <section
      class="relative w-full overflow-hidden"
      style="height: 220px"
      [style.height.px]="isMobile ? 220 : 480"
      aria-label="Featured promotions"
    >
      <!-- Slides -->
      @for (slide of slides; track slide.title; let i = $index) {
        <div
          class="absolute inset-0 flex items-center transition-opacity duration-500"
          [class.opacity-100]="currentIndex() === i"
          [class.opacity-0]="currentIndex() !== i"
        >
          <!-- Background Image & Overlay -->
          @if (slide.imageUrl) {
            <img [src]="slide.imageUrl" [alt]="slide.title" class="absolute inset-0 w-full h-full object-cover -z-10" />
            <div class="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent -z-10"></div>
          } @else {
            <div class="absolute inset-0 -z-10" [style.background]="slide.bgColor"></div>
          }

          <div class="max-w-layout mx-auto px-6 md:px-16 w-full relative z-10">
            <div class="max-w-sm md:max-w-lg">
              <p class="text-sm md:text-base text-white/80 mb-1 md:mb-2">{{ slide.subtitle }}</p>
              <h2 class="text-2xl md:text-5xl font-bold text-white mb-3 md:mb-6 leading-tight">{{ slide.title }}</h2>
              <a
                [routerLink]="slide.ctaLink"
                class="inline-block bg-white text-navy font-semibold px-5 py-2 md:px-8 md:py-3 rounded-full text-sm md:text-base hover:bg-[#F9A825] hover:text-white transition"
              >
                {{ slide.ctaLabel }}
              </a>
            </div>
          </div>
        </div>
      }

      <!-- Controls -->
      <button
        class="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 md:p-2 transition"
        aria-label="Previous slide"
        (click)="prev()"
      >
        <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <button
        class="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 md:p-2 transition"
        aria-label="Next slide"
        (click)="next()"
      >
        <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>

      <!-- Dots -->
      <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        @for (slide of slides; track slide.title; let i = $index) {
          <button
            [class.bg-white]="currentIndex() === i"
            [class.bg-white/40]="currentIndex() !== i"
            class="w-2 h-2 rounded-full transition"
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
      imageUrl:  'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
      title:     'New Season Arrivals',
      subtitle:  'Up to 50% off — Limited time',
      ctaLabel:  'Shop Women',
      ctaLink:   '/products?category=women',
      bgColor:   'linear-gradient(135deg, #1A1A6B 0%, #2D2D9B 100%)',
    },
    {
      imageUrl:  'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop',
      title:     'Tech Meets Style',
      subtitle:  'Latest electronics & gadgets',
      ctaLabel:  'Explore Electronics',
      ctaLink:   '/products?category=electronics',
      bgColor:   'linear-gradient(135deg, #0071C2 0%, #005A9E 100%)',
    },
    {
      imageUrl:  'https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2070&auto=format&fit=crop',
      title:     'Luxury Redefined',
      subtitle:  'Authentic. Curated. Exclusive.',
      ctaLabel:  'Shop Luxury',
      ctaLink:   '/products?category=luxury',
      bgColor:   'linear-gradient(135deg, #212121 0%, #424242 100%)',
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
