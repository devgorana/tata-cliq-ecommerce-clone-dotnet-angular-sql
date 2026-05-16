import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  signal,
} from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import type { ApexChart, ApexNonAxisChartSeries, ApexLegend, ApexTooltip, ApexPlotOptions } from 'ng-apexcharts';

export interface StatusCount {
  status: string;
  count: number;
}

@Component({
  selector: 'app-orders-donut-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgApexchartsModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <div class="px-5 py-4 border-b border-border">
        <h2 class="font-semibold text-dark text-sm">Orders by Status</h2>
        <p class="text-xs text-muted mt-0.5">Distribution of order statuses</p>
      </div>
      <div class="p-4">
        <apx-chart
          [series]="series()"
          [chart]="chartConfig"
          [labels]="labels()"
          [legend]="legend"
          [tooltip]="tooltip"
          [plotOptions]="plotOptions"
          [colors]="colors"
        />
      </div>
    </div>
  `,
})
export class OrdersDonutChartComponent implements OnChanges {
  @Input() data: StatusCount[] = [];

  series = signal<ApexNonAxisChartSeries>([]);
  labels = signal<string[]>([]);

  readonly chartConfig: ApexChart = {
    type: 'donut',
    height: 280,
    toolbar: { show: false },
    animations: { enabled: true, speed: 600 },
  };

  readonly legend: ApexLegend = {
    position: 'bottom',
    fontSize: '12px',
  };

  readonly tooltip: ApexTooltip = {
    y: { formatter: (val: number) => val + ' orders' },
  };

  readonly plotOptions: ApexPlotOptions = {
    pie: { donut: { size: '65%', labels: { show: true, total: { show: true, label: 'Total' } } } },
  };

  readonly colors = ['#1C2B4A', '#E31837', '#C9A84C', '#2E7D32', '#9E9E9E'];

  ngOnChanges(): void {
    this.labels.set(this.data.map((d) => d.status));
    this.series.set(this.data.map((d) => d.count));
  }
}
