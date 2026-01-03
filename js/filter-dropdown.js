/**
 * FilterDropdown - Multi-select dropdown with checkboxes
 * Uses standard-checkbox styles from form/_input.scss
 * 
 * HTML Structure:
 * <div class="filter-dropdown" data-placeholder="Select options">
 *   <div class="filter-dropdown__button">
 *     <div class="filter-dropdown__selected filter-dropdown__selected--placeholder">
 *       <div class="truncate">Select options</div>
 *     </div>
 *     <div class="filter-dropdown__arrow">
 *       <svg viewBox="0 0 53 50" fill="none" xmlns="http://www.w3.org/2000/svg">
 *         <path fill="#231f20" d="M26.8,41.9c-1.5,0-2.9-.7-3.9-1.8L2,13.8c-.8-1-.6-2.4.4-3.2,1-.8,2.4-.6,3.2.4l20.8,26.3c.1.1.3,0,.5.2.1,0,.3,0,.5-.2l20.1-26.1c.8-1,2.2-1.2,3.2-.4s1.2,2.2.4,3.2l-20.2,26.2c-1,1.2-2.5,1.9-4,1.9h0,0Z"/>
 *       </svg>
 *     </div>
 *   </div>
 *   <ul class="filter-dropdown__list">
 *     <li class="filter-dropdown__item" data-value="option1" data-label="Option 1">
 *       <div class="standard-checkbox">
 *         <input type="checkbox" id="filter-option1">
 *         <label class="standard-checkbox-label" for="filter-option1">Option 1</label>
 *       </div>
 *     </li>
 *     <li class="filter-dropdown__item" data-value="option2" data-label="Option 2">
 *       <div class="standard-checkbox">
 *         <input type="checkbox" id="filter-option2">
 *         <label class="standard-checkbox-label" for="filter-option2">Option 2</label>
 *       </div>
 *     </li>
 *   </ul>
 * </div>
 */

export class FilterDropdown {
  constructor(element) {
    this.dropdown = element;
    this.button = this.dropdown.querySelector('.filter-dropdown__button');
    this.selectedText = this.dropdown.querySelector('.filter-dropdown__selected');
    this.list = this.dropdown.querySelector('.filter-dropdown__list');
    this.items = this.dropdown.querySelectorAll('.filter-dropdown__item');
    
    this.placeholder = this.dropdown.dataset.placeholder || "Select options";
    this.selectedValues = [];
    
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.closeOnClickOutside = this.closeOnClickOutside.bind(this);
    this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
    
    this.init();
  }
  
  init() {
    this.button.addEventListener('click', this.toggleDropdown);
    
    this.items.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      
      // Handle click on the entire item
      item.addEventListener('click', (e) => {
        // Prevent double-firing when clicking directly on checkbox
        if (e.target.tagName !== 'INPUT') {
          e.preventDefault();
          this.toggleItem(item);
        }
      });
      
      // Handle direct checkbox change
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          e.stopPropagation();
          this.updateSelection();
          this.dispatchChangeEvent();
        });
      }
    });
    
    this.button.addEventListener('keydown', this.handleKeyboardNavigation);
    this.dropdown.addEventListener('keydown', this.handleKeyboardNavigation);
    
    // Initialize from pre-checked checkboxes
    this.updateSelection();
  }
  
  toggleDropdown(e) {
    e?.stopPropagation();
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
      this.dropdown.classList.remove('filter-dropdown--open');
      document.removeEventListener('click', this.closeOnClickOutside);
      this.button.setAttribute('aria-expanded', 'false');
    }
  }
  
  toggleItem(item) {
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      this.updateSelection();
      this.dispatchChangeEvent();
    }
  }
  
  updateSelection() {
    this.selectedValues = [];
    
    this.items.forEach(item => {
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
          this.dropdown.classList.remove('filter-dropdown--open');
          document.removeEventListener('click', this.closeOnClickOutside);
          this.button.setAttribute('aria-expanded', 'false');
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
  
  // Public methods
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
}

/**
 * FilterDropdownGroup - Manages multiple filter dropdowns and results bar
 * 
 * HTML Structure:
 * <div class="filter-dropdown-group-container">
 *   <div class="filter-dropdown-group filter-dropdown-group--cols-3">
 *     <div class="filter-dropdown-group__item">
 *       <div class="filter-dropdown" data-id="when" data-placeholder="When">...</div>
 *     </div>
 *     <div class="filter-dropdown-group__item">
 *       <div class="filter-dropdown" data-id="audiences" data-placeholder="Audiences">...</div>
 *     </div>
 *     <div class="filter-dropdown-group__item">
 *       <div class="filter-dropdown" data-id="event-types" data-placeholder="Event types">...</div>
 *     </div>
 *   </div>
 *   <div class="filter-results-bar" style="display: none;">
 *     <span class="filter-results-bar__label">Showing results for:</span>
 *     <div class="filter-results-bar__tags"></div>
 *     <button class="filter-results-bar__clear" type="button">Clear filters</button>
 *   </div>
 * </div>
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
    // Initialize all filter dropdowns in the group
    const dropdownElements = this.container.querySelectorAll('.filter-dropdown');
    dropdownElements.forEach(element => {
      const dropdown = new FilterDropdown(element);
      const id = element.dataset.id || element.id;
      this.dropdowns.set(id, dropdown);
      
      // Listen for changes
      element.addEventListener('filter-change', (e) => {
        this.updateResultsBar();
        this.dispatchGroupChangeEvent(id, e.detail);
      });
    });
    
    // Clear all button
    if (this.clearButton) {
      this.clearButton.addEventListener('click', () => this.clearAllFilters());
    }
    
    // Initial update
    this.updateResultsBar();
  }
  
  updateResultsBar() {
    if (!this.resultsBar || !this.tagsContainer) return;
    
    // Collect all selected filters
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
    
    // Show/hide results bar
    if (allFilters.length === 0) {
      this.resultsBar.style.display = 'none';
      return;
    }
    
    this.resultsBar.style.display = '';
    
    // Update clear button text (singular/plural)
    if (this.clearButton) {
      this.clearButton.textContent = allFilters.length === 1 
        ? this.clearFilterLabel 
        : this.clearFiltersLabel;
    }
    
    // Build tags HTML
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
    
    // Add click handlers to tags
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
  
  // Public methods
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

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize standalone filter dropdowns
  document.querySelectorAll('.filter-dropdown:not(.filter-dropdown-group-container .filter-dropdown)').forEach(element => {
    new FilterDropdown(element);
  });
  
  // Initialize filter dropdown groups
  document.querySelectorAll('.filter-dropdown-group-container').forEach(container => {
    new FilterDropdownGroup(container);
  });
});

// Fallback for already loaded DOM
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

// Export for manual initialization
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

