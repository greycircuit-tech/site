/* ==========================================================================
   GREY CIRCUIT TECHNOLOGIES — FRONTEND INTERACTION ENGINE (script.js)
   Zero-dependency Vanilla ES6+ runtime for index.html and all sub-pages.
   ========================================================================== */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  /* ------------------------------------------------------------------------
     1. CUSTOM CONTRAST CURSOR & MAGNETIC MICRO-INTERACTIONS
     ------------------------------------------------------------------------ */
  function initCursorAndMagnetic() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring || !isFinePointer) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      document.documentElement.style.setProperty('--mx', `${mouseX}px`);
      document.documentElement.style.setProperty('--my', `${mouseY}px`);
    }, { passive: true });

    const renderLoop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderLoop);
    };
    requestAnimationFrame(renderLoop);

    const interactiveSelectors = 'a, button, input, textarea, select, .practice-card, .project-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.add('hovering');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.remove('hovering');
      }
    });

    if (!prefersReducedMotion) {
      document.querySelectorAll('[data-magnetic]').forEach((el) => {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
          const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
          el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = '';
        });
      });
    }
  }

  /* ------------------------------------------------------------------------
     2. DYNAMIC ISLAND HEADER, DROPDOWN, ACTIVE SECTION SPY & MOBILE DRAWER
     ------------------------------------------------------------------------ */
  function initNavigation() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    // Dropdown menu toggle
    const dropdowns = nav.querySelectorAll('.nav-dropdown');
    const closeAllDropdowns = () => {
      dropdowns.forEach((dd) => {
        dd.classList.remove('is-open');
        dd.querySelector('.nav-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
      });
    };

    dropdowns.forEach((dd) => {
      const trigger = dd.querySelector('.nav-dropdown-trigger');
      trigger?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dd.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(isOpen));
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) closeAllDropdowns();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllDropdowns();
    });

    // Scroll behavior: compact island + hide on fast downward scroll
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      nav.classList.toggle('is-scrolled', currentY > 40);

      if (currentY > 280 && currentY - lastScrollY > 14) {
        nav.classList.add('is-hidden');
        closeAllDropdowns();
      } else if (lastScrollY - currentY > 10 || currentY < 120) {
        nav.classList.remove('is-hidden');
      }
      lastScrollY = currentY;
    }, { passive: true });

    // Active section tracking via IntersectionObserver
    const sectionLinks = new Map();
    nav.querySelectorAll('[data-nav-section]').forEach((link) => {
      sectionLinks.set(link.getAttribute('data-nav-section'), link);
    });

    if ('IntersectionObserver' in window && sectionLinks.size > 0) {
      const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section') || entry.target.id;
            sectionLinks.forEach((l, key) => l.classList.toggle('is-active-section', key === id));
          }
        });
      }, { rootMargin: '-35% 0px -55% 0px' });

      document.querySelectorAll('section[id]').forEach((sec) => spyObserver.observe(sec));
    }

    // Mobile slide-out drawer
    const drawerToggle = document.getElementById('mobile-drawer-toggle');
    const drawerClose = document.getElementById('mobile-drawer-close');
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');

    if (drawerToggle && drawer && backdrop) {
      const setDrawerState = (open) => {
        drawer.classList.toggle('is-open', open);
        drawer.setAttribute('aria-hidden', String(!open));
        drawerToggle.setAttribute('aria-expanded', String(open));
        backdrop.hidden = !open;
        document.body.style.overflow = open ? 'hidden' : '';
      };

      drawerToggle.addEventListener('click', () => setDrawerState(true));
      drawerClose?.addEventListener('click', () => setDrawerState(false));
      backdrop.addEventListener('click', () => setDrawerState(false));
      drawer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setDrawerState(false));
      });
    }
  }

  /* ------------------------------------------------------------------------
     3. SCROLL-DRIVEN REVEALS & ANIMATED METRIC COUNTERS
     ------------------------------------------------------------------------ */
  function initScrollRevealsAndCounters() {
    // Support both new `.reveal-on-scroll` and existing subpage `.project-reveal` / `.rev-up`
    document.body.classList.add('project-motion-enabled');
    const revealTargets = document.querySelectorAll('.reveal-on-scroll, .project-reveal, .project-hero-art');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach((el) => el.classList.add('is-visible'));
    } else {
      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      revealTargets.forEach((el) => revealObserver.observe(el));
    }

    // Animated Technical Telemetry Counters
    const counterEls = document.querySelectorAll('[data-counter]');
    if (counterEls.length === 0) return;

    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-counter') || '0');
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      if (prefersReducedMotion) {
        el.textContent = target.toFixed(decimals);
        return;
      }

      const duration = 1400;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = current.toFixed(decimals);
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target.toFixed(decimals);
        }
      };
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });

      counterEls.forEach((el) => counterObserver.observe(el));
    } else {
      counterEls.forEach(animateCounter);
    }
  }

  /* ------------------------------------------------------------------------
     4. EXECUTION MODEL (#approach) CIRCUIT LINE SCROLL TRACKER
     ------------------------------------------------------------------------ */
  function initCircuitTimeline() {
    const timeline = document.getElementById('circuit-timeline') || document.getElementById('approach');
    const pathFill = document.getElementById('circuit-path-fill');
    const steps = document.querySelectorAll('.meth-step');
    if (!timeline || !pathFill || steps.length === 0) return;

    const updateTimeline = () => {
      const rect = timeline.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const startOffset = viewHeight * 0.65;
      const scrolled = startOffset - rect.top;
      const percentage = Math.max(0, Math.min(100, (scrolled / rect.height) * 100));
      pathFill.style.height = `${percentage}%`;

      steps.forEach((step) => {
        const stepRect = step.getBoundingClientRect();
        const isActive = stepRect.top < viewHeight * 0.68;
        const node = step.querySelector('.circuit-node');
        const content = step.querySelector('.step-content');
        node?.classList.toggle('active', isActive);
        content?.classList.toggle('is-active', isActive);
        if (content) content.style.opacity = isActive ? '1' : '0.25';
      });
    };

    window.addEventListener('scroll', updateTimeline, { passive: true });
    window.addEventListener('resize', updateTimeline);
    updateTimeline();
  }

  /* ------------------------------------------------------------------------
     5. INTERACTIVE INQUIRY / LEAD CAPTURE FORM & JSON PAYLOAD BUILDER
     ------------------------------------------------------------------------ */
  function initLeadCaptureForm() {
    const form = document.getElementById('inquiry-form');
    if (!form) return;

    const feedbackEl = document.getElementById('form-feedback');
    const jsonPreviewEl = document.getElementById('inquiry-json-preview');
    const copyJsonBtn = document.getElementById('copy-json-btn');

    const setFieldError = (name, message) => {
      const input = form.elements[name];
      const errEl = form.querySelector(`[data-error-for="${name}"]`);
      if (input) input.classList.toggle('is-invalid', Boolean(message));
      if (errEl) errEl.textContent = message || '';
    };

    const validateAndBuildPayload = () => {
      const name = String(form.elements.name?.value || '').trim();
      const email = String(form.elements.email?.value || '').trim();
      const organization = String(form.elements.organization?.value || '').trim();
      const domain = String(form.elements.domain?.value || 'General').trim();
      const message = String(form.elements.message?.value || '').trim();

      let valid = true;
      setFieldError('name', '');
      setFieldError('email', '');
      setFieldError('message', '');

      if (name.length < 2) {
        setFieldError('name', 'Please enter your name.');
        valid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setFieldError('email', 'Please enter a valid work email address.');
        valid = false;
      }

      if (message.length < 12) {
        setFieldError('message', 'Please share a brief description of your requirement (min 12 chars).');
        valid = false;
      }

      const payload = {
        schema: 'gct.lead.inquiry.v2',
        timestamp: new Date().toISOString(),
        contact: {
          name,
          email,
          organization: organization || 'Unspecified'
        },
        engagement: {
          primary_practice: domain,
          requirement_summary: message
        },
        source: window.location.href
      };

      return { valid, payload };
    };

    copyJsonBtn?.addEventListener('click', async () => {
      const { valid, payload } = validateAndBuildPayload();
      if (!valid) {
        if (feedbackEl) {
          feedbackEl.textContent = 'Please complete the highlighted fields before generating the JSON brief.';
          feedbackEl.classList.remove('is-success');
        }
        return;
      }

      const jsonString = JSON.stringify(payload, null, 2);
      if (jsonPreviewEl) {
        jsonPreviewEl.hidden = false;
        jsonPreviewEl.textContent = jsonString;
      }

      try {
        await navigator.clipboard.writeText(jsonString);
        if (feedbackEl) {
          feedbackEl.textContent = 'Structured JSON payload copied to clipboard and displayed below.';
          feedbackEl.classList.add('is-success');
        }
      } catch {
        if (feedbackEl) {
          feedbackEl.textContent = 'Structured JSON payload prepared below.';
          feedbackEl.classList.add('is-success');
        }
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const { valid, payload } = validateAndBuildPayload();
      if (!valid) return;

      const jsonString = JSON.stringify(payload, null, 2);
      if (jsonPreviewEl) {
        jsonPreviewEl.hidden = false;
        jsonPreviewEl.textContent = jsonString;
      }

      const subject = encodeURIComponent(`[GCT Inquiry] ${payload.engagement.primary_practice} — ${payload.contact.organization}`);
      const body = encodeURIComponent(
        `Name: ${payload.contact.name}\n` +
        `Email: ${payload.contact.email}\n` +
        `Organization: ${payload.contact.organization}\n` +
        `Practice Area: ${payload.engagement.primary_practice}\n\n` +
        `Requirement:\n${payload.engagement.requirement_summary}\n\n` +
        `--- Structured Telemetry ---\n${jsonString}`
      );

      if (feedbackEl) {
        feedbackEl.textContent = 'Inquiry validated. Opening your email client with the structured brief...';
        feedbackEl.classList.add('is-success');
      }

      window.location.href = `mailto:contact@greycircuit.tech?subject=${subject}&body=${body}`;
    });
  }

  /* ------------------------------------------------------------------------
     6. SUB-PAGE SEARCH & FILTERING (services/* & projects/project.html)
     ------------------------------------------------------------------------ */
  function initSubpageDiscovery() {
    // Services sub-pages search
    const serviceSearchInput = document.querySelector('#cybersecurity-search, #automation-search, #software-search, #service-search');
    if (serviceSearchInput) {
      const cards = Array.from(document.querySelectorAll('.service-result'));
      const statusEl = document.querySelector('.service-search-status');

      const filterServices = (term) => {
        const q = term.trim().toLowerCase();
        let matches = 0;
        cards.forEach((card) => {
          const haystack = `${card.getAttribute('data-search') || ''} ${card.textContent || ''}`.toLowerCase();
          const isMatch = !q || haystack.includes(q);
          card.hidden = !isMatch;
          card.classList.toggle('is-match', Boolean(q && isMatch));
          if (isMatch) matches++;
        });
        if (statusEl) {
          statusEl.textContent = q ? `${matches} matching capability${matches === 1 ? '' : 's'} for "${term}"` : '';
        }
      };

      serviceSearchInput.addEventListener('input', (e) => filterServices(e.target.value));
      document.querySelectorAll('[data-service-term]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const term = btn.getAttribute('data-service-term') || '';
          serviceSearchInput.value = term;
          filterServices(term);
        });
      });
    }

    // Projects directory search & tag filtering
    const projectSearchInput = document.getElementById('project-search');
    if (projectSearchInput) {
      const projectCards = Array.from(document.querySelectorAll('.project-result'));
      const statusEl = document.querySelector('.project-search-status');
      const emptyEl = document.querySelector('.project-empty-state');
      let activeTag = 'all';

      const applyProjectFilters = () => {
        const q = projectSearchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        projectCards.forEach((card) => {
          const searchBlob = `${card.getAttribute('data-project-search') || ''} ${card.textContent || ''}`.toLowerCase();
          const tagsBlob = (card.getAttribute('data-project-tags') || '').toLowerCase();
          const matchesQuery = !q || searchBlob.includes(q);
          const matchesTag = activeTag === 'all' || tagsBlob.includes(activeTag);
          const show = matchesQuery && matchesTag;

          card.hidden = !show;
          card.classList.toggle('is-match', Boolean((q || activeTag !== 'all') && show));
          if (show) visibleCount++;
        });

        if (emptyEl) emptyEl.hidden = visibleCount > 0;
        if (statusEl) {
          statusEl.textContent = (q || activeTag !== 'all')
            ? `Showing ${visibleCount} project${visibleCount === 1 ? '' : 's'}`
            : '';
        }
      };

      projectSearchInput.addEventListener('input', applyProjectFilters);

      document.querySelectorAll('[data-project-term]').forEach((btn) => {
        btn.addEventListener('click', () => {
          projectSearchInput.value = btn.getAttribute('data-project-term') || '';
          applyProjectFilters();
        });
      });

      document.querySelectorAll('[data-project-filter]').forEach((btn) => {
        btn.addEventListener('click', () => {
          activeTag = (btn.getAttribute('data-project-filter') || 'all').toLowerCase();
          document.querySelectorAll('[data-project-filter]').forEach((b) => b.classList.toggle('is-active', b === btn));
          applyProjectFilters();
        });
      });
    }
  }

  /* ------------------------------------------------------------------------
     7. DYNAMIC CMS HYDRATION (SUPABASE + FAIL-SAFE LOCAL FALLBACK)
     ------------------------------------------------------------------------ */
  async function initDynamicCmsContent() {
    try {
      const cfg = window.__GCT_CONFIG__ || null;
      if (!cfg || !cfg.supabaseUrl || !cfg.anonKey) return;

      const res = await fetch(`${cfg.supabaseUrl}/rest/v1/published_sections?select=*`, {
        headers: { apikey: cfg.anonKey }
      }).catch(() => null);

      if (!res || !res.ok) return;
      const sections = await res.json();
      if (!Array.isArray(sections)) return;

      for (const sec of sections) {
        const data = sec.published_data;
        if (!data) continue;

        if (sec.section_key === 'hero') {
          const headlineEl = document.querySelector('.hero-headline, h1.font-display');
          if (headlineEl && data.headline) headlineEl.textContent = data.headline;
          const subheadEl = document.querySelector('.hero-subheadline, p.hero-subhead');
          if (subheadEl && data.subheadline) subheadEl.textContent = data.subheadline;
          const eyebrowEl = document.querySelector('.hero-badge, .status-pill');
          if (eyebrowEl && data.eyebrow) eyebrowEl.textContent = data.eyebrow;
        } else if (sec.section_key === 'about') {
          const taglineEl = document.querySelector('#about .section-heading-lg');
          if (taglineEl && data.tagline) taglineEl.textContent = data.tagline;
          const p1 = document.querySelector('#about .narrative-block p:first-of-type');
          if (p1 && data.paragraph1) p1.textContent = data.paragraph1;
          const p2 = document.querySelector('#about .narrative-block p:nth-of-type(2)');
          if (p2 && data.paragraph2) p2.textContent = data.paragraph2;
        } else if (sec.section_key === 'metrics' && Array.isArray(data.metrics)) {
          const cards = document.querySelectorAll('.telemetry-card, .metric-card');
          data.metrics.forEach((m, idx) => {
            if (cards[idx]) {
              const valEl = cards[idx].querySelector('.telemetry-value, .metric-val, .metric-value, [data-counter-target]');
              const lblEl = cards[idx].querySelector('.telemetry-label, .metric-label, .metric-title');
              if (valEl && m.value) valEl.textContent = m.value;
              if (lblEl && m.label) lblEl.textContent = m.label;
            }
          });
        } else if (sec.section_key === 'sec03' && Array.isArray(data.standards)) {
          const items = document.querySelectorAll('.outcomes-strip .outcome-item');
          data.standards.forEach((st, idx) => {
            if (items[idx]) {
              const kicker = items[idx].querySelector('.outcome-kicker');
              const strong = items[idx].querySelector('strong');
              const p = items[idx].querySelector('p');
              if (kicker && st.kicker) kicker.textContent = st.kicker;
              if (strong && st.title) strong.textContent = st.title;
              if (p && st.description) p.textContent = st.description;
            }
          });
        } else if (sec.section_key === 'sec09') {
          const emailLinks = document.querySelectorAll('a[href^="mailto:security@"]');
          emailLinks.forEach(el => {
            if (data.contactEmail) el.setAttribute('href', `mailto:${data.contactEmail}`);
          });
        }
      }
    } catch (err) {
      // Graceful fallback: maintain existing static markup
      console.debug('[GCT Dynamic CMS] Running in offline fallback mode.');
    }
  }

  /* ------------------------------------------------------------------------
     BOOT
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    initCursorAndMagnetic();
    initNavigation();
    initScrollRevealsAndCounters();
    initCircuitTimeline();
    initLeadCaptureForm();
    initSubpageDiscovery();
    initDynamicCmsContent();
  });
})();