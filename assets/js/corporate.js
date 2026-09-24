/* APM — Corporate Pro · interactions (vanilla, zéro dépendance) */
(function () {
  'use strict';

  /* ---------- Header sticky shadow ---------- */
  var header = document.querySelector('.header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile navigation ---------- */
  var burger = document.querySelector('.burger');
  var mnav = document.querySelector('.mobile-nav');
  var scrim = document.querySelector('.scrim');
  function closeNav() {
    if (!mnav) return;
    mnav.classList.remove('is-open');
    scrim && scrim.classList.remove('is-open');
    burger && burger.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = mnav.classList.toggle('is-open');
      scrim && scrim.classList.toggle('is-open', open);
      burger.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    scrim && scrim.addEventListener('click', closeNav);
    mnav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length) {
    if (!('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); ro.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
      revealables.forEach(function (el) { ro.observe(el); });
    }
  }

  /* ---------- Compteurs animés ---------- */
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var sep = el.dataset.sep === 'true';
    var dur = 1500, t0 = null;
    function fmt(n) {
      var v = Math.round(n);
      return sep ? v.toLocaleString('fr-FR').replace(/ | /g, ' ') : String(v);
    }
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.dataset.count; });
  }

  /* ---------- Jauges (fiche technique) ---------- */
  var meters = document.querySelectorAll('.meter__fill');
  if (meters.length && 'IntersectionObserver' in window) {
    var mo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.width = en.target.dataset.v + '%';
          mo.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    meters.forEach(function (el) { mo.observe(el); });
  } else {
    meters.forEach(function (el) { el.style.width = el.dataset.v + '%'; });
  }

  /* ---------- Accordéon ---------- */
  document.querySelectorAll('.acc__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.acc__i');
      var panel = item.querySelector('.acc__panel');
      var open = item.classList.contains('is-open');
      var parent = item.parentElement;
      parent.querySelectorAll('.acc__i.is-open').forEach(function (o) {
        o.classList.remove('is-open');
        o.querySelector('.acc__panel').style.maxHeight = null;
        o.querySelector('.acc__btn').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Filtres catalogue ---------- */
  var filterBtns = document.querySelectorAll('[data-filter]');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.dataset.filter;
        filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        document.querySelectorAll('[data-cat]').forEach(function (card) {
          var show = val === 'all' || card.dataset.cat.split(' ').indexOf(val) > -1;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Formulaire multi-étapes (devis) ---------- */
  var wizard = document.querySelector('[data-wizard]');
  if (wizard) {
    var panels = wizard.querySelectorAll('.step-panel');
    var steps = document.querySelectorAll('.stepper__i');
    var cur = 0;

    function paint() {
      panels.forEach(function (p, i) { p.classList.toggle('is-active', i === cur); });
      steps.forEach(function (s, i) {
        s.classList.toggle('is-active', i === cur);
        s.classList.toggle('is-done', i < cur);
      });
      var top = wizard.getBoundingClientRect().top + window.scrollY - 140;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
    }

    wizard.querySelectorAll('[data-next]').forEach(function (b) {
      b.addEventListener('click', function () {
        var panel = panels[cur];
        var invalid = false;
        panel.querySelectorAll('[required]').forEach(function (f) {
          if (!f.checkValidity()) { f.reportValidity(); invalid = true; }
        });
        if (invalid) return;
        if (cur < panels.length - 1) { cur++; paint(); }
      });
    });
    wizard.querySelectorAll('[data-prev]').forEach(function (b) {
      b.addEventListener('click', function () { if (cur > 0) { cur--; paint(); } });
    });
    paint();
  }

  /* ---------- Soumission de formulaire (démo) ---------- */
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var box = form.querySelector('[data-demo-msg]');
      if (box) {
        box.hidden = false;
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  /* ---------- Année courante ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
