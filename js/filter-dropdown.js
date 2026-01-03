/**
 * FilterDropdown - Multi-select dropdown with checkboxes
 * 
 * Can be initialized with either:
 * 1. A <select multiple> element (will auto-generate the UI)
 * 2. Pre-built HTML structure with .filter-dropdown__button, .filter-dropdown__list, etc.
 */

const allFilterDropdowns = new Set();

export class FilterDropdown {
  constructor(element) {
    this.dropdown = element;
    this.placeholder = this.dropdown.dataset.placeholder || "Select options";
    this.selectedValues = [];
    
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.closeOnClickOutside = this.closeOnClickOutside.bind(this);
    this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
    
    this.buildDropdownFromSelect();
    
    this.button = this.dropdown.querySelector('.filter-dropdown__button');
    this.selectedText = this.dropdown.querySelector('.filter-dropdown__selected');
    this.list = this.dropdown.querySelector('.filter-dropdown__list');
    this.items = this.dropdown.querySelectorAll('.filter-dropdown__item');
    
    allFilterDropdowns.add(this);
    
    this.init();
  }
  
  buildDropdownFromSelect() {
    const select = this.dropdown.querySelector('select[multiple]');
    if (!select) return;
    if (this.dropdown.querySelector('.filter-dropdown__button')) return;
    
    const button = document.createElement('div');
    button.className = 'filter-dropdown__button';
    button.setAttribute('tabindex', '0');
    button.setAttribute('role', 'combobox');
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = `
      <div class="filter-dropdown__selected filter-dropdown__selected--placeholder">
        <div class="truncate">${this.placeholder}</div>
      </div>
      <div class="filter-dropdown__arrow">
        <svg viewBox="0 0 53 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#231f20" d="M26.8,41.9c-1.5,0-2.9-.7-3.9-1.8L2,13.8c-.8-1-.6-2.4.4-3.2,1-.8,2.4-.6,3.2.4l20.8,26.3c.1.1.3,0,.5.2.1,0,.3,0,.5-.2l20.1-26.1c.8-1,2.2-1.2,3.2-.4s1.2,2.2.4,3.2l-20.2,26.2c-1,1.2-2.5,1.9-4,1.9h0,0Z"/>
        </svg>
      </div>
    `;
    
    const list = document.createElement('ul');
    list.className = 'filter-dropdown__list';
    list.setAttribute('role', 'listbox');
    
    Array.from(select.options).forEach((option, index) => {
      const item = document.createElement('li');
      item.className = 'filter-dropdown__item';
      item.setAttribute('data-value', option.value);
      item.setAttribute('data-label', option.textContent);
      item.setAttribute('role', 'option');
      
      if (option.value === 'all' || option.value === 'select-all') {
        item.classList.add('filter-dropdown__item--select-all');
      }
      
      const checkboxId = `${select.id || 'filter'}-option-${index}`;
      item.innerHTML = `
        <div class="standard-checkbox">
          <input type="checkbox" id="${checkboxId}" ${option.selected ? 'checked' : ''}>
          <label class="standard-checkbox-label" for="${checkboxId}">${option.textContent}</label>
        </div>
      `;
      
      list.appendChild(item);
    });
    
    this.dropdown.appendChild(button);
    this.dropdown.appendChild(list);
  }
  
