// Mobile menu toggle
const burger = document.getElementById('burgerBtn');
const menu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
});

menu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// Navbar shadow on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Scroll-triggered reveal animations
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseInt(delay));
      animateObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => {
  animateObserver.observe(el);
});

// Active nav link highlight on scroll
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.navlinks a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => sectionObserver.observe(s));

// Certificate modal viewer
const certModal = document.getElementById('certModal');
const certModalImage = document.getElementById('certModalImage');
const certModalTitle = document.getElementById('certModalTitle');
const certModalSource = document.getElementById('certModalSource');
const certModalId = document.getElementById('certModalId');
const certModalClose = document.getElementById('certModalClose');
const certModalBackdrop = document.getElementById('certModalBackdrop');

const certScroll = document.getElementById('certScroll');
const certPrev = document.getElementById('navPrev');
const certNext = document.getElementById('navNext');
const certDots = document.querySelectorAll('.cert-dot');
const certCards = document.querySelectorAll('.cert-card');

const setActiveCard = (index) => {
  certCards.forEach((card, i) => {
    card.classList.toggle('active', i === index);
  });
  certDots.forEach((dot, i) => {
    dot.classList.toggle('on', i === index);
    dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
  });
};

const scrollToCard = (index) => {
  const card = certCards[index];
  if (!card) return;
  card.scrollIntoView({ behavior: 'smooth', inline: 'start' });
  setActiveCard(index);
};

certDots.forEach((dot, index) => {
  dot.addEventListener('click', () => scrollToCard(index));
});

certPrev.addEventListener('click', () => {
  const current = [...certCards].findIndex(card => card.classList.contains('active'));
  scrollToCard(Math.max(0, current === -1 ? 0 : current - 1));
});

certNext.addEventListener('click', () => {
  const current = [...certCards].findIndex(card => card.classList.contains('active'));
  scrollToCard(Math.min(certCards.length - 1, current === -1 ? 0 : current + 1));
});

let certScrollTimeout;
certScroll.addEventListener('scroll', () => {
  window.clearTimeout(certScrollTimeout);
  certScrollTimeout = window.setTimeout(() => {
    const center = certScroll.scrollLeft + certScroll.offsetWidth / 2;
    let closestIndex = 0;
    certCards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      if (Math.abs(cardCenter - center) < Math.abs((certCards[closestIndex].offsetLeft + certCards[closestIndex].offsetWidth / 2) - center)) {
        closestIndex = index;
      }
    });
    setActiveCard(closestIndex);
  }, 80);
});

const openCertModal = (card) => {
  const imageSrc = card.getAttribute('data-image');
  if (!imageSrc) {
    return;
  }

  certModalImage.src = imageSrc;
  certModalTitle.textContent = card.getAttribute('data-title') || 'Certificate Preview';
  certModalSource.textContent = card.getAttribute('data-source') || '–';
  certModalId.textContent = card.getAttribute('data-id') || '–';
  certModal.classList.add('open');
  certModal.setAttribute('aria-hidden', 'false');
};

certCards.forEach(card => {
  card.addEventListener('click', () => openCertModal(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCertModal(card);
    }
  });
});

const closeCertModal = () => {
  certModal.classList.remove('open');
  certModal.setAttribute('aria-hidden', 'true');
  certModalImage.src = '';
};

certModalClose.addEventListener('click', closeCertModal);
certModalBackdrop.addEventListener('click', closeCertModal);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && certModal.classList.contains('open')) {
    closeCertModal();
  }
});
