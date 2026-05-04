import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroCarouselComponent } from '../../home/hero-carousel.component';
import { CategoryBannersComponent } from '../../home/category-banners.component';
import { FlashSaleComponent } from '../../home/flash-sale.component';
import { PromoBannersComponent } from '../../home/promo-banners.component';
import { BrandLogoStripComponent } from '../../home/brand-logo-strip.component';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    HeroCarouselComponent,
    CategoryBannersComponent,
    FlashSaleComponent,
    PromoBannersComponent,
    BrandLogoStripComponent,
  ],
  template: `
    <!-- DESIGN.md §5.1 Homepage order -->
    <main id="main-content" tabindex="-1">
      <!-- 3. Hero Carousel -->
      <app-hero-carousel />
      <!-- 4. Category Shortcut Strip -->
      <app-category-banners />
      <!-- 6. 2-up & 3-up Promo Banners (Women's | Men's + seasonal) -->
      <app-promo-banners />
      <!-- 7. Top Brands logo strip -->
      <app-brand-logo-strip />
      <!-- 10. Sale Picks / Flash Sale -->
      <app-flash-sale />
    </main>
  `,
})
export class HomeComponent {}
