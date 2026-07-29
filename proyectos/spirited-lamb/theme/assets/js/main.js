/* Spirited Lamb — main.js */
(function () {
  'use strict';

  // ── Navbar scroll ────────────────────────────────────
  const navbar = document.getElementById('sl-navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile menu ──────────────────────────────────────
  const burger     = document.getElementById('sl-burger');
  const mobileMenu = document.getElementById('sl-mobile-menu');
  if (burger && mobileMenu) {
    const toggle = () => {
      const open = mobileMenu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      mobileMenu.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    const close = () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    burger.addEventListener('click', toggle);
    document.getElementById('sl-mobile-close')?.addEventListener('click', close);
    document.querySelectorAll('.sl-mobile-link').forEach(link =>
      link.addEventListener('click', close)
    );
  }

  // ── Hero carousel ─────────────────────────────────────
  const slides = document.querySelectorAll('.sl-hero__slide');
  let current  = 0;

  function goToSlide(n) {
    slides[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
  }

  if (slides.length > 1) {
    setInterval(() => goToSlide(current + 1), 5000);
  }

  // ── Smooth scroll ────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Calendar ─────────────────────────────────────────
  const calGrid    = document.getElementById('sl-cal-grid');
  const calLabel   = document.getElementById('sl-cal-month-label');
  const calPrev    = document.getElementById('sl-cal-prev');
  const calNext    = document.getElementById('sl-cal-next');
  const eventsList = document.getElementById('sl-events-list');
  const eventsCount = document.getElementById('sl-events-count');

  let allEvents    = [];
  let viewDate     = new Date();
  let activeFilters = { type: 'all', county: 'all' };

  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];

  function normalizeEventsPayload(payload) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== 'object') return [];
    if (Array.isArray(payload.events)) return payload.events;
    if (payload.success && payload.data) return normalizeEventsPayload(payload.data);
    if (payload.data) return normalizeEventsPayload(payload.data);
    return [];
  }

  async function fetchEventsFrom(url, label) {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(label + ' returned HTTP ' + res.status);
    const data = await res.json();
    const events = normalizeEventsPayload(data);
    if (!Array.isArray(events)) throw new Error(label + ' returned non-array events payload');
    return events;
  }

  async function fetchEvents() {
    const config = (typeof SLConfig !== 'undefined') ? SLConfig : {};
    const ajaxUrl = config.ajaxUrl || '';
    const n8nUrl = config.n8nEventsUrl || '';
    const endpoints = [];

    if (n8nUrl) {
      endpoints.push({
        label: 'n8n webhook',
        url: n8nUrl
      });
    }
    if (ajaxUrl) {
      const sep = ajaxUrl.includes('?') ? '&' : '?';
      endpoints.push({
        label: 'WordPress AJAX proxy',
        url: ajaxUrl + sep + 'action=sl_get_events'
      });
    }

    if (endpoints.length === 0) {
      console.warn('[SL Events] no configured events endpoint');
      renderCalendar();
      return;
    }

    let loaded = false;
    let lastErr = null;
    for (const endpoint of endpoints) {
      try {
        const events = await fetchEventsFrom(endpoint.url, endpoint.label);
        allEvents = events;
        loaded = true;
        console.info('[SL Events] loaded', events.length, 'events from', endpoint.label);
        break;
      } catch (err) {
        lastErr = err;
        console.warn('[SL Events] failed loading from', endpoint.label, err);
      }
    }

    if (!loaded && eventsList) {
      console.error('[SL Events] all endpoints failed:', lastErr);
      eventsList.innerHTML = '<div class="sl-events-empty">Events temporarily unavailable. Check back soon!</div>';
    }

    renderCalendar();
  }

  function filteredEvents() {
    return allEvents.filter(ev => {
      const typeMatch   = activeFilters.type   === 'all' || ev.type   === activeFilters.type;
      const countyMatch = activeFilters.county === 'all' || ev.county === activeFilters.county;
      return typeMatch && countyMatch;
    });
  }

  function eventsForDate(dateStr) {
    return filteredEvents().filter(ev => {
      const d = new Date(ev.startDate || ev.date || '');
      return !isNaN(d) && d.toISOString().slice(0, 10) === dateStr;
    });
  }

  function renderCalendar() {
    if (!calGrid || !calLabel) return;

    const year  = viewDate.getFullYear();
    const month = viewDate.getMonth();
    calLabel.textContent = MONTHS[month] + ' ' + year;

    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays    = new Date(year, month, 0).getDate();
    const today       = new Date().toISOString().slice(0, 10);

    let html = '';

    for (let i = firstDay - 1; i >= 0; i--) {
      html += `<div class="sl-cal-day sl-cal-day--other">${prevDays - i}</div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const evs     = eventsForDate(dateStr);
      const isToday = dateStr === today;
      const hasEvs  = evs.length > 0;

      let cls = 'sl-cal-day';
      if (isToday)  cls += ' sl-cal-day--today';
      if (hasEvs)   cls += ' sl-cal-day--has-events';

      const badge = hasEvs
        ? `<span class="sl-cal-day__badge">${evs.length}</span>`
        : '';

      html += `<div class="${cls}"${hasEvs ? ` data-date="${dateStr}"` : ''}>${d}${badge}</div>`;
    }

    const totalCells = firstDay + daysInMonth;
    const trailing   = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= trailing; i++) {
      html += `<div class="sl-cal-day sl-cal-day--other">${i}</div>`;
    }

    calGrid.innerHTML = html;

    calGrid.querySelectorAll('.sl-cal-day--has-events').forEach(cell => {
      cell.addEventListener('click', () => {
        const evs = eventsForDate(cell.dataset.date);
        if (evs.length === 1) openModal(evs[0]);
        else {
          renderEventsList(evs);
          eventsList?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    const monthEvs = filteredEvents().filter(ev => {
      const d = new Date(ev.startDate || ev.date || '');
      return !isNaN(d) && d.getMonth() === month && d.getFullYear() === year;
    });
    renderEventsList(monthEvs);
  }

  function renderEventsList(evs) {
    if (!eventsList) return;

    if (eventsCount) {
      eventsCount.textContent = evs.length + ' Event' + (evs.length !== 1 ? 's' : '') + ' Found';
    }

    if (evs.length === 0) {
      eventsList.innerHTML = `<div class="sl-events-empty">No events found for this period. Check back soon!</div>`;
      return;
    }

    eventsList.innerHTML = evs
      .sort((a, b) => new Date(a.startDate || a.date) - new Date(b.startDate || b.date))
      .map(ev => {
        const d    = new Date(ev.startDate || ev.date || '');
        const mon  = isNaN(d) ? '—' : d.toLocaleString('en-US', { month: 'short' });
        const day  = isNaN(d) ? '—' : d.getDate();
        const sub  = [ev.parish, ev.city].filter(Boolean).join(' • ');

        return `
          <div class="sl-event-card" role="button" tabindex="0">
            <div class="sl-event-card__date">
              <span class="sl-event-card__date-mon">${mon}</span>
              <span class="sl-event-card__date-day">${day}</span>
            </div>
            <div class="sl-event-card__info">
              <h5 class="sl-event-card__title">${escHtml(ev.title || '')}</h5>
              ${sub ? `<p class="sl-event-card__sub">${escHtml(sub)}</p>` : ''}
            </div>
            <svg class="sl-event-card__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>`;
      }).join('');

    eventsList.querySelectorAll('.sl-event-card').forEach((card, i) => {
      const handler = () => openModal(evs[i]);
      card.addEventListener('click', handler);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handler(); });
    });
  }

  if (calPrev) calPrev.addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); });
  if (calNext) calNext.addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); });

  document.querySelectorAll('.sl-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const ft = btn.dataset.filter;
      document.querySelectorAll(`.sl-filter[data-filter="${ft}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters[ft] = btn.dataset.value;
      renderCalendar();
    });
  });

  // ── Modal ─────────────────────────────────────────────
  const modal         = document.getElementById('sl-event-modal');
  const modalBackdrop = document.getElementById('sl-modal-backdrop');
  const modalClose    = document.getElementById('sl-modal-close');

  function openModal(ev) {
    if (!modal || !ev) return;

    const titleEl = document.getElementById('sl-modal-title');
    if (titleEl) titleEl.textContent = ev.title || '';

    const d    = new Date(ev.startDate || ev.date || '');
    const dStr = isNaN(d) ? '' : d.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    const timeStr = (ev.startTime || '') + (ev.endTime ? ' – ' + ev.endTime : '');

    const dateEl = document.getElementById('sl-modal-date');
    if (dateEl) {
      dateEl.textContent = [dStr, timeStr].filter(Boolean).join(' · ');
      dateEl.style.display = dStr ? '' : 'none';
    }

    const locEl = document.getElementById('sl-modal-location');
    if (locEl) {
      const loc = [ev.parish, ev.city, ev.county ? ev.county + ' County' : ''].filter(Boolean).join(', ');
      locEl.textContent = loc;
      locEl.style.display = loc ? '' : 'none';
    }

    const descEl = document.getElementById('sl-modal-desc');
    if (descEl) descEl.textContent = ev.description || '';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ── Contact form ──────────────────────────────────────
  const contactForm   = document.getElementById('sl-contact-form');
  const contactStatus = document.getElementById('sl-contact-status');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const fd  = new FormData(contactForm);
      const subj = encodeURIComponent('Join the Mission — ' + (fd.get('name') || ''));
      const body = encodeURIComponent('Name: ' + fd.get('name') + '\nEmail: ' + fd.get('email') + '\n\n' + (fd.get('message') || ''));
      window.location.href = 'mailto:emily@spiritedlamb.com?subject=' + subj + '&body=' + body;
      if (contactStatus) contactStatus.textContent = '✓ Opening your email client…';
      contactForm.reset();
    });
  }

  // ── Init ──────────────────────────────────────────────
  fetchEvents();

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

})();
