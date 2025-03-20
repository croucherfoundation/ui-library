export class StandardDropdown {
    constructor(element) {
      // Store references to DOM elements
      this.dropdown = element;
      this.button = this.dropdown.querySelector('.standard-dropdown__button');
      this.selectedText = this.dropdown.querySelector('.standard-dropdown__selected');
      this.list = this.dropdown.querySelector('.standard-dropdown__list');
      this.items = this.dropdown.querySelectorAll('.standard-dropdown__item');
      this.hiddenInput = this.dropdown.querySelector('input[type="hidden"]');
      
      // Get placeholder from data attribute or use default
      this.placeholder = this.dropdown.dataset.placeholder || "Choose option";
      
      // Bind event handlers
      this.toggleDropdown = this.toggleDropdown.bind(this);
      this.selectItem = this.selectItem.bind(this);
      this.closeOnClickOutside = this.closeOnClickOutside.bind(this);
      this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
      
      // Initialize the dropdown
      this.init();
    }
    
    init() {
      // Add event listeners
      this.button.addEventListener('click', this.toggleDropdown);
      
      this.items.forEach(item => {
        item.addEventListener('click', () => this.selectItem(item));
        
        // Ensure each item has a mark-cricle span
        if (!item.querySelector('.mark-cricle')) {
          const markCircle = document.createElement('span');
          markCircle.className = 'mark-cricle';
          markCircle.setAttribute('aria-hidden', 'true');
          item.insertBefore(markCircle, item.firstChild);
        }
      });
      
      // Keyboard navigation
      this.button.addEventListener('keydown', this.handleKeyboardNavigation);
      this.dropdown.addEventListener('keydown', this.handleKeyboardNavigation);
      
      // Set initial selected value if there's a pre-selected item
      const preSelected = this.dropdown.querySelector('.standard-dropdown__item--selected');
      if (preSelected) {
        this.selectItem(preSelected, false);
      } else {
        // Only set placeholder if the selected text is empty or we should enforce placeholder
        if (!this.selectedText.textContent.trim() || this.dropdown.dataset.enforcePlaceholder === 'true') {
          this.selectedText.textContent = this.placeholder;
        }
        this.selectedText.classList.add('standard-dropdown__selected--placeholder');
        
        if (this.hiddenInput) {
          this.hiddenInput.value = '';
        }
      }
    }
    
    toggleDropdown() {
      const isOpen = this.dropdown.classList.toggle('standard-dropdown--open');
      
      if (isOpen) {
        // Check if there's enough space below the dropdown
        this.positionDropdownList();
        
        // Add click outside listener when dropdown is opened
        document.addEventListener('click', this.closeOnClickOutside);
        // Set aria attributes for accessibility
        this.button.setAttribute('aria-expanded', 'true');
      } else {
        // Remove click outside listener when dropdown is closed
        document.removeEventListener('click', this.closeOnClickOutside);
        this.button.setAttribute('aria-expanded', 'false');
        
        // Remove upward class when closing
        this.dropdown.classList.remove('standard-dropdown--upward');
      }
    }
    
    positionDropdownList() {
      // Get the position and dimensions
      const buttonRect = this.button.getBoundingClientRect();
      const listHeight = this.list.offsetHeight || 250; // Use default height if list not visible yet
      
      // Check if there's enough space below
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const shouldOpenUpward = spaceBelow < listHeight && buttonRect.top > listHeight;
      
      if (shouldOpenUpward) {
        this.dropdown.classList.add('standard-dropdown--upward');
      } else {
        this.dropdown.classList.remove('standard-dropdown--upward');
      }
    }
    
    closeOnClickOutside(event) {
      if (!this.dropdown.contains(event.target)) {
        this.dropdown.classList.remove('standard-dropdown--open');
        document.removeEventListener('click', this.closeOnClickOutside);
        this.button.setAttribute('aria-expanded', 'false');
      }
    }
    
    selectItem(item, closeDropdown = true) {
      // Remove selected class from all items
      this.items.forEach(i => i.classList.remove('standard-dropdown__item--selected'));
      
      // Add selected class to the clicked item
      item.classList.add('standard-dropdown__item--selected');
      
      // Update the button text
      this.selectedText.textContent = item.textContent.trim();
      
      // Remove placeholder class if it exists
      this.selectedText.classList.remove('standard-dropdown__selected--placeholder');
      
      // Update hidden input value if it exists
      if (this.hiddenInput) {
        this.hiddenInput.value = item.dataset.value || item.textContent.trim();
      }
      
      // Close the dropdown
      if (closeDropdown) {
        this.dropdown.classList.remove('standard-dropdown--open');
        document.removeEventListener('click', this.closeOnClickOutside);
        this.button.setAttribute('aria-expanded', 'false');
        
        // Trigger change event
        const event = new CustomEvent('dropdown-change', {
          detail: {
            value: item.dataset.value || item.textContent.trim()
          }
        });
        this.dropdown.dispatchEvent(event);
      }
    }
    
    handleKeyboardNavigation(event) {
      const isOpen = this.dropdown.classList.contains('standard-dropdown--open');
      const allItems = Array.from(this.list.children);
      const selectableItems = allItems.filter(item => 
        !item.classList.contains('standard-dropdown__group-header')
      );
      
      switch (event.key) {
        case 'Enter':
        case ' ':
          if (!isOpen) {
            this.toggleDropdown();
          } else {
            const focused = document.activeElement;
            if (focused && focused.classList.contains('standard-dropdown__item')) {
              this.selectItem(focused);
            }
          }
          event.preventDefault();
          break;
          
        case 'Escape':
          if (isOpen) {
            this.dropdown.classList.remove('standard-dropdown--open');
            document.removeEventListener('click', this.closeOnClickOutside);
            this.button.setAttribute('aria-expanded', 'false');
            this.button.focus();
          }
          break;
          
        case 'ArrowDown':
          if (!isOpen) {
            this.toggleDropdown();
          } else {
            const focused = document.activeElement;
            if (focused === this.button) {
              selectableItems[0]?.focus();
            } else {
              const currentIndex = selectableItems.indexOf(focused);
              if (currentIndex >= 0 && currentIndex < selectableItems.length - 1) {
                selectableItems[currentIndex + 1].focus();
              }
            }
          }
          event.preventDefault();
          break;
          
        case 'ArrowUp':
          if (isOpen) {
            const focused = document.activeElement;
            const currentIndex = selectableItems.indexOf(focused);
            if (currentIndex > 0) {
              selectableItems[currentIndex - 1].focus();
            } else {
              this.button.focus();
            }
            event.preventDefault();
          }
          break;
      }
    }
  }

