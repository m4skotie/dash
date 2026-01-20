// js/ToDoWidget.js
import { UIComponent } from './UIComponent.js';

export class ToDoWidget extends UIComponent {
  constructor(config = {}) {
    super({ ...config, title: config.title || 'Список дел' });
    this.tasks = JSON.parse(localStorage.getItem(`tasks-${this.id}`)) || [];
  }

  saveTasks() {
    localStorage.setItem(`tasks-${this.id}`, JSON.stringify(this.tasks));
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget todo-widget';
    this.element.innerHTML = `
      <div class="widget-header">
        <h3>${this.title}</h3>
        <button class="btn-minimize">−</button>
        <button class="btn-close">×</button>
      </div>
      <div class="widget-body">
        <div class="input-group">
          <input type="text" placeholder="Новая задача..." class="task-input">
          <button class="btn-add">✚</button>
        </div>
        <ul class="task-list"></ul>
      </div>
    `;

    const header = this.element.querySelector('.widget-header');
    this.addManagedListener(header.querySelector('.btn-close'), 'click', () => this.close());
    this.addManagedListener(header.querySelector('.btn-minimize'), 'click', () => this.minimize());

    const input = this.element.querySelector('.task-input');
    const addButton = this.element.querySelector('.btn-add');
    const taskList = this.element.querySelector('.task-list');

    const addTaskFromInput = () => {
      const text = input.value.trim();
      if (text) {
        this.tasks.push({ id: Date.now(), text, done: false });
        this.saveTasks();
        input.value = '';
        this.renderTasks(taskList);
      }
    };

    this.addManagedListener(addButton, 'click', addTaskFromInput);
    this.addManagedListener(input, 'keypress', (e) => {
      if (e.key === 'Enter') addTaskFromInput();
    });

    this.renderTasks(taskList);
    return this.element;
  }

  renderTasks(taskList) {
    taskList.innerHTML = '';
    this.tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = task.done ? 'task done' : 'task';
      li.innerHTML = `
        <input type="checkbox" ${task.done ? 'checked' : ''} data-id="${task.id}">
        <span>${task.text}</span>
        <button class="btn-delete" data-id="${task.id}">×</button>
      `;
      taskList.appendChild(li);
    });

    taskList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      this.addManagedListener(cb, 'change', (e) => {
        const id = Number(e.target.dataset.id);
        const task = this.tasks.find(t => t.id === id);
        if (task) {
          task.done = e.target.checked;
          this.saveTasks();
          this.renderTasks(taskList);
        }
      });
    });

    taskList.querySelectorAll('.btn-delete').forEach(btn => {
      this.addManagedListener(btn, 'click', (e) => {
        const id = Number(e.target.dataset.id);
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks(taskList);
      });
    });
  }

  destroy() {
    localStorage.removeItem(`tasks-${this.id}`);
    super.destroy();
  }
}

