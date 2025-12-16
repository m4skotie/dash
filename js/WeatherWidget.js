// js/WeatherWidget.js
import { UIComponent } from './UIComponent.js';

export class WeatherWidget extends UIComponent {
  constructor(config = {}) {
    super({ ...config, title: config.title || 'Погода (Москва)' });
  }

  async loadWeather() {
    try {
      // Open-Meteo — открытый API без CORS проблем
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?' +
        'latitude=55.7558&longitude=37.6176&' +
        'current=temperature_2m&temperature_unit=celsius'
      );
      if (!res.ok) throw new Error('Weather API error');
      const data = await res.json();
      const temp = Math.round(data.current.temperature_2m);
      this.updateContent(`${temp}°C`, 'Москва');
    } catch (err) {
      this.updateContent('--°C', 'Ошибка загрузки');
    }
  }

  updateContent(temp, location) {
    if (!this.element) return;
    this.element.querySelector('.temp').textContent = temp;
    this.element.querySelector('.location').textContent = location;
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget weather-widget';
    this.element.innerHTML = `
      <div class="widget-header">
        <h3>${this.title}</h3>
        <button class="btn-minimize">−</button>
        <button class="btn-close">×</button>
      </div>
      <div class="widget-body">
        <div class="weather-info">
          <span class="temp">--°C</span>
          <span class="location">Загрузка...</span>
        </div>
        <button class="btn-refresh">🔄 Обновить</button>
      </div>
    `;

    const header = this.element.querySelector('.widget-header');
    this.addManagedListener(header.querySelector('.btn-close'), 'click', () => this.close());
    this.addManagedListener(header.querySelector('.btn-minimize'), 'click', () => this.minimize());
    this.addManagedListener(this.element.querySelector('.btn-refresh'), 'click', () => this.loadWeather());

    this.loadWeather();
    return this.element;
  }
}
