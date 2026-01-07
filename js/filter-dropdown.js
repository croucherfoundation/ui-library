/**
 * FilterDropdown - Multi-select dropdown with checkboxes
 *
 * Can be initialized with either:
 * 1. A <select multiple> element (will auto-generate the UI)
 * 2. Pre-built HTML structure with .filter-dropdown__button, .filter-dropdown__list, etc.
 * 3. A calendar date picker (data-type="calendar")
 */

(function () {
  var allFilterDropdowns = new Set();

  /**
   * FilterDropdownCalendar - Date picker with single date or date range selection
   */
  function FilterDropdownCalendar(element) {
    this.dropdown = element;
    this.placeholder = this.dropdown.dataset.placeholder || "Select date";
    this.startDate = null;
    this.endDate = null;
    this.currentMonth = new Date();
    this.isSelectingEndDate = false;

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.closeOnClickOutside = this.closeOnClickOutside.bind(this);

    this.buildCalendarUI();

    this.button = this.dropdown.querySelector('.filter-dropdown__button');
    this.selectedText = this.dropdown.querySelector('.filter-dropdown__selected');
    this.calendarContainer = this.dropdown.querySelector('.filter-dropdown__calendar');

    allFilterDropdowns.add(this);

    this.init();
  }

  FilterDropdownCalendar.prototype.buildCalendarUI = function() {
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

    var calendarContainer = document.createElement('div');
    calendarContainer.className = 'filter-dropdown__calendar';

    this.dropdown.appendChild(button);
    this.dropdown.appendChild(calendarContainer);
  };

  FilterDropdownCalendar.prototype.init = function() {
    if (!this.button) return;

    this.button.addEventListener('click', this.toggleDropdown);
    this.renderCalendar();
  };

  FilterDropdownCalendar.prototype.renderCalendar = function() {
    var self = this;
    var year = this.currentMonth.getFullYear();
    var month = this.currentMonth.getMonth();

    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    var dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    var firstDay = new Date(year, month, 1);
    var lastDay = new Date(year, month + 1, 0);
    var startDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0
    var daysInMonth = lastDay.getDate();

    var prevMonthLastDay = new Date(year, month, 0).getDate();

    var html = `
      <div class="filter-dropdown__calendar-header">
        <button type="button" class="filter-dropdown__calendar-nav filter-dropdown__calendar-nav--prev" data-action="prev">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <span class="filter-dropdown__calendar-title">${monthNames[month]} ${year}</span>
        <button type="button" class="filter-dropdown__calendar-nav filter-dropdown__calendar-nav--next" data-action="next">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="filter-dropdown__calendar-weekdays">
        ${dayNames.map(function(day) { return '<span>' + day + '</span>'; }).join('')}
      </div>
      <div class="filter-dropdown__calendar-days">
    `;

    // Previous month days
    for (var i = startDayOfWeek - 1; i >= 0; i--) {
      var day = prevMonthLastDay - i;
      var date = new Date(year, month - 1, day);
      html += this.renderDay(date, true);
    }

    // Current month days
    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(year, month, d);
      html += this.renderDay(date, false);
    }

    // Next month days to fill the grid
    var totalCells = startDayOfWeek + daysInMonth;
    var remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (var n = 1; n <= remainingCells; n++) {
      var date = new Date(year, month + 1, n);
      html += this.renderDay(date, true);
    }

    html += `
      </div>
      <div class="filter-dropdown__calendar-actions">
        <button type="button" class="filter-dropdown__calendar-btn filter-dropdown__calendar-btn--clear" data-action="clear">Clear</button>
        <button type="button" class="filter-dropdown__calendar-btn filter-dropdown__calendar-btn--confirm" data-action="confirm">Confirm</button>
      </div>
    `;

    this.calendarContainer.innerHTML = html;

    // Add event listeners
    this.calendarContainer.querySelector('.filter-dropdown__calendar-nav--prev').addEventListener('click', function(e) {
      e.stopPropagation();
      self.navigateMonth(-1);
    });

    this.calendarContainer.querySelector('.filter-dropdown__calendar-nav--next').addEventListener('click', function(e) {
      e.stopPropagation();
      self.navigateMonth(1);
    });

    this.calendarContainer.querySelectorAll('.filter-dropdown__calendar-day').forEach(function(dayEl) {
      dayEl.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!dayEl.classList.contains('filter-dropdown__calendar-day--disabled')) {
          var timestamp = parseInt(dayEl.dataset.date);
          self.selectDate(new Date(timestamp));
        }
      });
    });

    this.calendarContainer.querySelector('.filter-dropdown__calendar-btn--clear').addEventListener('click', function(e) {
      e.stopPropagation();
      self.clearSelection();
    });

    this.calendarContainer.querySelector('.filter-dropdown__calendar-btn--confirm').addEventListener('click', function(e) {
      e.stopPropagation();
      self.confirmSelection();
    });
  };

  FilterDropdownCalendar.prototype.renderDay = function(date, isOtherMonth) {
    var classes = ['filter-dropdown__calendar-day'];
    
    if (isOtherMonth) {
      classes.push('filter-dropdown__calendar-day--other-month');
    }

    var isStart = this.startDate && this.isSameDay(date, this.startDate);
    var isEnd = this.endDate && this.isSameDay(date, this.endDate);
    var isInRange = this.startDate && this.endDate && date > this.startDate && date < this.endDate;

    if (isStart) {
      classes.push('filter-dropdown__calendar-day--selected');
      classes.push('filter-dropdown__calendar-day--range-start');
    }
    if (isEnd) {
      classes.push('filter-dropdown__calendar-day--selected');
      classes.push('filter-dropdown__calendar-day--range-end');
    }
    if (isInRange) {
      classes.push('filter-dropdown__calendar-day--in-range');
    }
    if (isStart && isEnd) {
      classes.push('filter-dropdown__calendar-day--single');
    }

    return '<button type="button" class="' + classes.join(' ') + '" data-date="' + date.getTime() + '">' + date.getDate() + '</button>';
  };

  FilterDropdownCalendar.prototype.isSameDay = function(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  FilterDropdownCalendar.prototype.selectDate = function(date) {
    if (!this.startDate || (this.startDate && this.endDate)) {
      // Start new selection
      this.startDate = date;
      this.endDate = date;
      this.isSelectingEndDate = true;
    } else if (this.isSelectingEndDate) {
      // Set end date
      if (date < this.startDate) {
        this.endDate = this.startDate;
        this.startDate = date;
      } else {
        this.endDate = date;
      }
      this.isSelectingEndDate = false;
    }

    this.renderCalendar();
  };

  FilterDropdownCalendar.prototype.navigateMonth = function(direction) {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + direction);
    this.renderCalendar();
  };

  FilterDropdownCalendar.prototype.clearSelection = function() {
    this.startDate = null;
    this.endDate = null;
    this.isSelectingEndDate = false;
    this.renderCalendar();
    this.updateButtonText();
    this.dispatchChangeEvent();
  };

  FilterDropdownCalendar.prototype.confirmSelection = function() {
    this.updateButtonText();
    this.close();
    this.dispatchChangeEvent();
  };

  FilterDropdownCalendar.prototype.updateButtonText = function() {
    var selectedDiv = this.button.querySelector('.filter-dropdown__selected');
    var truncateDiv = selectedDiv.querySelector('.truncate');

    if (this.startDate) {
      var text = this.formatDateDisplay(this.startDate);
      if (this.endDate && !this.isSameDay(this.startDate, this.endDate)) {
        text += ' - ' + this.formatDateDisplay(this.endDate);
      }
      truncateDiv.textContent = text;
      selectedDiv.classList.remove('filter-dropdown__selected--placeholder');
      selectedDiv.classList.add('filter-dropdown__selected--value');
    } else {
      truncateDiv.textContent = this.placeholder;
      selectedDiv.classList.add('filter-dropdown__selected--placeholder');
      selectedDiv.classList.remove('filter-dropdown__selected--value');
    }
  };

  FilterDropdownCalendar.prototype.formatDateDisplay = function(date) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    return days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()];
  };

  FilterDropdownCalendar.prototype.toggleDropdown = function(e) {
    e?.stopPropagation();

    var wasOpen = this.dropdown.classList.contains('filter-dropdown--open');

    if (!wasOpen) {
      allFilterDropdowns.forEach(function(dropdown) {
        if (dropdown !== this) {
          dropdown.close();
        }
      }.bind(this));
    }

    var isOpen = this.dropdown.classList.toggle('filter-dropdown--open');

    if (isOpen) {
      this.positionCalendar();
      document.addEventListener('click', this.closeOnClickOutside);
      this.button.setAttribute('aria-expanded', 'true');
    } else {
      document.removeEventListener('click', this.closeOnClickOutside);
      this.button.setAttribute('aria-expanded', 'false');
      this.dropdown.classList.remove('filter-dropdown--upward');
    }
  };

  FilterDropdownCalendar.prototype.positionCalendar = function() {
    var buttonRect = this.button.getBoundingClientRect();
    var calendarHeight = this.calendarContainer.offsetHeight || 400;
    var spaceBelow = window.innerHeight - buttonRect.bottom;
    var shouldOpenUpward = spaceBelow < calendarHeight && buttonRect.top > calendarHeight;

    if (shouldOpenUpward) {
      this.dropdown.classList.add('filter-dropdown--upward');
    } else {
      this.dropdown.classList.remove('filter-dropdown--upward');
    }
  };

  FilterDropdownCalendar.prototype.close = function() {
    this.dropdown.classList.remove('filter-dropdown--open');
    this.dropdown.classList.remove('filter-dropdown--upward');
    document.removeEventListener('click', this.closeOnClickOutside);
    if (this.button) {
      this.button.setAttribute('aria-expanded', 'false');
    }
  };

  FilterDropdownCalendar.prototype.closeOnClickOutside = function(event) {
    if (!this.dropdown.contains(event.target)) {
      this.close();
    }
  };

  FilterDropdownCalendar.prototype.dispatchChangeEvent = function() {
    var detail = {
      startDate: this.startDate,
      endDate: this.endDate,
      values: [],
      options: []
    };

    if (this.startDate) {
      var label = this.formatDateDisplay(this.startDate);
      if (this.endDate && !this.isSameDay(this.startDate, this.endDate)) {
        label += ' - ' + this.formatDateDisplay(this.endDate);
      }
      detail.values = [this.startDate.toISOString()];
      if (this.endDate && !this.isSameDay(this.startDate, this.endDate)) {
        detail.values.push(this.endDate.toISOString());
      }
      detail.options = [{
        value: detail.values.join(','),
        label: label
      }];
    }

    var event = new CustomEvent('filter-change', { detail: detail });
    this.dropdown.dispatchEvent(event);
  };

  FilterDropdownCalendar.prototype.getSelectedValues = function() {
    if (!this.startDate) return [];
    var values = [this.startDate.toISOString()];
    if (this.endDate && !this.isSameDay(this.startDate, this.endDate)) {
      values.push(this.endDate.toISOString());
    }
    return values;
  };

  FilterDropdownCalendar.prototype.getSelectedOptions = function() {
    if (!this.startDate) return [];
    var label = this.formatDateDisplay(this.startDate);
    if (this.endDate && !this.isSameDay(this.startDate, this.endDate)) {
      label += ' - ' + this.formatDateDisplay(this.endDate);
    }
    return [{
      value: this.getSelectedValues().join(','),
      label: label
    }];
  };

  FilterDropdownCalendar.prototype.clearSelection = function() {
    this.startDate = null;
    this.endDate = null;
    this.isSelectingEndDate = false;
    this.renderCalendar();
    this.updateButtonText();
    this.dispatchChangeEvent();
  };

  FilterDropdownCalendar.prototype.setSelection = function(values) {
    if (values && values.length > 0) {
      this.startDate = new Date(values[0]);
      this.endDate = values.length > 1 ? new Date(values[1]) : new Date(values[0]);
      this.renderCalendar();
      this.updateButtonText();
    } else {
      this.clearSelection();
    }
  };

  FilterDropdownCalendar.prototype.destroy = function() {
    allFilterDropdowns.delete(this);
    document.removeEventListener('click', this.closeOnClickOutside);
    if (this.button) {
      this.button.removeEventListener('click', this.toggleDropdown);
    }
  };

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
      var isCalendar = element.dataset.type === 'calendar';
      var dropdown = isCalendar ? new FilterDropdownCalendar(element) : new FilterDropdown(element);
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
      if (element.dataset.type === 'calendar') {
        new FilterDropdownCalendar(element);
      } else {
        new FilterDropdown(element);
      }
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
          if (element.dataset.type === 'calendar') {
            element._filterDropdown = new FilterDropdownCalendar(element);
          } else {
            element._filterDropdown = new FilterDropdown(element);
          }
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



