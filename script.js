const loader = document.getElementById('pageLoader');
const cursorGlow = document.getElementById('cursorGlow');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('.reveal');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 800);
});

const updateCursorGlow = (event) => {
  cursorGlow.style.opacity = '1';
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
};

document.addEventListener('mousemove', updateCursorGlow);
document.addEventListener('mouseleave', () => {
  cursorGlow.style.opacity = '0';
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => observer.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const target = link.getAttribute('href').replace('#', '');
          link.classList.toggle('active', target === entry.target.id);
        });
      }
    });
  },
  { threshold: 0.45 }
);

sections.forEach((section) => sectionObserver.observe(section));

const cards = document.querySelectorAll('.glass-panel, .project-card, .hero-card');

cards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

const form = document.getElementById('contactForm');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = form.querySelector('button');
  const userName = form.querySelector('input[name="user_name"]').value;
  const userEmail = form.querySelector('input[name="user_email"]').value;
  const message = form.querySelector('textarea[name="message"]').value;
  
  button.textContent = 'Sending...';
  button.disabled = true;

  // Send via FormSubmit.co (no signup required, emails to hnaveen036@gmail.com)
  fetch('https://formsubmit.co/ajax/hnaveen036@gmail.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: userName,
      email: userEmail,
      message: message
    })
  })
    .then((response) => {
      if (response.ok) {
        button.textContent = 'Message Sent ✓';
        setTimeout(() => {
          button.textContent = 'Send Message';
          button.disabled = false;
          form.reset();
        }, 1800);
      } else {
        throw new Error('Failed to send');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      button.textContent = 'Error - Try Again';
      setTimeout(() => {
        button.textContent = 'Send Message';
        button.disabled = false;
      }, 1800);
    });
});