  init() {
    if (!this.button) return;
    
    this.button.addEventListener('click', this.toggleDropdown);
    
    this.items.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      
      item.addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT') {
          e.preventDefault();
          this.toggleItem(item);
        }
      });
      
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          e.stopPropagation();
          
          const isSelectAll = item.classList.contains('filter-dropdown__item--select-all');
          
          if (isSelectAll) {
            const newCheckedState = checkbox.checked;
            this.items.forEach(otherItem => {
              if (!otherItem.classList.contains('filter-dropdown__item--select-all')) {
                const otherCheckbox = otherItem.querySelector('input[type="checkbox"]');
                if (otherCheckbox) {
                  otherCheckbox.checked = newCheckedState;
                }
              }
            });
          } else {
            this.updateSelectAllState();
          }
          
          this.updateSelection();
          this.dispatchChangeEvent();
        });
      }
    });
    
    this.button.addEventListener('keydown', this.handleKeyboardNavigation);
    this.dropdown.addEventListener('keydown', this.handleKeyboardNavigation);
    
    this.updateSelection();
  }
  
  toggleDropdown(e) {
    e?.stopPropagation();
    
    const wasOpen = this.dropdown.classList.contains('filter-dropdown--open');
    
    // Close other dropdowns when opening this one
    if (!wasOpen) {
      allFilterDropdowns.forEach(dropdown => {
        if (dropdown !== this) {
          dropdown.close();
        }
      });
    }
    
    const isOpen = this.dropdown.classList.toggle('filter-dropdown--open');
    
    if (isOpen) {
      this.positionDropdownList();
      document.addEventListener('click', this.closeOnClickOutside);
      this.button.setAttribute('aria-expanded', 'true');
    } else {
      document.removeEventListener('click', this.closeOnClickOutside);
      this.button.setAttribute('aria-expanded', 'false');
      this.dropdown.classList.remove('filter-dropdown--upward');
    }
  }
  
  close() {
    this.dropdown.classList.remove('filter-dropdown--open');
    this.dropdown.classList.remove('filter-dropdown--upward');
    document.removeEventListener('click', this.closeOnClickOutside);
    if (this.button) {
      this.button.setAttribute('aria-expanded', 'false');
    }
  }
  
  positionDropdownList() {
    const buttonRect = this.button.getBoundingClientRect();
    const listHeight = this.list.offsetHeight || 200;
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const shouldOpenUpward = spaceBelow < listHeight && buttonRect.top > listHeight;
    
    if (shouldOpenUpward) {
      this.dropdown.classList.add('filter-dropdown--upward');
    } else {
      this.dropdown.classList.remove('filter-dropdown--upward');
    }
  }
  
  closeOnClickOutside(event) {
    if (!this.dropdown.contains(event.target)) {
      this.close();
    }
  }
  
  toggleItem(item) {
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (!checkbox) return;
    
    const isSelectAll = item.classList.contains('filter-dropdown__item--select-all');
    
    if (isSelectAll) {
      const newCheckedState = !checkbox.checked;
      checkbox.checked = newCheckedState;
      
      this.items.forEach(otherItem => {
        if (!otherItem.classList.contains('filter-dropdown__item--select-all')) {
          const otherCheckbox = otherItem.querySelector('input[type="checkbox"]');
          if (otherCheckbox) {
            otherCheckbox.checked = newCheckedState;
          }
        }
      });
    } else {
      checkbox.checked = !checkbox.checked;
      this.updateSelectAllState();
    }
    
    this.updateSelection();
    this.dispatchChangeEvent();
  }
  
  updateSelectAllState() {
    const selectAllItem = this.dropdown.querySelector('.filter-dropdown__item--select-all');
    if (!selectAllItem) return;
    
    const selectAllCheckbox = selectAllItem.querySelector('input[type="checkbox"]');
    if (!selectAllCheckbox) return;
    
    const regularItems = Array.from(this.items).filter(
      item => !item.classList.contains('filter-dropdown__item--select-all')
    );
    
    const allChecked = regularItems.every(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      return checkbox && checkbox.checked;
    });
    
    selectAllCheckbox.checked = allChecked;
  }
  
  updateSelection() {
    this.selectedValues = [];
    
    this.items.forEach(item => {
      // "Select all" is just a control, not an actual filter value
      if (item.classList.contains('filter-dropdown__item--select-all')) return;
      
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        this.selectedValues.push({
          value: item.dataset.value,
          label: item.dataset.label
        });
      }
    });
  }
  
  dispatchChangeEvent() {
    const event = new CustomEvent('filter-change', {
      detail: {
        values: this.selectedValues.map(v => v.value),
        options: this.selectedValues
      }
    });
    this.dropdown.dispatchEvent(event);
  }
  
  handleKeyboardNavigation(event) {
    const isOpen = this.dropdown.classList.contains('filter-dropdown--open');
    const selectableItems = Array.from(this.items);
    
    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          this.toggleDropdown(event);
        } else {
          const focused = document.activeElement;
          const focusedItem = focused.closest('.filter-dropdown__item');
          if (focusedItem) {
            this.toggleItem(focusedItem);
          }
        }
        event.preventDefault();
        break;
        
      case 'Escape':
        if (isOpen) {
          this.close();
          this.button.focus();
        }
        break;
        
      case 'ArrowDown':
        if (!isOpen) {
          this.toggleDropdown(event);
        } else {
          const focused = document.activeElement;
          if (focused === this.button) {
            selectableItems[0]?.querySelector('input')?.focus();
          } else {
            const currentItem = focused.closest('.filter-dropdown__item');
            const currentIndex = selectableItems.indexOf(currentItem);
            if (currentIndex >= 0 && currentIndex < selectableItems.length - 1) {
              selectableItems[currentIndex + 1].querySelector('input')?.focus();
            }
          }
        }
        event.preventDefault();
        break;
        
      case 'ArrowUp':
        if (isOpen) {
          const focused = document.activeElement;
          const currentItem = focused.closest('.filter-dropdown__item');
          const currentIndex = selectableItems.indexOf(currentItem);
          if (currentIndex > 0) {
            selectableItems[currentIndex - 1].querySelector('input')?.focus();
          } else {
            this.button.focus();
          }
          event.preventDefault();
        }
        break;
    }
  }
  
  getSelectedValues() {
    return this.selectedValues.map(v => v.value);
  }
  
  getSelectedOptions() {
    return this.selectedValues;
  }
  
  clearSelection() {
    this.items.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = false;
      }
    });
    this.updateSelection();
    this.dispatchChangeEvent();
  }
  
  setSelection(values) {
    this.items.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = values.includes(item.dataset.value);
      }
    });
    this.updateSelection();
  }
  
  destroy() {
    allFilterDropdowns.delete(this);
    document.removeEventListener('click', this.closeOnClickOutside);
    if (this.button) {
      this.button.removeEventListener('click', this.toggleDropdown);
      this.button.removeEventListener('keydown', this.handleKeyboardNavigation);
    }
    this.dropdown.removeEventListener('keydown', this.handleKeyboardNavigation);
  }
}

