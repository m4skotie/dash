// js/QuoteWidget.js
import { UIComponent } from './UIComponent.js';

// Встроенный массив известных цитат на русском языке
const RUSSIAN_QUOTES = [
  { q: 'Жизнь — это то, что с тобой происходит, пока ты строишь планы.', a: 'Джон Леннон' },
  { q: 'Не бойся медлить, бойся остановиться.', a: 'Китайская пословица' },
  { q: 'Сделай шаг, и дорога появится сама.', a: 'Антуан де Сент-Экзюпери' },
  { q: 'Всё, что нас не убивает, делает нас сильнее.', a: 'Фридрих Ницше' },
  { q: 'Начни с малого, но мечтай о большем.', a: 'Сэм Уолтон' },
  { q: 'Успех — это идти от неудачи к неудаче, не теряя энтузиазма.', a: 'Уinston Черчилль' },
  { q: 'Лучший способ предсказать будущее — создать его самому.', a: 'Питер Друкер' },
  { q: 'Терпение — ключ к успеху.', a: 'Саади' },
  { q: 'Делай, что должен, и будь, что будет.', a: 'Фёдор Достоевский' },
  { q: 'Кто не рискует, тот не пьёт шампанское.', a: 'Народная мудрость' }
];

export class QuoteWidget extends UIComponent {
  constructor(config = {}) {
    super({ ...config, title: config.title || 'Цитата дня (RU)' });
  }

  getRandomQuote() {
    const index = Math.floor(Math.random() * RUSSIAN_QUOTES.length);
    return RUSSIAN_QUOTES[index];
  }

  loadQuote() {
    try {
      const { q: quote, a: author } = this.getRandomQuote();
      this.updateContent(quote, author);
    } catch (err) {
      this.updateContent('Вдохновение на подходе...', '—');
      console.error('Ошибка выбора цитаты:', err);
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
        <blockquote>Загрузка мудрости...</blockquote>
        <p class="author">—</p>
        <button class="btn-refresh">🔄 Новая цитата</button>
      </div>
    `;

    const header = this.element.querySelector('.widget-header');
    this.addManagedListener(header.querySelector('.btn-close'), 'click', () => this.close());
    this.addManagedListener(header.querySelector('.btn-minimize'), 'click', () => this.minimize());
    this.addManagedListener(this.element.querySelector('.btn-refresh'), 'click', () => this.loadQuote());

    this.loadQuote(); // синхронно, без fetch
    return this.element;
  }
}