/**
 * Helper to convert a standard select with optgroups into our custom dropdown
 * @param {HTMLElement} selectElement - The original select element to convert
 */
export function convertSelectToDropdown(selectElement) {
  // Create the custom dropdown container
  const dropdown = document.createElement('div');
  dropdown.className = 'standard-dropdown';
  
  // Check if it should be a grouped dropdown
  const hasOptgroups = selectElement.querySelectorAll('optgroup').length > 0;
  
  if (selectElement.id) {
    dropdown.id = `${selectElement.id}-custom`;
  }
  
  // Set placeholder from first option if it has no value
  const firstOption = selectElement.querySelector('option');
  const placeholder = firstOption && !firstOption.value ? firstOption.textContent : 'Select an option';
  dropdown.dataset.placeholder = placeholder;
  
  // Create the button
  const button = document.createElement('button');
  button.className = 'standard-dropdown__button';
  button.setAttribute('type', 'button');
  button.setAttribute('aria-haspopup', 'listbox');
  button.setAttribute('aria-expanded', 'false');
  
  const selectedText = document.createElement('span');
  selectedText.className = 'standard-dropdown__selected';
  selectedText.textContent = placeholder;
  
  const arrow = document.createElement('span');
  arrow.className = 'standard-dropdown__arrow';
  arrow.innerHTML = `<svg viewBox="0 0 53 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#231f20" d="M26.8,41.9c-1.5,0-2.9-.7-3.9-1.8L2,13.8c-.8-1-.6-2.4.4-3.2,1-.8,2.4-.6,3.2.4l20.8,26.3c.1.1.3,0,.5.2.1,0,.3,0,.5-.2l20.1-26.1c.8-1,2.2-1.2,3.2-.4s1.2,2.2.4,3.2l-20.2,26.2c-1,1.2-2.5,1.9-4,1.9h0,0Z"></path>
  </svg>`;
  
  button.appendChild(selectedText);
  button.appendChild(arrow);
  dropdown.appendChild(button);
  
  // Create the dropdown list
  const list = document.createElement('ul');
  list.className = 'standard-dropdown__list';
  list.setAttribute('role', 'listbox');
  
  // Process all options and optgroups
  Array.from(selectElement.children).forEach(child => {
    if (child.tagName.toLowerCase() === 'optgroup') {
      // Create group header
      const groupHeader = document.createElement('li');
      groupHeader.className = 'standard-dropdown__group-header';
      groupHeader.textContent = child.label;
      list.appendChild(groupHeader);
      
      // Process options in the group
      Array.from(child.children).forEach(option => {
        if (option.tagName.toLowerCase() === 'option' && (firstOption !== option || option.value)) {
          const item = createDropdownItem(option.value, option.textContent);
          item.classList.add('standard-dropdown__group-item');
          list.appendChild(item);
        }
      });
    } else if (child.tagName.toLowerCase() === 'option' && (firstOption !== child || child.value)) {
      // Create regular option (if it's not the placeholder)
      const item = createDropdownItem(child.value, child.textContent);
      list.appendChild(item);
    }
  });
  
  dropdown.appendChild(list);
  
  // Create hidden input
  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', selectElement.name);
  if (selectElement.value) {
    hiddenInput.value = selectElement.value;
  }
  dropdown.appendChild(hiddenInput);
  
  // Replace the select with the custom dropdown
  selectElement.parentNode.replaceChild(dropdown, selectElement);
  
  // Initialize the custom dropdown
  return new StandardDropdown(dropdown);
}
  
