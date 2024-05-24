import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, merge, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CryptoService } from './services/crypto/crypto.service';
import { cryptoCurrencies } from './data/crypto-currencies';
import { RealTimeComponent } from './components/real-time/real-time.component';
import { HistoricalChartComponent } from './components/historical-chart/historical-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RealTimeComponent, HistoricalChartComponent, ReactiveFormsModule, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  symbolFormControl = new FormControl<string>('BITSTAMP_SPOT_BTC_USD');
  private cryptoService = inject(CryptoService);
  private destroyRef = inject(DestroyRef);
  cryptos = cryptoCurrencies;

  private subscribe(): void {
    this.cryptoService.sendMessage({
      type: 'hello',
      apikey: this.cryptoService.apiKey,
      heartbeat: false,
      subscribe_data_type: ['trade'],
      subscribe_filter_symbol_id: [this.symbolFormControl.value],
    });
  }

  isWsConnected$: Observable<boolean> = merge(
    this.symbolFormControl.valueChanges.pipe(map(() => false)),
    this.cryptoService.wsConnection$.pipe(map(() => true))
  ).pipe(
    startWith(false)
  );

  ngOnInit() {
    this.subscribe();
    this.symbolFormControl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.subscribe());
  }

}
