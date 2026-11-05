(() => {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const sections = document.querySelectorAll('.why-us, .contact-section, .contact-page-section');
    sections.forEach((section) => {
      const image = section.querySelector('.why-us-background img, .contact-background img, .contact-page-image');
      if (!image) return;
      const distance = section.classList.contains('contact-page-section') ? 4 : 20;
      section.classList.add('has-background-parallax');
      gsap.fromTo(image, { yPercent: -distance }, {
        yPercent: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => sections.forEach((section) => section.classList.remove('has-background-parallax'));
  });
})();