// Initialize all dropdowns when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, initializing dropdowns');
  const dropdowns = document.querySelectorAll('.standard-dropdown');
  console.log('Found', dropdowns.length, 'dropdowns');
  
  // Make sure the dropdown initialization happens
  dropdowns.forEach(dropdown => {
    try {
      new StandardDropdown(dropdown);
      console.log('Dropdown initialized successfully');
    } catch (error) {
      console.error('Error initializing dropdown:', error);
    }
  });

  // When initializing existing dropdown items
  const items = document.querySelectorAll('.standard-dropdown__item');
  items.forEach(item => {
    if (!item.querySelector('.mark-cricle')) {
      const markCircle = document.createElement('span');
      markCircle.className = 'mark-cricle';
      markCircle.setAttribute('aria-hidden', 'true');
      item.insertBefore(markCircle, item.firstChild);
    }
  });
  
  // Convert select elements to custom dropdowns
  const selectsToConvert = document.querySelectorAll('select[data-convert-to-dropdown]');
  selectsToConvert.forEach(select => {
    try {
      convertSelectToDropdown(select);
      console.log('Select converted to dropdown successfully');
    } catch (error) {
      console.error('Error converting select to dropdown:', error);
    }
  });
});

// Add a fallback initialization for cases where DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => {
    const dropdowns = document.querySelectorAll('.standard-dropdown');
    dropdowns.forEach(dropdown => new StandardDropdown(dropdown));
  }, 1);
}

// When creating or initializing dropdown items
export function createDropdownItem(value, text) {
  const item = document.createElement('li');
  item.className = 'standard-dropdown__item';
  item.setAttribute('role', 'option');
  item.setAttribute('tabindex', '0');
  item.setAttribute('data-value', value);
  
  // Add mark-cricle span
  const markCircle = document.createElement('span');
  markCircle.className = 'mark-cricle';
  markCircle.setAttribute('aria-hidden', 'true');
  item.appendChild(markCircle);
  
  // Add the text
  item.appendChild(document.createTextNode(text));
  
  return item;
}