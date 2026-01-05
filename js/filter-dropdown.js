/**
 * FilterDropdown - Multi-select dropdown with checkboxes
 *
 * Can be initialized with either:
 * 1. A <select multiple> element (will auto-generate the UI)
 * 2. Pre-built HTML structure with .filter-dropdown__button, .filter-dropdown__list, etc.
 */

(function () {
  var allFilterDropdowns = new Set();

  function FilterDropdown(element) {
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

  FilterDropdown.prototype.buildDropdownFromSelect = function() {
    var select = this.dropdown.querySelector('select[multiple]');
    if (!select) return;
    if (this.dropdown.querySelector('.filter-dropdown__button')) return;

    var button = document.createElement('div');
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

    var list = document.createElement('ul');
    list.className = 'filter-dropdown__list';
    list.setAttribute('role', 'listbox');

    Array.from(select.options).forEach(function(option, index) {
      var item = document.createElement('li');
      item.className = 'filter-dropdown__item';
      item.setAttribute('data-value', option.value);
      item.setAttribute('data-label', option.textContent);
      item.setAttribute('role', 'option');

      if (option.value === 'all' || option.value === 'select-all') {
        item.classList.add('filter-dropdown__item--select-all');
      }

      var checkboxId = `${select.id || 'filter'}-option-${index}`;
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
  };

  FilterDropdown.prototype.init = function() {
    if (!this.button) return;

    this.button.addEventListener('click', this.toggleDropdown);

    this.items.forEach(function(item) {
      var checkbox = item.querySelector('input[type="checkbox"]');

      item.addEventListener('click', function(e) {
        if (e.target.tagName !== 'INPUT') {
          e.preventDefault();
          this.toggleItem(item);
        }
      }.bind(this));

      if (checkbox) {
        checkbox.addEventListener('change', function(e) {
          e.stopPropagation();

          var isSelectAll = item.classList.contains('filter-dropdown__item--select-all');

          if (isSelectAll) {
            var newCheckedState = checkbox.checked;
            this.items.forEach(function(otherItem) {
              if (!otherItem.classList.contains('filter-dropdown__item--select-all')) {
                var otherCheckbox = otherItem.querySelector('input[type="checkbox"]');
                if (otherCheckbox) {
                  otherCheckbox.checked = newCheckedState;
                }
              }
            }.bind(this));
          } else {
            this.updateSelectAllState();
          }

          this.updateSelection();
          this.dispatchChangeEvent();
        }.bind(this));
      }
    }.bind(this));

    this.button.addEventListener('keydown', this.handleKeyboardNavigation);
    this.dropdown.addEventListener('keydown', this.handleKeyboardNavigation);

    this.updateSelection();
  };

  FilterDropdown.prototype.toggleDropdown = function(e) {
    e?.stopPropagation();

    var wasOpen = this.dropdown.classList.contains('filter-dropdown--open');

    // Close other dropdowns when opening this one
    if (!wasOpen) {
      allFilterDropdowns.forEach(function(dropdown) {
        if (dropdown !== this) {
          dropdown.close();
        }
      }.bind(this));
    }

    var isOpen = this.dropdown.classList.toggle('filter-dropdown--open');

    if (isOpen) {
      this.positionDropdownList();
      document.addEventListener('click', this.closeOnClickOutside);
      this.button.setAttribute('aria-expanded', 'true');
    } else {
      document.removeEventListener('click', this.closeOnClickOutside);
      this.button.setAttribute('aria-expanded', 'false');
      this.dropdown.classList.remove('filter-dropdown--upward');
    }
  };

  FilterDropdown.prototype.close = function() {
    this.dropdown.classList.remove('filter-dropdown--open');
    this.dropdown.classList.remove('filter-dropdown--upward');
    document.removeEventListener('click', this.closeOnClickOutside);
    if (this.button) {
      this.button.setAttribute('aria-expanded', 'false');
    }
  };

  FilterDropdown.prototype.positionDropdownList = function() {
    var buttonRect = this.button.getBoundingClientRect();
    var listHeight = this.list.offsetHeight || 200;
    var spaceBelow = window.innerHeight - buttonRect.bottom;
    var shouldOpenUpward = spaceBelow < listHeight && buttonRect.top > listHeight;

    if (shouldOpenUpward) {
      this.dropdown.classList.add('filter-dropdown--upward');
    } else {
      this.dropdown.classList.remove('filter-dropdown--upward');
    }
  };

  FilterDropdown.prototype.closeOnClickOutside = function(event) {
    if (!this.dropdown.contains(event.target)) {
      this.close();
    }
  };

  FilterDropdown.prototype.toggleItem = function(item) {
    var checkbox = item.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    var isSelectAll = item.classList.contains('filter-dropdown__item--select-all');

    if (isSelectAll) {
      var newCheckedState = !checkbox.checked;
      checkbox.checked = newCheckedState;

      this.items.forEach(function(otherItem) {
        if (!otherItem.classList.contains('filter-dropdown__item--select-all')) {
          var otherCheckbox = otherItem.querySelector('input[type="checkbox"]');
          if (otherCheckbox) {
            otherCheckbox.checked = newCheckedState;
          }
        }
      }.bind(this));
    } else {
      checkbox.checked = !checkbox.checked;
      this.updateSelectAllState();
    }

    this.updateSelection();
    this.dispatchChangeEvent();
  };

  FilterDropdown.prototype.updateSelectAllState = function() {
    var selectAllItem = this.dropdown.querySelector('.filter-dropdown__item--select-all');
    if (!selectAllItem) return;

    var selectAllCheckbox = selectAllItem.querySelector('input[type="checkbox"]');
    if (!selectAllCheckbox) return;

    var regularItems = Array.from(this.items).filter(
      function(item) { return !item.classList.contains('filter-dropdown__item--select-all'); }
    );

    var allChecked = regularItems.every(function(item) {
      var checkbox = item.querySelector('input[type="checkbox"]');
      return checkbox && checkbox.checked;
    });

    selectAllCheckbox.checked = allChecked;
  };

  FilterDropdown.prototype.updateSelection = function() {
    this.selectedValues = [];

    this.items.forEach(function(item) {
      // "Select all" is just a control, not an actual filter value
      if (item.classList.contains('filter-dropdown__item--select-all')) return;

      var checkbox = item.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        this.selectedValues.push({
          value: item.dataset.value,
          label: item.dataset.label
        });
      }
    }.bind(this));
  };

  FilterDropdown.prototype.dispatchChangeEvent = function() {
    var event = new CustomEvent('filter-change', {
      detail: {
        values: this.selectedValues.map(function(v) { return v.value; }),
        options: this.selectedValues
      }
    });
    this.dropdown.dispatchEvent(event);
  };

  FilterDropdown.prototype.handleKeyboardNavigation = function(event) {
    var isOpen = this.dropdown.classList.contains('filter-dropdown--open');
    var selectableItems = Array.from(this.items);

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          this.toggleDropdown(event);
        } else {
          var focused = document.activeElement;
          var focusedItem = focused.closest('.filter-dropdown__item');
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
          var focused = document.activeElement;
          if (focused === this.button) {
            selectableItems[0]?.querySelector('input')?.focus();
          } else {
            var currentItem = focused.closest('.filter-dropdown__item');
            var currentIndex = selectableItems.indexOf(currentItem);
            if (currentIndex >= 0 && currentIndex < selectableItems.length - 1) {
              selectableItems[currentIndex + 1].querySelector('input')?.focus();
            }
          }
        }
        event.preventDefault();
        break;

      case 'ArrowUp':
        if (isOpen) {
          var focused = document.activeElement;
          var currentItem = focused.closest('.filter-dropdown__item');
          var currentIndex = selectableItems.indexOf(currentItem);
          if (currentIndex > 0) {
            selectableItems[currentIndex - 1].querySelector('input')?.focus();
          } else {
            this.button.focus();
          }
          event.preventDefault();
        }
        break;
    }
  };

  FilterDropdown.prototype.getSelectedValues = function() {
    return this.selectedValues.map(function(v) { return v.value; });
  };

  FilterDropdown.prototype.getSelectedOptions = function() {
    return this.selectedValues;
  };

  FilterDropdown.prototype.clearSelection = function() {
    this.items.forEach(function(item) {
      var checkbox = item.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = false;
      }
    }.bind(this));
    this.updateSelection();
    this.dispatchChangeEvent();
  };

  FilterDropdown.prototype.setSelection = function(values) {
    this.items.forEach(function(item) {
      var checkbox = item.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = values.includes(item.dataset.value);
      }
    }.bind(this));
    this.updateSelection();
  };

  FilterDropdown.prototype.destroy = function() {
    allFilterDropdowns.delete(this);
    document.removeEventListener('click', this.closeOnClickOutside);
    if (this.button) {
      this.button.removeEventListener('click', this.toggleDropdown);
      this.button.removeEventListener('keydown', this.handleKeyboardNavigation);
    }
    this.dropdown.removeEventListener('keydown', this.handleKeyboardNavigation);
  };

  /**
   * FilterDropdownGroup - Manages multiple dropdowns with a shared results bar
   */
  function FilterDropdownGroup(container) {
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

  FilterDropdownGroup.prototype.init = function() {
    var dropdownElements = this.container.querySelectorAll('.filter-dropdown');
    dropdownElements.forEach(function(element) {
      var dropdown = new FilterDropdown(element);
      var id = element.dataset.id || element.id;
      this.dropdowns.set(id, dropdown);

      element.addEventListener('filter-change', function(e) {
        this.updateResultsBar();
        this.dispatchGroupChangeEvent(id, e.detail);
      }.bind(this));
    }.bind(this));

    if (this.clearButton) {
      this.clearButton.addEventListener('click', function() { this.clearAllFilters(); }.bind(this));
    }

    this.updateResultsBar();
  };

  FilterDropdownGroup.prototype.updateResultsBar = function() {
    if (!this.resultsBar || !this.tagsContainer) return;

    var allFilters = [];
    this.dropdowns.forEach(function(dropdown, dropdownId) {
      dropdown.getSelectedOptions().forEach(function(option) {
        allFilters.push({
          dropdownId: dropdownId,
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

    this.tagsContainer.innerHTML = allFilters.map(function(filter) {
      return `
        <span class="filter-results-bar__tag" data-dropdown-id="${filter.dropdownId}" data-value="${filter.value}">
          <span class="filter-results-bar__tag-icon">
            <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5l-.705.705L5.295 6 2.5 8.795l.705.705L6 6.705 8.795 9.5l.705-.705L6.705 6z"/>
            </svg>
          </span>
          <span class="filter-results-bar__tag-text">${filter.label}</span>
        </span>
      `;
    }).join('');

    this.tagsContainer.querySelectorAll('.filter-results-bar__tag').forEach(function(tag) {
      tag.addEventListener('click', function() {
        var dropdownId = tag.dataset.dropdownId;
        var value = tag.dataset.value;
        this.removeFilter(dropdownId, value);
      }.bind(this));
    }.bind(this));
  };

  FilterDropdownGroup.prototype.removeFilter = function(dropdownId, value) {
    var dropdown = this.dropdowns.get(dropdownId);
    if (!dropdown) return;

    var currentValues = dropdown.getSelectedValues();
    var newValues = currentValues.filter(function(v) { return v !== value; });
    dropdown.setSelection(newValues);
    this.updateResultsBar();
  };

  FilterDropdownGroup.prototype.clearAllFilters = function() {
    this.dropdowns.forEach(function(dropdown) {
      dropdown.clearSelection();
    }.bind(this));
    this.updateResultsBar();
  };

  FilterDropdownGroup.prototype.dispatchGroupChangeEvent = function(dropdownId, detail) {
    var event = new CustomEvent('filter-group-change', {
      detail: {
        dropdownId: dropdownId,
        values: detail.values,
        options: detail.options
      }
    });
    this.container.dispatchEvent(event);
  };

  FilterDropdownGroup.prototype.getDropdown = function(id) {
    return this.dropdowns.get(id);
  };

  FilterDropdownGroup.prototype.getAllSelectedFilters = function() {
    var filters = {};
    this.dropdowns.forEach(function(dropdown, id) {
      filters[id] = dropdown.getSelectedValues();
    });
    return filters;
  };

  // Auto-init on page load
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.filter-dropdown:not(.filter-dropdown-group-container .filter-dropdown)').forEach(function(element) {
      new FilterDropdown(element);
    });

    document.querySelectorAll('.filter-dropdown-group-container').forEach(function(container) {
      new FilterDropdownGroup(container);
    });
  });

  // Fallback if DOM already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(function() {
      document.querySelectorAll('.filter-dropdown:not(.filter-dropdown-group-container .filter-dropdown)').forEach(function(element) {
        if (!element._filterDropdown) {
          element._filterDropdown = new FilterDropdown(element);
        }
      });

      document.querySelectorAll('.filter-dropdown-group-container').forEach(function(container) {
        if (!container._filterDropdownGroup) {
          container._filterDropdownGroup = new FilterDropdownGroup(container);
        }
      });
    }, 1);
  }

  function createFilterDropdownItem(value, label, id) {
    var item = document.createElement('li');
    item.className = 'filter-dropdown__item';
    item.setAttribute('data-value', value);
    item.setAttribute('data-label', label);

    var checkbox = document.createElement('div');
    checkbox.className = 'standard-checkbox';

    var input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id || `filter-${value}`;

    var labelEl = document.createElement('label');
    labelEl.className = 'standard-checkbox-label';
    labelEl.setAttribute('for', input.id);
    labelEl.textContent = label;

    checkbox.appendChild(input);
    checkbox.appendChild(labelEl);
    item.appendChild(checkbox);

    return item;
  }
})();
