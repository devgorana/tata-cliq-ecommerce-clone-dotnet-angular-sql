import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-size-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <!-- DESIGN.md §4.11 Size Selector -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-semibold text-dark">Select Size</span>
        <button class="text-xs text-red hover:underline" aria-label="View size guide">Size Guide</button>
      </div>

      <!-- Pill chips — horizontal flex wrap -->
      <div class="flex flex-wrap gap-2" role="group" aria-label="Available sizes">
        @for (size of sizes; track size) {
          <button
            class="min-w-[36px] h-9 px-2 border-2 rounded text-sm font-medium transition-all"
            [class.border-red]="selectedSize === size"
            [class.bg-red]="selectedSize === size"
            [class.text-white]="selectedSize === size"
            [class.border-border]="selectedSize !== size"
            [class.text-dark]="selectedSize !== size"
            [class.hover:border-red]="selectedSize !== size"
            [attr.aria-label]="'Size ' + size"
            [attr.aria-pressed]="selectedSize === size"
            (click)="sizeChange.emit(size)"
          >{{ size }}</button>
        }
      </div>
    </div>
  `,
})
export class SizeSelectorComponent {
  @Input({ required: true }) sizes: string[] = [];
  @Input() selectedSize: string | null = null;
  @Output() sizeChange = new EventEmitter<string>();
}
