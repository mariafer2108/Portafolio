document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox__img');
  const lightboxClose = document.querySelector('.lightbox__close');

  function openLightbox(src, alt = '') {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.removeAttribute('src'); 
    lightboxImg.alt = '';
    document.body.style.overflow = '';
  }

 
  const proyectos = document.getElementById('proyectos');
  proyectos?.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) return;
    const full = img.dataset.fullSrc || img.src;
    openLightbox(full, img.alt);
  });


  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('open')) {
      closeLightbox();
    }
  });


  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    function closeNav() {
      navToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('open');
      navToggle.classList.remove('open');
    }

    function openNav() {
      navToggle.setAttribute('aria-expanded', 'true');
      primaryNav.classList.add('open');
      navToggle.classList.add('open');
    }

    function toggleNav() {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) closeNav(); else openNav();
    }

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNav();
    });

    // Cerrar al hacer clic en un enlace
    primaryNav.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => closeNav())
    );

    // Cerrar al pulsar Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });

    // Cerrar al clicar fuera del menú
    document.addEventListener('click', (e) => {
      if (!primaryNav.contains(e.target) && !navToggle.contains(e.target)) {
        closeNav();
      }
    });
  }


  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
});


document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('formStatus');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        statusEl.textContent = 'Enviando...';

        const formData = new FormData(form);
        const email = formData.get('email');
        const message = formData.get('message');
        if (!email || !message) {
            statusEl.textContent = 'Por favor completa email y mensaje.';
            return;
        }

        try {
            const resp = await fetch('https://formspree.io/f/meopeakl', {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' },
            });

            if (resp.ok) {
                statusEl.textContent = '¡Mensaje enviado! Gracias por escribirme.';
                form.reset();
            } else {
                const data = await resp.json().catch(() => null);
                statusEl.textContent = data?.errors?.[0]?.message || 'Error al enviar. Intenta de nuevo.';
            }
        } catch {
            statusEl.textContent = 'Error de red. Revisa tu conexión.';
        }
    });
});