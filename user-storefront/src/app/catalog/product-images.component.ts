import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  OnDestroy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { SkeletonLoaderComponent } from '../shared/components/skeleton-loader.component';

@Component({
  selector: 'app-product-images',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SkeletonLoaderComponent],
  styles: [`
    .zoom-container { overflow: hidden; }
    .zoom-container img { transition: transform 0.3s ease; }
    .zoom-container:hover img { transform: scale(1.5); }
  `],
  template: `
    <div class="flex gap-3">

      <!-- Thumbnails — desktop only -->
      <div class="hidden md:flex flex-col gap-2 w-16 flex-shrink-0">
        @for (img of images; track img; let i = $index) {
          <button
            class="w-16 h-20 border-2 rounded overflow-hidden flex-shrink-0 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
            [class.border-navy]="activeIndex() === i"
            [class.border-transparent]="activeIndex() !== i"
            [attr.aria-label]="'View image ' + (i + 1) + ' of ' + images.length"
            (click)="activeIndex.set(i)"
          >
            <img
              [src]="img"
              [alt]="productName + ' thumbnail ' + (i + 1)"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        }
        @if (images.length === 0) {
          <div class="w-16 h-20 bg-gray-100 rounded"></div>
        }
      </div>

      <!-- Main image -->
      <div
        class="flex-1 aspect-[3/4] rounded-lg overflow-hidden bg-gray-50 relative zoom-container"
        tabindex="0"
        role="img"
        [attr.aria-label]="productName + ' — image ' + (activeIndex() + 1) + ' of ' + images.length"
        (keydown.ArrowLeft)="prev()"
        (keydown.ArrowRight)="next()"
        (touchstart)="onTouchStart($event)"
        (touchend)="onTouchEnd($event)"
      >
        @if (images.length > 0) {
          <!-- Skeleton shown until image loads (LCP placeholder) -->
          @if (!imageLoaded()) {
            <div class="absolute inset-0 z-10">
              <app-skeleton-loader height="100%" cssClass="rounded-lg" />
            </div>
          }
          <img
            [src]="images[activeIndex()]"
            [alt]="productName + ' — image ' + (activeIndex() + 1)"
            class="w-full h-full object-contain cursor-zoom-in"
            [loading]="activeIndex() === 0 ? 'eager' : 'lazy'"
            [class.opacity-0]="!imageLoaded()"
            [class.opacity-100]="imageLoaded()"
            style="transition: opacity 0.2s ease"
            (load)="imageLoaded.set(true)"
            (click)="openLightbox()"
          />
        } @else {
          <div class="w-full h-full flex items-center justify-center text-8xl" aria-hidden="true">🛍️</div>
        }

        <!-- Mobile counter pill — "2 / 5" -->
        @if (images.length > 1) {
          <div
            class="md:hidden absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium
                   px-2 py-0.5 rounded-full pointer-events-none"
            aria-hidden="true"
          >{{ activeIndex() + 1 }} / {{ images.length }}</div>
        }

        <!-- Mobile dots (small screens) -->
        @if (images.length > 1) {
          <div class="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" aria-hidden="true">
            @for (img of images; track img; let i = $index) {
              <button
                class="w-1.5 h-1.5 rounded-full transition"
                [class.bg-navy]="activeIndex() === i"
                [class.bg-gray-300]="activeIndex() !== i"
                [attr.aria-label]="'Go to image ' + (i + 1)"
                (click)="activeIndex.set(i); imageLoaded.set(false)"
              ></button>
            }
          </div>
        }

        <!-- Desktop prev/next arrows -->
        @if (images.length > 1) {
          <button
            class="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80
                   rounded-full items-center justify-center shadow hover:bg-white transition
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
            tabindex="0"
            aria-label="Previous image"
            (click)="prev()"
          >
            <svg class="w-4 h-4 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            class="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80
                   rounded-full items-center justify-center shadow hover:bg-white transition
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
            tabindex="0"
            aria-label="Next image"
            (click)="next()"
          >
            <svg class="w-4 h-4 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        }
      </div>
    </div>

    <!-- Lightbox template — rendered into CDK Overlay -->
    <ng-template #lightboxTpl>
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="productName + ' fullscreen image'"
        (click)="closeLightbox()"
        (keydown.Escape)="closeLightbox()"
      >
        <!-- Stop propagation so clicking the image itself doesn't close -->
        <div class="relative max-w-3xl max-h-[90vh] p-4" (click)="$event.stopPropagation()">
          <img
            [src]="images[activeIndex()]"
            [alt]="productName + ' — fullscreen image ' + (activeIndex() + 1)"
            class="max-w-full max-h-[80vh] object-contain rounded-lg"
            loading="eager"
          />
          <!-- Close button -->
          <button
            class="absolute top-2 right-2 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full
                   flex items-center justify-center text-white transition
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close fullscreen image"
            (click)="closeLightbox()"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <!-- Lightbox counter -->
          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm">
            {{ activeIndex() + 1 }} / {{ images.length }}
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class ProductImagesComponent implements OnDestroy {
  @Input({ required: true }) images: string[] = [];
  @Input() productName = '';

  @ViewChild('lightboxTpl') lightboxTpl!: TemplateRef<unknown>;

  private readonly overlay        = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private overlayRef: OverlayRef | null = null;

  readonly activeIndex = signal(0);
  readonly imageLoaded = signal(false);

  // ── Navigation ────────────────────────────────────────────────────────────

  prev(): void {
    this.imageLoaded.set(false);
    this.activeIndex.update((i) => (i - 1 + this.images.length) % this.images.length);
  }

  next(): void {
    this.imageLoaded.set(false);
    this.activeIndex.update((i) => (i + 1) % this.images.length);
  }

  // ── Touch swipe ───────────────────────────────────────────────────────────

  private touchStartX = 0;

  onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.changedTouches[0].clientX;
  }

  onTouchEnd(e: TouchEvent): void {
    const delta = e.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(delta) < 40) return; // ignore small taps
    delta < 0 ? this.next() : this.prev();
  }

  // ── Lightbox ──────────────────────────────────────────────────────────────

  openLightbox(): void {
    if (this.overlayRef) return;
    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });
    const portal = new TemplatePortal(this.lightboxTpl, this.viewContainerRef);
    this.overlayRef.attach(portal);
  }

  closeLightbox(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }

  @HostListener('document:keydown.Escape')
  onEscape(): void { this.closeLightbox(); }

  ngOnDestroy(): void { this.closeLightbox(); }
}
