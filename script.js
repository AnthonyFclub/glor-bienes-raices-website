// ===================================
// GLOR BIENES RAÍCES - JavaScript
// Riviera Maya Luxury Real Estate
// ===================================

// === GLOBAL STATE ===
let currentLanguage = 'es'; // Default Spanish
let translations = {};
let properties = [];
let currentTestimonial = 0;
let currentHeroSlide = 0;
let heroSlides = [];

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', async () => {
  // Load data from JSON files
  await loadTranslations();
  await loadProperties();

  // Initialize components
  initNavbar();
  initHeroSlider();
  initMobileMenu();
  initLanguageToggle();
  initScrollAnimations();
  initTestimonials();
  renderProperties();
  renderLocations();
  updateContent();

  // Set WhatsApp links
  setupWhatsAppLinks();
});

// === LOAD DATA ===
async function loadTranslations() {
  try {
    const response = await fetch('data/translations.json');
    translations = await response.json();
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

async function loadProperties() {
  try {
    const response = await fetch('data/properties.json');
    const data = await response.json();
    properties = data.properties;
  } catch (error) {
    console.error('Error loading properties:', error);
  }
}

// === NAVBAR ===
function initNavbar() {
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        // Close mobile menu if open
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
          mobileMenu.classList.remove('active');
        }
      }
    });
  });
}

// === MOBILE MENU ===
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menu = document.querySelector('.mobile-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
  }
}

// === LANGUAGE TOGGLE ===
function initLanguageToggle() {
  const esBtn = document.getElementById('lang-es');
  const enBtn = document.getElementById('lang-en');
  const esBtnMobile = document.getElementById('lang-es-mobile');
  const enBtnMobile = document.getElementById('lang-en-mobile');

  if (esBtn && enBtn) {
    esBtn.addEventListener('click', () => switchLanguage('es'));
    enBtn.addEventListener('click', () => switchLanguage('en'));
  }

  if (esBtnMobile && enBtnMobile) {
    esBtnMobile.addEventListener('click', () => switchLanguage('es'));
    enBtnMobile.addEventListener('click', () => switchLanguage('en'));
  }
}

function switchLanguage(lang) {
  currentLanguage = lang;

  // Update active button for both desktop and mobile
  document.querySelectorAll('.language-toggle button').forEach(btn => {
    btn.classList.remove('active');
  });

  // Add active class to both desktop and mobile buttons
  const desktopBtn = document.getElementById(`lang-${lang}`);
  const mobileBtn = document.getElementById(`lang-${lang}-mobile`);

  if (desktopBtn) {
    desktopBtn.classList.add('active');
  }
  if (mobileBtn) {
    mobileBtn.classList.add('active');
  }

  // Update all content
  updateContent();
  renderProperties();

  // Store preference
  localStorage.setItem('preferredLanguage', lang);
}

function updateContent() {
  const t = translations[currentLanguage];
  if (!t) return;

  // Update all text content with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const keys = key.split('.');
    let value = t;

    for (const k of keys) {
      value = value[k];
      if (!value) break;
    }

    if (value) {
      element.textContent = value;
    }
  });

  // Update all placeholders with data-i18n-placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const keys = key.split('.');
    let value = t;

    for (const k of keys) {
      value = value[k];
      if (!value) break;
    }

    if (value) {
      element.placeholder = value;
    }
  });

  // Update page title
  document.title = `GLOR Bienes Raíces | ${currentLanguage === 'es' ? 'Bienes Raíces de Lujo en Riviera Maya' : 'Luxury Real Estate in Riviera Maya'}`;
}

// === HERO SLIDER ===
function initHeroSlider() {
  heroSlides = [
    'images/hero/property_hero_1.jpg',
    'images/hero/property_hero_2.jpg',
    'images/hero/property_hero_3.jpg',
    'images/hero/property_hero_4.jpg',
    'images/hero/property_hero_5.jpg'
  ];

  const sliderContainer = document.querySelector('.hero-slider');
  if (!sliderContainer) return;

  // Create slides
  heroSlides.forEach((image, index) => {
    const slide = document.createElement('div');
    slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
    slide.style.backgroundImage = `url('${image}')`;
    sliderContainer.appendChild(slide);
  });

  // Auto-rotate slides
  setInterval(nextHeroSlide, 5000);
}

function nextHeroSlide() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;

  slides[currentHeroSlide].classList.remove('active');
  currentHeroSlide = (currentHeroSlide + 1) % slides.length;
  slides[currentHeroSlide].classList.add('active');
}

// === PROPERTIES ===
function renderProperties() {
  const grid = document.getElementById('properties-grid');
  if (!grid || properties.length === 0) return;

  grid.innerHTML = '';
  const t = translations[currentLanguage];

  // Filter featured properties
  const featuredProperties = properties.filter(p => p.featured);

  featuredProperties.forEach(property => {
    const card = createPropertyCard(property, t);
    grid.appendChild(card);
  });
}