/**
 * FilterDropdownGroup - Manages multiple dropdowns with a shared results bar
 */
export class FilterDropdownGroup {
  constructor(container) {
    this.container = container;
    this.dropdownGroup = container.querySelector('.filter-dropdown-group');
    this.resultsBar = container.querySelector('.filter-results-bar');
    this.tagsContainer = container.querySelector('.filter-results-bar__tags');
    this.clearButton = container.querySelector('.filter-results-bar__clear');
    this.labelElement = container.querySelector('.filter-results-bar__label');
    
    this.dropdowns = new Map();
    this.showResultsLabel = this.resultsBar?.dataset.showResultsLabel || "Showing results for:";
    this.clearFiltersLabel = this.resultsBar?.dataset.clearFiltersLabel || "Clear filters";
    this.clearFilterLabel = this.resultsBar?.dataset.clearFilterLabel || "Clear filter";
    
    this.init();
  }
  
  init() {
    const dropdownElements = this.container.querySelectorAll('.filter-dropdown');
    dropdownElements.forEach(element => {
      const dropdown = new FilterDropdown(element);
      const id = element.dataset.id || element.id;
      this.dropdowns.set(id, dropdown);
      
      element.addEventListener('filter-change', (e) => {
        this.updateResultsBar();
        this.dispatchGroupChangeEvent(id, e.detail);
      });
    });
    
    if (this.clearButton) {
      this.clearButton.addEventListener('click', () => this.clearAllFilters());
    }
    
    this.updateResultsBar();
  }
  
