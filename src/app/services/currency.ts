import { Injectable, signal } from '@angular/core';

export type Currency = 'KES' | 'USD' | 'GBP' | 'EUR' | 'UGX' | 'TZS';

const EXCHANGE_RATES: Record<Currency, number> = {
  KES: 1,
  USD: 0.0077,
  GBP: 0.0061,
  EUR: 0.0071,
  UGX: 28.5,
  TZS: 20.2
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  KES: 'KES',
  USD: '$',
  GBP: '£',
  EUR: '€',
  UGX: 'UGX',
  TZS: 'TZS'
};

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private _currency = signal<Currency>(
    (localStorage.getItem('preferredCurrency') as Currency) || 'KES'
  );

  currency = this._currency.asReadonly();

  setCurrency(currency: Currency) {
    this._currency.set(currency);
    localStorage.setItem('preferredCurrency', currency);
  }

  convert(amountInKES: number): number {
    const rate = EXCHANGE_RATES[this._currency()];
    return amountInKES * rate;
  }

  format(amountInKES: number): string {
    const converted = this.convert(amountInKES);
    const symbol = CURRENCY_SYMBOLS[this._currency()];
    return `${symbol} ${converted.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  get symbol(): string {
    return CURRENCY_SYMBOLS[this._currency()];
  }
}