// ===================================
// GLOR BIENES RAÍCES - JavaScript
// Riviera Maya Luxury Real Estate
// ===================================

// === GLOBAL STATE ===
let currentLanguage = 'es'; // Default Spanish
let translations = {};
let properties = [];
let currentAboutTestimonial = 0;
let currentHeroSlide = 0;
let currentAboutSlide = 0;
let heroSlides = [];
let aboutBackgrounds = [];

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', async () => {
  // Load data from JSON files
  await loadTranslations();
  await loadProperties();

  // Initialize components
  initNavbar();
  initHeroSlider();
  initAboutBackgrounds();
  initMobileMenu();
  initLanguageToggle();
  initScrollAnimations();
  initAboutTestimonials();
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
    if (window.scrollY > 50) {
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

        // Close full screen menu if open
        const fullScreenMenu = document.querySelector('.full-screen-menu');
        if (fullScreenMenu && fullScreenMenu.classList.contains('active')) {
          fullScreenMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });
}

// === HERO SLIDER ===
function initHeroSlider() {
  const heroSlider = document.querySelector('.hero-slider');
  const heroImages = [
    'images/hero/hero_beachfront_villa_1766071844160.png',
    'images/hero/hero_tulum_jungle_1766071862778.png',
    'images/hero/hero_cancun_condo_1766071880927.png',
    'images/hero/hero_bacalar_lakefront_1766071902073.png',
    'images/hero/hero_playa_penthouse_1766071926554.png'
  ];

  if (heroSlider) {
    // Clear existing content
    heroSlider.innerHTML = '';

    // Create slides
    heroImages.forEach((img, index) => {
      const slide = document.createElement('div');
      slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
      slide.style.backgroundImage = `url('${img}')`;
      heroSlider.appendChild(slide);
    });

    // Auto-rotate
    setInterval(() => {
      const slides = document.querySelectorAll('.hero-slide');
      if (slides.length > 0) {
        slides[currentHeroIndex].classList.remove('active');
        currentHeroIndex = (currentHeroIndex + 1) % slides.length;
        slides[currentHeroIndex].classList.add('active');
      }
    }, 5000);
  }
}

