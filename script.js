// ================================================
// BALATRO PORTFOLIO — script.js
// 1. Flip Cards (Curiosidades)
// 2. Reveal on Scroll (IntersectionObserver)
// 3. Nav Scroll Spy
// 4. Nav Hide/Show ao rolar
// 5. Efeito Magnético nos cards
// 6. Ciclo de imagens nos Joker Cards no hover
// ================================================

// ── Ano no footer ─────────────────────────────
document.getElementById('footer-year').textContent = new Date().getFullYear();

// ── 1. FLIP CARDS (Curiosidades) ──────────────
const flipCards  = document.querySelectorAll('.flip-card');
const finaleEl   = document.getElementById('curiosidades-finale');

function flipCard(card) {
  // Bloqueia novo flip enquanto a animação do véu está rolando
  if (card.classList.contains('is-animating')) return;

  card.classList.add('is-animating');
  setTimeout(() => card.classList.remove('is-animating'), 950);

  const isFlipped = card.classList.toggle('is-flipped');
  card.setAttribute('aria-pressed', isFlipped);

  const allFlipped = [...flipCards].every(c => c.classList.contains('is-flipped'));
  if (allFlipped && finaleEl) finaleEl.removeAttribute('hidden');
}

flipCards.forEach(card => {
  card.addEventListener('click', () => flipCard(card));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flipCard(card); }
  });
});

// ── 2. REVEAL ON SCROLL ───────────────────────
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal-card').forEach(el => revealObserver.observe(el));

// ── 3. NAV SCROLL SPY ─────────────────────────
const sections = document.querySelectorAll('header[id], section[id]');
const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

const spyObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const href = `#${entry.target.id}`;
      navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === href));
    });
  },
  { rootMargin: '-30% 0px -60% 0px' }
);
sections.forEach(s => spyObserver.observe(s));

// ── 4. NAV HIDE / SHOW ────────────────────────
const nav = document.getElementById('nav');
let lastY = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 80) {
    const down = y > lastY;
    nav.style.opacity       = down ? '0' : '1';
    nav.style.pointerEvents = down ? 'none' : 'auto';
    nav.style.transform     = down
      ? 'translateX(-50%) translateY(-20px)'
      : 'translateX(-50%) translateY(0)';
  } else {
    nav.style.opacity       = '1';
    nav.style.pointerEvents = 'auto';
    nav.style.transform     = 'translateX(-50%) translateY(0)';
  }
  lastY = y;
}, { passive: true });

// ── 5. EFEITO MAGNÉTICO (Tilt 3D) ────────────
function applyMagnetic(selector) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);

      el.style.transition = 'transform 80ms ease, box-shadow 80ms ease';
      el.style.transform  = `perspective(700px) rotateY(${dx*9}deg) rotateX(${-dy*9}deg) translateY(-8px) scale(1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 500ms cubic-bezier(.23,1,.32,1), box-shadow 500ms ease';
      el.style.transform  = '';
    });
  });
}
applyMagnetic('.hobby-card');
applyMagnetic('.joker-card');

// ── 6. CICLO DE IMAGENS NOS PROJETOS ─────────
// Quando o mouse entra no card, a imagem principal troca a cada 900ms
// entre as screenshots listadas em data-images (JSON array).
// Ao sair, volta para a primeira imagem.

function setupImageCycler() {
  document.querySelectorAll('.joker-card[data-images]').forEach(card => {
    let images;
    try { images = JSON.parse(card.getAttribute('data-images')); } catch { return; }
    if (!images || images.length < 2) return;

    const imgEl = card.querySelector('.joker-card__img');
    if (!imgEl) return;

    let idx      = 0;
    let interval = null;

    function showImage(newIdx) {
      imgEl.style.opacity = '0';
      setTimeout(() => {
        imgEl.src = images[newIdx];
        imgEl.style.opacity = '1';
      }, 220);
    }

    card.addEventListener('mouseenter', () => {
      interval = setInterval(() => {
        idx = (idx + 1) % images.length;
        showImage(idx);
      }, 900);
    });

    card.addEventListener('mouseleave', () => {
      clearInterval(interval);
      interval = null;
      if (idx !== 0) {
        idx = 0;
        showImage(0);
      }
    });
  });
}

setupImageCycler();
