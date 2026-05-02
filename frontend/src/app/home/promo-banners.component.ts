import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface PromoBanner {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string;
  bgColor: string;
  textColor: string;
}

@Component({
  selector: 'app-promo-banners',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-6 md:py-10 px-4 max-w-layout mx-auto" aria-label="Promotions">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (banner of banners; track banner.title) {
          <a
            [routerLink]="banner.ctaLink"
            class="rounded-xl p-6 md:p-8 flex flex-col justify-between min-h-[140px] md:min-h-[180px] hover:opacity-90 transition group"
            [style.background]="banner.bgColor"
          >
            <div>
              <p class="text-sm font-medium mb-1" [style.color]="banner.textColor + 'CC'">{{ banner.subtitle }}</p>
              <h3 class="text-xl md:text-2xl font-bold leading-tight" [style.color]="banner.textColor">{{ banner.title }}</h3>
            </div>
            <span
              class="self-start mt-4 px-4 py-1.5 rounded-full text-sm font-semibold border transition group-hover:scale-105"
              [style.color]="banner.textColor"
              [style.borderColor]="banner.textColor + '60'"
            >
              {{ banner.ctaLabel }} →
            </span>
          </a>
        }
      </div>
    </section>
  `,
})
export class PromoBannersComponent {
  readonly banners: PromoBanner[] = [
    {
      title:     'CLiQ Cash Rewards',
      subtitle:  'Earn on every purchase',
      ctaLabel:  'Know More',
      ctaLink:   '/help/cliq-cash',
      bgColor:   '#FFF8E1',
      textColor: '#212121',
    },
    {
      title:     'Try & Buy',
      subtitle:  'Try at home, pay if you love it',
      ctaLabel:  'How it Works',
      ctaLink:   '/help/try-and-buy',
      bgColor:   '#E8F5E9',
      textColor: '#1B5E20',
    },
    {
      title:     'Easy Returns',
      subtitle:  '30-day hassle-free returns',
      ctaLabel:  'Return Policy',
      ctaLink:   '/help/returns',
      bgColor:   '#E3F2FD',
      textColor: '#0D47A1',
    },
  ];
}