  updateResultsBar() {
    if (!this.resultsBar || !this.tagsContainer) return;
    
    const allFilters = [];
    this.dropdowns.forEach((dropdown, dropdownId) => {
      dropdown.getSelectedOptions().forEach(option => {
        allFilters.push({
          dropdownId,
          value: option.value,
          label: option.label
        });
      });
    });
    
    if (allFilters.length === 0) {
      this.resultsBar.style.display = 'none';
      return;
    }
    
    this.resultsBar.style.display = '';
    
    if (this.clearButton) {
      this.clearButton.textContent = allFilters.length === 1 
        ? this.clearFilterLabel 
        : this.clearFiltersLabel;
    }
    
    this.tagsContainer.innerHTML = allFilters.map(filter => `
      <span class="filter-results-bar__tag" data-dropdown-id="${filter.dropdownId}" data-value="${filter.value}">
        <span class="filter-results-bar__tag-icon">
          <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5l-.705.705L5.295 6 2.5 8.795l.705.705L6 6.705 8.795 9.5l.705-.705L6.705 6z"/>
          </svg>
        </span>
        <span class="filter-results-bar__tag-text">${filter.label}</span>
      </span>
    `).join('');
    
    this.tagsContainer.querySelectorAll('.filter-results-bar__tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const dropdownId = tag.dataset.dropdownId;
        const value = tag.dataset.value;
        this.removeFilter(dropdownId, value);
      });
    });
  }
  
  removeFilter(dropdownId, value) {
    const dropdown = this.dropdowns.get(dropdownId);
    if (!dropdown) return;
    
    const currentValues = dropdown.getSelectedValues();
    const newValues = currentValues.filter(v => v !== value);
    dropdown.setSelection(newValues);
    this.updateResultsBar();
  }
  
  clearAllFilters() {
    this.dropdowns.forEach(dropdown => {
      dropdown.clearSelection();
    });
    this.updateResultsBar();
  }
  
  dispatchGroupChangeEvent(dropdownId, detail) {
    const event = new CustomEvent('filter-group-change', {
      detail: {
        dropdownId,
        ...detail
      }
    });
    this.container.dispatchEvent(event);
  }
  
  getDropdown(id) {
    return this.dropdowns.get(id);
  }
  
  getAllSelectedFilters() {
    const filters = {};
    this.dropdowns.forEach((dropdown, id) => {
      filters[id] = dropdown.getSelectedValues();
    });
    return filters;
  }
}

// Auto-init on page load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filter-dropdown:not(.filter-dropdown-group-container .filter-dropdown)').forEach(element => {
    new FilterDropdown(element);
  });
  
  document.querySelectorAll('.filter-dropdown-group-container').forEach(container => {
    new FilterDropdownGroup(container);
  });
});

// Fallback if DOM already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => {
    document.querySelectorAll('.filter-dropdown:not(.filter-dropdown-group-container .filter-dropdown)').forEach(element => {
      if (!element._filterDropdown) {
        element._filterDropdown = new FilterDropdown(element);
      }
    });
    
    document.querySelectorAll('.filter-dropdown-group-container').forEach(container => {
      if (!container._filterDropdownGroup) {
        container._filterDropdownGroup = new FilterDropdownGroup(container);
      }
    });
  }, 1);
}

export function createFilterDropdownItem(value, label, id) {
  const item = document.createElement('li');
  item.className = 'filter-dropdown__item';
  item.setAttribute('data-value', value);
  item.setAttribute('data-label', label);
  
  const checkbox = document.createElement('div');
  checkbox.className = 'standard-checkbox';
  
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = id || `filter-${value}`;
  
  const labelEl = document.createElement('label');
  labelEl.className = 'standard-checkbox-label';
  labelEl.setAttribute('for', input.id);
  labelEl.textContent = label;
  
  checkbox.appendChild(input);
  checkbox.appendChild(labelEl);
  item.appendChild(checkbox);
  
  return item;
}
