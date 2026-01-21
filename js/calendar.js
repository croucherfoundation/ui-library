(function() {
    // ========== Calendar Application ==========
    const CalendarApp = (function() {
      // State
      let currentDate = new Date();
      let currentView = 'month';
      let events = [];

      // DOM Elements
      const calendarView = document.getElementById('calendar-view');
      const dateRange = document.getElementById('date-range');
      const viewBtns = document.querySelectorAll('.view-btn');
      const prevBtn = document.getElementById('prev-btn');
      const nextBtn = document.getElementById('next-btn');
      const todayBtn = document.getElementById('today-btn');
      const dialogOverlay = document.getElementById('dialog-overlay');
      const dialogTitle = document.getElementById('dialog-title');
      const dialogBody = document.getElementById('dialog-body');
      const dialogClose = document.getElementById('dialog-close');

      // Sample events data (replace with API call)
      const sampleEvents = [
        {
          id: 1,
          title: 'Team Meeting',
          start: new Date(new Date().setHours(9, 0, 0, 0)),
          end: new Date(new Date().setHours(10, 0, 0, 0)),
          slug: 'team-meeting',
          isPublished: true
        },
        {
          id: 2,
          title: 'Project Review',
          start: new Date(new Date().setHours(14, 0, 0, 0)),
          end: new Date(new Date().setHours(15, 0, 0, 0)),
          slug: 'project-review',
          isPublished: true
        },
        {
          id: 3,
          title: 'Workshop',
          start: new Date(new Date().getTime() + 86400000 * 2), // 2 days from now
          end: new Date(new Date().getTime() + 86400000 * 2 + 3600000),
          slug: 'workshop',
          isPublished: true
        },
        {
          id: 4,
          title: 'Conference Call',
          start: new Date(new Date().getTime() + 86400000 * 5), // 5 days from now
          end: new Date(new Date().getTime() + 86400000 * 5 + 3600000),
          slug: 'conference-call',
          isPublished: false
        }
      ];

      // Utility Functions
      const formatDate = (date, format) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
        const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const d = date.getDate();
        const m = date.getMonth();
        const y = date.getFullYear();
        const day = date.getDay();

        switch(format) {
          case 'd MMMM yyyy':
            return `${d} ${months[m]} ${y}`;
          case 'MMMM yyyy':
            return `${months[m]} ${y}`;
          case 'yyyy':
            return `${y}`;
          case 'EEE':
            return daysShort[day];
          case 'd':
            return `${d}`;
          case 'MMM d':
            return `${monthsShort[m]} ${d}`;
          case 'MMM d, yyyy':
            return `${monthsShort[m]} ${d}, ${y}`;
          case 'MMMM d, yyyy':
            return `${months[m]} ${d}, ${y}`;
          case 'yyyy-MM-dd':
            return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          default:
            return date.toDateString();
        }
      };

      const isSameDay = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
      };

      const startOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        d.setDate(d.getDate() - day);
        d.setHours(0, 0, 0, 0);
        return d;
      };

      const endOfWeek = (date) => {
        const d = startOfWeek(date);
        d.setDate(d.getDate() + 6);
        return d;
      };

      const addDays = (date, days) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
      };

      const addMonths = (date, months) => {
        const d = new Date(date);
        d.setMonth(d.getMonth() + months);
        return d;
      };

      const addYears = (date, years) => {
        const d = new Date(date);
        d.setFullYear(d.getFullYear() + years);
        return d;
      };

      const getEventsForDay = (date) => {
        return events.filter(event => isSameDay(event.start, date));
      };

      // Update Date Range Label
      const updateDateRangeLabel = () => {
        let label = '';
        switch(currentView) {
          case 'day':
            label = formatDate(currentDate, 'd MMMM yyyy');
            break;
          case 'week':
          case 'month':
            label = formatDate(currentDate, 'MMMM yyyy');
            break;
          case 'year':
            label = formatDate(currentDate, 'yyyy');
            break;
        }
        dateRange.textContent = label;
      };

      // Update URL Parameters
      const updateUrlParams = () => {
        const params = new URLSearchParams(window.location.search);
        params.set('view', currentView);
        params.set('date', formatDate(currentDate, 'yyyy-MM-dd'));
        window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
      };

      // Handle Event Click
      const handleEventClick = (event) => {
        if (event.slug) {
          const route = event.isPublished 
            ? `/en/news/${event.slug}` 
            : `/en/page-templates/news/${event.id}`;
          // For demo purposes, alert the route
          alert(`Navigating to: ${route}`);
          // In production: window.location.href = route;
        }
      };

      // ========== Month View ==========
      const renderMonthView = () => {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDay = firstDayOfMonth.getDay();
        const totalDays = lastDayOfMonth.getDate();

        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();

        let html = `<div class="month-view">`;
        
        // Header
        html += `<div class="month-header">`;
        weekdays.forEach(day => {
          html += `<div class="month-header-cell">${day}</div>`;
        });
        html += `</div>`;

        // Body
        html += `<div class="month-body">`;

        // Previous month days
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        for (let i = startDay - 1; i >= 0; i--) {
          const day = prevMonth.getDate() - i;
          const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);
          const dayEvents = getEventsForDay(date);
          html += `<div class="month-cell other-month" data-date="${formatDate(date, 'yyyy-MM-dd')}">`;
          html += `<div class="month-day-number">${String(day).padStart(2, '0')}</div>`;
          dayEvents.slice(0, 2).forEach(event => {
            html += `<div class="month-event" data-event-id="${event.id}">${event.title}</div>`;
          });
          if (dayEvents.length > 2) {
            html += `<div class="more-events">+${dayEvents.length - 2} more</div>`;
          }
          html += `</div>`;
        }

        // Current month days
        for (let day = 1; day <= totalDays; day++) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const isToday = isSameDay(date, today);
          const dayEvents = getEventsForDay(date);
          
          html += `<div class="month-cell${isToday ? ' today' : ''}" data-date="${formatDate(date, 'yyyy-MM-dd')}">`;
          html += `<div class="month-day-number">${String(day).padStart(2, '0')}</div>`;
          dayEvents.slice(0, 2).forEach(event => {
            html += `<div class="month-event" data-event-id="${event.id}">${event.title}</div>`;
          });
          if (dayEvents.length > 2) {
            html += `<div class="more-events">+${dayEvents.length - 2} more</div>`;
          }
          html += `</div>`;
        }

        // Next month days
        const filledCells = startDay + totalDays;
        const totalCells = Math.ceil(filledCells / 7) * 7;
        const remainingCells = totalCells - filledCells;
        
        for (let day = 1; day <= remainingCells; day++) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
          const dayEvents = getEventsForDay(date);
          html += `<div class="month-cell other-month" data-date="${formatDate(date, 'yyyy-MM-dd')}">`;
          html += `<div class="month-day-number">${String(day).padStart(2, '0')}</div>`;
          dayEvents.slice(0, 2).forEach(event => {
            html += `<div class="month-event" data-event-id="${event.id}">${event.title}</div>`;
          });
          if (dayEvents.length > 2) {
            html += `<div class="more-events">+${dayEvents.length - 2} more</div>`;
          }
          html += `</div>`;
        }

        html += `</div></div>`;
        calendarView.innerHTML = html;

        // Add event listeners
        document.querySelectorAll('.month-event').forEach(el => {
          el.addEventListener('click', (e) => {
            e.stopPropagation();
            const eventId = parseInt(el.dataset.eventId);
            const event = events.find(ev => ev.id === eventId);
            if (event) handleEventClick(event);
          });
        });
      };

      // ========== Week View ==========
      const renderWeekView = () => {
        const weekStart = startOfWeek(currentDate);
        const today = new Date();

        let html = `<div class="week-view">`;

        // Header
        html += `<div class="week-header"><div class="week-day-headers">`;
        for (let i = 0; i < 7; i++) {
          const day = addDays(weekStart, i);
          const isToday = isSameDay(day, today);
          html += `<div class="week-day-header">`;
          html += `<div class="week-day-name">${formatDate(day, 'EEE')}</div>`;
          html += `<div class="week-day-number${isToday ? ' today' : ''}">${formatDate(day, 'd')}</div>`;
          html += `</div>`;
        }
        html += `</div></div>`;

        // Body
        html += `<div class="week-body">`;

        // Time column
        html += `<div class="time-column">`;
        html += `<div class="time-slot empty-slot"></div>`;
        for (let i = 1; i < 24; i++) {
          const hour = i % 12 || 12;
          const ampm = i < 12 ? 'AM' : 'PM';
          html += `<div class="time-slot"><span class="time-label">${hour} ${ampm}</span></div>`;
        }
        html += `<div class="time-slot"><span class="time-label">12 AM</span></div>`;
        html += `<div class="time-slot extra-row"></div>`;
        html += `</div>`;

        // Event grid
        html += `<div class="week-event-grid">`;
        for (let i = 0; i < 7; i++) {
          const day = addDays(weekStart, i);
          const dayEvents = getEventsForDay(day);

          html += `<div class="week-day-column">`;
          
          // Hour lines
          for (let h = 0; h <= 25; h++) {
            html += `<div class="hour-line" style="top: ${h * 35}px"></div>`;
          }

          // Events
          dayEvents.forEach(event => {
            const startHour = event.start.getHours() + event.start.getMinutes() / 60;
            html += `<div class="week-event" style="top: ${startHour * 35}px" data-event-id="${event.id}">`;
            html += `<div class="week-event-title">${event.title}</div>`;
            html += `</div>`;
          });

          html += `</div>`;
        }
        html += `</div>`;

        html += `</div></div>`;
        calendarView.innerHTML = html;

        // Add event listeners
        document.querySelectorAll('.week-event').forEach(el => {
          el.addEventListener('click', () => {
            const eventId = parseInt(el.dataset.eventId);
            const event = events.find(ev => ev.id === eventId);
            if (event) handleEventClick(event);
          });
        });
      };

      // ========== Day View ==========
      const renderDayView = () => {
        const today = new Date();
        const isToday = isSameDay(currentDate, today);
        const dayEvents = getEventsForDay(currentDate);

        let html = `<div class="day-view">`;

        // Header
        html += `<div class="day-header-wrapper">`;
        html += `<div class="day-day-headers">`;
        html += `<div class="day-day-header">`;
        html += `<div class="day-day-name">${formatDate(currentDate, 'EEE')}</div>`;
        html += `<div class="day-day-number${isToday ? ' today' : ''}">${formatDate(currentDate, 'd')}</div>`;
        html += `</div>`;
        html += `</div></div>`;

        // Body
        html += `<div class="day-body">`;

        // Time column
        html += `<div class="time-column">`;
        html += `<div class="time-slot empty-slot"></div>`;
        for (let i = 1; i < 24; i++) {
          const hour = i % 12 || 12;
          const ampm = i < 12 ? 'AM' : 'PM';
          html += `<div class="time-slot"><span class="time-label">${hour} ${ampm}</span></div>`;
        }
        html += `<div class="time-slot"><span class="time-label">12 AM</span></div>`;
        html += `<div class="time-slot extra-row"></div>`;
        html += `</div>`;

        // Event grid
        html += `<div class="day-event-grid">`;
        html += `<div class="day-column">`;
        
        // Hour lines
        for (let h = 0; h <= 25; h++) {
          html += `<div class="hour-line" style="top: ${h * 35}px"></div>`;
        }

        // Events
        dayEvents.forEach(event => {
          const startHour = event.start.getHours() + event.start.getMinutes() / 60;
          html += `<div class="day-event" style="top: ${startHour * 35}px" data-event-id="${event.id}">`;
          html += `<div class="day-event-title">${event.title}</div>`;
          html += `</div>`;
        });

        html += `</div></div>`;

        html += `</div></div>`;
        calendarView.innerHTML = html;

        // Add event listeners
        document.querySelectorAll('.day-event').forEach(el => {
          el.addEventListener('click', () => {
            const eventId = parseInt(el.dataset.eventId);
            const event = events.find(ev => ev.id === eventId);
            if (event) handleEventClick(event);
          });
        });
      };

      // ========== Year View ==========
      const renderYearView = () => {
        const year = currentDate.getFullYear();
        const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];

        let html = `<div class="year-view"><div class="year-grid">`;

        for (let month = 0; month < 12; month++) {
          const monthStart = new Date(year, month, 1);
          const monthEnd = new Date(year, month + 1, 0);
          const startWeekday = monthStart.getDay();

          html += `<div class="year-month-grid">`;
          html += `<h3 class="year-month-title">${months[month]} ${year}</h3>`;
          
          // Weekday headers
          html += `<div class="weekday-headers">`;
          weekdays.forEach(day => {
            html += `<div class="weekday-header">${day}</div>`;
          });
          html += `</div>`;

          // Days grid
          html += `<div class="year-days-grid">`;
          
          // Empty cells before first day
          for (let i = 0; i < startWeekday; i++) {
            html += `<div class="year-day-cell empty-cell"></div>`;
          }

          // Days
          for (let day = 1; day <= monthEnd.getDate(); day++) {
            const date = new Date(year, month, day);
            const dayEvents = getEventsForDay(date);
            const hasEvents = dayEvents.length > 0;
            
            html += `<div class="year-day-cell${hasEvents ? ' has-events' : ''}" 
                          data-date="${formatDate(date, 'yyyy-MM-dd')}"
                          data-has-events="${hasEvents}">`;
            html += `${day}`;
            if (hasEvents) {
              html += `<span class="event-indicator">•</span>`;
            }
            html += `</div>`;
          }

          html += `</div></div>`;
        }

        html += `</div></div>`;
        calendarView.innerHTML = html;

        // Add event listeners for days with events
        document.querySelectorAll('.year-day-cell.has-events').forEach(el => {
          el.addEventListener('click', () => {
            const dateStr = el.dataset.date;
            const date = new Date(dateStr + 'T00:00:00');
            const dayEvents = getEventsForDay(date);
            showDialog(date, dayEvents);
          });
        });
      };

      // Show Dialog for Year View
      const showDialog = (date, dayEvents) => {
        dialogTitle.textContent = formatDate(date, 'MMMM d, yyyy');
        
        let html = '<ul class="event-list">';
        dayEvents.forEach(event => {
          html += `<li data-event-id="${event.id}">${event.title}</li>`;
        });
        html += '</ul>';
        
        dialogBody.innerHTML = html;
        dialogOverlay.style.display = 'block';

        // Add click handlers for events
        dialogBody.querySelectorAll('li').forEach(el => {
          el.addEventListener('click', () => {
            const eventId = parseInt(el.dataset.eventId);
            const event = events.find(ev => ev.id === eventId);
            if (event) {
              closeDialog();
              handleEventClick(event);
            }
          });
        });
      };

      const closeDialog = () => {
        dialogOverlay.style.display = 'none';
      };

      // Navigation
      const navigate = (action) => {
        switch(action) {
          case 'PREV':
            switch(currentView) {
              case 'day':
                currentDate = addDays(currentDate, -1);
                break;
              case 'week':
                currentDate = addDays(currentDate, -7);
                break;
              case 'month':
                currentDate = addMonths(currentDate, -1);
                break;
              case 'year':
                currentDate = addYears(currentDate, -1);
                break;
            }
            break;
          case 'NEXT':
            switch(currentView) {
              case 'day':
                currentDate = addDays(currentDate, 1);
                break;
              case 'week':
                currentDate = addDays(currentDate, 7);
                break;
              case 'month':
                currentDate = addMonths(currentDate, 1);
                break;
              case 'year':
                currentDate = addYears(currentDate, 1);
                break;
            }
            break;
          case 'TODAY':
            currentDate = new Date();
            break;
        }
        render();
        updateUrlParams();
      };

      // Change View
      const changeView = (view) => {
        currentView = view;
        viewBtns.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.view === view);
        });
        render();
        updateUrlParams();
      };

      // Render
      const render = () => {
        updateDateRangeLabel();
        switch(currentView) {
          case 'day':
            renderDayView();
            break;
          case 'week':
            renderWeekView();
            break;
          case 'month':
            renderMonthView();
            break;
          case 'year':
            renderYearView();
            break;
        }
      };

      // Initialize from URL
      const initFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const viewParam = params.get('view');
        const dateParam = params.get('date');

        if (viewParam && ['day', 'week', 'month', 'year'].includes(viewParam)) {
          currentView = viewParam;
          viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewParam);
          });
        }

        if (dateParam) {
          const parsedDate = new Date(dateParam + 'T00:00:00');
          if (!isNaN(parsedDate.getTime())) {
            currentDate = parsedDate;
          }
        }
      };

      // Fetch Events (placeholder - replace with actual API call)
      const fetchEvents = async () => {
        // In production, fetch from API:
        // const response = await fetch(`/api/calendar?range_type=${currentView}&date=${formatDate(currentDate, 'yyyy-MM-dd')}`);
        // const data = await response.json();
        // events = data.map(event => ({ ... }));
        
        // For demo, use sample events
        events = sampleEvents;
        render();
      };

      // Initialize
      const init = () => {
        // Event listeners
        viewBtns.forEach(btn => {
          btn.addEventListener('click', () => changeView(btn.dataset.view));
        });

        prevBtn.addEventListener('click', () => navigate('PREV'));
        nextBtn.addEventListener('click', () => navigate('NEXT'));
        todayBtn.addEventListener('click', () => navigate('TODAY'));

        dialogClose.addEventListener('click', closeDialog);
        dialogOverlay.addEventListener('click', (e) => {
          if (e.target.classList.contains('dialog-overlay') || e.target.classList.contains('dialog-wrapper')) {
            closeDialog();
          }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') closeDialog();
        });

        // Initialize from URL
        initFromUrl();

        // Update URL if params are missing
        if (!window.location.search.includes('view') || !window.location.search.includes('date')) {
          updateUrlParams();
        }

        // Fetch events and render
        fetchEvents();
      };

      return { init };
    })();

    // Initialize the calendar
    document.addEventListener('DOMContentLoaded', CalendarApp.init);
})();
