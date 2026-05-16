import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateReviewRequest } from '../core/models/review.model';

@Component({
  selector: 'app-review-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="border border-border rounded-lg p-5 bg-gray-50">
      <h3 class="text-sm font-semibold text-dark mb-4">Write a Review</h3>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>

        <!-- Star rating selector -->
        <div class="mb-4">
          <label class="block text-xs font-medium text-dark mb-2">
            Your Rating <span class="text-red-600" aria-hidden="true">*</span>
          </label>
          <div class="flex gap-1" role="radiogroup" aria-label="Rating">
            @for (star of stars; track star) {
              <button
                type="button"
                [attr.aria-label]="star + ' star' + (star === 1 ? '' : 's')"
                [attr.aria-checked]="hoveredStar() >= star || (hoveredStar() === 0 && selectedRating() >= star)"
                role="radio"
                class="text-2xl leading-none transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                (mouseenter)="hoveredStar.set(star)"
                (mouseleave)="hoveredStar.set(0)"
                (click)="setRating(star)"
                (keydown.enter)="setRating(star)"
                (keydown.space)="setRating(star)"
              >
                @if (hoveredStar() >= star || (hoveredStar() === 0 && selectedRating() >= star)) {
                  <span class="text-yellow-400" aria-hidden="true">★</span>
                } @else {
                  <span class="text-gray-300" aria-hidden="true">★</span>
                }
              </button>
            }
          </div>
          @if (form.get('rating')?.invalid && form.get('rating')?.touched) {
            <p class="text-xs text-red-600 mt-1" role="alert">Please select a rating.</p>
          }
        </div>

        <!-- Title -->
        <div class="mb-3">
          <label for="review-title" class="block text-xs font-medium text-dark mb-1">
            Review Title <span class="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="review-title"
            type="text"
            formControlName="title"
            placeholder="Summarise your experience"
            maxlength="120"
            class="w-full border border-border rounded px-3 py-2 text-sm text-dark
                   placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-red-500
                   bg-white"
            [attr.aria-invalid]="form.get('title')?.invalid && form.get('title')?.touched"
          />
          @if (form.get('title')?.invalid && form.get('title')?.touched) {
            <p class="text-xs text-red-600 mt-1" role="alert">Title is required (max 120 chars).</p>
          }
        </div>

        <!-- Body -->
        <div class="mb-4">
          <label for="review-body" class="block text-xs font-medium text-dark mb-1">
            Review <span class="text-red-600" aria-hidden="true">*</span>
          </label>
          <textarea
            id="review-body"
            formControlName="body"
            rows="4"
            placeholder="Tell others what you think about this product…"
            maxlength="2000"
            class="w-full border border-border rounded px-3 py-2 text-sm text-dark
                   placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-red-500
                   bg-white resize-none"
            [attr.aria-invalid]="form.get('body')?.invalid && form.get('body')?.touched"
          ></textarea>
          @if (form.get('body')?.invalid && form.get('body')?.touched) {
            <p class="text-xs text-red-600 mt-1" role="alert">Review body is required (min 10 chars).</p>
          }
        </div>

        <!-- Error from store -->
        @if (submitError) {
          <p class="text-xs text-red-600 mb-3" role="alert">{{ submitError }}</p>
        }

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            type="submit"
            [disabled]="submitting || form.invalid"
            class="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded
                   hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500
                   transition-colors"
          >
            @if (submitting) { Submitting… } @else { Submit Review }
          </button>
          <button
            type="button"
            (click)="onCancel()"
            class="px-5 py-2 border border-border text-sm font-medium rounded
                   text-dark hover:bg-gray-100 transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ReviewFormComponent implements OnInit {
  @Input() submitting = false;
  @Input() submitError: string | null = null;
  @Output() submitted = new EventEmitter<CreateReviewRequest>();
  @Output() cancelled = new EventEmitter<void>();

  readonly stars = [1, 2, 3, 4, 5];
  readonly hoveredStar  = signal(0);
  readonly selectedRating = signal(0);

  form!: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      title:  ['', [Validators.required, Validators.maxLength(120)]],
      body:   ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    });
  }

  setRating(star: number): void {
    this.selectedRating.set(star);
    this.form.patchValue({ rating: star });
    this.form.get('rating')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { rating, title, body } = this.form.value as CreateReviewRequest;
    this.submitted.emit({ rating, title, body });
  }

  onCancel(): void {
    this.form.reset({ rating: 0, title: '', body: '' });
    this.selectedRating.set(0);
    this.cancelled.emit();
  }
}
