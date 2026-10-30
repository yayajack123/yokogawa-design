(() => {
  const { gsap } = window;
  const section = document.querySelector('.contact-section');
  const image = section?.querySelector('.contact-background img');
  if (!gsap || !section || !image) return;

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    let hovered = canHover.matches && section.matches(':hover');
    let focused = section.contains(document.activeElement);
    const zoom = gsap.to(image, {
      scale: 1.04,
      duration: 0.9,
      ease: 'power2.inOut',
      force3D: true,
      paused: true,
    });
    section.classList.add('gsap-cta-ready');

    const update = () => (hovered || focused ? zoom.play() : zoom.reverse());
    const enter = () => { if (canHover.matches) { hovered = true; update(); } };
    const leave = () => { hovered = false; update(); };
    const focusIn = () => { focused = true; update(); };
    const focusOut = (event) => {
      focused = section.contains(event.relatedTarget);
      update();
    };

    section.addEventListener('pointerenter', enter);
    section.addEventListener('pointerleave', leave);
    section.addEventListener('focusin', focusIn);
    section.addEventListener('focusout', focusOut);
    update();

    return () => {
      section.removeEventListener('pointerenter', enter);
      section.removeEventListener('pointerleave', leave);
      section.removeEventListener('focusin', focusIn);
      section.removeEventListener('focusout', focusOut);
      section.classList.remove('gsap-cta-ready');
    };
  });
})();
