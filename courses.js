const categoryLinks = [...document.querySelectorAll(".catalog-nav a")];
const catalog = document.querySelector(".catalog");
const nav = document.querySelector(".catalog-nav");
const groups = [...document.querySelectorAll(".catalog-group")];
const search = document.querySelector("#courses_page_search_input");
const clearSearch = document.querySelector("#courses_page_clear_button");
const resultStatus = document.querySelector("#courses_page_results_label");
const emptyState = document.querySelector("#courses_page_empty");
const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const courses = groups.flatMap(group => [...group.querySelectorAll(".catalog-card")].map(card => {
  const code = new URL(card.querySelector("h3 a").href).searchParams.get("course") || "";
  return { card, group, text: normalize(`${card.textContent} ${code} ${group.querySelector("h2").textContent}`) };
}));

function filterCourses() {
  const terms = normalize(search.value).split(/\s+/).filter(Boolean);
  let count = 0;
  courses.forEach(({ card, text }) => {
    card.hidden = !terms.every(term => text.includes(term));
    if (!card.hidden) count++;
  });
  groups.forEach(group => {
    group.hidden = !courses.some(course => course.group === group && !course.card.hidden);
  });
  categoryLinks.forEach(link => {
    const group = groups.find(group => `#${group.id}` === link.getAttribute("href"));
    if (group?.hidden) link.setAttribute("aria-disabled", "true");
    else link.removeAttribute("aria-disabled");
  });
  clearSearch.hidden = search.value.length === 0;
  emptyState.hidden = count > 0;
  resultStatus.textContent = terms.length ? `${count} ${count === 1 ? "course" : "courses"} found` : `${count} courses available`;
  updateCategory();
}

document.querySelector(".catalog-tools").hidden = false;
document.querySelector("#courses_page_search_form").addEventListener("submit", event => event.preventDefault());
search.addEventListener("input", filterCourses);
clearSearch.addEventListener("click", () => {
  search.value = "";
  filterCourses();
  search.focus();
});
categoryLinks.forEach(link => link.addEventListener("click", event => {
  if (link.getAttribute("aria-disabled") === "true") event.preventDefault();
}));

let centeredCategory = null;
const mobileCategories = window.matchMedia("(max-width: 640px)");
const reducedCategoryMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateCategory() {
  const cta = document.querySelector(".contact-section");
  const stickyTop = parseFloat(getComputedStyle(nav).top) || 0;
  const pastCatalog = Boolean(cta && cta.getBoundingClientRect().top <= stickyTop + nav.offsetHeight);
  nav.classList.toggle("is-past-catalog", pastCatalog);
  nav.inert = pastCatalog;
  // Match native anchor positioning: html scroll padding and section scroll margin add up.
  const pageInset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const threshold = Math.max(nav.getBoundingClientRect().bottom + 24,
    pageInset + (parseFloat(getComputedStyle(groups[0]).scrollMarginTop) || 0) + 2);
  let active = "#all-courses";

  if (catalog.getBoundingClientRect().top <= threshold) {
    for (const group of groups) {
      if (group.hidden) continue;
      if (group.getBoundingClientRect().top <= threshold) active = `#${group.id}`;
      else break;
    }
  }

  categoryLinks.forEach(link => {
    if (link.getAttribute("href") === active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });

  if (!mobileCategories.matches) {
    centeredCategory = null;
    return;
  }
  if (centeredCategory === active) return;
  centeredCategory = active;
  const activeLink = categoryLinks.find(link => link.getAttribute("href") === active);
  if (!activeLink) return;
  const navBounds = nav.getBoundingClientRect();
  const linkBounds = activeLink.getBoundingClientRect();
  const left = nav.scrollLeft + linkBounds.left - navBounds.left
    + linkBounds.width / 2 - nav.clientWidth / 2;
  nav.scrollTo({ left, behavior: reducedCategoryMotion.matches ? "instant" : "smooth" });
}

let scheduled = false;
window.addEventListener("scroll", () => {
  if (!scheduled) {
    requestAnimationFrame(() => { updateCategory(); scheduled = false; });
    scheduled = true;
  }
}, { passive: true });
window.addEventListener("resize", updateCategory);
window.addEventListener("hashchange", updateCategory);
window.addEventListener("load", updateCategory);
updateCategory();
filterCourses();

