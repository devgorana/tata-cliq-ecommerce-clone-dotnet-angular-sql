import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Observable, catchError, of } from 'rxjs';
import { NgApexchartsModule } from 'ng-apexcharts';
import type { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTooltip, ApexPlotOptions } from 'apexcharts';
import { SellerApiService, SellerAnalytics } from '../../../core/services/seller-api.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';

@Component({
  selector: 'app-seller-analytics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, DecimalPipe, KpiCardComponent, NgApexchartsModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-xl font-bold text-dark">Analytics</h1>

      @if (analytics$ | async; as a) {
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <app-kpi-card label="Total Revenue" [value]="'₹' + (a.totalRevenue | number:'1.0-0')" icon="₹" iconBg="bg-gold/10" />
          <app-kpi-card label="Total Orders" [value]="a.totalOrders.toString()" icon="📦" iconBg="bg-navy/10" />
          <app-kpi-card label="Avg Order Value" [value]="'₹' + (a.averageOrderValue | number:'1.0-2')" icon="📊" iconBg="bg-blue/10" />
        </div>

        <!-- Top Products Bar Chart -->
        @if (a.topProducts.length) {
          <div class="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
            <div class="px-5 py-4 border-b border-border">
              <h2 class="font-semibold text-dark text-sm">Top Products by Revenue</h2>
            </div>
            <div class="p-4">
              <apx-chart
                [series]="buildSeries(a)"
                [chart]="chartConfig"
                [xaxis]="buildXaxis(a)"
                [plotOptions]="plotOptions"
                [dataLabels]="dataLabels"
                [tooltip]="tooltip"
                [colors]="colors"
              />
            </div>
          </div>

          <!-- Table -->
          <div class="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
            <div class="px-5 py-4 border-b border-border">
              <h2 class="font-semibold text-dark text-sm">Top Products — Detail</h2>
            </div>
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
          </div>
        } @else {
          <div class="p-8 text-center text-muted text-sm">No product data yet.</div>
        }
      } @else {
        <div class="p-8 text-center text-muted text-sm">Loading analytics…</div>
      }
    </div>
  `,
})
export class SellerAnalyticsComponent implements OnInit {
  analytics$: Observable<SellerAnalytics> | null = null;

  readonly chartConfig: ApexChart = {
    type: 'bar',
    height: 260,
    toolbar: { show: false },
    animations: { enabled: true, speed: 600 },
  };

  readonly plotOptions: ApexPlotOptions = {
    bar: { borderRadius: 4, horizontal: true, barHeight: '60%' },
  };

  readonly dataLabels: ApexDataLabels = {
    enabled: true,
    formatter: (val: number) => '₹' + val.toLocaleString('en-IN'),
    style: { fontSize: '11px' },
  };

  readonly tooltip: ApexTooltip = {
    y: { formatter: (val: number) => '₹' + val.toLocaleString('en-IN') },
  };

  readonly colors = ['#C9A84C'];

  constructor(private api: SellerApiService) {}

  ngOnInit(): void {
    this.analytics$ = this.api.getAnalytics().pipe(
      catchError(() => of({ totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, topProducts: [] })),
    );
  }

  buildSeries(a: SellerAnalytics): ApexAxisChartSeries {
    return [{ name: 'Revenue (₹)', data: a.topProducts.map((p) => p.revenue) }];
  }

  buildXaxis(a: SellerAnalytics): ApexXAxis {
    return { categories: a.topProducts.map((p) => p.productName.substring(0, 20)), labels: { style: { fontSize: '11px' } } };
  }
}
