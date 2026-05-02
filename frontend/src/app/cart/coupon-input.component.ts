import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coupon-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="border border-gray-200 rounded-lg p-4">
      <h3 class="text-sm font-semibold text-dark mb-3">Apply Coupon</h3>
      <div class="flex gap-2">
        <input
          type="text"
          placeholder="Enter coupon code"
          [ngModel]="code()"
          class="flex-1 border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-navy uppercase"
          (ngModelChange)="code.set($event.toUpperCase())"
          (keydown.enter)="apply()"
        />
        <button
          class="bg-navy text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue transition disabled:opacity-50"
          [disabled]="!code().trim()"
          (click)="apply()"
        >Apply</button>
      </div>
    </div>
  `,
})
export class CouponInputComponent {
  @Output() applyCoupon = new EventEmitter<string>();
  readonly code = signal('');

  apply(): void {
    const trimmed = this.code().trim();
    if (trimmed) {
      this.applyCoupon.emit(trimmed);
    }
  }
}
