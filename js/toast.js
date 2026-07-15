export class ToastNotification {
  constructor() {
    if (ToastNotification.instance) {
      return ToastNotification.instance;
    }
    this.container = null;
    this.toasts = [];
    this.maxToasts = 3;
    this.initContainer();
    ToastNotification.instance = this;
  }

  initContainer() {
    if (typeof document === 'undefined') return;
    
    if (!document.querySelector('.c-toast-container')) {
      this.container = document.createElement('div');
      this.container.className = 'c-toast-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.querySelector('.c-toast-container');
    }
  }

  getIconSvg(type) {
    if (type === 'success') {
      return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" fill="currentColor"/><path d="M10.5 15.8L6.5 11.8L7.9 10.4L10.5 13L16.1 7.4L17.5 8.8L10.5 15.8Z" fill="white"/></svg>`;
    } else if (type === 'error') {
      return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" fill="currentColor"/><path d="M12 7V13M12 17V17.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
    return '';
  }

  getCloseSvg() {
    return `<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" /></svg>`;
  }

  show(message, type = 'success', duration = 5000) {
    if (typeof document === 'undefined') return;
    
    // Ensure container exists
    if (!this.container || !document.querySelector('.c-toast-container')) {
      this.initContainer();
    }

    // Prevent duplicate exact messages by resetting timer
    const existingToast = this.toasts.find(t => t.message === message && t.type === type);
    if (existingToast) {
      clearTimeout(existingToast.timeoutId);
      existingToast.timeoutId = setTimeout(() => {
        this.remove(existingToast.element);
      }, duration);
      
      existingToast.element.style.transform = 'scale(1.02)';
      setTimeout(() => {
        existingToast.element.style.transform = '';
      }, 150);
      return;
    }

    // Maintain max stack
    if (this.toasts.length >= this.maxToasts) {
      const oldestToast = this.toasts[0];
      this.remove(oldestToast.element);
    }

    const toastEl = document.createElement('div');
    toastEl.className = 'c-toast';

    toastEl.innerHTML = `
      <div class="c-toast__icon c-toast__icon--${type}">
        ${this.getIconSvg(type)}
      </div>
      <div class="c-toast__content">${this.escapeHtml(message)}</div>
      <button class="c-toast__close" aria-label="Close">
        ${this.getCloseSvg()}
      </button>
    `;

    this.container.appendChild(toastEl);
    
    // Trigger layout for CSS transition
    void toastEl.offsetWidth;
    toastEl.classList.add('c-toast--show');

    const timeoutId = setTimeout(() => {
      this.remove(toastEl);
    }, duration);

    const toastObj = { element: toastEl, message, type, timeoutId };
    this.toasts.push(toastObj);

    const closeBtn = toastEl.querySelector('.c-toast__close');
    closeBtn.addEventListener('click', () => {
      this.remove(toastEl);
    });
  }

  remove(toastEl) {
    toastEl.classList.remove('c-toast--show');
    toastEl.classList.add('c-toast--hide');
    
    this.toasts = this.toasts.filter(t => t.element !== toastEl);

    toastEl.addEventListener('transitionend', () => {
      if (toastEl.parentNode) {
        toastEl.parentNode.removeChild(toastEl);
      }
    });
  }

  escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }
}

export const toast = new ToastNotification();
