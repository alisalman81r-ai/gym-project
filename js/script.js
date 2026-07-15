document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const setActiveLink = () => {
  let current = sections[0]?.id;
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    if (scrollPos >= section.offsetTop) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};

window.addEventListener('scroll', setActiveLink);
setActiveLink();

// Back to top button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Contact form handling (client-side only, no backend wired up)
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !emailPattern.test(email)) {
    formStatus.textContent = 'Please enter a valid name and email address.';
    formStatus.className = 'form-status error';
    return;
  }

  formStatus.textContent = `Thanks, ${name}! We'll be in touch shortly.`;
  formStatus.className = 'form-status success';
  contactForm.reset();
});
