import { Component, computed, inject, input } from '@angular/core';
import { CryptoService } from '../../services/crypto/crypto.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { map } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { cryptoYears } from '../../data/crypto-years';

@Component({
  selector: 'app-historical-chart',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, NgxChartsModule],
  templateUrl: './historical-chart.component.html',
  styleUrl: './historical-chart.component.scss',
  providers: [DatePipe]
})
export class HistoricalChartComponent {
  symbol = input.required<string | null>();
  private cryptoService = inject(CryptoService);
  private datePipe = inject(DatePipe);

  colorScheme = {
    domain: ['#5AA454']
  };
  cryptoYears = cryptoYears;
  cryptoYearFormControl = new FormControl<string>('2024');
  yearChangesSignal = toSignal(this.cryptoYearFormControl.valueChanges);
  historicalData = computed(() => {
    const startDate = `${this.yearChangesSignal() || '2024'}-01-01`;
    const endDate = `${this.yearChangesSignal() || '2024'}-12-31`;
    return this.cryptoService.getHistoricalData(
      this.symbol() || 'COINBASE_SPOT_BTC_USD', '1DAY', startDate, endDate)
      .pipe(
        map(data => [{
          "name": this.symbol(),
          "series": data.map((item: any) => ({
            name: this.datePipe.transform(item.time_period_start),
            value: item.price_close
          }))
        }])
      )
    }
  );

}
