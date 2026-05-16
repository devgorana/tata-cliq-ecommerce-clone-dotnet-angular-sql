import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { Observable, catchError, of } from 'rxjs';
import { AdminApiService, DashboardMetrics, RevenueData } from '../../core/services/admin-api.service';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, CurrencyPipe, DatePipe, NgIf, KpiCardComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-xl font-bold text-dark">Dashboard</h1>
        <p class="text-sm text-muted mt-0.5">Platform overview</p>
      </div>

      @if (metrics$ | async; as m) {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <app-kpi-card label="Total Orders"    [value]="m.totalOrders | number"      icon="📦" iconBg="bg-blue/10" />
          <app-kpi-card label="Total Revenue"   [value]="'₹' + (m.totalRevenue | number:'1.0-0')" icon="💰" iconBg="bg-success/10" />
          <app-kpi-card label="Registered Users" [value]="m.totalUsers | number"     icon="👥" iconBg="bg-navy/10" />
          <app-kpi-card label="Active Products"  [value]="m.totalProducts | number"  icon="👗" iconBg="bg-gold/10" />
          <app-kpi-card label="Total Sellers"    [value]="m.totalSellers | number"   icon="🏪" iconBg="bg-navy/10" [subtitle]="m.pendingSellers + ' pending approval'" />
          <app-kpi-card label="Brands"           [value]="m.totalBrands | number"    icon="🏷️"  iconBg="bg-mid-gray/20" />
          <app-kpi-card label="Categories"       [value]="m.totalCategories | number" icon="🗂️"  iconBg="bg-mid-gray/20" />
        </div>
      } @else {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          @for (i of [1,2,3,4,5,6,7]; track i) {
            <div class="bg-white rounded-xl p-5 shadow-sm border border-border animate-pulse h-24"></div>
          }
        </div>
      }

      <!-- Revenue table -->
      @if (revenue$ | async; as revenue) {
        <div class="bg-white rounded-xl shadow-sm border border-border">
          <div class="px-5 py-4 border-b border-border">
            <h2 class="font-semibold text-dark text-sm">Revenue — Last 30 Days</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-border text-xs text-muted uppercase tracking-wide">
                  <th class="px-5 py-3 text-left">Date</th>
                  <th class="px-5 py-3 text-right">Revenue</th>
                  <th class="px-5 py-3 text-right">Orders</th>
                </tr>
              </thead>
              <tbody>
                @for (row of revenue.slice().reverse(); track row.date) {
                  <tr class="border-b border-border/50 hover:bg-bg/50">
                    <td class="px-5 py-2.5 text-dark">{{ row.date | date:'mediumDate' }}</td>
                    <td class="px-5 py-2.5 text-right font-medium">₹{{ row.revenue | number:'1.0-0' }}</td>
                    <td class="px-5 py-2.5 text-right text-muted">{{ row.orderCount }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  metrics$: Observable<DashboardMetrics> | null = null;
  revenue$: Observable<RevenueData[]>   | null = null;

  constructor(private api: AdminApiService) {}

  ngOnInit(): void {
    this.metrics$ = this.api.getMetrics().pipe(catchError(() => of({} as DashboardMetrics)));
    this.revenue$ = this.api.getRevenue(30).pipe(catchError(() => of([])));
  }
}
