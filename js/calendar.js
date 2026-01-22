(function() {
  const CalendarApp = (function() {
    let currentDate = new Date();
    let currentView = 'month';
    let events = [];

    const calendarView = document.getElementById('calendar_view');
    const dateRange = document.getElementById('date_range');
    const viewBtns = document.querySelectorAll('.view_btn');
    const prevBtn = document.getElementById('prev_btn');
    const nextBtn = document.getElementById('next_btn');
    const todayBtn = document.getElementById('today_btn');
    const dialogOverlay = document.getElementById('dialog_overlay');
    const dialogTitle = document.getElementById('dialog_title');
    const dialogBody = document.getElementById('dialog_body');
    const dialogClose = document.getElementById('dialog_close');

    const formatDate = (date, format) => {
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
      const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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

    const updateUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      params.set('range_type', currentView);
      params.set('date', formatDate(currentDate, 'yyyy-MM-dd'));
      window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    };

    const handleEventClick = (event) => {
      if (event.full_url) {
        window.location.href = event.full_url;
      }
    };

    const renderMonthView = () => {
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const startDay = firstDayOfMonth.getDay();
      const totalDays = lastDayOfMonth.getDate();

      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date();

      let html = `<div class="month_view">`;
      
      html += `<div class="month_header">`;
      weekdays.forEach(day => {
        html += `<div class="month_header_cell">${day}</div>`;
      });
      html += `</div>`;

      html += `<div class="month_body">`;

      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      for (let i = startDay - 1; i >= 0; i--) {
        const day = prevMonth.getDate() - i;
        const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);
        const dayEvents = getEventsForDay(date);
        html += `<div class="month_cell other_month" data-date="${formatDate(date, 'yyyy-MM-dd')}">`;
        html += `<div class="month_day_number">${String(day).padStart(2, '0')}</div>`;
        dayEvents.slice(0, 2).forEach(event => {
          html += `<div class="month_event" data-event-id="${event.id}">${event.title}</div>`;
        });
        if (dayEvents.length > 2) {
          html += `<div class="more_events">+${dayEvents.length - 2} more</div>`;
        }
        html += `</div>`;
      }

      for (let day = 1; day <= totalDays; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const isToday = isSameDay(date, today);
        const dayEvents = getEventsForDay(date);
        
        html += `<div class="month_cell${isToday ? ' today' : ''}" data-date="${formatDate(date, 'yyyy-MM-dd')}">`;
        html += `<div class="month_day_number">${String(day).padStart(2, '0')}</div>`;
        dayEvents.slice(0, 2).forEach(event => {
          html += `<div class="month_event" data-event-id="${event.id}">${event.title}</div>`;
        });
        if (dayEvents.length > 2) {
          html += `<div class="more_events">+${dayEvents.length - 2} more</div>`;
        }
        html += `</div>`;
      }

      const filledCells = startDay + totalDays;
      const totalCells = Math.ceil(filledCells / 7) * 7;
      const remainingCells = totalCells - filledCells;
      
      for (let day = 1; day <= remainingCells; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
        const dayEvents = getEventsForDay(date);
        html += `<div class="month_cell other_month" data-date="${formatDate(date, 'yyyy-MM-dd')}">`;
        html += `<div class="month_day_number">${String(day).padStart(2, '0')}</div>`;
        dayEvents.slice(0, 2).forEach(event => {
          html += `<div class="month_event" data-event-id="${event.id}">${event.title}</div>`;
        });
        if (dayEvents.length > 2) {
          html += `<div class="more_events">+${dayEvents.length - 2} more</div>`;
        }
        html += `</div>`;
      }

      html += `</div></div>`;
      calendarView.innerHTML = html;

      document.querySelectorAll('.month_event').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const eventId = parseInt(el.dataset.eventId);
          const event = events.find(ev => ev.id === eventId);
          if (event) handleEventClick(event);
        });
      });
    };

    const renderWeekView = () => {
      const weekStart = startOfWeek(currentDate);
      const today = new Date();

      let html = `<div class="week_view">`;

      html += `<div class="week_header"><div class="week_day_headers">`;
      for (let i = 0; i < 7; i++) {
        const day = addDays(weekStart, i);
        const isToday = isSameDay(day, today);
        html += `<div class="week_day_header">`;
        html += `<div class="week_day_name">${formatDate(day, 'EEE')}</div>`;
        html += `<div class="week_day_number${isToday ? ' today' : ''}">${formatDate(day, 'd')}</div>`;
        html += `</div>`;
      }
      html += `</div></div>`;

      html += `<div class="week_body">`;

      html += `<div class="time_column">`;
      html += `<div class="time_slot empty_slot"></div>`;
      for (let i = 1; i < 24; i++) {
        const hour = i % 12 || 12;
        const ampm = i < 12 ? 'AM' : 'PM';
        html += `<div class="time_slot"><span class="time_label">${hour} ${ampm}</span></div>`;
      }
      html += `<div class="time_slot"><span class="time_label">12 AM</span></div>`;
      html += `<div class="time_slot extra_row"></div>`;
      html += `</div>`;

      html += `<div class="week_event_grid">`;
      for (let i = 0; i < 7; i++) {
        const day = addDays(weekStart, i);
        const dayEvents = getEventsForDay(day);

        html += `<div class="week_day_column">`;
        
        for (let h = 0; h <= 25; h++) {
          html += `<div class="hour_line" style="top: ${h * 35}px"></div>`;
        }

        dayEvents.forEach(event => {
          const startHour = event.start.getHours() + event.start.getMinutes() / 60;
          html += `<div class="week_event" style="top: ${startHour * 35}px" data-event-id="${event.id}">`;
          html += `<div class="week_event_title">${event.title}</div>`;
          html += `</div>`;
        });

        html += `</div>`;
      }
      html += `</div>`;

      html += `</div></div>`;
      calendarView.innerHTML = html;

      document.querySelectorAll('.week_event').forEach(el => {
        el.addEventListener('click', () => {
          const eventId = parseInt(el.dataset.eventId);
          const event = events.find(ev => ev.id === eventId);
          if (event) handleEventClick(event);
        });
      });
    };

    const renderDayView = () => {
      const today = new Date();
      const isToday = isSameDay(currentDate, today);
      const dayEvents = getEventsForDay(currentDate);

      let html = `<div class="day_view">`;

      html += `<div class="day_header_wrapper">`;
      html += `<div class="day_day_headers">`;
      html += `<div class="day_day_header">`;
      html += `<div class="day_day_name">${formatDate(currentDate, 'EEE')}</div>`;
      html += `<div class="day_day_number${isToday ? ' today' : ''}">${formatDate(currentDate, 'd')}</div>`;
      html += `</div>`;
      html += `</div></div>`;

      html += `<div class="day_body">`;

      html += `<div class="time_column">`;
      html += `<div class="time_slot empty_slot"></div>`;
      for (let i = 1; i < 24; i++) {
        const hour = i % 12 || 12;
        const ampm = i < 12 ? 'AM' : 'PM';
        html += `<div class="time_slot"><span class="time_label">${hour} ${ampm}</span></div>`;
      }
      html += `<div class="time_slot"><span class="time_label">12 AM</span></div>`;
      html += `<div class="time_slot extra_row"></div>`;
      html += `</div>`;

      html += `<div class="day_event_grid">`;
      html += `<div class="day_column">`;
      
      for (let h = 0; h <= 25; h++) {
        html += `<div class="hour_line" style="top: ${h * 35}px"></div>`;
      }

      dayEvents.forEach(event => {
        const startHour = event.start.getHours() + event.start.getMinutes() / 60;
        html += `<div class="day_event" style="top: ${startHour * 35}px" data-event-id="${event.id}">`;
        html += `<div class="day_event_title">${event.title}</div>`;
        html += `</div>`;
      });

      html += `</div></div>`;

      html += `</div></div>`;
      calendarView.innerHTML = html;

      document.querySelectorAll('.day_event').forEach(el => {
        el.addEventListener('click', () => {
          const eventId = parseInt(el.dataset.eventId);
          const event = events.find(ev => ev.id === eventId);
          if (event) handleEventClick(event);
        });
      });
    };

    const renderYearView = () => {
      const year = currentDate.getFullYear();
      const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];

      let html = `<div class="year_view"><div class="year_grid">`;

      for (let month = 0; month < 12; month++) {
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0);
        const startWeekday = monthStart.getDay();

        html += `<div class="year_month_grid">`;
        html += `<h3 class="year_month_title">${months[month]} ${year}</h3>`;
        
        html += `<div class="weekday_headers">`;
        weekdays.forEach(day => {
          html += `<div class="weekday_header">${day}</div>`;
        });
        html += `</div>`;

        html += `<div class="year_days_grid">`;
        
        for (let i = 0; i < startWeekday; i++) {
          html += `<div class="year_day_cell empty_cell"></div>`;
        }

        for (let day = 1; day <= monthEnd.getDate(); day++) {
          const date = new Date(year, month, day);
          const dayEvents = getEventsForDay(date);
          const hasEvents = dayEvents.length > 0;
          
          html += `<div class="year_day_cell${hasEvents ? ' has_events' : ''}" 
                        data-date="${formatDate(date, 'yyyy-MM-dd')}"
                        data-has-events="${hasEvents}">`;
          html += `${day}`;
          if (hasEvents) {
            html += `<span class="event_indicator">•</span>`;
          }
          html += `</div>`;
        }

        html += `</div></div>`;
      }

      html += `</div></div>`;
      calendarView.innerHTML = html;

      document.querySelectorAll('.year_day_cell.has_events').forEach(el => {
        el.addEventListener('click', () => {
          const dateStr = el.dataset.date;
          const date = new Date(dateStr + 'T00:00:00');
          const dayEvents = getEventsForDay(date);
          showDialog(date, dayEvents);
        });
      });
    };

    const showDialog = (date, dayEvents) => {
      dialogTitle.textContent = formatDate(date, 'MMMM d, yyyy');
      
      let html = '<ul class="event_list">';
      dayEvents.forEach(event => {
        html += `<li data-event-id="${event.id}">${event.title}</li>`;
      });
      html += '</ul>';
      
      dialogBody.innerHTML = html;
      dialogOverlay.style.display = 'block';

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

    const changeView = (view) => {
      currentView = view;
      viewBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
      });
      render();
      updateUrlParams();
    };

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

    const initFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('range_type');
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

    const parseDateStr = (dateStr) => {
      try {
        let cleanStr = dateStr.replace(',', '').replace(/([ap]m)$/i, ' $1');
        let date = new Date(cleanStr);
        if (!isNaN(date.getTime())) return date;
        return new Date(dateStr); 
      } catch (e) {
        console.error('Error parsing date:', dateStr, e);
        return new Date();
      }
    };

    const fetchEvents = async () => {
      const apiUrl = calendarView.getAttribute('data-events');
      
      if (!apiUrl) {
        console.warn('Calendar: No data-events attribute provided. Events will not be loaded.');
        return;
      }

      calendarView.innerHTML = '<div class="loading_state">Loading events...</div>';
      
      try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        const eventData = Array.isArray(responseData) ? responseData : (responseData.data || []);
        
        if (!Array.isArray(eventData)) {
          throw new Error('Invalid data format: Expected an array of events.');
        }

        events = eventData.map(item => {
          const props = item.attributes || item;
          const id = item.id || props.id;
          
          return {
            id: id,
            title: props.title,
            start: parseDateStr(props.start),
            end: parseDateStr(props.end),
            full_url: props.full_url,
            is_published: props.is_published
          };
        });

        render();
      } catch (error) {
        console.error('Calendar: Error fetching events:', error);
        calendarView.innerHTML = `<div class="error_state">
          <p>Unable to load events.</p>
          <p class="error_details">${error.message}</p>
        </div>`;
      }
    };

    const init = () => {
      viewBtns.forEach(btn => {
        btn.addEventListener('click', () => changeView(btn.dataset.view));
      });

      prevBtn.addEventListener('click', () => navigate('PREV'));
      nextBtn.addEventListener('click', () => navigate('NEXT'));
      todayBtn.addEventListener('click', () => navigate('TODAY'));

      dialogClose.addEventListener('click', closeDialog);
      dialogOverlay.addEventListener('click', (e) => {
        if (e.target.classList.contains('dialog_overlay') || e.target.classList.contains('dialog_wrapper')) {
          closeDialog();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDialog();
      });

      initFromUrl();

      if (!window.location.search.includes('range_type') || !window.location.search.includes('date')) {
        updateUrlParams();
      }

      fetchEvents();
    };

    return { init };
  })();

  document.addEventListener('DOMContentLoaded', CalendarApp.init);
})();