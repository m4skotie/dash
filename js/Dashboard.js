// js/Dashboard.js
import { ToDoWidget } from './ToDoWidget.js';
import { QuoteWidget } from './QuoteWidget.js';
import { WeatherWidget } from './WeatherWidget.js';
import { CurrencyWidget } from './CurrencyWidget.js';

export class Dashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container #${containerId} not found`);
    }
    this.widgets = [];
  }

  addWidget(type) {
    let widget;
    const config = { id: `widget-${Date.now()}` };

    switch (type) {
      case 'todo':
        widget = new ToDoWidget(config);
        break;
      case 'quote':
        widget = new QuoteWidget(config);
        break;
      case 'weather':
        widget = new WeatherWidget(config);
        break;
      case 'currency':
        widget = new CurrencyWidget(config);
        break;
      default:
        console.error('Unknown widget type:', type);
        return;
    }

    try {
      const element = widget.render(); // ← синхронно возвращает Node
      this.container.appendChild(element);
      this.widgets.push(widget);
    } catch (err) {
      console.error('Failed to render widget:', err);
    }
  }

  removeWidget(widgetId) {
    const index = this.widgets.findIndex(w => w.id === widgetId);
    if (index !== -1) {
      this.widgets[index].destroy();
      this.widgets.splice(index, 1);
    }
  }
}

