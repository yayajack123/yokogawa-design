const list = document.querySelector('#course-list');
const content = document.querySelector('#course-content');
const search = document.querySelector('#course-search');
const sidebar = document.querySelector('.course-sidebar');
function updateScrollHint() {
  sidebar.classList.toggle('has-more-courses', list.scrollTop + list.clientHeight < list.scrollHeight - 1);
}
list.addEventListener('scroll', updateScrollHint, { passive: true });
window.addEventListener('resize', updateScrollHint);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let revealTween;
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches && revealTween) { revealTween.progress(1); revealTween.kill(); }
});
let courses = [];
let activeId = new URLSearchParams(location.search).get('course');

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function renderList() {
  const query = search.value.trim().toLocaleLowerCase();
  list.replaceChildren();
  const categories = [...new Set(courses.map(course => course.category))];
  for (const category of categories) {
    const matches = courses.filter(course => course.category === category && (!query || `${category} ${course.title} ${course.id}`.toLocaleLowerCase().includes(query)));
    if (!matches.length) continue;
    const group = element('section', '', 'course-sidebar-group');
    group.append(element('h2', category));
    for (const course of matches) {
      const link = element('a', course.title);
      link.href = `?course=${encodeURIComponent(course.id)}`;
      if (course.id === activeId) link.setAttribute('aria-current', 'page');
      link.addEventListener('click', event => {
        event.preventDefault();
        selectCourse(course.id, true);
      });
      group.append(link);
    }
    list.append(group);
  }
  if (!list.children.length) list.append(element('p', 'No courses found. Try another search.', 'course-empty'));
  updateScrollHint();
}

function selectCourse(id, push = false) {
  const course = courses.find(item => item.id === id) || courses[0];
  const changed = content.querySelector('h1') && activeId !== course.id;
  if (revealTween) { revealTween.progress(1); revealTween.kill(); }
  activeId = course.id;
  if (push) history.pushState({ course: activeId }, '', `?course=${encodeURIComponent(activeId)}`);
  renderList();
  content.replaceChildren();
  const breadcrumb = element('nav', '', 'course-breadcrumb');
  breadcrumb.setAttribute('aria-label', 'Breadcrumb');
  const home = element('a', 'Home'); home.href = 'index.html';
  const catalog = element('a', 'Courses'); catalog.href = 'courses.html';
  breadcrumb.append(home, document.createTextNode(' / '), catalog, document.createTextNode(' / '), element('span', course.title));
  const hero = element('header', '', 'course-detail-hero');
  hero.append(element('h1', course.title));
  const description = course.description || course.fields.OBJECTIVE;
  if (description) hero.append(element('p', description));
  const body = element('div', '', 'course-detail-body');
  if (course.unavailable) body.append(element('p', 'Course details are unavailable from the source.'));
  const labels = {'COURSE CODE':'Course Code','OBJECTIVE':'Objective','DURATION':'Duration','PARTICIPANTS':'Participants','PREREQUISITE':'Prerequisite','MAX. CLASS SIZE':'Max. Class Size','COURSE FEE':'Course Fee'};
  if (Object.keys(course.fields).length) {
    const information = element('section', '', 'course-information');
    information.append(element('h2', 'Course Information'));
    const details = element('dl', '', 'course-facts');
    for (const [key, value] of Object.entries(course.fields)) {
      const row = element('div', '', 'course-fact');
      row.append(element('dt', labels[key] || key), element('dd', value));
      details.append(row);
    }
    information.append(details);
    body.append(information);
  }
  if (course.days.length) {
    const section = element('section', '', 'course-syllabus');
    const heading = element('div', '', 'course-syllabus-heading');
    heading.append(element('h2', 'Course Content'));
    if (course.pdf) { const pdf = element('a', 'View in PDF', 'button button-outlined'); pdf.href = course.pdf; pdf.target = '_blank'; pdf.rel = 'noopener noreferrer'; pdf.setAttribute('aria-label', 'View in PDF (opens in a new tab)'); heading.append(pdf); }
    section.append(heading);
    const days = element('div', '', 'course-days');
    course.days.forEach((day, index) => {
      const row = element('div', '', 'course-day');
      row.append(element('h3', `Day ${index + 1}`));
      const ul = element('ul');
      for (const item of day.items) ul.append(element('li', item));
      row.append(ul);
      days.append(row);
    });
    section.append(days);
    body.append(section);
  }
  if (course.source) { const source = element('a', 'View source', 'course-source-link'); source.href = course.source; body.append(source); }
  content.append(hero, breadcrumb, body);
  if (changed && window.gsap && !reducedMotion.matches) {
    const targets = [hero.querySelector('h1'), hero.querySelector('p'), breadcrumb, body].filter(Boolean);
    revealTween = gsap.fromTo(targets, { opacity: 0.35 }, { opacity: 1, duration: 0.28, stagger: 0.025, ease: 'power2.out', clearProps: 'opacity', overwrite: true });
  }
  document.title = `${course.title} | Yokogawa Industrial Training`;
}
search.addEventListener('input', renderList);
window.addEventListener('popstate', () => selectCourse(new URLSearchParams(location.search).get('course')));
fetch('course-data.json').then(response => { if (!response.ok) throw new Error('Unable to load courses'); return response.json(); }).then(data => { courses = data; selectCourse(activeId); }).catch(() => { list.replaceChildren(element('p', 'Unable to load courses. Please reload the page.')); content.replaceChildren(element('p', 'Course details could not be loaded.')); });
