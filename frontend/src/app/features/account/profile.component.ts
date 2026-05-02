import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-bg flex items-center justify-center">
      <p class="text-muted text-lg">My Account — Phase 4</p>
    </div>
  `,
})
export class ProfileComponent {}
