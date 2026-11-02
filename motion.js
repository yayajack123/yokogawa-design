(() => {
  const { gsap, ScrollTrigger, ScrollSmoother } = window;

  if (!gsap) return;

  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (ScrollTrigger && ScrollSmoother) gsap.registerPlugin(ScrollSmoother);

  const root = document.documentElement;
  const body = document.body;
  const media = gsap.matchMedia();

  media.add(
    {
      desktop: "(min-width: 1025px)",
      mobile: "(max-width: 1024px)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { desktop, reduceMotion } = context.conditions;

      if (reduceMotion) return;

      let smoother = null;
      const cleanups = [];

      if (desktop && !body.classList.contains("courses-page") && !body.classList.contains("course-detail-page") && ScrollTrigger && ScrollSmoother && document.querySelector("#smooth-wrapper") && document.querySelector("#smooth-content")) {
        root.classList.add("has-scroll-smoother");
        body.classList.add("has-scroll-smoother");

        try {
          smoother = ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 0.7,
            smoothTouch: 0,
            effects: true,
          });
        } catch {
          root.classList.remove("has-scroll-smoother");
          body.classList.remove("has-scroll-smoother");
        }
      }

      if (smoother) {
        const findAnchor = (hash) => {
          try { return hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null; }
          catch { return null; }
        };
        const scrollToTarget = (target) => {
          const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
          const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
          smoother.scrollTo(Math.max(0, smoother.offset(target, "top top") - margin - padding), false);
        };
        const scrollToHash = () => {
          const target = findAnchor(window.location.hash);
          if (target) scrollToTarget(target);
        };
        const handleAnchor = (event) => {
          const link = event.target.closest("a[href]");
          if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
          const url = new URL(link.href, window.location.href);
          if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
          const target = findAnchor(url.hash);
          if (!target) return;
          event.preventDefault();
          history.pushState(null, "", url.hash);
          scrollToTarget(target);
          if (link.classList.contains("skip-link")) {
            if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
          }
        };
        document.addEventListener("click", handleAnchor);
        window.addEventListener("popstate", scrollToHash);
        if (document.readyState === "complete") requestAnimationFrame(scrollToHash);
        else window.addEventListener("load", scrollToHash, { once: true });
        cleanups.push(() => {
          document.removeEventListener("click", handleAnchor);
          window.removeEventListener("popstate", scrollToHash);
          window.removeEventListener("load", scrollToHash);
        });
      }

      const header = document.querySelector(".site-header");

      if (header && ScrollTrigger && !body.classList.contains("courses-page") && !body.classList.contains("course-detail-page")) {
        const headerTween = gsap.to(header, {
          yPercent: -110,
          duration: 0.24,
          ease: "power2.out",
          paused: true,
        });
        let headerHidden = false;
        let previousScroll = window.scrollY;
        let accumulatedScroll = 0;
        let lastDirection = 0;

        const setHeaderHidden = (hidden) => {
          if (hidden === headerHidden) return;
          headerHidden = hidden;
          if (hidden) headerTween.play();
          else headerTween.reverse();
        };

        const headerTrigger = ScrollTrigger.create({
          trigger: document.documentElement,
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const currentScroll = self.scroll();
            const delta = currentScroll - previousScroll;
            previousScroll = currentScroll;

            if (currentScroll <= header.offsetHeight || header.matches(":focus-within")) {
              accumulatedScroll = 0;
              lastDirection = 0;
              setHeaderHidden(false);
              return;
            }

            if (delta === 0) return;

            const direction = delta > 0 ? 1 : -1;
            accumulatedScroll = direction === lastDirection ? accumulatedScroll + delta : delta;
            lastDirection = direction;

            if (direction > 0 && accumulatedScroll >= 12) {
              setHeaderHidden(true);
            } else if (direction < 0 && accumulatedScroll <= -8) {
              setHeaderHidden(false);
            }
          },
        });

        const showHeaderOnFocus = () => {
          accumulatedScroll = 0;
          lastDirection = 0;
          setHeaderHidden(false);
        };

        header.addEventListener("focusin", showHeaderOnFocus);
        cleanups.push(() => {
          header.removeEventListener("focusin", showHeaderOnFocus);
          headerTrigger.kill();
        });
      }

      const addReveal = (triggerSelector, targetSelectors) => {
        const trigger = document.querySelector(triggerSelector);
        const targets = targetSelectors.flatMap((selector) =>
          Array.from(document.querySelectorAll(selector)),
        );

        if (!ScrollTrigger || !trigger || targets.length === 0) return;

        if (trigger.getBoundingClientRect().bottom < 0) {
          gsap.set(targets, { autoAlpha: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger,
              start: "top 84%",
              once: true,
            },
          },
        );
      };

      addReveal("#about-us", [
        ".about-intro",
        ".about-benefits",
        ".about-content > .button",
      ]);
      addReveal("#why-us", [".why-us-intro", ".benefit-card"]);
      addReveal("#locations", [".locations-heading", ".locations-layout"]);
      addReveal(".schedule-section", [".schedule-intro"]);
      addReveal(".faq-page-content", [".faq-page-intro"]);
      document.querySelectorAll(".contact-page-section").forEach((section) => {
        const targets = section.querySelectorAll(".contact-page-image, .contact-page-copy");
        if (!ScrollTrigger || !targets.length || section.getBoundingClientRect().bottom < 0) return;
        gsap.fromTo(targets, { autoAlpha: 0, y: 16 }, {
          autoAlpha: 1, y: 0, duration: 0.55, ease: "expo.out", stagger: 0.08,
          scrollTrigger: { trigger: section, start: "top 84%", once: true },
        });
      });

      document.querySelectorAll(".faq-item").forEach((item) => {
        const summary = item.querySelector("summary");
        const answer = item.querySelector(".faq-answer");

        if (!summary || !answer) return;

        let expanded = item.open;

        const handleActivation = (event) => {
          event.preventDefault();

          const opening = !expanded;
          const reversingClose = opening && item.open;
          const currentHeight = answer.getBoundingClientRect().height;
          const currentOpacity = Number(gsap.getProperty(answer, "opacity"));
          const opacity = Number.isFinite(currentOpacity) ? currentOpacity : 1;
          expanded = opening;

          context.add(() => {
            gsap.killTweensOf(answer);

            if (opening) {
              item.open = true;
              gsap.fromTo(
                answer,
                {
                  height: reversingClose ? currentHeight : 0,
                  autoAlpha: reversingClose ? opacity : 0,
                },
                {
                  height: "auto",
                  autoAlpha: 1,
                  duration: 0.22,
                  ease: "power2.out",
                  overwrite: "auto",
                },
              );
              return;
            }

            gsap.to(answer, {
              height: 0,
              autoAlpha: 0,
              duration: 0.18,
              ease: "power2.in",
              overwrite: "auto",
              onComplete: () => {
                if (expanded) return;
                item.open = false;
                gsap.set(answer, { clearProps: "height,opacity,visibility" });
              },
            });
          });
        };

        summary.addEventListener("click", handleActivation);
        cleanups.push(() => {
          summary.removeEventListener("click", handleActivation);
          item.open = expanded;
          gsap.set(answer, { clearProps: "height,opacity,visibility" });
        });
      });

      if (ScrollTrigger) requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        cleanups.forEach((cleanup) => cleanup());
        smoother?.kill();
        root.classList.remove("has-scroll-smoother");
        body.classList.remove("has-scroll-smoother");
      };
    },
  );

  const refreshAfterLoad = () => { if (ScrollTrigger) requestAnimationFrame(() => ScrollTrigger.refresh()); };

  if (document.readyState === "complete") {
    refreshAfterLoad();
  } else {
    window.addEventListener("load", refreshAfterLoad, { once: true });
  }
})();

