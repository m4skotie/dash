// js/UIComponent.js
export class UIComponent {
  constructor(config = {}) {
    this.id = config.id || `widget-${Date.now()}`;
    this.title = config.title || 'Widget';
    this.element = null;
    this.eventHandlers = [];
  }

  render() {
    throw new Error('Метод render() должен быть реализован в дочернем классе');
  }

  addManagedListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.eventHandlers.push({ element, event, handler });
  }

  destroy() {
    if (this.element?.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.eventHandlers.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventHandlers = [];
  }
  
  minimize() {
    if (this.element) {
      this.element.classList.toggle('minimized');
    }
  }

  close() {
    this.destroy();
  }
}


