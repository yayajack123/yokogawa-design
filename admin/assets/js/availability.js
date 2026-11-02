(() => {
  const store = window.YokogawaAvailability;
  const form = document.getElementById('availability-form');
  const start = document.getElementById('availability-start');
  const end = document.getElementById('availability-end');
  const month = document.getElementById('availability-month-filter');
  const list = document.getElementById('availability-list');
  const feedback = document.getElementById('availability-feedback');
  const today = new Date();
  month.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  let dates;
  try { dates = store.read(); } catch (_) {
    feedback.textContent = 'Unable to read saved availability. Check browser storage and reload.';
    form.querySelector('button').disabled = true;
    return;
  }
  const addButton = document.getElementById('availability-add');
  const editorError = document.getElementById('availability-editor-error');
  const calendarPanel = document.getElementById('calendar-panel');
  const viewTabs = [...document.querySelectorAll('#availability-tabs [role="tab"]')];
  new MutationObserver(() => {
    viewTabs.forEach(tab => {
      const active = document.getElementById(`${tab.dataset.stislaTabsValue}-panel`).dataset.state === 'active';
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    if (calendarPanel.dataset.state === 'active') calendar.updateSize();
  }).observe(calendarPanel, { attributes: true, attributeFilter: ['data-state'] });
  viewTabs.forEach((tab, index) => tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? viewTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + viewTabs.length) % viewTabs.length;
    viewTabs[next].focus(); viewTabs[next].click();
  }));
  let selectedDate;
  function prepareForm(date) {
    form.reset(); editorError.textContent = '';
    start.value = date || `${month.value}-01`; end.min = start.value;
  }
  function openDate(date) {
    if (dates.includes(date)) {
      selectedDate = date;
      document.getElementById('availability-detail-date').textContent = new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(new Date(`${date}T00:00:00`));
      document.getElementById('availability-detail-error').textContent = '';
      document.getElementById('availability-detail-trigger').click();
    } else { prepareForm(date); addButton.click(); }
  }
  addButton.addEventListener('click', () => { if (!start.value) prepareForm(); });
  document.getElementById('availability-delete').addEventListener('click', () => {
    if (persist(dates.filter(date => date !== selectedDate), 'Availability removed.')) document.getElementById('availability-detail-close').click();
    else document.getElementById('availability-detail-error').textContent = feedback.textContent;
  });
  const calendar = new FullCalendar.Calendar(document.getElementById('admin-availability-calendar'), {
    initialView: 'dayGridMonth', firstDay: 1, height: 'auto',
    headerToolbar: false,
    dateClick(info) { openDate(info.dateStr); },
    eventClick(info) { openDate(info.event.startStr); },
    datesSet(info) {
      const date = info.view.currentStart;
      month.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      document.getElementById('availability-calendar-title').textContent = info.view.title;
      render();
    }
  });
  function render() {
    list.replaceChildren();
    const matching = dates.filter(date => date.startsWith(month.value));
    const table = document.createElement('table');
    table.className = 'table table--hover table--align-middle';
    const head = document.createElement('thead');
    head.className = 'table__head--alt';
    const header = document.createElement('tr');
    ['Date', 'Day', 'Action'].forEach(text => {
      const cell = document.createElement('th');
      cell.scope = 'col'; cell.textContent = text;
      if (text === 'Action') cell.className = 'text-end';
      header.append(cell);
    });
    head.append(header);
    const body = document.createElement('tbody');
    if (!matching.length) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 3;
      cell.textContent = 'No available dates for this month. Choose Add availability to add dates.';
      row.append(cell); body.append(row);
    }
    matching.forEach(date => {
      const day = new Date(`${date}T00:00:00`);
      const row = document.createElement('tr');
      const dateCell = document.createElement('th');
      dateCell.scope = 'row';
      dateCell.className = 'font-medium';
      const label = document.createElement('time');
      label.dateTime = date;
      label.textContent = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric' }).format(day);
      dateCell.append(label);
      const weekday = document.createElement('td');
      weekday.textContent = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(day);
      const action = document.createElement('td');
      action.className = 'text-end';
      const actions = document.createElement('div');
      actions.className = 'flex justify-end gap-1';
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'button button--ghost button--danger button--icon-only button--sm';
      remove.innerHTML = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5m4-5v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      remove.title = 'Remove availability';
      remove.setAttribute('aria-label', `Remove availability for ${label.textContent}`);
      remove.addEventListener('click', () => persist(dates.filter(value => value !== date), 'Availability removed.'));
      actions.append(remove); action.append(actions); row.append(dateCell, weekday, action); body.append(row);
    });
    table.append(head, body); list.append(table);
  }

  function persist(next, message) {
    try { store.save(next); dates = store.read(); calendar.removeAllEvents(); calendar.addEventSource(dates.map(date => ({ start: date, title: 'Available', allDay: true }))); calendar.gotoDate(`${month.value}-01`); render(); feedback.textContent = message; return true; }
    catch (_) { feedback.textContent = 'Unable to save availability. Enable browser storage and try again.'; return false; }
  }
  start.addEventListener('change', () => { end.min = start.value; });
  month.addEventListener('change', () => { if (month.value) calendar.gotoDate(`${month.value}-01`); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const last = end.value || start.value;
    if (!store.valid(start.value) || !store.valid(last) || last < start.value) {
      editorError.textContent = 'Choose a valid end date on or after the start date.'; return;
    }
    const from = new Date(`${start.value}T00:00:00Z`);
    const until = new Date(`${last}T00:00:00Z`);
    if ((until - from) / 86400000 > 365) { editorError.textContent = 'Choose a range of up to 366 days.'; return; }
    const added = [];
    for (let day = from; day <= until; day.setUTCDate(day.getUTCDate() + 1)) added.push(day.toISOString().slice(0, 10));
    month.value = start.value.slice(0, 7);
    if (persist([...dates, ...added], 'Availability saved. Reload the public calendar to see your changes.')) { form.reset(); document.getElementById('availability-editor-close').click(); } else editorError.textContent = feedback.textContent;
  });
  document.getElementById('availability-prev').addEventListener('click', () => calendar.prev());
  document.getElementById('availability-next').addEventListener('click', () => calendar.next());
  document.getElementById('availability-today').addEventListener('click', () => calendar.today());
  calendar.addEventSource(dates.map(date => ({ start: date, title: 'Available', allDay: true })));
  calendar.render();
  render();
})();
