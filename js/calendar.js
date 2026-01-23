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

    const normalizeDate = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const isDateInRange = (date, startDate, endDate) => {
      const normalizedDate = normalizeDate(date).getTime();
      const normalizedStart = normalizeDate(startDate).getTime();
      const normalizedEnd = normalizeDate(endDate).getTime();
      return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
    };

    const getEventsForDay = (date) => {
      return events.filter(event => isDateInRange(date, event.start, event.end));
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

    // Helper to get all dates in calendar grid for a month
    const getCalendarGridDates = (year, month) => {
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      const startDay = firstDayOfMonth.getDay();
      const totalDays = lastDayOfMonth.getDate();
      
      const dates = [];
      
      // Previous month days
      const prevMonth = new Date(year, month, 0);
      for (let i = startDay - 1; i >= 0; i--) {
        const day = prevMonth.getDate() - i;
        dates.push(new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day));
      }
      
      // Current month days
      for (let day = 1; day <= totalDays; day++) {
        dates.push(new Date(year, month, day));
      }
      
      // Next month days
      const filledCells = startDay + totalDays;
      const totalCells = Math.ceil(filledCells / 7) * 7;
      const remainingCells = totalCells - filledCells;
      for (let day = 1; day <= remainingCells; day++) {
        dates.push(new Date(year, month + 1, day));
      }
      
      return dates;
    };

    // Calculate spanning events for a week row
    const getSpanningEventsForWeek = (weekDates, allEvents) => {
      const spanningEvents = [];
      const usedSlots = new Array(weekDates.length).fill(null).map(() => []);
      
      // Sort events by start date, then by duration (longer events first)
      const sortedEvents = [...allEvents].sort((a, b) => {
        const startDiff = normalizeDate(a.start).getTime() - normalizeDate(b.start).getTime();
        if (startDiff !== 0) return startDiff;
        // Longer events first
        const aDuration = normalizeDate(a.end).getTime() - normalizeDate(a.start).getTime();
        const bDuration = normalizeDate(b.end).getTime() - normalizeDate(b.start).getTime();
        return bDuration - aDuration;
      });
      
      sortedEvents.forEach(event => {
        const eventStart = normalizeDate(event.start);
        const eventEnd = normalizeDate(event.end);
        
        // Find which days of this week the event spans
        let startCol = -1;
        let endCol = -1;
        
        for (let i = 0; i < weekDates.length; i++) {
          const cellDate = normalizeDate(weekDates[i]);
          if (cellDate.getTime() >= eventStart.getTime() && cellDate.getTime() <= eventEnd.getTime()) {
            if (startCol === -1) startCol = i;
            endCol = i;
          }
        }
        
        if (startCol === -1) return; // Event not in this week
        
        // Find the first available slot row for this span
        let slotRow = 0;
        let foundSlot = false;
        while (!foundSlot) {
          foundSlot = true;
          for (let col = startCol; col <= endCol; col++) {
            if (usedSlots[col][slotRow]) {
              foundSlot = false;
              slotRow++;
              break;
            }
          }
        }
        
        // Mark slots as used
        for (let col = startCol; col <= endCol; col++) {
          usedSlots[col][slotRow] = event.id;
        }
        
        // Check if event starts before this week
        const startsBeforeWeek = eventStart.getTime() < normalizeDate(weekDates[0]).getTime();
        // Check if event continues after this week
        const continuesAfterWeek = eventEnd.getTime() > normalizeDate(weekDates[6]).getTime();
        
        spanningEvents.push({
          event,
          startCol,
          endCol,
          slotRow,
          span: endCol - startCol + 1,
          startsBeforeWeek,
          continuesAfterWeek
        });
      });
      
      return spanningEvents;
    };

    const renderMonthView = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date();
      
      const gridDates = getCalendarGridDates(year, month);
      const numWeeks = gridDates.length / 7;

      let html = `<div class="month_view">`;
      
      html += `<div class="month_header">`;
      weekdays.forEach(day => {
        html += `<div class="month_header_cell">${day}</div>`;
      });
      html += `</div>`;

      html += `<div class="month_body">`;

      // Render each week row
      for (let week = 0; week < numWeeks; week++) {
        const weekDates = gridDates.slice(week * 7, (week + 1) * 7);
        const spanningEvents = getSpanningEventsForWeek(weekDates, events);
        const maxSlots = Math.max(2, ...spanningEvents.map(e => e.slotRow + 1));
        
        html += `<div class="month_week_row">`;
        
        // Day cells (background)
        html += `<div class="month_week_cells">`;
        weekDates.forEach((date, dayIndex) => {
          const isCurrentMonth = date.getMonth() === month;
          const isToday = isSameDay(date, today);
          const dayNum = String(date.getDate()).padStart(2, '0');
          
          html += `<div class="month_cell${isToday ? ' today' : ''}${!isCurrentMonth ? ' other_month' : ''}" 
                        data-date="${formatDate(date, 'yyyy-MM-dd')}">`;
          html += `<div class="month_day_number">${dayNum}</div>`;
          html += `</div>`;
        });
        html += `</div>`;
        
        // Events layer (absolute positioned spanning events)
        html += `<div class="month_week_events">`;
        
        const visibleEvents = spanningEvents.filter(e => e.slotRow < 2);
        const hiddenEventsPerDay = new Array(7).fill(0);
        
        spanningEvents.forEach(e => {
          if (e.slotRow >= 2) {
            for (let col = e.startCol; col <= e.endCol; col++) {
              hiddenEventsPerDay[col]++;
            }
          }
        });
        
        visibleEvents.forEach(({ event, startCol, span, slotRow, startsBeforeWeek, continuesAfterWeek }) => {
          const leftPercent = (startCol / 7) * 100;
          const widthPercent = (span / 7) * 100;
          const topOffset = 28 + (slotRow * 26); // Day number height + slot offset
          
          let classes = 'month_event month_event_spanning';
          if (startsBeforeWeek) classes += ' continues_left';
          if (continuesAfterWeek) classes += ' continues_right';
          
          html += `<div class="${classes}" 
                        data-event-id="${event.id}"
                        style="left: ${leftPercent}%; width: ${widthPercent}%; top: ${topOffset}px;">`;
          html += `<span class="month_event_title">${event.title}</span>`;
          html += `</div>`;
        });
        
        // Show "+N more" indicators for each day with hidden events
        hiddenEventsPerDay.forEach((count, dayIndex) => {
          if (count > 0) {
            const leftPercent = (dayIndex / 7) * 100;
            const widthPercent = (1 / 7) * 100;
            const dateStr = formatDate(weekDates[dayIndex], 'yyyy-MM-dd');
            html += `<div class="more_events" 
                          data-date="${dateStr}"
                          style="left: ${leftPercent}%; width: ${widthPercent}%; top: ${28 + (2 * 26)}px;">
                      +${count} more
                    </div>`;
          }
        });
        
        html += `</div>`;
        html += `</div>`;
      }

      html += `</div></div>`;
      calendarView.innerHTML = html;

      document.querySelectorAll('.month_event').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const eventId = el.dataset.eventId;
          const event = events.find(ev => String(ev.id) === String(eventId));
          if (event) handleEventClick(event);
        });
      });

      // Add click handler for "+N more" elements
      document.querySelectorAll('.more_events').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const dateStr = el.dataset.date;
          const date = new Date(dateStr + 'T00:00:00');
          const dayEvents = getEventsForDay(date);
          showDialog(date, dayEvents);
        });
      });
    };

    const renderWeekView = () => {
      const weekStart = startOfWeek(currentDate);
      const today = new Date();
      
      // Get week dates array
      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        weekDates.push(addDays(weekStart, i));
      }
      
      // Helper to check if event is multi-day
      const isMultiDayEvent = (event) => {
        const startDay = normalizeDate(event.start).getTime();
        const endDay = normalizeDate(event.end).getTime();
        return endDay > startDay;
      };
      
      // Get only multi-day events for spanning
      const multiDayEvents = events.filter(isMultiDayEvent);
      const spanningEvents = getSpanningEventsForWeek(weekDates, multiDayEvents);

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
      html += `</div>`;

      html += `<div class="week_event_grid">`;
      
      // Render spanning multi-day events layer - position at their start time
      html += `<div class="week_spanning_events">`;
      spanningEvents.forEach(({ event, startCol, span, startsBeforeWeek, continuesAfterWeek }) => {
        const leftPercent = (startCol / 7) * 100;
        const widthPercent = (span / 7) * 100;
        // Position at the event's actual start time (same formula as day view)
        const startHour = event.start.getHours() + event.start.getMinutes() / 60;
        const topOffset = startHour * 35;
        
        let classes = 'week_event_spanning';
        if (startsBeforeWeek) classes += ' continues_left';
        if (continuesAfterWeek) classes += ' continues_right';
        
        html += `<div class="${classes}" 
                      data-event-id="${event.id}"
                      style="left: ${leftPercent}%; width: ${widthPercent}%; top: ${topOffset}px;">`;
        html += `<span class="week_event_title">${event.title}</span>`;
        html += `</div>`;
      });
      html += `</div>`;
      
      // Day columns with hour lines and single-day events
      for (let i = 0; i < 7; i++) {
        const day = weekDates[i];
        // Get only single-day events for this day
        const dayEvents = getEventsForDay(day).filter(event => !isMultiDayEvent(event));
        
        html += `<div class="week_day_column">`;
        // Hour lines (same as day view)
        for (let h = 0; h <= 24; h++) {
          html += `<div class="hour_line" style="top: ${h * 35}px"></div>`;
        }
        // Render single-day events at their time position (same formula as day view)
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

      // Event handlers for week view events
      document.querySelectorAll('.week_event_spanning, .week_event').forEach(el => {
        el.addEventListener('click', () => {
          const eventId = el.dataset.eventId;
          const event = events.find(ev => String(ev.id) === String(eventId));
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
      html += `</div>`;

      html += `<div class="day_event_grid">`;
      html += `<div class="day_column">`;
      
      for (let h = 0; h <= 24; h++) {
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
          const eventId = el.dataset.eventId;
          const event = events.find(ev => String(ev.id) === String(eventId));
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
          const eventId = el.dataset.eventId;
          const event = events.find(ev => String(ev.id) === String(eventId));
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

      // Keep existing view while loading - don't show loading state
      
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