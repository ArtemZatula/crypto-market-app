import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  apiKey = 'A94D64C9-207A-485B-9BFD-7395010521C6'; // have to be server-side stored 
  private readonly restUrl = 'https://rest.coinapi.io/v1/';
  private readonly wsUrl = 'wss://ws.coinapi.io/v1/';

  private httpClient = inject(HttpClient);

  private socket$: WebSocketSubject<any> = webSocket({
    url: `${this.wsUrl}?apiKey=${this.apiKey}`,
    deserializer: (msg) => msg.data ? JSON.parse(msg.data) : msg,
  });
  wsConnection$ = this.socket$.asObservable().pipe(shareReplay());

  getHistoricalData(symbol: string, period: string, start: string, end: string): Observable<any> {
    const url = `${this.restUrl}ohlcv/${symbol}/history?period_id=${period}&time_start=${start}&time_end=${end}`;
    return this.httpClient.get(url, { headers: { 'X-CoinAPI-Key': this.apiKey } });
  }

  public sendMessage(message: any): void {
    this.socket$.next(message);
  }

  public close(): void {
    this.socket$.complete();
  }
}
