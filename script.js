(() => {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const visiblePage = () => document.visibilityState === "visible";
  const island = document.getElementById("site-nav");
  const dropdowns = [...document.querySelectorAll(".nav-dropdown")];

  /* Dynamic Island navigation */
  if (island) {
    let activeDropdown = null;
    let closeTimer = null;

    const setIslandState = (expanded) => {
      island.classList.toggle("is-expanded", expanded);
      island.classList.toggle("is-active", expanded);
    };

    const closeDropdowns = () => {
      dropdowns.forEach(d => {
        d.classList.remove("is-open");
        const menu = d.querySelector(".nav-dropdown-menu");
        const trigger = d.querySelector(".nav-dropdown-trigger");
        if (menu) {
          menu.style.removeProperty("opacity");
          menu.style.removeProperty("visibility");
          menu.style.removeProperty("pointer-events");
        }
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
      activeDropdown = null;
      setIslandState(false);
    };

    const openDropdown = (dropdown) => {
      if (closeTimer) clearTimeout(closeTimer);
      dropdowns.forEach(d => {
        const isTarget = d === dropdown;
        d.classList.toggle("is-open", isTarget);
        const menu = d.querySelector(".nav-dropdown-menu");
        const trigger = d.querySelector(".nav-dropdown-trigger");
        if (menu && isTarget) {
          menu.style.setProperty("opacity", "1", "important");
          menu.style.setProperty("visibility", "visible", "important");
          menu.style.setProperty("pointer-events", "auto", "important");
        }
        if (trigger) trigger.setAttribute("aria-expanded", isTarget ? "true" : "false");
      });
      activeDropdown = dropdown;
      setIslandState(true);
    };

    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector(".nav-dropdown-trigger");
      if (!trigger) return;

      dropdown.addEventListener("mouseenter", () => {
        if (window.matchMedia("(hover: hover)").matches) openDropdown(dropdown);
      });
      dropdown.addEventListener("mouseleave", () => {
        if (window.matchMedia("(hover: hover)").matches) {
          closeTimer = window.setTimeout(closeDropdowns, 160);
        }
      });

      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const servicesIndex = window.location.pathname.includes("/services/")
          ? "index.html"
          : "services/index.html";
        window.location.href = servicesIndex;
      });

    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest("#site-nav")) closeDropdowns();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDropdowns();
        island.querySelector(".nav-dropdown-trigger[aria-expanded='true']")?.focus();
      }
    });

    island.querySelectorAll(".nav-dropdown-menu a").forEach(link => {
      link.addEventListener("click", closeDropdowns);
    });

    /* Touch-friendly: keep the island expanded while interacting with a menu. */
    island.addEventListener("mouseenter", () => island.classList.add("is-hovered"));
    island.addEventListener("mouseleave", () => island.classList.remove("is-hovered"));
  }

  /* Scroll compression, like the Dynamic Island becoming a compact control. */
  if (island && !reduce) {
    let ticking = false;
    let previousScroll = window.scrollY;
    let downwardTravel = 0;
    let upwardTravel = 0;
    let navHidden = false;
    const updateNav = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - previousScroll;
      if (currentScroll <= 42) {
        downwardTravel = 0;
        upwardTravel = 0;
        navHidden = false;
      } else if (delta > 0) {
        downwardTravel += delta;
        upwardTravel = 0;
        if (!navHidden && downwardTravel >= 90) navHidden = true;
      } else if (delta < 0) {
        upwardTravel += Math.abs(delta);
        downwardTravel = 0;
        if (navHidden && upwardTravel >= 45) navHidden = false;
      }
      island.classList.toggle("is-scrolled", currentScroll > 42);
      island.classList.toggle("is-hidden", navHidden);
      island.classList.toggle("is-returning", !navHidden && delta < 0);
      previousScroll = currentScroll;
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    }, { passive: true });
    updateNav();
  }

  /* Magnetic buttons/links */
  const hasGSAP = typeof window.gsap !== "undefined";
  if (hasGSAP && !reduce && window.matchMedia("(min-width: 851px)").matches) {
    document.querySelectorAll("[data-magnetic]").forEach(el => {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.12;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.12;
        gsap.to(el, { x: dx, y: dy, duration: .28, ease: "power2.out", overwrite: true });
      });
      el.addEventListener("pointerleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: .5, ease: "elastic.out(1,.45)", overwrite: true });
      });
    });
  }

  /* Existing custom cursor */
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  const finePointer = window.matchMedia("(pointer: fine)");
  const useCustomCursor = dot && ring && !reduce && finePointer.matches;
  document.body.style.cursor = useCustomCursor ? "none" : "auto";
  if (useCustomCursor) {
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    window.addEventListener("pointermove", e => { x = e.clientX; y = e.clientY; }, { passive: true });
    const cursorLoop = () => {
      if (!visiblePage()) return;
      rx += (x - rx) * .16;
      ry += (y - ry) * .16;
      dot.style.left = x + "px";
      dot.style.top = y + "px";
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(cursorLoop);
    };
    requestAnimationFrame(cursorLoop);
    document.addEventListener("visibilitychange", () => {
      if (visiblePage() && !reduce) requestAnimationFrame(cursorLoop);
    }, { passive: true });
    document.addEventListener("mouseover", event => {
      if (event.target.closest("a, button, [data-magnetic]")) document.body.classList.add("hovering");
    }, { passive: true });
    document.addEventListener("mouseout", event => {
      if (event.relatedTarget && event.relatedTarget.closest?.("a, button, [data-magnetic]")) return;
      if (event.target.closest("a, button, [data-magnetic]")) document.body.classList.remove("hovering");
    }, { passive: true });
  } else {
    if (dot) dot.style.display = "none";
    if (ring) ring.style.display = "none";
  }

  finePointer.addEventListener?.("change", event => {
    document.body.style.cursor = event.matches && !reduce ? "none" : "auto";
    if (dot) dot.style.display = event.matches && !reduce ? "block" : "none";
    if (ring) ring.style.display = event.matches && !reduce ? "block" : "none";
  });

  /* Existing cinematic canvas */
  const canvas = document.getElementById("cinematic-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1, nodes = [];
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = Array.from({ length: reduce ? 25 : 70 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        v: (Math.random() - .5) * .12
      }));
    };
    resize();
    addEventListener("resize", resize, { passive: true });
    const draw = () => {
      if (!visiblePage()) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = .22;
      nodes.forEach((n, i) => {
        if (!reduce) n.y += n.v;
        if (n.y > h + 10) n.y = -10;
        ctx.fillStyle = "#fff";
        ctx.fillRect(n.x, n.y, 1, 1);
        if (i % 7 === 0 && !reduce) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n.x + 28, n.y);
          ctx.strokeStyle = "rgba(255,255,255,.07)";
          ctx.stroke();
        }
      });
      if (!reduce) requestAnimationFrame(draw);
    };
    draw();
    document.addEventListener("visibilitychange", () => {
      if (visiblePage() && !reduce) requestAnimationFrame(draw);
    }, { passive: true });
  }

  /* Shared ambient layer: interactive dots plus bokeh on alternating sections. */
  const ambientCanvas = document.createElement("canvas");
  ambientCanvas.className = "ambient-dot-field";
  ambientCanvas.setAttribute("aria-hidden", "true");
  document.body.prepend(ambientCanvas);
  const ambientContext = ambientCanvas.getContext("2d");
  const pointer = { x: innerWidth / 2, y: innerHeight / 2, active: false };
  let ambientWidth = 0;
  let ambientHeight = 0;
  let ambientDpr = 1;
  let ambientDots = [];

  const resizeAmbientLayer = () => {
    ambientDpr = Math.min(devicePixelRatio || 1, 2);
    ambientWidth = innerWidth;
    ambientHeight = innerHeight;
    ambientCanvas.width = ambientWidth * ambientDpr;
    ambientCanvas.height = ambientHeight * ambientDpr;
    ambientCanvas.style.width = ambientWidth + "px";
    ambientCanvas.style.height = ambientHeight + "px";
    ambientContext.setTransform(ambientDpr, 0, 0, ambientDpr, 0, 0);
    ambientDots = Array.from({ length: reduce ? 42 : 110 }, () => ({
      x: Math.random() * ambientWidth,
      y: Math.random() * ambientHeight,
      size: Math.random() * 1.35 + .35,
      speed: Math.random() * .16 + .04,
      phase: Math.random() * Math.PI * 2
    }));
  };

  const addAmbientBokeh = () => {
    document.querySelectorAll("section:nth-of-type(even)").forEach(section => {
      if (section.querySelector(":scope > .ambient-bokeh")) return;
      const bokeh = document.createElement("div");
      bokeh.className = "ambient-bokeh";
      bokeh.setAttribute("aria-hidden", "true");
      section.prepend(bokeh);
    });
  };

  const drawAmbientLayer = time => {
    ambientContext.clearRect(0, 0, ambientWidth, ambientHeight);
    ambientDots.forEach(dot => {
      if (!reduce) dot.y -= dot.speed;
      if (dot.y < -4) dot.y = ambientHeight + 4;
      const dx = pointer.x - dot.x;
      const dy = pointer.y - dot.y;
      const distance = Math.max(Math.hypot(dx, dy), 1);
      const influence = pointer.active ? Math.max(0, 1 - distance / 180) : 0;
      const x = dot.x - (dx / distance) * influence * 10;
      const y = dot.y - (dy / distance) * influence * 10;
      const alpha = .22 + Math.sin(time * .0015 + dot.phase) * .08 + influence * .3;
      ambientContext.fillStyle = `rgba(255,255,255,${alpha})`;
      ambientContext.beginPath();
      ambientContext.arc(x, y, dot.size + influence * 1.2, 0, Math.PI * 2);
      ambientContext.fill();
    });
    if (!reduce && visiblePage()) requestAnimationFrame(drawAmbientLayer);
  };

  resizeAmbientLayer();
  addAmbientBokeh();
  addEventListener("resize", resizeAmbientLayer, { passive: true });
  const updateAmbientPointer = (x, y) => {
    pointer.x = x;
    pointer.y = y;
    pointer.active = true;
  };
  addEventListener("pointermove", event => {
    updateAmbientPointer(event.clientX, event.clientY);
  }, { passive: true });
  addEventListener("touchmove", event => {
    const touch = event.touches[0];
    if (touch) updateAmbientPointer(touch.clientX, touch.clientY);
  }, { passive: true });
  addEventListener("touchend", () => { pointer.active = false; }, { passive: true });
  addEventListener("touchcancel", () => { pointer.active = false; }, { passive: true });
  addEventListener("blur", () => { pointer.active = false; });
  requestAnimationFrame(drawAmbientLayer);
  document.addEventListener("visibilitychange", () => {
    if (visiblePage() && !reduce) requestAnimationFrame(drawAmbientLayer);
  }, { passive: true });

  /* Mobile-only capability carousel. */
  const servicesCarousel = document.querySelector(".services-carousel");
  const mobileCarousel = window.matchMedia("(max-width: 767px)");
  if (servicesCarousel && mobileCarousel.matches && !reduce) {
    const serviceCards = [...servicesCarousel.querySelectorAll(".practice-card")];
    let activeService = 0;
    let carouselTimer = 0;
    const startCarousel = () => {
      if (!carouselTimer && visiblePage()) carouselTimer = window.setInterval(() => showService((activeService + 1) % serviceCards.length), 5000);
    };
    const stopCarousel = () => {
      if (carouselTimer) window.clearInterval(carouselTimer);
      carouselTimer = 0;
    };

    const showService = nextIndex => {
      const currentCard = serviceCards[activeService];
      const nextCard = serviceCards[nextIndex];
      currentCard.classList.remove("is-active");
      currentCard.classList.add("is-previous");
      nextCard.classList.add("is-active");
      serviceCards.forEach((card, index) => card.setAttribute("aria-hidden", index === nextIndex ? "false" : "true"));
      serviceCards.forEach((card, index) => {
        if (index === nextIndex) card.removeAttribute("tabindex");
        else card.setAttribute("tabindex", "-1");
      });
      activeService = nextIndex;
      window.setTimeout(() => currentCard.classList.remove("is-previous"), 750);
    };

    serviceCards.forEach((card, index) => {
      card.setAttribute("aria-hidden", index === 0 ? "false" : "true");
      if (index !== 0) card.setAttribute("tabindex", "-1");
    });
    serviceCards[0].classList.add("is-active");
    startCarousel();

    servicesCarousel.addEventListener("mouseenter", stopCarousel);
    servicesCarousel.addEventListener("mouseleave", startCarousel);
    document.addEventListener("visibilitychange", () => visiblePage() ? startCarousel() : stopCarousel(), { passive: true });
  }

  /* Ranked capability search for the services index page. */
  const serviceSearch = document.querySelector("#service-search");
  if (serviceSearch) {
    const serviceGrid = document.querySelector("main .grid");
    const keywordMap = {
      "technology consulting": "strategy architecture assessment roadmap transformation advisory decisions",
      "technology solutions": "engineering implementation integration modernization platforms systems build",
      "automation": "workflow process operations repetitive manual connect systems productivity",
      "artificial intelligence": "ai machine learning intelligent adoption models assistants data",
      "cybersecurity": "security cloud identity privacy risk resilience protection threat compliance",
      "emerging technologies": "research innovation evaluation future experimentation autonomous technology"
    };
    const categoryMap = {
      "technology consulting": "consulting",
      "technology solutions": "engineering",
      "automation": "automation",
      "artificial intelligence": "ai",
      "cybersecurity": "security",
      "emerging technologies": "emerging"
    };
    const serviceCards = serviceGrid ? [...serviceGrid.querySelectorAll(":scope > a")].map((card, index) => ({
      card,
      index,
      title: card.querySelector("h2")?.textContent.toLowerCase() || "",
      description: card.querySelector("p")?.textContent.toLowerCase() || "",
      category: categoryMap[card.querySelector("h2")?.textContent.toLowerCase()] || "",
      keywords: (card.dataset.keywords || keywordMap[card.querySelector("h2")?.textContent.toLowerCase()] || "").toLowerCase().split(/\s+/)
    })) : [];
    const resultCount = document.querySelector("#service-result-count");
    const resultStatus = document.querySelector("#service-search-status");
    const categorySelect = document.querySelector("#service-category");
    const categoryTags = [...document.querySelectorAll(".service-category-tag")];
    let activeCategory = "all";
    const normalize = value => value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
    const scoreCard = (item, tokens) => tokens.reduce((score, token) => {
      if (item.title.split(/\s+/).includes(token)) return score + 20;
      if (item.title.includes(token)) return score + 12;
      if (item.keywords.includes(token)) return score + 10;
      if (item.description.includes(token)) return score + 3;
      if (item.keywords.some(keyword => keyword.startsWith(token) || token.startsWith(keyword))) return score + 5;
      return score;
    }, 0);
    const renderResults = () => {
      const tokens = normalize(serviceSearch.value).split(/\s+/).filter(Boolean);
      const ranked = serviceCards.map(item => ({ item, score: tokens.length ? scoreCard(item, tokens) : 0 }))
        .sort((a, b) => b.score - a.score || a.item.index - b.item.index);
      ranked.forEach(({ item, score }) => {
        const visible = (activeCategory === "all" || item.category === activeCategory) && (!tokens.length || score > 0);
        item.card.hidden = !visible;
        serviceGrid.appendChild(item.card);
      });
      const visibleCount = ranked.filter(result => !result.item.card.hidden).length;
      if (resultCount) resultCount.textContent = `${visibleCount} / ${serviceCards.length}`;
      if (resultStatus) resultStatus.textContent = tokens.length || activeCategory !== "all" ? `${visibleCount} matching capabilities` : "Six capabilities available";
    };
    serviceSearch.addEventListener("input", renderResults, { passive: true });
    categorySelect?.addEventListener("change", event => {
      activeCategory = event.target.value;
      categoryTags.forEach(tag => tag.classList.toggle("is-active", tag.dataset.category === activeCategory));
      renderResults();
    });
    categoryTags.forEach(tag => tag.addEventListener("click", () => {
      activeCategory = tag.dataset.category;
      if (categorySelect) categorySelect.value = activeCategory;
      categoryTags.forEach(item => item.classList.toggle("is-active", item === tag));
      renderResults();
    }));
    renderResults();
  }

  /* Keep the original GSAP page effects intact when the homepage has them. */
  if (!hasGSAP) return;

  if (!reduce) {
    gsap.to(".rev-up", { y: 0, duration: 1.1, stagger: .1, ease: "power4.out", delay: .15 });
    gsap.to(".hero-desc,.hero-actions", { y: 0, opacity: 1, duration: .9, stagger: .08, ease: "power3.out", delay: .55 });
  } else {
    document.querySelectorAll(".rev-up").forEach(el => el.style.transform = "translateY(0)");
    document.querySelectorAll(".hero-desc,.hero-actions").forEach(el => el.style.opacity = "1");
    document.querySelectorAll(".reveal,.step-content").forEach(el => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";
  if (hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    if (!reduce) {
      gsap.to(".hero-content", {
        y: -80, opacity: .25, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
      });
      gsap.to(".scroll-indicator", {
        opacity: 0, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "25% top", scrub: true }
      });

      gsap.utils.toArray(".about-item, .practice-card, #industries .grid > div, #insights article")
        .filter(el => !(mobileCarousel.matches && el.closest(".services-carousel")))
        .forEach((el, i) => {
        gsap.from(el, {
          y: 40, opacity: 0, duration: .8, delay: (i % 6) * .05, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true }
        });
      });

      gsap.utils.toArray(".practice-card").forEach(card => {
        let cardBounds;
        card.addEventListener("pointerenter", () => { cardBounds = card.getBoundingClientRect(); }, { passive: true });
        card.addEventListener("pointermove", e => {
          const r = cardBounds || card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - .5;
          const py = (e.clientY - r.top) / r.height - .5;
          gsap.to(card, { rotationY: px * 5, rotationX: -py * 5, scale: 1.015, duration: .35, ease: "power2.out", overwrite: true });
        });
        card.addEventListener("pointerleave", () => {
          cardBounds = null;
          gsap.to(card, { rotationY: 0, rotationX: 0, scale: 1, duration: .5, ease: "power3.out" });
        });
      });

      const path = document.getElementById("circuit-path-fill");
      const steps = gsap.utils.toArray(".meth-step");
      if (path) {
        gsap.to(path, {
          height: "100%", ease: "none",
          scrollTrigger: { trigger: "#approach", start: "top 35%", end: "bottom 70%", scrub: true }
        });
      }
      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step, start: "top 62%", end: "bottom 38%",
          onEnter: () => activate(i), onEnterBack: () => activate(i)
        });
      });
      function activate(i) {
        steps.forEach((s, j) => {
          const c = s.querySelector(".circuit-node");
          const t = s.querySelector(".step-content");
          if (c) c.classList.toggle("active", j === i);
          if (t) gsap.to(t, { opacity: j === i ? 1 : .2, duration: .45 });
        });
      }

      /* Lenis smooth scrolling, if present. */
      if (typeof window.Lenis !== "undefined") {
        const lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(t => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(1000, 16);
        document.querySelectorAll('a[href^="#"]').forEach(a => {
          a.addEventListener("click", e => {
            const target = document.querySelector(a.getAttribute("href"));
            if (target) {
              e.preventDefault();
              lenis.scrollTo(target, { offset: -20, duration: 1.2 });
            }
          });
        });
      }
    }
  }
})();