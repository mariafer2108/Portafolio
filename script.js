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
  const MICAMA_LINK = 'https://webmicama.vercel.app/index.html';
  const EMAV_LINK = 'https://emavchile.com/';
  const GATITOS_LINK = 'https://gatitos-glotones.vercel.app/';
  const ALMA_LINK = 'https://www.almasilvestre.cl/';

  function openLightbox(src, alt = '', link) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    if (link) {
      lightboxImg.dataset.link = link;
    } else {
      delete lightboxImg.dataset.link;
    }
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Reset de zoom/estilos por cada apertura
    lightboxImg.classList.remove('zoomed');
    lightboxImg.style.width = '';
    lightboxImg.style.height = '';
    lightboxImg.style.cursor = 'zoom-in';
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.removeAttribute('src'); 
    lightboxImg.alt = '';
    delete lightboxImg.dataset.link;
    document.body.style.overflow = '';
    lightboxImg.classList.remove('zoomed');
  }

  function toggleZoom(e) {
    const img = lightboxImg;
    if (!img) return;

    const willZoom = !img.classList.contains('zoomed');

    if (willZoom) {
        const srcLower = img.src.toLowerCase();
        const isMiCama = srcLower.includes('micama.jpg');

        // micama 1.5x, otras suben un poco más a 2.0x
        const ZOOM_FACTOR = isMiCama ? 1.5 : 2.0;

        const rect = img.getBoundingClientRect();
        const desiredWidth = rect.width * ZOOM_FACTOR;
        const naturalWidth = img.naturalWidth;
        const targetWidth = Math.min(desiredWidth, naturalWidth);

        img.classList.add('zoomed');
        img.style.width = `${targetWidth}px`;
        img.style.height = 'auto';
        img.style.cursor = 'move';
    } else {
        img.classList.remove('zoomed');
        img.style.width = '';
        img.style.height = '';
        img.style.cursor = 'zoom-in';
    }

    e.stopPropagation();
  }

  function onLightboxImgClick(e) {
    const img = lightboxImg;
    if (!img) return;
    const link = img.dataset.link;
    if (link) {
      window.open(link, '_blank', 'noopener');
      e.stopPropagation();
      return;
    }
    toggleZoom(e);
  }

 
  const proyectos = document.getElementById('proyectos');
  proyectos?.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) return;
    const full = img.dataset.fullSrc || img.src;
    const link = img.dataset.link || '';
    openLightbox(full, img.alt, link);
  });


  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  lightboxImg?.addEventListener('click', onLightboxImgClick);
  
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
      primaryNav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
    }

    function openNav() {
      navToggle.setAttribute('aria-expanded', 'true');
      primaryNav.classList.add('is-open');
      navToggle.classList.add('is-open');
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
