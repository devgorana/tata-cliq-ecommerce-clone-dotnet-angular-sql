import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-size-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-semibold text-dark">Select Size</span>
        <button class="text-xs text-blue hover:underline">Size Guide</button>
      </div>
      <div class="flex flex-wrap gap-2">
        @for (size of sizes; track size) {
          <button
            class="w-12 h-10 border-2 rounded text-sm font-medium transition"
            [class.border-navy]="selectedSize === size"
            [class.text-navy]="selectedSize === size"
            [class.bg-navy]="selectedSize === size"
            [class.text-white]="selectedSize === size"
            [class.border-gray-200]="selectedSize !== size"
            [class.text-dark]="selectedSize !== size"
            [class.hover:border-navy]="selectedSize !== size"
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
