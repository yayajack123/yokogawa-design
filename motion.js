(() => {
  const { gsap, ScrollTrigger, ScrollSmoother } = window;

  if (!gsap || !ScrollTrigger || !ScrollSmoother) return;

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

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

      if (desktop) {
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

      const header = document.querySelector(".site-header");

      if (header) {
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

        if (!trigger || targets.length === 0) return;

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

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        cleanups.forEach((cleanup) => cleanup());
        smoother?.kill();
        root.classList.remove("has-scroll-smoother");
        body.classList.remove("has-scroll-smoother");
      };
    },
  );

  const refreshAfterLoad = () => requestAnimationFrame(() => ScrollTrigger.refresh());

  if (document.readyState === "complete") {
    refreshAfterLoad();
  } else {
    window.addEventListener("load", refreshAfterLoad, { once: true });
  }
})();
