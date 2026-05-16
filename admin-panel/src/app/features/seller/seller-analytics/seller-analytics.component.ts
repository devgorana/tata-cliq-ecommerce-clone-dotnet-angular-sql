import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Observable, catchError, of } from 'rxjs';
import { SellerApiService, SellerAnalytics } from '../../../core/services/seller-api.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';

@Component({
  selector: 'app-seller-analytics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, DecimalPipe, KpiCardComponent],
  template: `
    <div class="space-y-6">
      <h1 class="text-xl font-bold text-dark">Analytics</h1>

      @if (analytics$ | async; as a) {
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <app-kpi-card label="Total Revenue" [value]="'₹' + (a.totalRevenue | number:'1.0-0')" icon="₹" iconBg="bg-gold/10" />
          <app-kpi-card label="Total Orders" [value]="a.totalOrders.toString()" icon="📦" iconBg="bg-navy/10" />
          <app-kpi-card label="Avg Order Value" [value]="'₹' + (a.averageOrderValue | number:'1.0-2')" icon="📊" iconBg="bg-blue/10" />
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div class="px-5 py-4 border-b border-border">
            <h2 class="font-semibold text-dark text-sm">Top Products</h2>
          </div>
          @if (a.topProducts.length) {
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-border text-xs text-muted uppercase tracking-wide bg-bg/50">
                    <th class="px-5 py-3 text-left">#</th>
                    <th class="px-5 py-3 text-left">Product</th>
                    <th class="px-5 py-3 text-center">Units Sold</th>
                    <th class="px-5 py-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of a.topProducts; track p.productName; let i = $index) {
                    <tr class="border-b border-border/50 hover:bg-bg/30">
                      <td class="px-5 py-3 text-muted font-mono text-xs">{{ i + 1 }}</td>
                      <td class="px-5 py-3 font-medium text-dark">{{ p.productName }}</td>
                      <td class="px-5 py-3 text-center text-muted">{{ p.unitsSold }}</td>
                      <td class="px-5 py-3 text-right font-medium text-gold">₹{{ p.revenue | number:'1.0-0' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="p-8 text-center text-muted text-sm">No product data yet.</div>
          }
        </div>
      } @else {
        <div class="p-8 text-center text-muted text-sm">Loading analytics…</div>
      }
    </div>
  `,
})
export class SellerAnalyticsComponent implements OnInit {
  analytics$: Observable<SellerAnalytics> | null = null;

  constructor(private api: SellerApiService) {}

  ngOnInit(): void {
    this.analytics$ = this.api.getAnalytics().pipe(
      catchError(() => of({ totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, topProducts: [] }))
    );
  }
}