// === MOBILE MENU (FULL SCREEN) ===
function initMobileMenu() {
  const menuTrigger = document.querySelector('.menu-trigger');
  const menuClose = document.querySelector('.menu-close');
  const fullScreenMenu = document.querySelector('.full-screen-menu');
  const menuLinks = document.querySelectorAll('.menu-link, .menu-list a');

  function toggleMenu() {
    if (fullScreenMenu) {
      fullScreenMenu.classList.toggle('active');
      document.body.style.overflow = fullScreenMenu.classList.contains('active') ? 'hidden' : '';
    }
  }

  if (menuTrigger) {
    menuTrigger.addEventListener('click', toggleMenu);
  }

  if (menuClose) {
    menuClose.addEventListener('click', toggleMenu);
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

// === ABOUT BACKGROUNDS ===
function initAboutBackgrounds() {
  // Reuse the same images from the hero section
  aboutBackgrounds = [
    'images/hero/property_hero_1.jpg',
    'images/hero/property_hero_2.jpg',
    'images/hero/property_hero_3.jpg',
    'images/hero/property_hero_4.jpg',
    'images/hero/property_hero_5.jpg'
  ];

  const sliderContainer = document.querySelector('.about-background-slider');
  if (!sliderContainer) return;

  // Create background slides
  aboutBackgrounds.forEach((image, index) => {
    const slide = document.createElement('div');
    slide.className = `about-background-slide ${index === 0 ? 'active' : ''}`;
    slide.style.backgroundImage = `url('${image}')`;
    sliderContainer.appendChild(slide);
  });

  // Auto-rotate backgrounds every 8 seconds
  setInterval(nextAboutBackground, 8000);
}

function nextAboutBackground() {
  const slides = document.querySelectorAll('.about-background-slide');
  if (slides.length === 0) return;

  slides[currentAboutSlide].classList.remove('active');
  currentAboutSlide = (currentAboutSlide + 1) % slides.length;
  slides[currentAboutSlide].classList.add('active');
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
        <svg class="icon-svg" style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <span>${property.location}</span>
      </div>
      <div class="property-specs">
        <span>
          <svg class="icon-svg" style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path></svg> 
          ${property.beds} ${t?.featuredProperties?.beds || 'recámaras'}
        </span>
        <span>
          <svg class="icon-svg" style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21h6"></path><path d="M5 21h14"></path><path d="M5 21v-8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8"></path><path d="M17 9l-1.5-3"></path><path d="M2 10h20"></path></svg>
          ${property.baths} ${t?.featuredProperties?.baths || 'baños'}
        </span>
        <span>
          <svg class="icon-svg" style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M9 21H3v-6"></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"></path></svg>
          ${property.sqm_construction} m²
        </span>
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

// === ABOUT TESTIMONIALS ===
function initAboutTestimonials() {
  const testimonials = [
    {
      text_es: "Excelente servicio y muy profesional. Gloria nos ayudó a encontrar la casa perfecta en Tulum.",
      text_en: "Excellent service and very professional. Gloria helped us find the perfect home in Tulum.",
      author: "Cliente Satisfecho"
    },
    {
      text_es: "100% recomendada. Conoce muy bien el mercado de Riviera Maya y es muy atenta.",
      text_en: "100% recommended. She knows the Riviera Maya market very well and is very attentive.",
      author: "Cliente Satisfecho"
    },
    {
      text_es: "Great bilingual service! Gloria made our investment in Playa del Carmen smooth and easy.",
      text_en: "Great bilingual service! Gloria made our investment in Playa del Carmen smooth and easy.",
      author: "Satisfied Client"
    },
    {
      text_es: "Profesional, dedicada y conocedora del mercado. La mejor experiencia comprando en Cancún.",
      text_en: "Professional, dedicated and market-savvy. The best experience buying in Cancún.",
      author: "Cliente Satisfecho"
    },
    {
      text_es: "Her expertise in luxury properties is outstanding. Highly recommend for international buyers.",
      text_en: "Her expertise in luxury properties is outstanding. Highly recommend for international buyers.",
      author: "Satisfied Client"
    },
    {
      text_es: "Atención personalizada de principio a fin. Gloria hizo todo el proceso muy fácil.",
      text_en: "Personalized attention from start to finish. Gloria made the whole process very easy.",
      author: "Cliente Satisfecho"
    }
  ];

  const carousel = document.getElementById('about-testimonial-carousel');
  const dots = document.getElementById('about-testimonial-dots');

  if (!carousel || !dots) return;

  // Create testimonial slides
  testimonials.forEach((testimonial, index) => {
    const slide = document.createElement('div');
    slide.className = `about-testimonial-slide ${index === 0 ? 'active' : ''}`;

    const text = currentLanguage === 'es' ? testimonial.text_es : testimonial.text_en;

    slide.innerHTML = `
      <p class="testimonial-quote">"${text}"</p>
      <p class="testimonial-author">— ${testimonial.author}</p>
    `;

    carousel.appendChild(slide);

    // Create dot button
    const button = document.createElement('button');
    button.className = index === 0 ? 'active' : '';
    button.addEventListener('click', () => goToAboutTestimonial(index));
    dots.appendChild(button);
  });

  // Auto-rotate testimonials every 5 seconds
  setInterval(nextAboutTestimonial, 5000);
}

function nextAboutTestimonial() {
  const slides = document.querySelectorAll('.about-testimonial-slide');
  const buttons = document.querySelectorAll('.about-testimonial-dots button');

  if (slides.length === 0) return;

  slides[currentAboutTestimonial].classList.remove('active');
  buttons[currentAboutTestimonial].classList.remove('active');

  currentAboutTestimonial = (currentAboutTestimonial + 1) % slides.length;

  slides[currentAboutTestimonial].classList.add('active');
  buttons[currentAboutTestimonial].classList.add('active');
}

function goToAboutTestimonial(index) {
  const slides = document.querySelectorAll('.about-testimonial-slide');
  const buttons = document.querySelectorAll('.about-testimonial-dots button');

  slides[currentAboutTestimonial].classList.remove('active');
  buttons[currentAboutTestimonial].classList.remove('active');

  currentAboutTestimonial = index;
  slides[currentAboutTestimonial].classList.add('active');
  buttons[currentAboutTestimonial].classList.add('active');
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
