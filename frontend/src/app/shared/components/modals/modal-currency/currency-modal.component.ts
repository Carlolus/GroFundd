import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-currency-modal',
  templateUrl: './currency-modal.component.html',
  styleUrls: ['./currency-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CurrencyModalComponent {
  @Output() currencySelected = new EventEmitter<string>();
  selectedCurrency = 'USD';
  searchTerm = '';

  currencies = [
    { code: 'USD', name: 'Dólar estadounidense', flag: '🇺🇸' },
    { code: 'COP', name: 'Peso colombiano', flag: '🇨🇴' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'Libra esterlina', flag: '🇬🇧' },
    { code: 'JPY', name: 'Yen japonés', flag: '🇯🇵' },
    { code: 'BRL', name: 'Real brasileño', flag: '🇧🇷' }
  ];

  filteredCurrencies() {
    const term = this.searchTerm.toLowerCase();
    return this.currencies.filter(
      c =>
        c.name.toLowerCase().includes(term) ||
        c.code.toLowerCase().includes(term)
    );
  }

  saveCurrency() {
    this.currencySelected.emit(this.selectedCurrency);
  }
}