function createPropertyCard(property, t) {
  const card = document.createElement('div');
  card.className = 'property-card fade-in';

  const title = currentLanguage === 'es' ? property.title_es : property.title_en;
  const description = currentLanguage === 'es' ? property.description_es : property.description_en;

  card.innerHTML = `
    <div class="property-image-wrapper">
      <img src="${property.image}" alt="${title}" class="property-image">
      <div class="property-price">$${formatPrice(property.price_usd)} USD</div>
      <div class="property-overlay">
        <span>${t?.featuredProperties?.viewDetails || 'Ver Detalles'}</span>
      </div>
    </div>
    <div class="property-details">
      <h3>${title}</h3>
      <div class="property-location">
        <span>📍</span>
        <span>${property.location}</span>
      </div>
      <div class="property-specs">
        <span>🛏️ ${property.beds} ${t?.featuredProperties?.beds || 'recámaras'}</span>
        <span>🛁 ${property.baths} ${t?.featuredProperties?.baths || 'baños'}</span>
        <span>📏 ${property.sqm_construction} m²</span>
      </div>
    </div>
  `;

  return card;
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-US').format(price);
}

// === LOCATIONS ===
function renderLocations() {
  const grid = document.getElementById('locations-grid');
  if (!grid) return;

  // Use hero images as placeholder backgrounds for locations
  const locationImages = {
    'Cancún': 'images/hero/hero_cancun_condo_1766071880927.png',
    'Playa del Carmen': 'images/hero/hero_playa_penthouse_1766071926554.png',
    'Tulum': 'images/hero/hero_tulum_jungle_1766071862778.png',
    'Puerto Morelos': 'images/hero/hero_beachfront_villa_1766071844160.png',
    'Bacalar': 'images/hero/hero_bacalar_lakefront_1766071902073.png',
    'Akumal': 'images/hero/hero_beachfront_villa_1766071844160.png',
    'Mérida': 'images/hero/hero_tulum_jungle_1766071862778.png',
    'Chetumal': 'images/hero/hero_bacalar_lakefront_1766071902073.png',
    'Zona Hotelera': 'images/hero/hero_cancun_condo_1766071880927.png'
  };

  const locations = [
    { name: 'Cancún', tagline: currentLanguage === 'es' ? 'Vida resort y centro de inversión' : 'Resort living & investment hub' },
    { name: 'Playa del Carmen', tagline: currentLanguage === 'es' ? 'Centro vibrante y estilo de vida playero' : 'Vibrant downtown & beach lifestyle' },
    { name: 'Tulum', tagline: currentLanguage === 'es' ? 'Lujo bohemio y cenotes' : 'Bohemian luxury & cenotes' },
    { name: 'Puerto Morelos', tagline: currentLanguage === 'es' ? 'Encanto tranquilo y familiar' : 'Quiet charm & family-friendly' },
    { name: 'Bacalar', tagline: currentLanguage === 'es' ? 'Laguna mágica y escape natural' : 'Magical lagoon & nature escape' },
    { name: 'Akumal', tagline: currentLanguage === 'es' ? 'Bahía de tortugas y paraíso del buceo' : 'Turtle bay & diving paradise' },
    { name: 'Mérida', tagline: currentLanguage === 'es' ? 'Elegancia colonial y cultura' : 'Colonial elegance & culture' },
    { name: 'Chetumal', tagline: currentLanguage === 'es' ? 'Ciudad capital y centro de negocios' : 'Capital city & business center' },
    { name: 'Zona Hotelera', tagline: currentLanguage === 'es' ? 'Corredor turístico y alto ROI' : 'Tourist corridor & high ROI' }
  ];

  grid.innerHTML = '';

  locations.forEach(location => {
    const card = document.createElement('div');
    card.className = 'location-card fade-in';

    card.innerHTML = `
      <img src="${locationImages[location.name]}" alt="${location.name}" class="location-background">
      <div class="location-overlay">
        <div class="location-name">${location.name}</div>
        <div class="location-tagline">${location.tagline}</div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// === TESTIMONIALS ===
function initTestimonials() {
  const testimonials = [
    {
      text_es: "Gloria nos ayudó a encontrar nuestra casa de ensueño en Tulum. Su conocimiento del mercado y profesionalismo son excepcionales.",
      text_en: "Gloria helped us find our dream home in Tulum. Her market knowledge and professionalism are exceptional.",
      author: "María y Carlos Rodríguez",
      property: "Villa Tulum"
    },
    {
      text_es: "Excelente servicio desde el primer contacto hasta el cierre. Gloria hizo que todo el proceso fuera muy sencillo.",
      text_en: "Excellent service from first contact to closing. Gloria made the entire process very simple.",
      author: "John & Sarah Mitchell",
      property: "Cancún Beachfront"
    },
    {
      text_es: "Como inversionista extranjero, aprecié mucho el apoyo legal y la transparencia de Gloria en cada paso.",
      text_en: "As a foreign investor, I greatly appreciated Gloria's legal support and transparency at every step.",
      author: "David Thompson",
      property: "Playa del Carmen Condo"
    },
    {
      text_es: "Gloria es increíblemente profesional y conocedora. Nos consiguió una propiedad increíble en Bacalar.",
      text_en: "Gloria is incredibly professional and knowledgeable. She got us an amazing property in Bacalar.",
      author: "Laura Martínez",
      property: "Casa Bacalar"
    },
    {
      text_es: "El mejor agente inmobiliario en Riviera Maya. Altamente recomendada para cualquier compra de propiedad.",
      text_en: "The best real estate agent in Riviera Maya. Highly recommended for any property purchase.",
      author: "Michael & Jennifer Lee",
      property: "Puerto Morelos Home"
    },
    {
      text_es: "Gloria superó todas nuestras expectativas. Su dedicación y atención al detalle son incomparables.",
      text_en: "Gloria exceeded all our expectations. Her dedication and attention to detail are unmatched.",
      author: "Roberto Sánchez",
      property: "Zona Hotelera Investment"
    }
  ];

  const carousel = document.getElementById('testimonial-carousel');
  const controls = document.getElementById('testimonial-controls');

  if (!carousel || !controls) return;

  // Create testimonial slides
  testimonials.forEach((testimonial, index) => {
    const slide = document.createElement('div');
    slide.className = `testimonial-slide ${index === 0 ? 'active' : ''}`;

    const text = currentLanguage === 'es' ? testimonial.text_es : testimonial.text_en;

    slide.innerHTML = `
      <div class="testimonial-stars">★★★★★</div>
      <p class="testimonial-text">"${text}"</p>
      <p class="testimonial-author">${testimonial.author}</p>
      <p class="testimonial-property">${testimonial.property}</p>
    `;

    carousel.appendChild(slide);

    // Create control button
    const button = document.createElement('button');
    button.className = index === 0 ? 'active' : '';
    button.addEventListener('click', () => goToTestimonial(index));
    controls.appendChild(button);
  });

  // Auto-rotate testimonials
  setInterval(nextTestimonial, 6000);
}

function nextTestimonial() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const buttons = document.querySelectorAll('.testimonial-controls button');

  if (slides.length === 0) return;

  slides[currentTestimonial].classList.remove('active');
  buttons[currentTestimonial].classList.remove('active');

  currentTestimonial = (currentTestimonial + 1) % slides.length;

  slides[currentTestimonial].classList.add('active');
  buttons[currentTestimonial].classList.add('active');
}

function goToTestimonial(index) {
  const slides = document.querySelectorAll('.testimonial-slide');
  const buttons = document.querySelectorAll('.testimonial-controls button');

  slides[currentTestimonial].classList.remove('active');
  buttons[currentTestimonial].classList.remove('active');

  currentTestimonial = index;

  slides[currentTestimonial].classList.add('active');
  buttons[currentTestimonial].classList.add('active');
}

// === WHATSAPP ===
function setupWhatsAppLinks() {
  const phone = '5219842695799'; // Gloria's WhatsApp number
  const message = currentLanguage === 'es'
    ? 'Hola Gloria, estoy interesado en las propiedades de Riviera Maya.'
    : 'Hello Gloria, I am interested in the Riviera Maya properties.';

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  // Update all WhatsApp links
  document.querySelectorAll('.whatsapp-link').forEach(link => {
    link.href = whatsappUrl;
  });

  // Floating button
  const floatingBtn = document.querySelector('.floating-whatsapp');
  if (floatingBtn) {
    floatingBtn.addEventListener('click', () => {
      window.open(whatsappUrl, '_blank');
    });
  }
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // Re-observe when properties are rendered
  setTimeout(() => {
    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });
  }, 500);
}

// === UTILITY FUNCTIONS ===
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Reload language-dependent content when language changes
window.addEventListener('storage', (e) => {
  if (e.key === 'preferredLanguage') {
    currentLanguage = e.newValue || 'es';
    updateContent();
    renderProperties();
    renderLocations();
  }
});

// Re-init testimonials when language changes
const originalSwitchLanguage = switchLanguage;
switchLanguage = function (lang) {
  originalSwitchLanguage(lang);

  // Clear and re-render testimonials
  const carousel = document.getElementById('testimonial-carousel');
  const controls = document.getElementById('testimonial-controls');
  if (carousel && controls) {
    carousel.innerHTML = '';
    controls.innerHTML = '';
    currentTestimonial = 0;
    initTestimonials();
  }

  // Re-render locations
  renderLocations();

  // Update WhatsApp links
  setupWhatsAppLinks();
};
