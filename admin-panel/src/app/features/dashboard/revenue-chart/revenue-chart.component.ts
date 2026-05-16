import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  signal,
} from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import type { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexStroke, ApexTooltip, ApexDataLabels, ApexFill } from 'apexcharts';
import { RevenueData } from '../../../core/services/admin-api.service';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgApexchartsModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <div class="px-5 py-4 border-b border-border">
        <h2 class="font-semibold text-dark text-sm">Revenue Trend — Last 30 Days</h2>
        <p class="text-xs text-muted mt-0.5">Daily revenue in INR</p>
      </div>
      <div class="p-4">
        <apx-chart
          [series]="series()"
          [chart]="chartConfig"
          [xaxis]="xaxis()"
          [stroke]="stroke"
          [fill]="fill"
          [tooltip]="tooltip"
          [dataLabels]="dataLabels"
        />
      </div>
    </div>
  `,
})
export class RevenueChartComponent implements OnChanges {
  @Input() data: RevenueData[] = [];

  series = signal<ApexAxisChartSeries>([{ name: 'Revenue (₹)', data: [] }]);
  xaxis = signal<ApexXAxis>({ categories: [] });

  readonly chartConfig: ApexChart = {
    type: 'area',
    height: 280,
    toolbar: { show: false },
    animations: { enabled: true, speed: 600 },
  };

  readonly stroke: ApexStroke = { curve: 'smooth', width: 2, colors: ['#1C2B4A'] };

  readonly fill: ApexFill = {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.35,
      opacityTo: 0.05,
      stops: [0, 100],
      colorStops: [{ offset: 0, color: '#1C2B4A', opacity: 0.35 }, { offset: 100, color: '#1C2B4A', opacity: 0 }],
    },
  };

  readonly tooltip: ApexTooltip = {
    y: { formatter: (val: number) => '₹' + val.toLocaleString('en-IN') },
  };

  readonly dataLabels: ApexDataLabels = { enabled: false };

  ngOnChanges(): void {
    const sorted = [...this.data].sort((a, b) => a.date.localeCompare(b.date));
    this.series.set([{ name: 'Revenue (₹)', data: sorted.map((d) => d.revenue) }]);
    this.xaxis.set({
      categories: sorted.map((d) => {
        const dt = new Date(d.date);
        return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      }),
      labels: { rotate: -30, style: { fontSize: '10px' } },
    });
  }
}
