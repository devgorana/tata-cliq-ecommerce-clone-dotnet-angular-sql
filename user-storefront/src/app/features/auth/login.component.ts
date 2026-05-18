import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-bg flex items-center justify-center px-4">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-navy">Welcome Back</h1>
          <p class="text-muted text-sm mt-1">Sign in to your TataCliq account</p>
        </div>

        <!-- Error banner -->
        @if (error$ | async; as error) {
          <div class="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {{ error }}
          </div>
        }

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5" novalidate>

          <div>
            <label class="block text-sm font-medium text-dark mb-1" for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              autocomplete="email"
              placeholder="you@example.com"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              [class.border-red]="isInvalid('email')"
            />
            @if (isInvalid('email')) {
              <p class="mt-1 text-xs text-red">Enter a valid email address.</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-dark mb-1" for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              [class.border-red]="isInvalid('password')"
            />
            @if (isInvalid('password')) {
              <p class="mt-1 text-xs text-red">Password is required.</p>
            }
          </div>

          <button
            type="submit"
            [disabled]="loading$ | async"
            class="w-full bg-navy text-white font-semibold py-3 rounded-lg hover:bg-blue transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            @if (loading$ | async) { Signing in… } @else { Sign In }
          </button>
        </form>

        <!-- Footer -->
        <p class="mt-4 text-center text-sm">
          <a routerLink="/auth/forgot-password" class="text-red hover:underline text-xs">Forgot password?</a>
        </p>
        <p class="mt-3 text-center text-sm text-muted">
          Don't have an account?
          <a routerLink="/auth/register" class="text-navy font-medium hover:underline">Register</a>
        </p>

        <!-- Admin hint -->
        <p class="mt-3 text-center text-xs text-muted">
          Admin: admin&#64;tatacliq.com / Admin&#64;123
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly store = inject(Store);
  private readonly fb    = inject(FormBuilder);

  readonly loading$ = this.store.select(selectAuthLoading);
  readonly error$   = this.store.select(selectAuthError);

  readonly form = this.fb.nonNullable.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  isInvalid(field: 'email' | 'password'): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl.touched);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const { email, password } = this.form.getRawValue();
    this.store.dispatch(AuthActions.login({ email, password }));
  }
}
