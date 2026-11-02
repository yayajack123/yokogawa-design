(() => {
  const calendarElement = document.getElementById('schedule-calendar');
  const status = document.getElementById('schedule-status');
  const available = document.getElementById('schedule-available');
  const title = document.getElementById('schedule-month');
  const dates = ['2025-01-03', '2025-01-11', '2025-01-12', '2025-01-13', '2025-01-14'];
  if (!calendarElement || !window.FullCalendar) return;

  try {
    const calendar = new FullCalendar.Calendar(calendarElement, {
      initialView: 'dayGridMonth',
      initialDate: '2025-01-01',
      headerToolbar: false,
      fixedWeekCount: true,
      showNonCurrentDates: true,
      height: 'auto',
      dayHeaderFormat: { weekday: 'short' },
      events: dates.map(date => ({ start: date, display: 'background', classNames: ['schedule-example-day'] })),
      datesSet(info) {
        title.textContent = info.view.title;
        const month = info.view.currentStart;
        const matching = dates.filter(date => date.slice(0, 7) === `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`);
        available.textContent = matching.length ? `Example available dates: ${matching.map(date => Number(date.slice(-2))).join(', ')} ${new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(month)}.` : 'No example availability for this month.';
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
