(() => {
  const grid = document.querySelector('.courses-section .course-grid');
  if (!grid) return;
  fetch('course-data.json').then(response => {
    if (!response.ok) throw new Error('Unable to load courses');
    return response.json();
  }).then(source => {
    let hash = 2166136261;
    for (const char of JSON.stringify(source)) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
    const data = JSON.parse(sessionStorage.getItem(`yokogawa-admin-preview-en-${hash >>> 0}`));
    if (!data) return;
    const defaults = ['VPEG', 'PMCE-ONL', 'SPRS', 'VPMN'];
    const existing = new Map([...grid.querySelectorAll('.course-card')].map(card => [new URL(card.querySelector('a').href).searchParams.get('course'), card]));
    const courses = data.courses.filter(course => (course.popular ?? defaults.includes(course.id)) && course.status === 'Published' && data.categories.some(category => category.id === course.category && category.status === 'Published'));
    grid.replaceChildren(...courses.map(course => {
      const card = existing.get(course.id)?.cloneNode(true) || existing.values().next().value.cloneNode(true);
      card.querySelector('h3').textContent = course.name;
      card.querySelector('.course-category').lastChild.textContent = ` ${data.categories.find(category => category.id === course.category).name.toUpperCase()}`;
      const meta = card.querySelectorAll('.course-meta span');
      meta[0].lastChild.textContent = ` ${course.duration || '—'}`;
      meta[1].lastChild.textContent = ` ${course.fee || '—'}`;
      card.querySelector('a').href = `course-detail.html?course=${encodeURIComponent(course.id)}`;
      return card;
    }));
    if (!courses.length) {
      const message = document.createElement('p');
      message.textContent = 'No popular courses are available at the moment.';
      grid.append(message);
    }
  }).catch(() => {});
})();
