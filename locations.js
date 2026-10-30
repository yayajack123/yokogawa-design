(() => {
  const section = document.querySelector('.locations-section');
  if (!section) return;

  const map = section.querySelector('.locations-map');
  const national = section.querySelector('.locations-map-national');
  const region = section.querySelector('.locations-map-region');
  const jakartaPin = section.querySelector('.location-marker--jakarta');
  const cilegonPin = section.querySelector('.location-marker--cilegon');
  const back = section.querySelector('.locations-map-back');
  const regionalEntries = [jakartaPin, cilegonPin].filter(Boolean);
  const controls = [...section.querySelectorAll('[data-location]')];
  const panels = [...section.querySelectorAll('[data-location-panel]')];
  const motionAllowed = () => window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const refresh = () => { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); };
  let selectedLocation = 'jakarta';
  let zooming = false;

  if ('IntersectionObserver' in window && map) {
    const observer = new IntersectionObserver(([entry]) => {
      section.dataset.mapVisible = String(entry.isIntersecting);
    }, { threshold: 0.1 });
    observer.observe(map);
  }

  const selectLocation = (id, animate = false) => {
    const active = panels.find((panel) => panel.dataset.locationPanel === id);
    if (!active) return;
    selectedLocation = id;
    panels.forEach((panel) => { panel.hidden = panel !== active; });
    controls.forEach((control) => {
      if (control.dataset.location === id) control.setAttribute('aria-current', 'true');
      else control.removeAttribute('aria-current');
    });
    if (animate && motionAllowed()) {
      window.gsap.killTweensOf(active);
      window.gsap.fromTo(active, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out', clearProps: 'transform,opacity' });
    }
    refresh();
  };

  const showRegion = (origin) => {
    if (!national || !region || !back || zooming || !region.hidden) return;
    zooming = true;
    regionalEntries.forEach((pin) => pin.setAttribute('aria-expanded', 'true'));
    const finish = () => {
      national.hidden = true;
      region.hidden = false;
      back.hidden = false;
      map.classList.add('is-region');
      if (window.gsap) window.gsap.set(national, { clearProps: 'transform,opacity' });
      if (motionAllowed()) window.gsap.fromTo(region, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out', clearProps: 'transform,opacity' });
      const selectedPin = region.querySelector(`[data-location="${origin.dataset.location}"]`);
      if (selectedPin) selectedPin.focus({ preventScroll: true });
      zooming = false;
      refresh();
    };
    const originPosition = origin === cilegonPin ? '23.6% 72.2%' : '25% 74.6%';
    if (motionAllowed()) window.gsap.to(national, { scale: 2.2, opacity: 0, transformOrigin: originPosition, duration: 0.35, ease: 'power2.inOut', onComplete: finish });
    else finish();
  };

  const showIndonesia = () => {
    if (zooming || !region || !national) return;
    region.hidden = true;
    national.hidden = false;
    back.hidden = true;
    map.classList.remove('is-region');
    regionalEntries.forEach((pin) => pin.setAttribute('aria-expanded', 'false'));
    const target = selectedLocation === 'cilegon' ? cilegonPin : jakartaPin;
    if (target) {
      selectLocation(target.dataset.location);
      target.focus({ preventScroll: true });
    }
    if (motionAllowed()) window.gsap.fromTo(national, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out', clearProps: 'transform,opacity' });
    refresh();
  };

  controls.forEach((control) => {
    const activate = (event) => {
      event.preventDefault();
      if (zooming) return;
      selectLocation(control.dataset.location, true);
      if (regionalEntries.includes(control)) showRegion(control);
    };
    control.addEventListener('click', activate);
    control.addEventListener('keydown', (event) => {
      if (event.key === ' ') activate(event);
    });
  });
  if (region && back) {
    regionalEntries.forEach((pin) => {
      pin.setAttribute('aria-controls', 'banten-jakarta-map');
      pin.setAttribute('aria-expanded', 'false');
      pin.setAttribute('aria-label', `Zoom in to view ${pin.dataset.location === 'cilegon' ? 'Cilegon' : 'Jakarta'} and nearby offices`);
    });
    back.addEventListener('click', showIndonesia);
  }
  section.classList.add('locations-enhanced');
  selectLocation('jakarta');
})();
