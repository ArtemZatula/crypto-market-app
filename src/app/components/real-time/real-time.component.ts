import { Component, inject, input } from '@angular/core';
import { CryptoService } from '../../services/crypto/crypto.service';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-real-time',
  standalone: true,
  imports: [AsyncPipe, DatePipe, JsonPipe],
  templateUrl: './real-time.component.html',
  styleUrl: './real-time.component.scss'
})
export class RealTimeComponent {
  isWsConnected = input.required<any>();
  private cryptoService = inject(CryptoService);

  realTimeData$ = this.cryptoService.wsConnection$;

  ngOnDestroy(): void {
    this.cryptoService.close();
  }
}
