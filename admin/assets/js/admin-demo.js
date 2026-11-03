/* Static preview data only. Real authentication, file storage and validation belong to the backend. */
(async () => {
  'use strict';
  const sourceResponse = await fetch('../course-data.json');
  if (!sourceResponse.ok) throw new Error('Unable to load course data. Reload the page to try again.');
  const sourceCourses = await sourceResponse.json();
  const formatNumber = value => new Intl.NumberFormat('en').format(value);
  const plurals = new Intl.PluralRules('en');
  const countMessage = (count, messages) => messages[plurals.select(count)].replace('{count}', formatNumber(count));
  const categoryNames = [...new Set(sourceCourses.map(course => course.category))];
  const categoryId = name => `category-${categoryNames.indexOf(name) + 1}`;
  // A new source snapshot starts a fresh preview session, preventing stale sample records.
  const sourceText = JSON.stringify(sourceCourses);
  let sourceHash = 2166136261;
  for (const char of sourceText) sourceHash = Math.imul(sourceHash ^ char.charCodeAt(0), 16777619);
  const STORE = `yokogawa-admin-preview-en-${sourceHash >>> 0}`;
  const defaultPopular = ['VPEG', 'PMCE-ONL', 'SPRS', 'VPMN'];
  const categoryIcons = {
    'CENTUM VP Courses': 'category-settings.svg', 'Advanced Solution Courses': 'category-cpu-setting.svg',
    'Safety Courses': 'category-shield.svg', 'Others': 'category-other.svg', 'RAPID': 'category-rapid.svg',
    'Online Courses': 'category-monitor.svg', 'Academic': 'category-book.svg'
  };
  const seed = {
    categories: categoryNames.map(name => ({
      id: categoryId(name), name,
      status: 'Published'
    })),
    courses: sourceCourses.map(course => {
      const fields = course.fields || {};
      const sourcePath = new URL(course.source).pathname.split('/').filter(Boolean);
      return {
        id: course.id, name: course.title, code: fields['COURSE CODE'] || course.id,
        slug: `${sourcePath[sourcePath.length - 1]}${sourceCourses.filter(other => new URL(other.source).pathname.split('/').filter(Boolean).pop() === sourcePath[sourcePath.length - 1]).length > 1 ? '-' + course.id : ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        category: categoryId(course.category), description: course.description || '',
        duration: fields.DURATION || '', fee: fields['COURSE FEE'] || '',
        objective: fields.OBJECTIVE || '', participants: fields.PARTICIPANTS || '',
        prerequisite: fields.PREREQUISITE || '', classSize: fields['MAX. CLASS SIZE'] || '',
        source: course.source, pdfUrl: course.pdf || '', days: course.days || [],
        unavailable: course.unavailable, status: 'Published', popular: defaultPopular.includes(course.id)
      };
    }),
    banner: { title: 'Industrial Training', description: 'Build your team’s skills with Yokogawa training.', button: 'View courses', url: '/courses.html', secondaryButton: 'Ask Our Team', secondaryUrl: '/index.html#contact' }
  };
  let data;
  try { data = JSON.parse(sessionStorage.getItem(STORE)) || seed; } catch (_) { data = seed; }
  data.courses.forEach(course => { if (typeof course.popular !== 'boolean') course.popular = defaultPopular.includes(course.id); });
  const normalizePopularOrder = () => {
    const selected = data.courses.filter(course => course.popular).map(course => course.id);
    data.popularOrder = [...new Set([...(Array.isArray(data.popularOrder) ? data.popularOrder : defaultPopular), ...selected])].filter(id => selected.includes(id));
  };
  normalizePopularOrder();
  const categoryCourseCount = category => data.courses.filter(course => course.category === category).length;
  const courseCountLabel = count => countMessage(count, { one: '{count} course', other: '{count} courses' });
  const save = () => { try { sessionStorage.setItem(STORE, JSON.stringify(data)); return true; } catch (_) { return false; } };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const page = document.body.dataset.adminPage;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const feedback = message => { const el = document.getElementById('feedback'); if (el) el.textContent = message; };
  const badge = status => `<span class="badge badge--soft${status === 'Published' ? ' badge--success' : status === 'Draft' ? ' badge--warning' : ''}">${esc(status)}</span>`;
  const editIcon = '<svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="m16.862 4.487 1.687-1.688a2.652 2.652 0 1 1 3.75 3.75l-1.687 1.688M16.862 4.487 5.91 15.438c-.28.28-.42.42-.526.584-.126.193-.218.407-.274.63-.047.19-.062.387-.092.782L4.8 20.2l2.766-.218c.395-.03.592-.045.782-.092.223-.056.437-.148.63-.274.164-.106.304-.246.584-.526L20.612 8.237M16.862 4.487l3.75 3.75"/></g></svg>';
  // Reuse the delete SVG already present in the Stisla confirmation component.
  const deleteIcon = document.querySelector('#deleteRecord .icon-box')?.innerHTML || '';
  const queryKeys = ['name', 'description', 'code', 'slug', 'category', 'duration', 'fee', 'objective', 'participants', 'prerequisite', 'classSize', 'status', 'metaTitle', 'metaDescription'];
  document.querySelectorAll('[data-category-options]').forEach(select => {
    data.categories.forEach(cat => select.add(new Option(cat.name, cat.id)));
  });
  if (params.has('saved')) feedback('Changes saved for this preview session.');

  let draw;
  let pendingDelete;
  if (page === 'courses' || page === 'categories') {
    const course = page === 'courses';
    const search = document.getElementById('search');
    const status = document.getElementById('statusFilter');
    const category = document.getElementById('categoryFilter');
    const favorites = document.getElementById('course_favorites_filter_switch');
    let pendingPopular;
    let popularTrigger;
    const reorderToast = document.getElementById('reorder-toast');
    let toastTimer;
    const hideReorderToast = () => { clearTimeout(toastTimer); reorderToast.dataset.state = 'closed'; };
    const scheduleToastDismiss = () => {
      clearTimeout(toastTimer);
      if (reorderToast?.dataset.state === 'open') toastTimer = setTimeout(hideReorderToast, 4500);
    };
    const showReorderToast = message => {
      document.getElementById('reorder-toast-message').textContent = message;
      reorderToast.dataset.state = 'open';
      scheduleToastDismiss();
    };
    document.getElementById('reorder-toast-close')?.addEventListener('click', hideReorderToast);
    reorderToast?.addEventListener('mouseenter', () => clearTimeout(toastTimer));
    reorderToast?.addEventListener('mouseleave', scheduleToastDismiss);
    reorderToast?.addEventListener('focusin', () => clearTimeout(toastTimer));
    reorderToast?.addEventListener('focusout', scheduleToastDismiss);
    const tabs = [...document.querySelectorAll('#course-tabs [role="tab"]')];
    const selectTab = tab => {
      tabs.forEach(button => {
        const active = button === tab;
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
        button.dataset.state = active ? 'active' : 'inactive';
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        panel.hidden = !active;
        panel.dataset.state = button.dataset.state;
      });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        selectTab(tabs[next]); tabs[next].focus();
      });
    });
    document.getElementById('popular-browse')?.addEventListener('click', () => { selectTab(tabs[0]); tabs[0].focus(); });
    const drawPopular = () => {
      if (!course) return;
      normalizePopularOrder();
      const selected = data.popularOrder.map(id => data.courses.find(row => row.id === id));
      const eligible = selected.filter(row => row.status === 'Published' && data.categories.some(cat => cat.id === row.category && cat.status === 'Published')).length;
      document.getElementById('popular-count').textContent = `${courseCountLabel(eligible)} ready for Home · ${formatNumber(selected.length)} selected.`;
      const warning = document.getElementById('popular-warning');
      warning.hidden = eligible >= 4 && eligible % 2 === 0;
      warning.textContent = 'This count is outside the recommendation. You can still keep this selection.';
      document.getElementById('popular-empty').hidden = selected.length > 0;
      document.getElementById('popular-table').hidden = selected.length === 0;
      document.getElementById('popular-records').innerHTML = selected.map((row, index) => {
        const cat = data.categories.find(cat => cat.id === row.category);
        const hiddenReason = row.status !== 'Published' ? 'Not shown on Home: course is Draft.' : cat?.status !== 'Published' ? 'Not shown on Home: category is not Published.' : 'Eligible to appear on Home';
        const handle = `<button type="button" class="button button--ghost button--neutral button--icon-only popular-drag-handle" data-drag-id="${esc(row.id)}" aria-label="Reorder ${esc(row.name)}, position ${index + 1} of ${selected.length}" aria-describedby="popular-drag-help"><span aria-hidden="true">⠿</span></button>`;
        return `<tr data-popular-row="${esc(row.id)}"><td>${handle}</td><td>${index + 1}</td><th scope="row"><a class="font-medium" href="course-form.html?id=${encodeURIComponent(row.id)}">${esc(row.name)}</a></th><td>${esc(cat?.name || 'No category')}</td><td>${badge(row.status)}</td><td><span class="text-sm text-muted-foreground">${hiddenReason}</span></td></tr>`;
      }).join('');
    };
    const movePopular = (id, next) => {
      const previous = [...data.popularOrder];
      const index = previous.indexOf(id);
      if (index < 0 || next < 0 || next >= previous.length) return;
      if (index === next) return;
      data.popularOrder.splice(index, 1);
      data.popularOrder.splice(next, 0, id);
      const saved = save();
      if (!saved) data.popularOrder = previous;
      drawPopular();
      const row = data.courses.find(row => row.id === id);
      if (saved) {
        feedback('');
        showReorderToast(`${row.name} moved to position ${next + 1}. Order saved for this preview session.`);
      } else feedback('Unable to save the order. Enable browser storage and try again.');
      [...document.querySelectorAll('[data-drag-id]')].find(control => control.dataset.dragId === id)?.focus({ preventScroll: true });
    };
    const popularRecords = document.getElementById('popular-records');
    let drag;
    let scrollFrame;
    const clearDropTarget = () => popularRecords?.querySelectorAll('[data-drop-edge]').forEach(row => row.removeAttribute('data-drop-edge'));
    const finishDrag = (commit = false) => {
      if (!drag) return;
      const current = drag;
      drag = null;
      cancelAnimationFrame(scrollFrame);
      clearDropTarget();
      current.handle.closest('tr').removeAttribute('data-dragging');
      if (current.handle.hasPointerCapture(current.pointerId)) current.handle.releasePointerCapture(current.pointerId);
      if (commit && current.active && current.target) {
        const index = data.popularOrder.indexOf(current.id);
        let next = data.popularOrder.indexOf(current.target) + (current.after ? 1 : 0);
        if (next > index) next--;
        movePopular(current.id, next);
      }
    };
    const updateDropTarget = () => {
      if (!drag?.active) return;
      clearDropTarget();
      drag.target = null;
      const hit = document.elementFromPoint(drag.x, drag.y)?.closest('[data-popular-row]');
      if (!hit || !popularRecords.contains(hit) || hit.dataset.popularRow === drag.id) return;
      drag.target = hit.dataset.popularRow;
      const bounds = hit.getBoundingClientRect();
      drag.after = drag.y > bounds.top + bounds.height / 2;
      hit.dataset.dropEdge = drag.after ? 'after' : 'before';
    };
    const scrollWhileDragging = () => {
      if (!drag) return;
      if (drag.active) {
        const step = drag.y < 64 ? -12 : drag.y > window.innerHeight - 64 ? 12 : 0;
        if (step) { window.scrollBy(0, step); updateDropTarget(); }
      }
      scrollFrame = requestAnimationFrame(scrollWhileDragging);
    };
    popularRecords?.addEventListener('pointerdown', event => {
      const handle = event.target.closest('[data-drag-id]');
      if (!handle || !event.isPrimary || event.button !== 0 || drag) return;
      handle.focus({ preventScroll: true });
      drag = { id: handle.dataset.dragId, handle, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, active: false };
      handle.setPointerCapture(event.pointerId);
      scrollFrame = requestAnimationFrame(scrollWhileDragging);
    });
    popularRecords?.addEventListener('pointermove', event => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      drag.x = event.clientX; drag.y = event.clientY;
      if (!drag.active && Math.hypot(drag.x - drag.startX, drag.y - drag.startY) >= 6) {
        drag.active = true; drag.handle.closest('tr').setAttribute('data-dragging', '');
      }
      updateDropTarget();
    });
    popularRecords?.addEventListener('pointerup', event => { if (drag?.pointerId === event.pointerId) finishDrag(true); });
    popularRecords?.addEventListener('pointercancel', () => finishDrag());
    popularRecords?.addEventListener('lostpointercapture', () => finishDrag());
    window.addEventListener('blur', () => finishDrag());
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && drag) { event.preventDefault(); finishDrag(); }
    });
    popularRecords?.addEventListener('keydown', event => {
      const handle = event.target.closest('[data-drag-id]');
      if (!handle || !['ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      if (drag) return;
      movePopular(handle.dataset.dragId, data.popularOrder.indexOf(handle.dataset.dragId) + (event.key === 'ArrowUp' ? -1 : 1));
    });
    const popularDialog = document.createElement('dialog');
    if (course) {
      popularDialog.style.cssText = 'width: min(28rem, calc(100% - 2rem)); margin: auto; padding: 0; border: 0; border-radius: var(--radius); background: transparent;';
      popularDialog.setAttribute('aria-labelledby', 'popularTitle');
      popularDialog.setAttribute('aria-describedby', 'popularDescription');
      popularDialog.innerHTML = `<form method="dialog" class="card"><div class="card__body"><h2 class="dialog__title" id="popularTitle"></h2><p class="text-muted-foreground" id="popularDescription"></p></div><div class="dialog__footer justify-center"><button type="submit" value="cancel" class="button button--ghost button--neutral" autofocus>Cancel</button><button type="submit" value="confirm" class="button button--primary" id="confirmPopular"></button></div></form>`;
      document.body.append(popularDialog);
      popularDialog.addEventListener('close', () => {
        if (popularDialog.returnValue === 'confirm' && pendingPopular) {
          pendingPopular.popular = !pendingPopular.popular;
          const previousOrder = [...data.popularOrder];
          normalizePopularOrder();
          const saved = save();
          if (!saved) { pendingPopular.popular = !pendingPopular.popular; data.popularOrder = previousOrder; }
          draw();
          feedback(saved ? `${pendingPopular.name}: popular ${pendingPopular.popular ? 'on' : 'off'} for this preview session.` : 'Unable to save the selection. Enable browser storage and try again.');
          popularTrigger = [...document.querySelectorAll('[data-popular-id]')].find(button => button.dataset.popularId === pendingPopular.id);
        }
        (popularTrigger || favorites)?.focus();
        pendingPopular = null;
      });
    }
    const pageSize = 10;
    let currentPage = 1;
    draw = () => {
      drawPopular();
      const rows = data[page].filter(row => row.name.toLowerCase().includes(search.value.trim().toLowerCase()) && (!status.value || status.value === row.status) && (!category?.value || category.value === row.category) && (!favorites?.checked || row.popular));
      const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
      currentPage = Math.min(currentPage, totalPages);
      const start = course ? (currentPage - 1) * pageSize : 0;
      const visibleRows = course ? rows.slice(start, start + pageSize) : rows;
      document.getElementById('records').innerHTML = visibleRows.map(row => {
        const url = `${course ? 'course' : 'category'}-form.html?id=${encodeURIComponent(row.id)}`;
        const count = course ? 0 : categoryCourseCount(row.id);
        const middle = course ? `<td>${esc(data.categories.find(c => c.id === row.category)?.name || '—')}</td><td>${esc(row.duration || '—')}</td>` : `<td class="text-end">${count}</td>`;
        return `<tr><th scope="row"><div><a href="${url}" class="font-medium">${esc(row.name)}</a><div class="text-xs text-muted-foreground" style="font-weight: var(--font-weight-normal)">${esc(course ? row.code : courseCountLabel(count))}</div></div></th>${middle}<td>${badge(row.status)}</td><td class="text-end"><div class="flex justify-end gap-1">${course ? `<button type="button" class="button button--ghost ${row.popular ? 'button--primary' : 'button--neutral'} button--icon-only button--sm" data-popular-id="${esc(row.id)}" aria-pressed="${row.popular}" aria-label="Popular on homepage: ${row.popular ? 'on' : 'off'} for ${esc(row.name)}" title="Popular on homepage: ${row.popular ? 'On' : 'Off'}"><svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true" fill="${row.popular ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="m12 3 2.78 5.63 6.22.91-4.5 4.38 1.06 6.19L12 17.19l-5.56 2.92 1.06-6.19L3 9.54l6.22-.91L12 3Z"/></svg></button>` : ''}<a href="${url}" class="button button--ghost button--neutral button--icon-only button--sm" aria-label="Edit ${esc(row.name)}">${editIcon}</a><button type="button" class="button button--ghost button--danger button--icon-only button--sm" data-stisla-dialog-trigger="deleteRecord" data-fill-name="${esc(row.name)}" data-delete-id="${esc(row.id)}" aria-label="Delete ${esc(row.name)}">${deleteIcon}</button></div></td></tr>`;
      }).join('');
      document.getElementById('emptyState').hidden = rows.length > 0;
      const countLabel = countMessage(rows.length, course ? { one: '{count} course', other: '{count} courses' } : { one: '{count} category', other: '{count} categories' });
      document.getElementById('resultCount').textContent = course
        ? `Showing ${formatNumber(rows.length ? start + 1 : 0)}–${formatNumber(start + visibleRows.length)} of ${countLabel}`
        : `Showing ${formatNumber(rows.length)} of ${countMessage(data[page].length, { one: '{count} category', other: '{count} categories' })}`;
      document.getElementById('emptyTitle').textContent = search.value.trim()
        ? `No results for “${search.value.trim()}”`
        : course ? 'No courses match these filters' : 'No categories match these filters';
      if (course) {
        const control = (number, label, disabled = false, active = false) => `<li><button type="button" class="pagination__button" data-page="${number}" aria-label="${label}" ${disabled ? 'disabled aria-disabled="true"' : ''} ${active ? 'data-state="active" aria-current="page"' : ''}>${label}</button></li>`;
        document.getElementById('paginationButtons').innerHTML = control(currentPage - 1, 'Previous', currentPage === 1)
          + Array.from({ length: totalPages }, (_, index) => control(index + 1, String(index + 1), false, currentPage === index + 1)).join('')
          + control(currentPage + 1, 'Next', currentPage === totalPages);
        document.getElementById('coursePagination').hidden = rows.length === 0;
      }
    };
    [search, status, category].filter(Boolean).forEach(el => el.addEventListener('input', () => { currentPage = 1; draw(); }));
    favorites?.addEventListener('change', () => { currentPage = 1; draw(); });
    const clearFilters = () => { search.value = status.value = ''; if (category) category.value = ''; if (favorites) favorites.checked = false; currentPage = 1; draw(); search.focus(); };
    document.getElementById('resetFilters').addEventListener('click', clearFilters);
    document.getElementById('emptyReset').addEventListener('click', clearFilters);
    document.getElementById('records').addEventListener('click', event => {
      const popularButton = event.target.closest('[data-popular-id]');
      if (popularButton) {
        pendingPopular = data.courses.find(row => row.id === popularButton.dataset.popularId);
        popularTrigger = popularButton;
        const turningOn = !pendingPopular.popular;
        document.getElementById('popularTitle').textContent = turningOn ? 'Add to popular courses?' : 'Remove from popular courses?';
        document.getElementById('popularDescription').textContent = turningOn
          ? `Show “${pendingPopular.name}” in popular courses on the homepage? The course and its category must be published.`
          : `Remove “${pendingPopular.name}” from popular courses on the homepage?`;
        document.getElementById('confirmPopular').textContent = turningOn ? 'Add to popular' : 'Remove from popular';
        popularDialog.returnValue = '';
        popularDialog.showModal();
        return;
      }
      const trigger = event.target.closest('[data-delete-id]');
      if (!trigger) return;
      pendingDelete = trigger.dataset.deleteId;
      const blocked = !course && data.courses.some(c => c.category === pendingDelete);
      const record = data[page].find(row => row.id === pendingDelete);
      document.getElementById('deleteTitle').textContent = blocked ? 'Category in use' : `Delete “${record.name}”?`;
      document.querySelector('[data-confirm-delete]').textContent = course ? 'Delete course' : 'Delete category';
      document.getElementById('deleteDescription').innerHTML = blocked ? 'Move or delete all courses in this category, then try again.' : `Delete <span data-slot="name">${esc(data[page].find(r => r.id === pendingDelete).name)}</span> from this preview? This cannot be undone during this session.`;
      document.querySelector('[data-confirm-delete]').hidden = blocked;
    });
    document.querySelector('[data-confirm-delete]').addEventListener('click', () => {
      if (!pendingDelete || (page === 'categories' && data.courses.some(c => c.category === pendingDelete))) return;
      const previous = data[page];
      const previousOrder = [...data.popularOrder];
      data[page] = data[page].filter(row => row.id !== pendingDelete); normalizePopularOrder();
      const saved = save();
      if (!saved) { data[page] = previous; data.popularOrder = previousOrder; }
      draw(); feedback(saved ? 'Item deleted from this preview session.' : 'Unable to delete the item. Enable browser storage and try again.');
    });
    document.getElementById('paginationButtons')?.addEventListener('click', event => {
      const button = event.target.closest('button[data-page]');
      if (!button || button.disabled) return;
      currentPage = Number(button.dataset.page);
      draw();
      document.querySelector(`#paginationButtons button[data-page="${currentPage}"][aria-current="page"]`)?.focus();
    });
    draw();
  }

  const form = document.querySelector('[data-demo-form]');
  if (!form) return;
  const type = form.dataset.demoForm;
  const collection = type === 'course' ? 'courses' : 'categories';
  const item = ['course', 'category'].includes(type) ? data[collection].find(row => row.id === id) : null;
  if (id && ['course', 'category'].includes(type) && !item) { feedback('This item is no longer available. Return to the list to select another item.'); form.hidden = true; return; }
  if (type === 'category') document.getElementById('categoryCourseCount').textContent = courseCountLabel(item ? categoryCourseCount(item.id) : 0);
  if (item) {
    queryKeys.forEach(key => { if (form.elements[key]) form.elements[key].value = item[key] || ''; });
    const label = `Edit ${type === 'course' ? 'course' : 'category'}`;
    document.querySelector('[data-page-title]').textContent = label; document.title = `${label} · Yokogawa Admin`;
    if (type === 'course') document.getElementById('existingFiles').textContent = [item.thumbnailName, item.pdfName].filter(Boolean).length ? `Selected files: ${new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format([item.thumbnailName, item.pdfName].filter(Boolean))}. File names are saved for this preview; uploads are not stored.` : 'No new files selected.';
  }
  if (item?.pdfUrl) {
    const link = document.createElement('a');
    link.className = 'link'; link.href = item.pdfUrl; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.textContent = 'View source schedule PDF (opens in a new tab)';
    document.getElementById('existingFiles').append(document.createElement('br'), link);
  }
  form.querySelectorAll('input,select,textarea').forEach(control => {
    if (control.name && document.getElementById(`${control.name}-error`)) control.setAttribute('aria-describedby', `${control.name}-help ${control.name}-error`);
  });
  if (type === 'password') { form.elements.oldPassword.autocomplete = 'current-password'; form.elements.newPassword.minLength = 8; }
  if (type === 'course') {
    const nameInput = form.elements.name;
    const slugInput = form.elements.slug;
    const slugify = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let automaticSlug = !slugInput.value || slugInput.value === slugify(nameInput.value);
    nameInput.addEventListener('input', () => {
      if (automaticSlug) slugInput.value = slugify(nameInput.value);
    });
    slugInput.addEventListener('input', () => { automaticSlug = !slugInput.value; });
    const days = document.getElementById('course_content_days');
    const addDay = document.getElementById('course_content_add_button');
    const status = document.getElementById('course_content_status');
    const renumberDays = () => {
      [...days.children].forEach((row, index) => {
        const label = `Day ${index + 1}`;
        row.querySelector('[data-day-heading]').textContent = label;
        row.querySelector('[data-day-label]').textContent = `${label} topics *`;
        row.querySelector('[data-remove-day]').setAttribute('aria-label', `Remove ${label.toLowerCase()}`);
      });
      document.getElementById('course_content_empty').hidden = days.children.length > 0;
      document.getElementById('days-error').textContent = '';
    };
    let nextDayId = 0;
    const appendDay = (day = { items: [] }) => {
      const row = document.getElementById('course_content_day_template').content.firstElementChild.cloneNode(true);
      const key = `course_content_day_${++nextDayId}`;
      const topics = row.querySelector('[data-day-topics]');
      topics.id = `${key}_input`;
      topics.name = `${key}_topics`;
      topics.value = day.items.join('\n');
      row.querySelector('[data-day-label]').htmlFor = topics.id;
      row.querySelector('[data-remove-day]').id = `${key}_remove_button`;
      days.append(row);
      renumberDays();
      return topics;
    };
    (item?.days || []).forEach(appendDay);
    renumberDays();
    addDay.addEventListener('click', () => {
      appendDay().focus();
      status.textContent = `Day ${days.children.length} added.`;
    });
    days.addEventListener('click', event => {
      const button = event.target.closest('[data-remove-day]');
      if (!button) return;
      const row = button.closest('[data-course-day]');
      const label = row.querySelector('[data-day-heading]').textContent;
      const next = row.nextElementSibling || row.previousElementSibling;
      row.remove();
      renumberDays();
      (next?.querySelector('[data-day-topics]') || addDay).focus();
      status.textContent = `${label} removed. Remaining days have been renumbered.`;
    });
    const note = () => { const category = data.categories.find(c => c.id === form.elements.category.value); document.getElementById('visibilityNote').textContent = category?.status === 'Unpublished' ? 'This category is Unpublished. You can save the course, but it will stay hidden from the website.' : 'A course appears on the website only when both the course and its category are Published.'; };
    form.elements.category.addEventListener('change', note); note();
  }
  function error(name, message) {
    const output = document.getElementById(`${name}-error`);
    if (output) output.textContent = message;
    const control = form.elements[name];
    if (control) { control.setAttribute('aria-invalid', 'true'); control.focus(); }
    return false;
  }
  function validateFile(file, name, kind) {
    if (!file || !file.size) return true;
    if (kind === 'pdf') return file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024 || error(name, 'Choose a PDF up to 10 MB.');
    const image = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= 2 * 1024 * 1024;
    const video = kind === 'media' && file.type === 'video/mp4' && file.size <= 20 * 1024 * 1024;
    return image || video || error(name, kind === 'media' ? 'Choose a JPG, PNG, or WebP image up to 2 MB, or an MP4 up to 20 MB.' : 'Choose a JPG, PNG, or WebP image up to 2 MB.');
  }
  let iconValue = item?.iconData || '';
  let iconName = item?.iconName || '';
  let iconTask = Promise.resolve(true);
  let iconRevision = 0;
  if (type === 'course' || type === 'category') {
    const input = form.elements.icon;
    const preview = document.getElementById('icon-preview');
    const filename = document.getElementById('icon-filename');
    const remove = document.getElementById('icon-remove');
    const status = document.getElementById('icon-status');
    const defaultIcon = type === 'course' ? '../asset/course-figma/94876.svg' : `../asset/${categoryIcons[item?.name] || 'category-settings.svg'}`;
    const renderIcon = () => {
      preview.src = iconValue || defaultIcon;
      filename.textContent = iconName || 'Default icon';
      remove.hidden = !iconValue;
    };
    renderIcon();
    input.addEventListener('change', () => {
      const revision = ++iconRevision;
      const file = input.files[0];
      if (!file) { iconTask = Promise.resolve(true); return; }
      const validType = (file.type === 'image/png' && /\.png$/i.test(file.name)) || (file.type === 'image/svg+xml' && /\.svg$/i.test(file.name));
      const message = 'Choose an SVG or PNG image up to 2 MB.';
      if (!validType || file.size === 0 || file.size > 2 * 1024 * 1024) {
        error('icon', message); remove.hidden = false;
        iconTask = Promise.resolve(false); return;
      }
      document.getElementById('icon-error').textContent = ''; input.removeAttribute('aria-invalid');
      status.textContent = 'Loading icon preview.';
      remove.hidden = false;
      iconTask = new Promise(resolve => {
        const reader = new FileReader();
        const fail = () => {
          if (revision === iconRevision) { error('icon', 'This image could not be opened. Choose another SVG or PNG.'); status.textContent = ''; }
          resolve(false);
        };
        reader.onerror = fail;
        reader.onload = () => {
          const image = new Image();
          image.onerror = fail;
          image.onload = () => {
            if (revision === iconRevision) {
              iconValue = reader.result; iconName = file.name; renderIcon();
              status.textContent = `${file.name} ready for preview. Save the form to keep it for this session.`;
            }
            resolve(true);
          };
          image.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
    });
    remove.addEventListener('click', () => {
      ++iconRevision; input.value = ''; iconValue = ''; iconName = ''; iconTask = Promise.resolve(true);
      document.getElementById('icon-error').textContent = ''; input.removeAttribute('aria-invalid');
      renderIcon(); status.textContent = 'Default icon restored. Save the form to keep this change.'; input.focus();
    });
  }
  const safeUrl = value => { try { const parsed = new URL(value, location.origin); return ['https:', 'http:'].includes(parsed.protocol) && (/^https?:\/\//i.test(value) || value.startsWith('/') && !value.startsWith('//')); } catch (_) { return false; } };
  let objectUrl;
  if (type === 'banner') {
    data.banner = { ...seed.banner, ...data.banner };
    Object.entries(data.banner).forEach(([key, value]) => { if (form.elements[key]) form.elements[key].value = value; });
    const preview = () => {
      document.getElementById('previewTitle').textContent = form.elements.title.value;
      document.getElementById('previewDescription').textContent = form.elements.description.value;
      const link = document.getElementById('previewLink'); link.textContent = form.elements.button.value;
      link.href = safeUrl(form.elements.url.value) ? form.elements.url.value : '#';
      const secondaryLink = document.getElementById('previewSecondaryLink'); secondaryLink.textContent = form.elements.secondaryButton.value;
      secondaryLink.href = safeUrl(form.elements.secondaryUrl.value) ? form.elements.secondaryUrl.value : '#';
    };
    form.addEventListener('input', preview); preview();
    form.elements.media.addEventListener('change', () => {
      const file = form.elements.media.files[0];
      if (!file) return;
      if (!validateFile(file, 'media', 'media')) return;
      document.getElementById('media-error').textContent = ''; form.elements.media.removeAttribute('aria-invalid');
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(file);
      const isVideo = file.type === 'video/mp4';
      const image = document.getElementById('bannerImage'), video = document.getElementById('bannerVideo');
      image.hidden = isVideo; video.hidden = !isVideo;
      if (isVideo) video.src = objectUrl; else { video.pause(); video.removeAttribute('src'); image.src = objectUrl; }
    });
    window.addEventListener('pagehide', () => { if (objectUrl) URL.revokeObjectURL(objectUrl); });
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    form.querySelectorAll('[data-error]').forEach(el => { el.textContent = ''; });
    form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
    const f = new FormData(form);
    if (type === 'login') {
      if (f.get('email') !== 'admin@example.com' || f.get('password') !== 'demo1234') return feedback('The email or password does not match. Check both and try again.');
      location.href = 'index.html'; return;
    }
    if (type === 'password') {
      if (f.get('oldPassword') !== 'demo1234') return error('oldPassword', 'The current password does not match. For this preview, enter demo1234.');
      if (f.get('newPassword').length < 8) return error('newPassword', 'Choose a password with at least 8 characters.');
      if (f.get('newPassword') !== f.get('confirmPassword')) return error('confirmPassword', 'Enter the same password in both new password fields.');
      form.reset(); feedback('Preview complete. No live account password was changed.'); return;
    }
    if (type === 'banner') {
      if (!validateFile(f.get('media'), 'media', 'media')) return;
      if (!safeUrl(f.get('url').trim())) return error('url', 'Enter an http/https URL or a path starting with /.');
      if (!safeUrl(f.get('secondaryUrl').trim())) return error('secondaryUrl', 'Enter an http/https URL or a path starting with /.');
      data.banner = Object.fromEntries(['title', 'description', 'button', 'url', 'secondaryButton', 'secondaryUrl'].map(key => [key, String(f.get(key)).trim()]));
      save(); feedback('Banner text saved for this preview session. Selected media is available until you leave this page.'); return;
    }
    if (!(await iconTask)) return error('icon', 'Choose a valid SVG or PNG up to 2 MB, or remove the selection.');
    const value = Object.fromEntries(queryKeys.filter(key => f.has(key)).map(key => [key, String(f.get(key)).trim()]));
    if (!value.name) return error('name', 'Enter a name.');
    if (type === 'course') {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug)) return error('slug', 'Use lowercase letters, numbers, and hyphens.');
      if (data.courses.some(row => row.slug === value.slug && row.id !== id)) return error('slug', 'This slug is already in use. Choose a unique slug.');
      if (!data.categories.some(cat => cat.id === value.category)) return error('category', 'Select an available category.');
      const topicInputs = [...form.querySelectorAll('[data-day-topics]')];
      const emptyDay = topicInputs.find(control => !control.value.trim());
      if (emptyDay) {
        error('days', 'Enter at least one topic for each day, or remove the empty day.');
        emptyDay.setAttribute('aria-invalid', 'true');
        emptyDay.focus();
        return;
      }
      value.days = topicInputs.map((control, index) => ({
        title: `Day ${index + 1}`,
        items: control.value.split(/\r?\n/).map(topic => topic.trim()).filter(Boolean)
      }));
      if (!validateFile(f.get('thumbnail'), 'thumbnail', 'image') || !validateFile(f.get('pdf'), 'pdf', 'pdf')) return;
      value.thumbnailName = f.get('thumbnail')?.name || item?.thumbnailName || '';
      value.pdfName = f.get('pdf')?.name || item?.pdfName || '';
    }
    value.iconData = iconValue; value.iconName = iconName;
    const previous = item ? { ...item } : null;
    if (item) Object.assign(item, value); else data[collection].push({ id: `${type}-${Date.now()}`, ...value });
    if (!save()) {
      if (item) Object.assign(item, previous); else data[collection].pop();
      feedback('Unable to save this preview. Browser storage may be full or unavailable. Try a smaller icon or remove it, then save again.');
      return;
    }
    location.href = `${type === 'course' ? 'index' : 'categories'}.html?saved=1`;
  });
})().catch(() => {
  const feedback = document.getElementById('feedback');
  if (feedback) { feedback.setAttribute('role', 'alert'); feedback.textContent = 'Unable to load course data. Check your connection and reload the page.'; }
  document.querySelectorAll('[data-demo-form] button[type="submit"]').forEach(button => { button.disabled = true; });
});
