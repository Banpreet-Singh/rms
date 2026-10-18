// Populate contact details from config.js — edit values there, not here or in the HTML.
(function applySiteConfig() {
  const cfg = window.SITE_CONFIG;
  if (!cfg) return;

  document.querySelectorAll('[data-phone-link]').forEach(function (el) {
    const variant = el.getAttribute('data-phone-link');
    el.textContent = variant === 'short' ? cfg.phoneDisplayShort : cfg.phoneDisplay;
    el.href = 'tel:+' + cfg.phoneIntl;
  });

  document.querySelectorAll('[data-email-link]').forEach(function (el) {
    el.textContent = cfg.email;
    el.href = 'mailto:' + cfg.email;
  });

  document.querySelectorAll('[data-address]').forEach(function (el) {
    const variant = el.getAttribute('data-address');
    el.textContent = variant === 'short' ? cfg.addressShort : cfg.addressFull;
  });

  document.querySelectorAll('[data-wa-link]').forEach(function (el) {
    const msg = el.getAttribute('data-wa-msg') || cfg.whatsappDefaultMsg;
    el.href = 'https://wa.me/' + cfg.phoneIntl + (msg ? '?text=' + encodeURIComponent(msg) : '');
  });
})();

// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', function () {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(function (link) {
  link.addEventListener('click', function () {
    document.querySelectorAll('.nav-links a').forEach(function (l) { l.classList.remove('active'); });
    link.classList.add('active');
    navLinks.classList.remove('open');
  });
});

// Navbar shadow + active-link on scroll
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', function () {
  navbar.classList.toggle('scrolled', window.scrollY > 10);

  let current = '';
  sections.forEach(function (sec) {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  if (current) {
    document.querySelectorAll('.nav-links a').forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }
});

// Scroll-reveal animations
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(function (el) { observer.observe(el); });

// Testimonials carousel, synced with the orbiting avatar highlight
const TESTIMONIALS = [
  { photo: 'images/deepak.png', name: 'Deepak', location: 'Gurugram', title: 'Wonderful Experience Provider.', text: 'RAFTAAR Mobility Services made our dream vacation come true! The staff was incredibly professional and knowledgeable, providing fantastic recommendations and ensuring all our needs were met. We will cherish these memories forever.' },
  { photo: 'images/priya sharma.png', name: 'Priya Sharma', location: 'Delhi', title: 'Smooth Airport Transfer.', text: 'Booked a last-minute airport pickup and the driver was waiting right on time with a clean, comfortable car. No surge pricing surprises, just a straightforward, stress-free ride.' },
  { photo: 'images/rohit verma.png', name: 'Rohit Verma', location: 'Noida', title: 'Reliable For Daily Commute.', text: 'I use RAFTAAR for my daily office commute and it has never let me down. Punctual drivers, fair fares, and the app makes booking a ride almost instant.' },
  { photo: 'images/anjali mehta.png', name: 'Anjali Mehta', location: 'Gurugram', title: 'Perfect For Family Trips.', text: 'We hired an Innova for a family trip to Nainital and the driver was courteous throughout, with frequent breaks for the kids. Genuinely felt like travelling with a trusted friend.' },
  { photo: 'images/Vikram Singh.png', name: 'Vikram Singh', location: 'Dehradun', title: 'Great Outstation Service.', text: 'Took a RAFTAAR cab from Dehradun to Delhi for a business meeting and the car was spotless with a very professional driver. Will definitely book again for my next trip.' },
  { photo: 'images/neha kapoor.png', name: 'Neha Kapoor', location: 'Faridabad', title: 'Stress-Free Wedding Transport.', text: 'Booked multiple cars for our wedding guests and every single one arrived on time. Coordinating pickups across the city was effortless thanks to their responsive support team.' },
  { photo: 'images/Arjun rawat.png', name: 'Arjun Rawat', location: 'Haldwani', title: 'Loved The Corbett Safari Ride.', text: "Our driver for the Jim Corbett trip knew the route perfectly and even suggested a great spot for breakfast on the way. Made the whole safari weekend so much easier." },
  { photo: 'images/Harmeet Singh.png', name: 'Harmeet Singh', location: 'Chandigarh', title: 'Consistently Dependable.', text: "I've booked RAFTAAR a dozen times now for everything from local errands to long drives, and the quality has never dipped. That consistency is exactly why I keep coming back." }
];

(function initTestimonialCarousel() {
  const card = document.getElementById('testiCard');
  if (!card) return;

  const titleEl = document.getElementById('testiTitle');
  const textEl = document.getElementById('testiText');
  const avatarEl = document.getElementById('testiAvatar');
  const nameEl = document.getElementById('testiName');
  const locationEl = document.getElementById('testiLocation');
  const orbitBadges = document.querySelectorAll('.orbit-avatar');

  let current = 0;

  function setActiveAvatar(index) {
    orbitBadges.forEach(function (el) {
      const badge = el.querySelector('.orbit-avatar-badge');
      if (!badge) return;
      badge.classList.toggle('active', Number(el.getAttribute('data-index')) === index);
    });
  }

  function render(index) {
    const t = TESTIMONIALS[index];
    titleEl.textContent = t.title;
    textEl.textContent = t.text;
    avatarEl.src = t.photo;
    avatarEl.alt = t.name;
    nameEl.textContent = t.name;
    locationEl.textContent = t.location;
    setActiveAvatar(index);
  }

  function goTo(index) {
    if (index === current) return;
    current = index;
    card.classList.add('fade');
    setTimeout(function () {
      render(current);
      card.classList.remove('fade');
    }, 350);
  }

  let timer;
  function startAutoplay() {
    timer = setInterval(function () {
      goTo((current + 1) % TESTIMONIALS.length);
    }, 9000);
  }
  function restartAutoplay() {
    clearInterval(timer);
    startAutoplay();
  }

  render(current);
  startAutoplay();

  orbitBadges.forEach(function (el) {
    el.addEventListener('click', function () {
      const index = Number(el.getAttribute('data-index'));
      goTo(index);
      restartAutoplay();
    });
  });
})();

