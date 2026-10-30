const categoryLinks = [...document.querySelectorAll(".catalog-nav a")];
const catalog = document.querySelector(".catalog");
const nav = document.querySelector(".catalog-nav");
const groups = [...document.querySelectorAll(".catalog-group")];

function updateCategory() {
  const threshold = nav.getBoundingClientRect().bottom + 24;
  let active = "#all-courses";

  if (catalog.getBoundingClientRect().top <= threshold) {
    for (const group of groups) {
      if (group.getBoundingClientRect().top <= threshold) active = `#${group.id}`;
      else break;
    }
  }

  categoryLinks.forEach(link => {
    if (link.getAttribute("href") === active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
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

