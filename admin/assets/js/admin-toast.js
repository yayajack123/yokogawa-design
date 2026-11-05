(() => {
  'use strict';
  const region = document.createElement('div');
  region.className = 'toast-region toast-region--bottom-end';
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-atomic', 'true');
  region.innerHTML = '<div class="toast toast--success admin-toast" data-state="closed"><span class="toast__icon" aria-hidden="true">✓</span><div class="toast__content"><p class="toast__header"></p><p class="toast__body"></p></div><button class="toast__close" type="button" aria-label="Dismiss notification">×</button></div>';
  document.body.append(region);
  const toast = region.firstElementChild;
  const title = toast.querySelector('.toast__header');
  const body = toast.querySelector('.toast__body');
  let timer;
  const hide = () => { clearTimeout(timer); toast.dataset.state = 'closed'; };
  const schedule = () => {
    clearTimeout(timer);
    if (toast.dataset.state === 'open' && !toast.matches(':hover') && !toast.contains(document.activeElement)) timer = setTimeout(hide, 4500);
  };
  toast.querySelector('.toast__close').addEventListener('click', hide);
  toast.addEventListener('mouseenter', () => clearTimeout(timer));
  toast.addEventListener('mouseleave', schedule);
  toast.addEventListener('focusin', () => clearTimeout(timer));
  toast.addEventListener('focusout', () => setTimeout(schedule, 0));
  window.adminToast = (heading, message = '') => {
    title.textContent = heading;
    body.textContent = message;
    body.hidden = !message;
    toast.dataset.state = 'open';
    schedule();
  };
})();
