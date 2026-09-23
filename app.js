const modal = document.querySelector('#object-modal');

if (modal) {
  const image = modal.querySelector('.modal-image');
  const title = modal.querySelector('#modal-title');
  const kind = modal.querySelector('#modal-kind');
  const description = modal.querySelector('#modal-description');
  const close = modal.querySelector('.close');
  let previous;

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    previous?.focus();
  };

  document.querySelectorAll('.object-card').forEach(card => {
    card.addEventListener('click', () => {
      previous = card;
      image.src = card.dataset.image;
      image.alt = card.dataset.title;
      title.textContent = card.dataset.title;
      kind.textContent = card.dataset.kind;
      description.textContent = card.dataset.description;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      close.focus();
    });
  });

  close.addEventListener('click', closeModal);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

document.querySelectorAll('.explore-grid').forEach(track => {
  const cards = [...track.querySelectorAll('.object-card')];
  if (cards.length < 2) return;

  const carousel = document.createElement('section');
  const controls = document.createElement('div');
  const previousButton = document.createElement('button');
  const nextButton = document.createElement('button');
  let current = 0;
  let timer;

  carousel.className = 'carousel orbit-carousel';
  controls.className = 'carousel-controls';
  previousButton.className = 'carousel-button';
  previousButton.type = 'button';
  previousButton.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Previous card' : 'Carte précédente');
  previousButton.textContent = '←';
  nextButton.className = 'carousel-button';
  nextButton.type = 'button';
  nextButton.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Next card' : 'Carte suivante');
  nextButton.textContent = '→';

  track.parentNode.insertBefore(carousel, track);
  carousel.append(track, controls);
  controls.append(previousButton, nextButton);
  track.classList.add('carousel-track');

  const show = index => {
    current = (index + cards.length) % cards.length;
    cards.forEach((card, cardIndex) => {
      const distance = (cardIndex - current + cards.length) % cards.length;
      card.classList.remove('is-active', 'is-left', 'is-right', 'is-back');
      card.classList.add(distance === 0 ? 'is-active' : distance === 1 ? 'is-right' : distance === cards.length - 1 ? 'is-left' : 'is-back');
      card.setAttribute('aria-hidden', distance === 0 ? 'false' : 'true');
    });
  };
  const start = () => {
    clearInterval(timer);
    timer = setInterval(() => show(current + 1), 5200);
  };

  cards.forEach((card, cardIndex) => {
    card.addEventListener('click', event => {
      if (!card.classList.contains('is-active')) {
        event.stopImmediatePropagation();
        show(cardIndex);
        start();
      }
    }, true);
  });
  previousButton.addEventListener('click', () => {
    show(current - 1);
    start();
  });
  nextButton.addEventListener('click', () => {
    show(current + 1);
    start();
  });
  carousel.addEventListener('pointermove', event => {
    const bounds = carousel.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    carousel.style.setProperty('--parallax-x', `${(x * 10).toFixed(1)}px`);
    carousel.style.setProperty('--parallax-y', `${(y * 8).toFixed(1)}px`);
    carousel.style.setProperty('--parallax-rotate', `${(x * -5).toFixed(1)}deg`);
  });
  carousel.addEventListener('pointerleave', () => {
    carousel.style.setProperty('--parallax-x', '0px');
    carousel.style.setProperty('--parallax-y', '0px');
    carousel.style.setProperty('--parallax-rotate', '0deg');
    start();
  });
  carousel.addEventListener('pointerenter', () => clearInterval(timer));
  carousel.addEventListener('focusin', () => clearInterval(timer));
  carousel.addEventListener('focusout', start);

  show(0);
  start();
});

const form = document.querySelector('#contact-form');
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    form.querySelector('.form-note').textContent = document.documentElement.lang === 'en' ? 'Signal received — thank you for your message!' : 'Signal reçu — merci pour votre message !';
    form.reset();
  });
}
