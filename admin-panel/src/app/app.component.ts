import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgIf } from '@angular/common';
import { restoreSession } from './store/auth/auth.actions';
import { selectToast } from './store/ui/ui.selectors';
import { clearToast } from './store/ui/ui.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, AsyncPipe, NgIf],
  template: `
    <router-outlet />

    @if (toast$ | async; as toast) {
      @if (toast.message) {
        <div
          class="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium text-sm"
          [class.bg-success]="toast.type === 'success'"
          [class.bg-error]="toast.type === 'error'"
          [class.bg-navy]="toast.type === 'info'">
          {{ toast.message }}
        </div>
      }
    }
  `,
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);
  readonly toast$ = this.store.select(selectToast);

  ngOnInit(): void {
    const token = localStorage.getItem('admin_token');
    const refreshToken = localStorage.getItem('admin_refresh_token');
    const userStr = localStorage.getItem('admin_user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.store.dispatch(restoreSession({ user, token, refreshToken: refreshToken ?? '' }));
      } catch {
        localStorage.clear();
      }
    }
  }
}
