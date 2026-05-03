import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-[#F5F5F5] p-4 md:p-8">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-2xl font-bold text-[#1A1A6B] mb-6">Admin Dashboard</h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a routerLink="/admin/banners"
             class="bg-white rounded-lg shadow p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-full bg-[#1A1A6B]/10 flex items-center justify-center">
              <span class="text-2xl">🖼️</span>
            </div>
            <div>
              <p class="font-semibold text-[#212121]">Banners</p>
              <p class="text-sm text-[#757575]">Manage hero, promo &amp; flash-sale banners</p>
            </div>
          </a>

          <a routerLink="/admin/coupons"
             class="bg-white rounded-lg shadow p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-full bg-[#E4002B]/10 flex items-center justify-center">
              <span class="text-2xl">🎟️</span>
            </div>
            <div>
              <p class="font-semibold text-[#212121]">Coupons</p>
              <p class="text-sm text-[#757575]">Create and toggle discount codes</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent {}
