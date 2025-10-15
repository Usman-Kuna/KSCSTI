/* KACSI main JS — menu, smooth-scroll, reveal, form handling (AJAX for Formspree) */

/* Mobile menu toggle */
(function () {
  const menuToggle = document.getElementById('menu-toggle');
  const navUl = document.querySelector('nav ul');
  if (!menuToggle || !navUl) return;
  menuToggle.addEventListener('click', () => navUl.classList.toggle('show'));
})();

/* Smooth scroll for in-page anchors (only when target exists) */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href.length > 1 && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close mobile nav if open
      const navUl = document.querySelector('nav ul');
      if (navUl && navUl.classList.contains('show')) navUl.classList.remove('show');
    }
  });
});

/* Reveal on scroll (IntersectionObserver) */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(i => i.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(i => obs.observe(i));
})();

/* Forms: AJAX handling only if action is a real http(s) endpoint (Formspree) */
(function () {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const action = (form.getAttribute('action') || '').trim();
    if (!action.startsWith('http://') && !action.startsWith('https://')) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('input[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

      fetch(action, {
        method: form.method || 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(res => {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit'; }
        if (res.ok) {
          alert('✅ Submission received — we will contact you soon.');
          form.reset();
        } else {
          res.json().then(data => {
            alert('❌ ' + (data.error || 'Submission failed. Please try again.'));
          }).catch(() => alert('❌ Submission failed. Please try again.'));
        }
      }).catch(() => {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit'; }
        alert('⚠️ Network error. Please check your connection and try again.');
      });
    });
  });
})();
