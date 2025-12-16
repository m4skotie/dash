// js/CurrencyWidget.js
import { UIComponent } from './UIComponent.js';

export class CurrencyWidget extends UIComponent {
  constructor(config = {}) {
    super({ ...config, title: config.title || 'Курсы валют' });
    this.rates = { USD: '--', EUR: '--' };
  }

  async loadRates() {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/RUB');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      // Конвертируем: сколько рублей за 1 доллар/евро
      const usdRate = (1 / data.rates.USD).toFixed(2);
      const eurRate = (1 / data.rates.EUR).toFixed(2);

      this.rates = { USD: usdRate, EUR: eurRate };
      this.updateDisplay();
    } catch (err) {
      this.rates = { USD: '—', EUR: '—' };
      this.updateDisplay();
      console.error('Ошибка загрузки курсов:', err);
    }
  }

  updateDisplay() {
    if (!this.element) return;
    this.element.querySelector('.usd-rate').textContent = this.rates.USD;
    this.element.querySelector('.eur-rate').textContent = this.rates.EUR;
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget currency-widget';
    this.element.innerHTML = `
      <div class="widget-header">
        <h3>${this.title}</h3>
        <button class="btn-minimize">−</button>
        <button class="btn-close">×</button>
      </div>
      <div class="widget-body">
        <div class="currency-row">
          <span>🇺🇸 USD:</span>
          <strong class="usd-rate">—</strong> ₽
        </div>
        <div class="currency-row">
          <span>🇪🇺 EUR:</span>
          <strong class="eur-rate">—</strong> ₽
        </div>
        <button class="btn-refresh">🔄 Обновить</button>
      </div>
    `;

    const header = this.element.querySelector('.widget-header');
    this.addManagedListener(header.querySelector('.btn-close'), 'click', () => this.close());
    this.addManagedListener(header.querySelector('.btn-minimize'), 'click', () => this.minimize());
    this.addManagedListener(this.element.querySelector('.btn-refresh'), 'click', () => this.loadRates());

    this.loadRates();
    return this.element;
  }
}
