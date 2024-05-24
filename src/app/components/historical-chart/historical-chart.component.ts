import { Component, computed, inject, input } from '@angular/core';
import { CryptoService } from '../../services/crypto/crypto.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { map } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-historical-chart',
  standalone: true,
  imports: [AsyncPipe, NgxChartsModule],
  templateUrl: './historical-chart.component.html',
  styleUrl: './historical-chart.component.scss',
  providers: [DatePipe]
})
export class HistoricalChartComponent {
  symbol = input.required<string | null>();
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  showYAxisLabel = true;
  yAxisLabel = 'Price';
  colorScheme = {
    domain: ['#5AA454']
  };

  private cryptoService = inject(CryptoService)
  private datePipe = inject(DatePipe)
  historicalData = computed(() => 
    this.cryptoService.getHistoricalData(this.symbol() || 'BITSTAMP_SPOT_BTC_USD', '1DAY', '2024-01-01', '2024-12-31')
      .pipe(
        map(data => [{
          "name": this.symbol(),
          "series": data.map((item: any) => ({
            name: this.datePipe.transform(item.time_period_start),
            value: item.price_close
          }))
        }])
      )
  );

}
