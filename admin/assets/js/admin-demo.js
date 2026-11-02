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
        unavailable: course.unavailable, status: 'Published'
      };
    }),
    banner: { title: 'Industrial Training', description: 'Build your team’s skills with Yokogawa training.', button: 'View courses', url: '/courses.html', secondaryButton: 'Ask Our Team', secondaryUrl: '/index.html#contact' }
  };
  let data;
  try { data = JSON.parse(sessionStorage.getItem(STORE)) || seed; } catch (_) { data = seed; }
  const categoryCourseCount = category => data.courses.filter(course => course.category === category).length;
  const courseCountLabel = count => countMessage(count, { one: '{count} course', other: '{count} courses' });
  const save = () => { try { sessionStorage.setItem(STORE, JSON.stringify(data)); } catch (_) { /* Preview remains usable without storage. */ } };
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
    const pageSize = 10;
    let currentPage = 1;
    draw = () => {
      const rows = data[page].filter(row => row.name.toLowerCase().includes(search.value.trim().toLowerCase()) && (!status.value || status.value === row.status) && (!category?.value || category.value === row.category));
      const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
      currentPage = Math.min(currentPage, totalPages);
      const start = course ? (currentPage - 1) * pageSize : 0;
      const visibleRows = course ? rows.slice(start, start + pageSize) : rows;
      document.getElementById('records').innerHTML = visibleRows.map(row => {
        const url = `${course ? 'course' : 'category'}-form.html?id=${encodeURIComponent(row.id)}`;
        const count = course ? 0 : categoryCourseCount(row.id);
        const middle = course ? `<td>${esc(data.categories.find(c => c.id === row.category)?.name || '—')}</td><td>${esc(row.duration || '—')}</td>` : `<td class="text-end">${count}</td>`;
        return `<tr><th scope="row"><div><a href="${url}" class="font-medium">${esc(row.name)}</a><div class="text-xs text-muted-foreground" style="font-weight: var(--font-weight-normal)">${esc(course ? row.code : courseCountLabel(count))}</div></div></th>${middle}<td>${badge(row.status)}</td><td class="text-end"><div class="flex justify-end gap-1"><a href="${url}" class="button button--ghost button--neutral button--icon-only button--sm" aria-label="Edit ${esc(row.name)}">${editIcon}</a><button type="button" class="button button--ghost button--danger button--icon-only button--sm" data-stisla-dialog-trigger="deleteRecord" data-fill-name="${esc(row.name)}" data-delete-id="${esc(row.id)}" aria-label="Delete ${esc(row.name)}">${deleteIcon}</button></div></td></tr>`;
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
    const clearFilters = () => { search.value = status.value = ''; if (category) category.value = ''; currentPage = 1; draw(); search.focus(); };
    document.getElementById('resetFilters').addEventListener('click', clearFilters);
    document.getElementById('emptyReset').addEventListener('click', clearFilters);
    document.getElementById('records').addEventListener('click', event => {
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
      data[page] = data[page].filter(row => row.id !== pendingDelete); save(); draw(); feedback('Item deleted from this preview session.');
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
  form.addEventListener('submit', event => {
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
    const value = Object.fromEntries(queryKeys.filter(key => f.has(key)).map(key => [key, String(f.get(key)).trim()]));
    if (!value.name) return error('name', 'Enter a name.');
    if (type === 'course') {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug)) return error('slug', 'Use lowercase letters, numbers, and hyphens.');
      if (data.courses.some(row => row.slug === value.slug && row.id !== id)) return error('slug', 'This slug is already in use. Choose a unique slug.');
      if (!data.categories.some(cat => cat.id === value.category)) return error('category', 'Select an available category.');
      if (!validateFile(f.get('thumbnail'), 'thumbnail', 'image') || !validateFile(f.get('pdf'), 'pdf', 'pdf')) return;
      value.thumbnailName = f.get('thumbnail')?.name || item?.thumbnailName || '';
      value.pdfName = f.get('pdf')?.name || item?.pdfName || '';
    }
    if (item) Object.assign(item, value); else data[collection].push({ id: `${type}-${Date.now()}`, ...value });
    save(); location.href = `${type === 'course' ? 'index' : 'categories'}.html?saved=1`;
  });
})().catch(() => {
  const feedback = document.getElementById('feedback');
  if (feedback) { feedback.setAttribute('role', 'alert'); feedback.textContent = 'Unable to load course data. Check your connection and reload the page.'; }
  document.querySelectorAll('[data-demo-form] button[type="submit"]').forEach(button => { button.disabled = true; });
});
