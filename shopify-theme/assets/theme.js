/*
 * 22SIDE — Underground theme
 * Vanilla JS + GSAP/ScrollTrigger + Lenis (loaded before this file, all deferred).
 * Every effect is optional: without GSAP, with reduced motion or on touch the
 * page still works and simply shows its content.
 */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = window.matchMedia('(hover: none)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';
  const gsap = window.gsap;
  const INTRO_KEY = '22side.intro.seen';
  const root = document.documentElement;
  let lenis = null;

  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  /* ───────────── Smooth scroll ───────────── */
  function initLenis() {
    if (reduced || touch || typeof window.Lenis === 'undefined') return;
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', () => window.ScrollTrigger && window.ScrollTrigger.update());
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href').length < 2) return;
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0 });
    });
  }
  const lockScroll = (on) => {
    root.style.overflow = on ? 'hidden' : '';
    if (lenis) on ? lenis.stop() : lenis.start();
  };

  /* ───────────── Header ───────────── */
  function initHeader() {
    const header = $('[data-header]');
    if (!header) return;
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle('bg-obsidian/85', y > 40);
      header.classList.toggle('backdrop-blur-md', y > 40);
      header.classList.toggle('border-dirty/10', y > 40);
      const menuOpen = $('[data-mobile-menu]')?.classList.contains('is-open');
      header.classList.toggle('header-hidden', !menuOpen && y > 400 && y > last);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const toggle = $('[data-menu-toggle]');
    const menu = $('[data-mobile-menu]');
    const label = $('[data-menu-label]');
    if (toggle && menu) {
      const set = (open) => {
        menu.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        if (label) label.textContent = open ? label.dataset.open : label.dataset.closed;
        lockScroll(open);
      };
      toggle.addEventListener('click', () => set(!menu.classList.contains('is-open')));
      menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) set(false); });
    }

    const clock = $('[data-nyc-clock]');
    if (clock) {
      const fmt = new Intl.DateTimeFormat('it-IT', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' });
      const tick = () => { clock.textContent = fmt.format(new Date()); };
      tick();
      setInterval(tick, 15000);
    }
  }

  /* ───────────── Legal pages: index, withdrawal function, cookie preferences ───────────── */
  function initLegal() {
    $$('[data-legal]').forEach((sec) => {
      const body = $('[data-legal-body]', sec);
      const toc = $('[data-legal-toc]', sec);
      const list = $('[data-legal-toc-list]', sec);
      if (!body || !toc || !list) return;
      const heads = $$('h2', body);
      if (heads.length < 3) return;
      heads.forEach((h, i) => {
        if (!h.id) h.id = 'sez-' + (i + 1) + '-' + h.textContent.trim().toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent.trim();
        a.className = 'block py-1 text-dirty/80 hover:text-dirty';
        li.appendChild(a);
        list.appendChild(li);
      });
      toc.hidden = false;
    });

    // Withdrawal function (art. 54-bis Codice del Consumo): timestamp + saved summary.
    const KEY = '22side.withdrawal';
    $$('[data-withdrawal-form]').forEach((form) => {
      form.addEventListener('submit', () => {
        const now = new Date();
        const stamp = now.toLocaleString('it-IT', { dateStyle: 'long', timeStyle: 'medium' });
        const time = $('[data-withdrawal-time]', form);
        if (time) time.value = stamp + ' (' + now.toISOString() + ')';
        const summary = $$('input:not([type=hidden]), textarea', form).map((f) => [form.querySelector('label[for="' + f.id + '"]')?.textContent.replace('*', '').trim() || f.name, f.value]);
        summary.push(['Inviato il', stamp]);
        try { sessionStorage.setItem(KEY, JSON.stringify(summary)); } catch (e) { /* ignore */ }
      });
    });
    const done = $('[data-withdrawal-done]');
    if (done) {
      const dl = $('[data-withdrawal-summary]', done);
      let rows = [];
      try { rows = JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch (e) { /* ignore */ }
      rows.filter((r) => r[1]).forEach(([k, v]) => {
        const dt = document.createElement('dt'); dt.className = 'label mt-2 text-concrete'; dt.textContent = k;
        const dd = document.createElement('dd'); dd.textContent = v;
        dl.append(dt, dd);
      });
      done.focus();
      $('[data-withdrawal-print]', done)?.addEventListener('click', () => window.print());
    }

    // Cookie preferences: reopen Shopify's consent banner (privacyBanner is loaded by Shopify when
    // the banner is enabled in Settings › Customer privacy). Fallback: the privacy policy.
    $$('[data-cookie-preferences]').forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.privacyBanner && typeof window.privacyBanner.showPreferences === 'function') {
        window.privacyBanner.showPreferences();
      } else {
        const cookiePage = document.querySelector('a[href$="/pages/cookie"]');
        window.location.href = cookiePage ? cookiePage.href : '/policies/privacy-policy';
      }
    }));
  }

  /* ───────────── Dropdowns (Catalogo) ───────────── */
  function initDropdowns() {
    $$('[data-dropdown]').forEach((wrap) => {
      const btn = $('[data-dropdown-toggle]', wrap);
      const panel = $('[data-dropdown-panel]', wrap);
      if (!btn || !panel) return;
      const icon = $('svg', btn);
      const setOpen = (open) => {
        btn.setAttribute('aria-expanded', String(open));
        panel.hidden = !open;
        if (icon) icon.style.transform = open ? 'rotate(180deg)' : '';
      };
      btn.addEventListener('click', () => setOpen(panel.hidden));
      document.addEventListener('pointerdown', (e) => { if (!wrap.contains(e.target)) setOpen(false); });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !panel.hidden) { setOpen(false); btn.focus(); }
      });
      wrap.addEventListener('focusout', (e) => { if (e.relatedTarget && !wrap.contains(e.relatedTarget)) setOpen(false); });
    });
  }

  /* ───────────── Text & image reveals ───────────── */
  function splitWords(el) {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          if (!child.textContent.trim()) return;
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'split-word';
            const inner = document.createElement('span');
            inner.textContent = p;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && !child.classList.contains('split-word')) {
          walk(child);
        }
      });
    };
    walk(el);
    $$('.split-word > span', el).forEach((s, i) => { s.style.transitionDelay = `${Math.min(i * 0.05, 0.6)}s`; });
  }

  function initReveals() {
    const items = $$('[data-reveal], [data-img-reveal], [data-split]');
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }
    $$('[data-split]').forEach(splitWords);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach((el) => io.observe(el));
  }

  /* ───────────── Light-up words (manifesto) ───────────── */
  function initLightUp() {
    $$('[data-light-up]').forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map((w) => `<span class="lu-word">${w.replace(/</g, '&lt;')}</span>`).join(' ');
      const spans = $$('.lu-word', el);
      if (reduced) { spans.forEach((s) => s.classList.add('on')); return; }
      const update = () => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
        const n = Math.round(p * spans.length);
        spans.forEach((s, i) => s.classList.toggle('on', i < n));
      };
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    });
  }

  /* ───────────── Scroll scenes (GSAP) ───────────── */
  function initScenes() {
    if (!hasGsap || !window.ScrollTrigger || reduced) return;

    const hero = $('[data-hero]');
    if (hero) {
      gsap.to('[data-hero-img]', { yPercent: 18, scale: 1.08, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('[data-hero-title]', { yPercent: -25, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    }

    $$('[data-parallax]').forEach((el) => {
      gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    $$('[data-22-reveal]').forEach((wrap) => {
      const mask = $('[data-22-mask]', wrap);
      if (!mask) return;
      gsap.timeline({ scrollTrigger: { trigger: wrap, start: 'top top', end: '+=120%', scrub: 0.6, pin: true } })
        .fromTo(mask, { scale: 1, svgOrigin: '800 500' }, { scale: 30, svgOrigin: '800 500', ease: 'power2.in' });
    });

    $$('[data-draw-22]').forEach((svg) => {
      const text = $('text', svg);
      if (!text) return;
      const len = 1400;
      gsap.set(text, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 80%', once: true } });
      tl.to(text, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' });
      if (!svg.hasAttribute('data-no-fill')) tl.to(text, { fillOpacity: 1, duration: 0.6 }, '-=0.4');
    });

    $$('[data-count-22]').forEach((el) => {
      const obj = { v: 0 };
      gsap.to(obj, { v: 22, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true }, onUpdate: () => { el.textContent = String(Math.round(obj.v)).padStart(2, '0'); } });
    });

    $$('[data-final-logo]').forEach((el) => {
      gsap.fromTo(el.firstElementChild, { yPercent: 40 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true } });
    });

    window.addEventListener('load', () => window.ScrollTrigger.refresh());
  }

  /* ───────────── Magnetic buttons & collection preview ───────────── */
  function initPointer() {
    if (touch || reduced) return;
    $$('[data-magnetic]').forEach((el) => {
      el.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1)';
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    $$('[data-collection-list]').forEach((sec) => {
      const img = $('[data-preview-img]', sec);
      const list = img?.parentElement;
      if (!img || !list) return;
      $$('[data-preview]', sec).forEach((a) => {
        a.addEventListener('pointerenter', () => {
          if (!a.dataset.preview) return;
          img.src = a.dataset.preview;
          img.style.opacity = '1';
        });
        a.addEventListener('pointerleave', () => { img.style.opacity = '0'; });
      });
      list.addEventListener('pointermove', (e) => {
        const r = list.getBoundingClientRect();
        img.style.left = `${e.clientX - r.left}px`;
        img.style.top = `${e.clientY - r.top}px`;
      });
    });
  }

  /* ───────────── Stickers (drag) ───────────── */
  function initStickers(scope = document) {
    $$('[data-sticker]', scope).forEach((el) => {
      let sx = 0, sy = 0, ox = 0, oy = 0, drag = false;
      el.addEventListener('pointerdown', (e) => {
        drag = true; sx = e.clientX; sy = e.clientY;
        el.setPointerCapture(e.pointerId);
        el.style.zIndex = '30';
      });
      el.addEventListener('pointermove', (e) => {
        if (!drag) return;
        el.style.translate = `${ox + e.clientX - sx}px ${oy + e.clientY - sy}px`;
      });
      const end = (e) => {
        if (!drag) return;
        drag = false;
        ox += e.clientX - sx; oy += e.clientY - sy;
      };
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);
    });
  }

  /* ───────────── Intro: the key, the door, the logo ───────────── */
  function initIntro() {
    const overlay = $('[data-intro-overlay]');
    if (!overlay) return;
    let seen = false;
    try { seen = !!sessionStorage.getItem(INTRO_KEY); } catch (e) { /* private mode */ }
    if (seen) { overlay.remove(); return; }

    const scene = $('[data-intro-scene]', overlay);
    const title = $('[data-intro-title]', overlay);
    let tl = null, glitchTimer = null, closed = false;
    lockScroll(true);
    initStickers(overlay);

    const showTitle = () => {
      if (closed) return;
      title.classList.remove('hidden');
      title.classList.add('flex');
      requestAnimationFrame(() => requestAnimationFrame(() => title.classList.add('is-in')));
      if (scene) scene.style.opacity = '0';
      if (!reduced) {
        glitchTimer = setInterval(() => {
          title.classList.add('glitch');
          setTimeout(() => title.classList.remove('glitch'), 180);
        }, 1900);
      }
      $('[data-intro-enter]', overlay)?.focus({ preventScroll: true });
    };

    const close = () => {
      if (closed) return;
      closed = true;
      if (tl) tl.kill();
      clearInterval(glitchTimer);
      try { sessionStorage.setItem(INTRO_KEY, '1'); } catch (e) { /* ignore */ }
      lockScroll(false);
      const done = () => {
        root.setAttribute('data-intro', 'seen');
        overlay.remove();
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      };
      if (reduced) { done(); return; }
      overlay.classList.add('intro-exit');
      setTimeout(done, 950);
    };

    $('[data-intro-enter]', overlay)?.addEventListener('click', close);
    $('[data-intro-skip]', overlay)?.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    if (reduced || !hasGsap || !scene) { showTitle(); return; }

    const q = (s) => scene.querySelector(s);
    const KEY = { x: 925, y: 615 }, DOOR_L = 640, DOOR_T = 250, FLOOR = 900;
    gsap.set(q('#char'), { x: 1780, y: FLOOR });
    gsap.set(q('#arm'), { rotation: -3, transformOrigin: '50% 0%' });
    gsap.set(q('#key'), { opacity: 0, scale: 2.4, svgOrigin: `${KEY.x} ${KEY.y}` });
    gsap.set(q('#click'), { opacity: 0, scale: 0, svgOrigin: '1015 548' });
    gsap.set(q('#swoosh'), { opacity: 0, scale: 0.4, svgOrigin: '1120 380' });
    gsap.set(q('#neon'), { opacity: 0.05 });
    gsap.set([q('#spill'), q('#glow'), q('#flash'), q('#speed')], { opacity: 0 });
    scene.style.visibility = 'visible';

    tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: showTitle });
    tl.to(q('#neon'), { opacity: 1, duration: 0.05 })
      .to(q('#neon'), { opacity: 0.15, duration: 0.05 })
      .to(q('#neon'), { opacity: 1, duration: 0.05, delay: 0.12 })
      .to(q('#neon'), { opacity: 0.3, duration: 0.04, delay: 0.1 })
      .to(q('#neon'), { opacity: 1, duration: 0.06 });

    tl.to(q('#char'), { x: 760, duration: 1.15, ease: 'power2.out' }, 0.35);
    tl.to(q('#charBob'), { y: -14, duration: 0.14, repeat: 7, yoyo: true, ease: 'sine.inOut' }, 0.35);
    tl.add('arrive', 1.45);
    tl.to(q('#arm'), { rotation: -21.5, duration: 0.35, ease: 'back.out(2)' }, 'arrive');
    tl.to(q('#camera'), { scale: 3.4, x: 800 - KEY.x, y: 500 - KEY.y, svgOrigin: `${KEY.x} ${KEY.y}`, duration: 0.45, ease: 'expo.inOut' }, 'arrive+=0.2');
    tl.to(q('#speed'), { opacity: 0.8, duration: 0.1, yoyo: true, repeat: 1 }, 'arrive+=0.3');
    tl.to(q('#key'), { opacity: 1, scale: 1, duration: 0.3, ease: 'power4.in' }, 'arrive+=0.75');
    tl.to(q('#keyTag'), { rotation: 28, svgOrigin: `${KEY.x} ${KEY.y + 22}`, duration: 0.25, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 'arrive+=1.0');
    tl.to(q('#keyTurn'), { rotation: 90, svgOrigin: `${KEY.x} ${KEY.y}`, duration: 0.22, ease: 'back.out(3)' }, 'arrive+=1.15');
    tl.to(q('#click'), { opacity: 1, scale: 1, rotation: -12, duration: 0.25, ease: 'back.out(3)' }, 'arrive+=1.3');
    tl.to(q('#shake'), { x: 'random(-14,14)', y: 'random(-10,10)', duration: 0.04, repeat: 7, yoyo: true, ease: 'none' }, 'arrive+=1.3');
    tl.set(q('#shake'), { x: 0, y: 0 });
    tl.to(q('#click'), { opacity: 0, scale: 1.4, duration: 0.2 }, 'arrive+=1.75');
    tl.to(q('#camera'), { scale: 1, x: 0, y: 0, duration: 0.45, ease: 'expo.inOut' }, 'arrive+=1.7');
    tl.add('open', 'arrive+=2.1');
    tl.to(q('#door'), { scaleX: 0.1, skewY: -9, svgOrigin: `${DOOR_L} ${(DOOR_T + FLOOR) / 2}`, duration: 0.5, ease: 'back.out(1.4)' }, 'open');
    tl.to([q('#glow'), q('#spill')], { opacity: 1, duration: 0.4, ease: 'power2.out' }, 'open');
    tl.to(q('#charBob'), { filter: 'brightness(0.18)', duration: 0.3 }, 'open');
    tl.to(q('#arm'), { rotation: -3, duration: 0.3 }, 'open');
    tl.to(q('#swoosh'), { opacity: 1, scale: 1, rotation: 8, duration: 0.3, ease: 'back.out(3)' }, 'open+=0.1');
    tl.to(q('#swoosh'), { opacity: 0, duration: 0.2 }, 'open+=0.6');
    tl.to(q('#char'), { x: 800, y: FLOOR - 70, scale: 0.6, transformOrigin: '50% 100%', duration: 0.7, ease: 'power2.in' }, 'open+=0.45');
    tl.to(q('#char'), { opacity: 0, duration: 0.3 }, 'open+=0.85');
    tl.to(q('#camera'), { scale: 11, x: 0, y: -60, svgOrigin: '800 560', duration: 0.75, ease: 'expo.in' }, 'open+=0.7');
    tl.to(q('#speed'), { opacity: 1, duration: 0.3 }, 'open+=0.95');
    tl.to(q('#flash'), { opacity: 1, duration: 0.25, ease: 'power2.in' }, 'open+=1.2');
  }

  function initReplayIntro() {
    $$('[data-replay-intro]').forEach((b) => b.addEventListener('click', () => {
      try { sessionStorage.removeItem(INTRO_KEY); } catch (e) { /* ignore */ }
      window.location.href = window.theme.routes.root_url;
    }));
  }

  /* ───────────── Cart (Ajax API + Section Rendering) ───────────── */
  const Cart = {
    drawer: null,
    async post(url, body) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...body, sections: 'cart-drawer', sections_url: window.location.pathname }),
      });
      const data = await res.json();
      if (!res.ok || data.status) throw new Error(data.description || data.message || window.theme.strings.unavailable);
      return data;
    },
    render(data) {
      const html = data.sections && data.sections['cart-drawer'];
      if (html && this.drawer) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const fresh = $('[data-cart-drawer-body]', doc);
        const body = $('[data-cart-drawer-body]', this.drawer);
        if (fresh && body) body.replaceWith(fresh);
      }
      const count = data.item_count ?? (data.items ? data.items.reduce((n, i) => n + i.quantity, 0) : null);
      if (count !== null && count !== undefined) this.setCount(count);
      else fetch(`${window.theme.routes.cart_url}.js`).then((r) => r.json()).then((c) => this.setCount(c.item_count));
    },
    setCount(n) {
      $$('[data-cart-count]').forEach((el) => {
        el.textContent = n;
      });
    },
    open() {
      if (!this.drawer) { window.location.href = window.theme.routes.cart_url; return; }
      this.drawer.classList.add('is-open');
      lockScroll(true);
      $('[data-cart-close]', this.drawer)?.focus({ preventScroll: true });
    },
    close() {
      if (!this.drawer) return;
      this.drawer.classList.remove('is-open');
      lockScroll(false);
    },
  };

  function initCart() {
    Cart.drawer = $('[data-cart-drawer]');
    const onCartPage = !!$('[data-main-cart]');

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-cart-open]') && Cart.drawer && !onCartPage) {
        e.preventDefault();
        Cart.open();
      }
      if (e.target.closest('[data-cart-close]')) Cart.close();

      const qty = e.target.closest('[data-cart-qty]');
      if (qty) {
        e.preventDefault();
        qty.disabled = true;
        Cart.post(`${window.theme.routes.cart_change_url}.js`, { line: Number(qty.dataset.cartQty), quantity: Number(qty.dataset.qty) })
          .then((data) => { if (onCartPage) window.location.reload(); else Cart.render(data); })
          .catch((err) => { alert(err.message); qty.disabled = false; });
      }
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && Cart.drawer?.classList.contains('is-open')) Cart.close(); });

    document.addEventListener('submit', (e) => {
      const form = e.target.closest('[data-product-form]');
      if (!form || !Cart.drawer) return;
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const fd = new FormData(form);
      const body = { items: [{ id: Number(fd.get('id')), quantity: Number(fd.get('quantity') || 1) }] };
      const label = btn ? btn.innerHTML : '';
      if (btn) btn.disabled = true;
      Cart.post(`${window.theme.routes.cart_add_url}.js`, body)
        .then((data) => {
          Cart.render(data);
          form.closest('[data-quick-add]')?.removeAttribute('open');
          if (btn && form.hasAttribute('data-main-form')) btn.textContent = window.theme.strings.added;
          Cart.open();
        })
        .catch((err) => alert(err.message))
        .finally(() => {
          if (!btn) return;
          setTimeout(() => { btn.innerHTML = label; btn.disabled = false; }, form.hasAttribute('data-main-form') ? 1600 : 0);
        });
    });
  }

  /* ───────────── Product page ───────────── */
  function initProduct() {
    $$('[data-product]').forEach((sec) => {
      const form = $('[data-main-form]', sec);
      if (!form) return;
      const variants = JSON.parse($('[data-variants]', sec)?.textContent || '[]');
      const idInput = $('[data-variant-id]', form);
      const btn = $('[data-add-button]', form);
      const avail = $('[data-availability]', form);
      const price = $('[data-price]', sec);
      const pending = sec.dataset.pending === 'true';
      const money = (cents) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: (window.Shopify && window.Shopify.currency && window.Shopify.currency.active) || 'EUR' }).format(cents / 100);

      const update = () => {
        const selected = $$('[data-option-index]:checked', form).map((i) => i.value);
        $$('[data-option-index]:checked', form).forEach((i) => {
          const out = $(`[data-option-value="${i.dataset.optionIndex}"]`, form);
          if (out) out.textContent = i.value;
        });
        const v = variants.find((x) => x.options.every((o, i) => o === selected[i]));
        if (!v) {
          btn.disabled = true;
          btn.textContent = window.theme.strings.unavailable;
          return;
        }
        idInput.value = v.id;
        if (!pending) {
          btn.disabled = !v.available;
          btn.textContent = v.available ? window.theme.strings.addToCart : window.theme.strings.soldOut;
          if (avail) avail.textContent = v.available ? avail.dataset.inStock || avail.textContent : window.theme.strings.soldOut;
          if (price) price.innerHTML = money(v.price) + (v.compare_at_price > v.price ? ` <s class="ml-2 text-concrete">${money(v.compare_at_price)}</s>` : '');
        }
        const url = new URL(window.location.href);
        url.searchParams.set('variant', v.id);
        window.history.replaceState({}, '', url);
      };
      if (avail && !avail.dataset.inStock) avail.dataset.inStock = avail.textContent.trim();
      form.addEventListener('change', (e) => { if (e.target.matches('[data-option-index]')) update(); });

      const qty = $('[data-qty-input]', form);
      $$('[data-qty-step]', form).forEach((b) => b.addEventListener('click', () => {
        qty.value = String(Math.max(1, Number(qty.value || 1) + Number(b.dataset.qtyStep)));
      }));
    });

    $$('[data-recommendations]').forEach((el) => {
      if (el.children.length) return;
      const load = () => fetch(el.dataset.url).then((r) => r.text()).then((html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const fresh = $('[data-recommendations]', doc);
        if (fresh && fresh.innerHTML.trim()) { el.innerHTML = fresh.innerHTML; initReveals(); }
      });
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { io.disconnect(); load(); } }, { rootMargin: '400px' });
        io.observe(el);
      } else load();
    });
  }

  /* ───────────── Collection sort ───────────── */
  function initSort() {
    $$('[data-sort]').forEach((sel) => sel.addEventListener('change', () => {
      const url = new URL(window.location.href);
      url.searchParams.set('sort_by', sel.value);
      url.searchParams.delete('page');
      window.location.href = url.toString();
    }));
  }

  /* ───────────── Theme editor support ───────────── */
  function initEditor() {
    if (!window.Shopify || !window.Shopify.designMode) return;
    document.addEventListener('shopify:section:load', () => {
      initReveals();
      initLightUp();
      if (hasGsap && window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  }

  const boot = () => {
    if (window.Shopify && window.Shopify.designMode) {
      try { sessionStorage.setItem(INTRO_KEY, '1'); } catch (e) { /* ignore */ }
    }
    initLenis();
    initIntro();
    initHeader();
    initDropdowns();
    initLegal();
    initReveals();
    initLightUp();
    initScenes();
    initPointer();
    initReplayIntro();
    initCart();
    initProduct();
    initSort();
    initEditor();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