// Keep <details> open until its exit animation finishes.
(() => {
  const menu = document.querySelector('.mobile-menu');
  if (!menu) return;
  const toggle = menu.querySelector('summary');
  const panel = menu.querySelector('.mobile-nav');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 1025px)');
  let tween;
  let expanded = menu.open;
  function setMenu(open, instant = false) {
    expanded = open;
    tween?.kill();
    toggle.setAttribute('aria-expanded', String(open));
    if (open) menu.open = true;
    const finish = () => {
      menu.open = open;
      panel.style.removeProperty('transform');
      panel.style.removeProperty('opacity');
    };
    if (!window.gsap || reduce.matches || instant) { finish(); return; }
    if (open) {
      if (!panel.style.opacity) gsap.set(panel, { y: -16, opacity: 0 });
      tween = gsap.to(panel, { y: 0, opacity: 1, duration: 0.28,
        ease: 'power2.out', overwrite: true, onComplete: finish });
    } else {
      if (panel.contains(document.activeElement)) toggle.focus({ preventScroll: true });
      tween = gsap.to(panel, { y: -12, opacity: 0, duration: 0.18,
        ease: 'power2.out', overwrite: true, onComplete: finish });
    }
  }
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.addEventListener('click', event => { event.preventDefault(); setMenu(!expanded); });
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) { event.preventDefault(); setMenu(false); toggle.focus(); }
  });
  panel.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false, true);
  });
  desktop.addEventListener('change', () => { if (desktop.matches) setMenu(false, true); });
  reduce.addEventListener('change', () => { if (reduce.matches) setMenu(expanded, true); });
})();
