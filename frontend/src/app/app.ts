import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';
import { BottomNavComponent } from './layout/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, BottomNavComponent],
  template: `
    <div class="flex flex-col min-h-screen">
      <app-header />
      <div class="flex-1">
        <router-outlet />
      </div>
      <app-footer />
      <app-bottom-nav />
    </div>
  `,
  styles: [],
})
export class App {}
