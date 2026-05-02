import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroCarouselComponent } from '../../home/hero-carousel.component';
import { CategoryBannersComponent } from '../../home/category-banners.component';
import { FlashSaleComponent } from '../../home/flash-sale.component';
import { PromoBannersComponent } from '../../home/promo-banners.component';

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
  ],
  template: `
    <main>
      <app-hero-carousel />
      <app-category-banners />
      <app-flash-sale />
      <app-promo-banners />
    </main>
  `,
})
export class HomeComponent {}
