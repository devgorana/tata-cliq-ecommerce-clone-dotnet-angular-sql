import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  signal,
} from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import type { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexFill, ApexTooltip, ApexDataLabels } from 'apexcharts';

export interface DailyCount {
  date: string;
  count: number;
}

@Component({
  selector: 'app-user-registration-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgApexchartsModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <div class="px-5 py-4 border-b border-border">
        <h2 class="font-semibold text-dark text-sm">User Registrations — Last 30 Days</h2>
        <p class="text-xs text-muted mt-0.5">New customer sign-ups per day</p>
      </div>
      <div class="p-4">
        <apx-chart
          [series]="series()"
          [chart]="chartConfig"
          [xaxis]="xaxis()"
          [fill]="fill"
          [tooltip]="tooltip"
          [dataLabels]="dataLabels"
          [colors]="colors"
        />
      </div>
    </div>
  `,
})
export class UserRegistrationChartComponent implements OnChanges {
  @Input() data: DailyCount[] = [];

  series = signal<ApexAxisChartSeries>([{ name: 'Registrations', data: [] }]);
  xaxis = signal<ApexXAxis>({ categories: [] });

  readonly chartConfig: ApexChart = {
    type: 'area',
    height: 240,
    toolbar: { show: false },
    animations: { enabled: true, speed: 600 },
  };

  readonly fill: ApexFill = {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05,
      stops: [0, 100],
    },
  };

  readonly tooltip: ApexTooltip = {
    y: { formatter: (val: number) => val + ' users' },
  };

  readonly dataLabels: ApexDataLabels = { enabled: false };
  readonly colors = ['#0071C2'];

  ngOnChanges(): void {
    const sorted = [...this.data].sort((a, b) => a.date.localeCompare(b.date));
    this.series.set([{ name: 'Registrations', data: sorted.map((d) => d.count) }]);
    this.xaxis.set({
      categories: sorted.map((d) => {
        const dt = new Date(d.date);
        return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      }),
      labels: { rotate: -30, style: { fontSize: '10px' } },
    });
  }
}
