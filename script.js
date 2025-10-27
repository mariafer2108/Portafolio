// Navegación suave en los enlaces internos
document.addEventListener('DOMContentLoaded', () => {
  // Navegación suave
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

  // Lightbox
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
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  // Delegación de eventos: clic en imágenes dentro de #proyectos
  const proyectos = document.getElementById('proyectos');
  proyectos?.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) return;
    const full = img.dataset.fullSrc || img.src;
    openLightbox(full, img.alt);
  });

  // Cerrar: botón, clic fuera y Escape
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('open')) {
      closeLightbox();
    }
  });
});

// Simulación simple de envío del formulario (sin backend)
// Envío real del formulario con Formspree (sin backend propio)
document.addEventListener('DOMContentLoaded', () => {
    // Envío real del formulario con Formspree
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