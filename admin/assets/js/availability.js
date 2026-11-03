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
  let visibleRange;
  const selectedDates = new Set();
  const bulkDialog = document.createElement('dialog');
  bulkDialog.setAttribute('aria-labelledby', 'availability-bulk-title');
  bulkDialog.setAttribute('aria-describedby', 'availability-bulk-description');
  bulkDialog.style.cssText = 'width: min(28rem, calc(100% - 2rem)); margin: auto; padding: 0; border: 0; border-radius: var(--radius); background: transparent;';
  bulkDialog.innerHTML = '<div class="card"><div class="card__body"><h2 class="dialog__title" id="availability-bulk-title">Remove selected dates?</h2><p class="text-sm text-muted-foreground" id="availability-bulk-description"></p><p class="text-sm text-danger" id="availability-bulk-error" role="alert"></p></div><div class="dialog__footer justify-center"><button type="button" class="button button--ghost button--neutral" data-bulk-cancel>Cancel</button><button type="button" class="button button--danger" data-bulk-confirm>Remove dates</button></div></div>';
  document.body.append(bulkDialog);
  bulkDialog.querySelector('[data-bulk-cancel]').addEventListener('click', () => bulkDialog.close());
  bulkDialog.querySelector('[data-bulk-confirm]').addEventListener('click', () => {
    const amount = selectedDates.size;
    if (!amount) { bulkDialog.close(); return; }
    if (persist(dates.filter(date => !selectedDates.has(date)), `${amount} ${amount === 1 ? 'date' : 'dates'} removed from availability.`)) {
      bulkDialog.close(); month.focus();
    } else bulkDialog.querySelector('#availability-bulk-error').textContent = feedback.textContent;
  });
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
      const nextRange = { start: info.startStr.slice(0, 10), end: info.endStr.slice(0, 10) };
      if (visibleRange && (visibleRange.start !== nextRange.start || visibleRange.end !== nextRange.end)) selectedDates.clear();
      visibleRange = nextRange;
      month.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      document.getElementById('availability-calendar-title').textContent = info.view.title;
      render();
    }
  });
  function render() {
    if (!visibleRange) return;
    list.replaceChildren();
    const rangeDescription = document.getElementById('availability-list-range');
    const summary = rangeDescription.parentElement;
    summary.classList.add('availability-list-summary');
    summary.querySelector('.availability-selection')?.remove();
    const matching = dates.filter(date => date >= visibleRange.start && date < visibleRange.end);
    for (const date of selectedDates) if (!matching.includes(date)) selectedDates.delete(date);
    const lastVisibleDay = new Date(`${visibleRange.end}T00:00:00`);
    lastVisibleDay.setDate(lastVisibleDay.getDate() - 1);
    const rangeLabel = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric' }).formatRange(new Date(`${visibleRange.start}T00:00:00`), lastVisibleDay);
    rangeDescription.textContent = `Matches Calendar view: ${rangeLabel}. Includes dates from adjacent months shown in the calendar.`;
    const table = document.createElement('table');
    table.className = 'table table--hover table--align-middle';
    const head = document.createElement('thead');
    head.className = 'table__head--alt';
    const header = document.createElement('tr');
    const selectCell = document.createElement('th');
    selectCell.scope = 'col';
    const selectAll = document.createElement('input');
    selectAll.type = 'checkbox'; selectAll.className = 'checkbox';
    selectAll.setAttribute('aria-label', 'Select all dates in this calendar view');
    selectAll.disabled = !matching.length;
    selectCell.append(selectAll); header.append(selectCell);
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
      cell.colSpan = 4;
      cell.textContent = 'No available dates in this calendar view. Choose Add availability to add dates.';
      row.append(cell); body.append(row);
    }
    matching.forEach(date => {
      const day = new Date(`${date}T00:00:00`);
      const row = document.createElement('tr');
      const checkboxCell = document.createElement('td');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox'; checkbox.className = 'checkbox'; checkbox.value = date;
      checkbox.checked = selectedDates.has(date);
      const dateCell = document.createElement('th');
      dateCell.scope = 'row';
      dateCell.className = 'font-medium';
      const label = document.createElement('time');
      label.dateTime = date;
      label.textContent = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric' }).format(day);
      checkbox.setAttribute('aria-label', `Select ${label.textContent}`);
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) selectedDates.add(date); else selectedDates.delete(date);
        syncSelection();
      });
      checkboxCell.append(checkbox);
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
      actions.append(remove); action.append(actions); row.append(checkboxCell, dateCell, weekday, action); body.append(row);
    });
    const toolbar = document.createElement('div');
    toolbar.className = 'availability-selection';
    const count = document.createElement('span');
    count.className = 'text-sm'; count.setAttribute('role', 'status');
    const bulkDelete = document.createElement('button');
    bulkDelete.type = 'button'; bulkDelete.className = 'button button--danger button--sm';
    bulkDelete.textContent = 'Remove selected dates';
    const toolbarActions = document.createElement('div');
    toolbarActions.className = 'flex flex-wrap items-center gap-3';
    toolbarActions.append(count, bulkDelete); toolbar.append(toolbarActions);
    const syncSelection = () => {
      const size = selectedDates.size;
      count.textContent = `${new Intl.NumberFormat('en').format(size)} ${size === 1 ? 'date' : 'dates'} selected`;
      bulkDelete.disabled = size === 0;
      toolbar.hidden = size === 0;
      selectAll.checked = matching.length > 0 && size === matching.length;
      selectAll.indeterminate = size > 0 && size < matching.length;
      body.querySelectorAll('input[type="checkbox"]').forEach(box => {
        box.checked = selectedDates.has(box.value);
        if (box.checked) box.closest('tr').setAttribute('data-state', 'active');
        else box.closest('tr').removeAttribute('data-state');
      });
    };
    selectAll.addEventListener('change', () => {
      if (selectAll.checked) matching.forEach(date => selectedDates.add(date));
      else matching.forEach(date => selectedDates.delete(date));
      syncSelection();
    });
    bulkDelete.addEventListener('click', () => {
      const amount = selectedDates.size;
      if (!amount) return;
      bulkDialog.querySelector('#availability-bulk-description').textContent = `Remove ${amount} selected ${amount === 1 ? 'date' : 'dates'} from availability?`;
      bulkDialog.querySelector('#availability-bulk-error').textContent = '';
      bulkDialog.showModal();
      bulkDialog.querySelector('[data-bulk-cancel]').focus();
    });
    table.append(head, body); summary.append(toolbar); list.append(table); syncSelection();
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
