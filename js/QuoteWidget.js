// js/QuoteWidget.js
import { UIComponent } from './UIComponent.js';

export class QuoteWidget extends UIComponent {
  constructor(config = {}) {
    super({ ...config, title: config.title || 'Цитата дня' });
  }

  async loadQuote() {
    try {
      const res = await fetch('https://api.quotable.io/random');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      this.updateContent(data.content, data.author);
    } catch (err) {
      this.updateContent('Не удалось загрузить цитату', '—');
    }
  }

  updateContent(quote, author) {
    if (!this.element) return;
    this.element.querySelector('blockquote').textContent = `"${quote}"`;
    this.element.querySelector('.author').textContent = author || '—';
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget quote-widget';
    this.element.innerHTML = `
      <div class="widget-header">
        <h3>${this.title}</h3>
        <button class="btn-minimize">−</button>
        <button class="btn-close">×</button>
      </div>
      <div class="widget-body">
        <blockquote>Загрузка...</blockquote>
        <p class="author">—</p>
        <button class="btn-refresh">🔄 Обновить</button>
      </div>
    `;

    const header = this.element.querySelector('.widget-header');
    this.addManagedListener(header.querySelector('.btn-close'), 'click', () => this.close());
    this.addManagedListener(header.querySelector('.btn-minimize'), 'click', () => this.minimize());
    this.addManagedListener(this.element.querySelector('.btn-refresh'), 'click', () => this.loadQuote());

    // Загружаем цитату
    this.loadQuote();

    return this.element;
  }
}
