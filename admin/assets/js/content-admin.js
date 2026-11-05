(async () => {
  'use strict';
  const feedback = document.getElementById('feedback');
  const key = 'yokogawa-content-session-v1';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const urlOK = value => { try { const u = new URL(value, location.origin + '/'); return (/^https?:$/.test(u.protocol) && (/^https?:\/\//i.test(value) || value.startsWith('/') && !value.startsWith('//') || /^[\w.-]+\.html(?:[?#].*)?$/.test(value))); } catch { return false; } };
  let data;
  try {
    const response = await fetch('assets/js/content-seed.json');
    if (!response.ok) throw new Error();
    const seed = await response.json();
    const saved = sessionStorage.getItem(key);
    data = saved ? JSON.parse(saved) : seed;
  } catch {
    feedback.textContent = 'Unable to load content. Reload the page to try again.';
    return;
  }
  const save = next => {
    try { sessionStorage.setItem(key, JSON.stringify(next)); data = next; return true; }
    catch { feedback.textContent = 'Unable to save changes. Enable browser storage and try again.'; return false; }
  };
  const copy = () => structuredClone(data);
  const page = document.body.dataset.adminPage;
  const cleanHTML = html => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const walk = node => {
      if (node.nodeType === Node.TEXT_NODE) return esc(node.nodeValue);
      if (node.nodeType !== Node.ELEMENT_NODE) return '';
      const inner = Array.from(node.childNodes).map(walk).join('');
      if (node.tagName === 'A' && urlOK(node.getAttribute('href') || '')) return `<a href="${esc(node.getAttribute('href'))}">${inner}</a>`;
      if (node.tagName === 'BR') return '<br>';
      if (node.tagName === 'DIV' || node.tagName === 'P') return `${inner}<br>`;
      return inner;
    };
    return Array.from(doc.body.childNodes).map(walk).join('').replace(/(?:<br>)+$/, '');
  };
  const seedHTML = text => esc(text).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => urlOK(href) ? `<a href="${href}">${label}</a>` : label).replace(/\n/g, '<br>');
  const editIcon = '<svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="m16.862 4.487 1.687-1.688a2.652 2.652 0 1 1 3.75 3.75l-1.687 1.688M16.862 4.487 5.91 15.438c-.28.28-.42.42-.526.584-.126.193-.218.407-.274.63-.047.19-.062.387-.092.782L4.8 20.2l2.766-.218c.395-.03.592-.045.782-.092.223-.056.437-.148.63-.274.164-.106.304-.246.584-.526L20.612 8.237M16.862 4.487l3.75 3.75"/></g></svg>';
  const deleteIcon = document.querySelector('#deleteRecord .icon-box')?.innerHTML || '';
  if (page === 'faqs') {
    const body = document.getElementById('faq-records');
    const state = document.getElementById('faq-status');
    let moving = null;
    const reorder = (id, target) => {
      const next = copy(); const from = next.faqs.findIndex(item => item.id === id);
      if (from < 0 || target < 0 || target >= next.faqs.length || from === target) return;
      const [item] = next.faqs.splice(from, 1); next.faqs.splice(target, 0, item);
      if (save(next)) { render(); state.textContent = `Moved to position ${target + 1}.`; body.querySelector(`[data-move="${CSS.escape(id)}"]`)?.focus(); }
    };
    function render() {
      body.innerHTML = data.faqs.map((item, i) => `<tr data-row="${esc(item.id)}"><td><button type="button" class="button button--ghost button--neutral button--sm" draggable="true" style="touch-action: none; cursor: grab" data-move="${esc(item.id)}" aria-label="Reorder ${esc(item.question)}; use arrow keys">⠿ ${i + 1}</button></td><td>${esc(item.question)}</td><td><span class="badge badge--soft ${item.status === 'Published' ? 'badge--success' : 'badge--warning'}">${esc(item.status)}</span></td><td><input class="switch" type="checkbox" role="switch" data-home="${esc(item.id)}" aria-label="Show on Home: ${esc(item.question)}" ${item.home ? 'checked' : ''}></td><td class="text-end"><div class="flex justify-end gap-1"><a class="button button--ghost button--neutral button--icon-only button--sm" href="faq-form.html?id=${encodeURIComponent(item.id)}" aria-label="Edit ${esc(item.question)}" title="Edit">${editIcon}</a><button class="button button--ghost button--danger button--icon-only button--sm" type="button" data-delete="${esc(item.id)}" aria-label="Delete ${esc(item.question)}" title="Delete">${deleteIcon}</button></div></td></tr>`).join('');
      document.getElementById('faq-empty').hidden = data.faqs.length > 0;
    }
    render();
    body.addEventListener('change', e => { const toggle = e.target.closest('[data-home]'); if (!toggle) return; const next = copy(); const item = next.faqs.find(x => x.id === toggle.dataset.home); if (!item) return; item.home = toggle.checked; if (save(next)) state.textContent = item.home ? 'Shown on Home.' : 'Hidden from Home.'; else toggle.checked = !toggle.checked; });
    body.addEventListener('keydown', e => { const button = e.target.closest('[data-move]'); if (!button || !['ArrowUp','ArrowDown'].includes(e.key)) return; e.preventDefault(); const i = data.faqs.findIndex(x => x.id === button.dataset.move); reorder(button.dataset.move, i + (e.key === 'ArrowUp' ? -1 : 1)); });
    body.addEventListener('dragstart', e => { const button = e.target.closest('[data-move]'); if (!button) return; moving = button.dataset.move; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', moving); });
    body.addEventListener('dragover', e => { if (moving && e.target.closest('[data-row]')) e.preventDefault(); });
    body.addEventListener('drop', e => { const row = e.target.closest('[data-row]'); if (!row || !moving) return; e.preventDefault(); reorder(moving, data.faqs.findIndex(x => x.id === row.dataset.row)); moving = null; });
    body.addEventListener('dragend', () => { moving = null; });
    let touchId = null;
    body.addEventListener('pointerdown', e => { const button = e.target.closest('[data-move]'); if (button && e.pointerType === 'touch') { touchId = button.dataset.move; button.setPointerCapture(e.pointerId); } });
    body.addEventListener('pointerup', e => { if (!touchId) return; const row = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-row]'); if (row) reorder(touchId, data.faqs.findIndex(x => x.id === row.dataset.row)); touchId = null; });
    body.addEventListener('pointercancel', () => { touchId = null; });
    let pending = null;
    body.addEventListener('click', e => { const button = e.target.closest('[data-delete]'); if (!button) return; pending = button.dataset.delete; const item = data.faqs.find(x => x.id === pending); document.querySelector('#deleteDescription [data-slot="name"]').textContent = item.question; document.getElementById('deleteRecord').dataset.state = 'open'; document.getElementById('deleteRecord').setAttribute('aria-hidden','false'); document.querySelector('[data-confirm-delete]').focus(); });
    const dialog = document.getElementById('deleteRecord');
    const close = () => { dialog.dataset.state = 'closed'; dialog.setAttribute('aria-hidden','true'); pending = null; };
    dialog.querySelectorAll('[data-stisla-dialog-dismiss]:not([data-confirm-delete])').forEach(button => button.addEventListener('click', close));
    dialog.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    dialog.querySelector('[data-confirm-delete]').addEventListener('click', () => { if (!pending) return; const next = copy(); next.faqs = next.faqs.filter(x => x.id !== pending); if (save(next)) { render(); state.textContent = 'FAQ deleted.'; close(); } });
  }
  if (page === 'faq-form') {
    const form = document.getElementById('faq-form'); const answer = document.getElementById('answer');
    const id = new URLSearchParams(location.search).get('id'); const item = data.faqs.find(x => x.id === id);
    if (id && !item) { feedback.textContent = 'FAQ not found.'; form.hidden = true; return; }
    if (item) { document.querySelector('[data-page-title]').textContent = 'Edit FAQ'; form.question.value = item.question; answer.innerHTML = item.html ? cleanHTML(item.html) : seedHTML(item.answer); form.status.value = item.status; document.getElementById('home').checked = item.home; }
    let selected = null; const panel = document.getElementById('link-fields');
    document.getElementById('add-link').addEventListener('click', () => { const sel = window.getSelection(); selected = sel.rangeCount && answer.contains(sel.anchorNode) ? sel.getRangeAt(0).cloneRange() : null; document.getElementById('link-label').value = selected?.toString() || ''; panel.hidden = false; document.getElementById('link-label').focus(); });
    document.getElementById('cancel-link').addEventListener('click', () => { panel.hidden = true; answer.focus(); });
    document.getElementById('insert-link').addEventListener('click', () => {
      const label = document.getElementById('link-label').value.trim(); const url = document.getElementById('link-url').value.trim(); const error = document.getElementById('link-error');
      if (!label || !urlOK(url)) { error.textContent = 'Enter link text and a valid http/https URL or website path.'; return; }
      const link = document.createElement('a'); link.href = url; link.setAttribute('href', url); link.textContent = label;
      if (selected && answer.contains(selected.commonAncestorContainer)) { selected.deleteContents(); selected.insertNode(link); } else answer.append(link);
      panel.hidden = true; error.textContent = ''; answer.focus();
    });
    document.getElementById('remove-link').addEventListener('click', () => { const selection = window.getSelection(); const node = selection.anchorNode; const link = (node?.nodeType === 1 ? node : node?.parentElement)?.closest('a'); if (link && answer.contains(link)) link.replaceWith(document.createTextNode(link.textContent)); });
    form.addEventListener('submit', e => {
      e.preventDefault(); const question = form.question.value.trim(); const html = cleanHTML(answer.innerHTML); const hasAnswer = answer.textContent.trim();
      document.getElementById('question-error').textContent = question ? '' : 'Enter a question.';
      document.getElementById('answer-error').textContent = hasAnswer ? '' : 'Enter an answer.';
      if (!question || !hasAnswer) { (question ? answer : form.question).focus(); return; }
      const next = copy(); const entry = {id: id || String(Date.now()) + Math.random().toString(36).slice(2), question, html, status: form.status.value, home: document.getElementById('home').checked};
      if (id) next.faqs[next.faqs.findIndex(x => x.id === id)] = entry; else next.faqs.push(entry);
      if (save(next)) location.href = 'faqs.html?saved=1';
    });
  }
  if (page === 'cta-contact') {
    const form = document.getElementById('contact-form');
    const names = ['phone','email','website','office','address','hours','maps'];
    names.forEach(name => { form.elements[name].value = data.contact[name]; });
    form.addEventListener('submit', e => {
      e.preventDefault(); let first = null;
      names.forEach(name => { const input = form.elements[name]; const value = input.value.trim(); let error = value ? '' : 'This field is required.'; if (!error && name === 'email' && !input.validity.valid) error = 'Enter a valid email address.'; if (!error && ['website','maps'].includes(name) && (!/^https?:\/\//i.test(value) || !urlOK(value))) error = 'Enter a valid http/https URL.'; document.getElementById(`${name}-error`).textContent = error; if (error && !first) first = input; });
      if (first) { first.focus(); return; }
      const next = copy(); names.forEach(name => { next.contact[name] = form.elements[name].value.trim(); }); if (save(next)) { feedback.textContent = ''; adminToast('Contact information saved', 'Changes are available for this preview session.'); }
    });
  }
  const params = new URLSearchParams(location.search);
  if (page === 'faqs' && params.get('saved') === '1') {
    adminToast('FAQ saved', 'Changes are available for this preview session.');
    params.delete('saved');
    history.replaceState(null, '', location.pathname + (params.size ? `?${params}` : '') + location.hash);
  }
})().catch(() => { const el = document.getElementById('feedback'); if (el) el.textContent = 'Unable to load content. Reload the page to try again.'; });
