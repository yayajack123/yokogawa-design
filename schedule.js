(() => {
  const calendarElement = document.getElementById('schedule-calendar');
  const status = document.getElementById('schedule-status');
  const available = document.getElementById('schedule-available');
  const title = document.getElementById('schedule-month');
  let dates;
  try { dates = window.YokogawaAvailability.read(); } catch (error) {
    status.textContent = 'Unable to load availability. Please contact us for available dates.';
    return;
  }
  if (!calendarElement || !window.FullCalendar) return;

  const nextDate = value => {
    const date = new Date(`${value}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toISOString().slice(0, 10);
  };
  const ranges = [];
  [...new Set(dates)].sort().forEach(date => {
    const previous = ranges[ranges.length - 1];
    if (previous && previous.end === date) {
      previous.end = nextDate(date);
    } else {
      // FullCalendar uses an exclusive end date for all-day ranges.
      ranges.push({ start: date, end: nextDate(date), title: 'Available', allDay: true,
        classNames: ['schedule-example-day'] });
    }
  });

  try {
    const calendar = new FullCalendar.Calendar(calendarElement, {
      initialView: 'dayGridMonth',
      headerToolbar: false,
      fixedWeekCount: true,
      showNonCurrentDates: true,
      firstDay: 1,
      height: 'auto',
      dayHeaderContent(info) {
        const full = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(info.date);
        const short = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(info.date);
        const label = document.createElement('span');
        label.setAttribute('aria-label', full);
        const desktop = document.createElement('span');
        desktop.className = 'schedule-weekday-full';
        desktop.textContent = short;
        const mobile = document.createElement('span');
        mobile.className = 'schedule-weekday-initial';
        mobile.setAttribute('aria-hidden', 'true');
        mobile.textContent = full[0];
        label.append(desktop, mobile);
        return { domNodes: [label] };
      },
      dayCellClassNames(info) {
        const localDate = `${info.date.getFullYear()}-${String(info.date.getMonth() + 1).padStart(2, '0')}-${String(info.date.getDate()).padStart(2, '0')}`;
        return dates.includes(localDate) ? ['schedule-day-available'] : [];
      },
      events: ranges,
      datesSet(info) {
        title.textContent = info.view.title;
        const month = info.view.currentStart;
        const matching = dates.filter(date => date.slice(0, 7) === `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`);
        document.getElementById('availability-month').textContent = info.view.title;
        available.replaceChildren();
        if (!matching.length) {
          const empty = document.createElement('p');
          empty.className = 'schedule-empty';
          empty.textContent = 'No available dates listed for this month.';
          available.append(empty);
          return;
        }
        const list = document.createElement('ul');
        matching.sort().forEach(date => {
          const day = new Date(`${date}T00:00:00`);
          const item = document.createElement('li');
          const number = document.createElement('time');
          number.dateTime = date;
          number.textContent = day.getDate();
          const description = document.createElement('div');
          const weekday = document.createElement('strong');
          weekday.textContent = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(day);
          const label = document.createElement('span');
          label.textContent = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(day);
          description.append(weekday, label);
          item.append(number, description);
          list.append(item);
        });
        available.append(list);
      }
    });
    calendar.render();
    document.getElementById('schedule-prev').addEventListener('click', () => calendar.prev());
    document.getElementById('schedule-next').addEventListener('click', () => calendar.next());
    status.hidden = true;
  } catch (error) {
    console.error('Unable to load the schedule calendar:', error);
  }
})();
