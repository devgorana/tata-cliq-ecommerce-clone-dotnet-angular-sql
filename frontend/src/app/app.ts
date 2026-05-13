import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';
import { BottomNavComponent } from './layout/bottom-nav.component';
import { SnackbarComponent } from './shared/components/snackbar.component';
import { BackToTopComponent } from './shared/components/back-to-top.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterOutlet,
    HeaderComponent, FooterComponent, BottomNavComponent,
    SnackbarComponent, BackToTopComponent,
  ],
  template: `
    <div class="flex flex-col min-h-screen">
      <app-header />
      <div class="flex-1">
        <router-outlet />
      </div>
      <app-footer />
      <app-bottom-nav />
      <app-snackbar />
      <!-- DESIGN.md §4.19 — global back-to-top button -->
      <app-back-to-top />
    </div>
  `,
  styles: [],
})
export class App {}
