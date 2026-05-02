import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-images',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="flex gap-3">
      <!-- Thumbnails -->
      <div class="hidden md:flex flex-col gap-2 w-16">
        @for (img of images; track img; let i = $index) {
          <button
            class="w-16 h-20 border-2 rounded overflow-hidden flex-shrink-0 transition"
            [class.border-navy]="activeIndex() === i"
            [class.border-transparent]="activeIndex() !== i"
            [attr.aria-label]="'View image ' + (i + 1)"
            (click)="activeIndex.set(i)"
          >
            <img [src]="img" [alt]="'Product image ' + (i + 1)" class="w-full h-full object-cover" loading="lazy" />
          </button>
        }
        @if (images.length === 0) {
          <div class="w-16 h-20 bg-gray-100 rounded"></div>
        }
      </div>

      <!-- Main image -->
      <div class="flex-1 aspect-[3/4] rounded-lg overflow-hidden bg-gray-50 relative">
        @if (images.length > 0) {
          <img
            [src]="images[activeIndex()]"
            [alt]="productName + ' — image ' + (activeIndex() + 1)"
            class="w-full h-full object-contain"
          />
        } @else {
          <div class="w-full h-full flex items-center justify-center text-8xl">🛍️</div>
        }

        <!-- Mobile dots -->
        @if (images.length > 1) {
          <div class="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            @for (img of images; track img; let i = $index) {
              <button
                [class.bg-navy]="activeIndex() === i"
                [class.bg-gray-300]="activeIndex() !== i"
                class="w-1.5 h-1.5 rounded-full transition"
                (click)="activeIndex.set(i)"
              ></button>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class ProductImagesComponent {
  @Input({ required: true }) images: string[] = [];
  @Input() productName = '';
  readonly activeIndex = signal(0);
}
