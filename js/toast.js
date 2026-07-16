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

    if (!document.querySelector('.croucher-toast-container')) {
      this.container = document.createElement('div');
      this.container.className = 'croucher-toast-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.querySelector('.croucher-toast-container');
    }
  }

  getIconSvg(type) {
    if (type === 'success') {
      return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" fill="currentColor"/><path d="M10.5 15.8L6.5 11.8L7.9 10.4L10.5 13L16.1 7.4L17.5 8.8L10.5 15.8Z" fill="white"/></svg>`;
    } else if (type === 'error' || type === 'alert') {
      // The design for alert uses the same exclamation mark structure as error, but we'll return the same paths. 
      // The color is controlled via CSS (--toast-alert-icon-color)
      return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" fill="currentColor"/><path d="M12 7V13M12 17V17.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
    return '';
  }

  getCloseSvg() {
    return `<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" /></svg>`;
  }

  show(message, type = 'success', duration = 5000, options = {}) {
    if (typeof document === 'undefined') return;

    // Ensure container exists
    if (!this.container || !document.querySelector('.croucher-toast-container')) {
      this.initContainer();
    }

    const isConfirmation = type === 'alert' && (options.onOk || options.onCancel);
    if (isConfirmation) {
      duration = 0; // Disable auto-dismissal for action toasts
    }

    // Prevent duplicate exact messages by resetting timer
    const existingToast = this.toasts.find(t => t.message === message && t.type === type);
    if (existingToast && !isConfirmation) {
      clearTimeout(existingToast.timeoutId);
      existingToast.timeoutId = setTimeout(() => {
        this.remove(existingToast.element);
      }, duration);

      existingToast.element.style.transform = 'scale(1.02)';
      setTimeout(() => {
        existingToast.element.style.transform = '';
      }, 150);
      return;
    } else if (existingToast && isConfirmation) {
      // Do not spawn a second identical confirmation toast
      return;
    }

    // Maintain max stack
    if (this.toasts.length >= this.maxToasts) {
      const oldestToast = this.toasts[0];
      this.remove(oldestToast.element);
    }

    const toastEl = document.createElement('div');
    toastEl.className = 'croucher-toast' + (isConfirmation ? ' croucher-toast--confirmation' : '');

    toastEl.innerHTML = `
      ${isConfirmation ? '' : `
      <div class="croucher-toast__icon croucher-toast__icon--${type}">
        ${this.getIconSvg(type)}
      </div>
      `}
      <div class="croucher-toast__content">
        <span>${this.escapeHtml(message)}</span>
        ${isConfirmation ? `
          <div class="croucher-toast__actions">
            <button class="croucher-toast__btn-cancel">Cancel</button>
            <button class="croucher-toast__btn-ok">OK</button>
          </div>
        ` : ''}
      </div>
      <button class="croucher-toast__close" aria-label="Close">
        ${this.getCloseSvg()}
      </button>
    `;

    this.container.appendChild(toastEl);

    // Trigger layout for CSS transition
    void toastEl.offsetWidth;
    toastEl.classList.add('croucher-toast--show');

    let timeoutId = null;
    if (duration > 0) {
      timeoutId = setTimeout(() => {
        this.remove(toastEl);
      }, duration);
    }

    const toastObj = { element: toastEl, message, type, timeoutId };
    this.toasts.push(toastObj);

    const closeBtn = toastEl.querySelector('.croucher-toast__close');
    closeBtn.addEventListener('click', () => {
      this.remove(toastEl);
    });

    if (isConfirmation) {
      const btnCancel = toastEl.querySelector('.croucher-toast__btn-cancel');
      const btnOk = toastEl.querySelector('.croucher-toast__btn-ok');

      if (btnCancel) {
        btnCancel.addEventListener('click', () => {
          if (options.onCancel) options.onCancel();
          this.remove(toastEl);
        });
      }

      if (btnOk) {
        btnOk.addEventListener('click', () => {
          if (options.onOk) options.onOk();
          this.remove(toastEl);
        });
      }
    }
  }

  remove(toastEl) {
    toastEl.classList.remove('croucher-toast--show');
    toastEl.classList.add('croucher-toast--hide');

    this.toasts = this.toasts.filter(t => t.element !== toastEl);

    toastEl.addEventListener('transitionend', () => {
      if (toastEl.parentNode) {
        toastEl.parentNode.removeChild(toastEl);
      }
    });
  }

  // Polyfills for react-hot-toast API compatibility
  success(message, options = {}) {
    this.show(message, 'success', 5000, options);
  }

  error(message, options = {}) {
    this.show(message, 'error', 5000, options);
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
