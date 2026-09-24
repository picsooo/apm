/* APM — Modern · moteur d'interactions (vanilla, zéro dépendance) */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ================= Préchargement ================= */
  var loader = document.querySelector('.loader');
  function startPage() {
    document.body.classList.add('is-ready');
    if (loader) loader.classList.add('is-done');
  }
  if (loader) {
    var fill = loader.querySelector('.loader__fill');
    var pct = loader.querySelector('.loader__pct');
    var p = 0;
    var tick = setInterval(function () {
      p = Math.min(p + Math.random() * 18 + 6, 100);
      if (fill) fill.style.width = p + '%';
      if (pct) pct.textContent = String(Math.round(p)).padStart(3, '0');
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(startPage, 320);
      }
    }, reduce ? 20 : 130);
  } else {
    startPage();
  }

  /* ================= Curseur personnalisé ================= */
  var dot = document.querySelector('.cursor');
  var ring = document.querySelector('.cursor-ring');
  if (dot && ring && window.matchMedia('(hover:hover)').matches && !reduce) {
    var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    (function loop() {
      rx = lerp(rx, mx, 0.16); ry = lerp(ry, my, 0.16);
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,.pcard,.bx').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-lg'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-lg'); });
    });
  }

  /* ================= Barre de progression + nav ================= */
  var bar = document.querySelector('.progress');
  var nav = document.querySelector('.nav');
  var last = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (nav) nav.classList.toggle('is-hidden', y > last && y > 400);
    last = y;
  }, { passive: true });

  /* ================= Menu plein écran ================= */
  var burger = document.querySelector('.nav__burger');
  var drawer = document.querySelector('.drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.classList.remove('is-open');
        burger.classList.remove('is-open');
        document.body.classList.remove('is-locked');
      });
    });
  }

  /* ================= Reveal ================= */
  var rvs = document.querySelectorAll('.rv,.clipimg');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('on'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8%' });
    rvs.forEach(function (el) { ro.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add('on'); });
  }

  /* ================= Compteurs ================= */
  function count(el) {
    var target = parseFloat(el.dataset.count);
    var sep = el.dataset.sep === 'true';
    var t0 = null, dur = 1700;
    function f(ts) {
      if (t0 === null) t0 = ts;
      var pr = Math.min((ts - t0) / dur, 1);
      var v = Math.round(target * (1 - Math.pow(1 - pr, 3)));
      el.textContent = sep ? v.toLocaleString('fr-FR').replace(/ | /g, ' ') : v;
      if (pr < 1) requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  }
  var cs = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { count(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.5 });
    cs.forEach(function (el) { co.observe(el); });
  } else {
    cs.forEach(function (el) { el.textContent = el.dataset.count; });
  }

  /* ================= Jauges ================= */
  var gs = document.querySelectorAll('.gauge__f');
  if ('IntersectionObserver' in window) {
    var go = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.style.width = e.target.dataset.v + '%'; go.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    gs.forEach(function (el) { go.observe(el); });
  } else {
    gs.forEach(function (el) { el.style.width = el.dataset.v + '%'; });
  }

  /* ================= Texte mot à mot ================= */
  document.querySelectorAll('.bigtext').forEach(function (block) {
    var words = block.textContent.trim().split(/\s+/);
    block.innerHTML = words.map(function (w) { return '<span class="t">' + w + '</span>'; }).join(' ');
    var spans = block.querySelectorAll('.t');
    function paint() {
      var r = block.getBoundingClientRect();
      var start = window.innerHeight * 0.88;
      var end = window.innerHeight * 0.22;
      var pr = clamp((start - r.top) / (start - end), 0, 1);
      var n = Math.round(pr * spans.length);
      spans.forEach(function (s, i) { s.classList.toggle('on', i < n); });
    }
    window.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);
    paint();
  });

  /* ================= Parallaxe hero ================= */
  var pmedia = document.querySelector('.hero__media img');
  if (pmedia && !reduce) {
    window.addEventListener('scroll', function () {
      pmedia.style.transform = 'translateY(' + (window.scrollY * 0.22) + 'px)';
    }, { passive: true });
  }

  /* ================= Scroller horizontal ================= */
  var hs = document.querySelector('.hs');
  if (hs && window.innerWidth > 760) {
    var track = hs.querySelector('.hs__track');
    var fillBar = hs.querySelector('.hs__bar-fill');
    function hsPaint() {
      var r = hs.getBoundingClientRect();
      var total = hs.offsetHeight - window.innerHeight;
      var pr = clamp(-r.top / total, 0, 1);
      var dist = track.scrollWidth - window.innerWidth + 64;
      track.style.transform = 'translateX(' + (-pr * Math.max(dist, 0)) + 'px)';
      if (fillBar) fillBar.style.width = (pr * 100) + '%';
    }
    window.addEventListener('scroll', hsPaint, { passive: true });
    window.addEventListener('resize', hsPaint);
    hsPaint();
  }

  /* ================= Boutons magnétiques ================= */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('[data-magnet]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * 0.22 + 'px,' + y * 0.32 + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ================= Formulaires démo ================= */
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var box = form.querySelector('[data-demo-msg]');
      if (box) { box.hidden = false; box.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
  });

  /* ================= Année ================= */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
