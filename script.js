// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Active navigation link based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Event Card Interactions
const eventCards = document.querySelectorAll('.event-card');

eventCards.forEach(card => {
    const image = card.querySelector('.event-image img');
    const overlay = card.querySelector('.event-overlay');
    const icon = card.querySelector('.event-icon');
    const button = card.querySelector('.details-btn');
    
    // Parallax effect on mouse move
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) / 20;
        const moveY = (y - centerY) / 20;
        
        image.style.transform = `scale(1.15) translate(${moveX}px, ${moveY}px)`;
        icon.style.transform = `translateY(0) translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
    });
    
    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
        image.style.transform = 'scale(1) translate(0, 0)';
        icon.style.transform = 'translateY(20px)';
    });

    // Button click animation
    button.addEventListener('click', (e) => {
        e.preventDefault();
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
            // Add your booking logic here
            showNotification('Redirecting to booking page...', 'success');
        }, 300);
    });
});

// Add button click animation styles
const buttonStyle = document.createElement('style');
buttonStyle.textContent = `
    .details-btn.clicked {
        transform: scale(0.95);
    }
`;
document.head.appendChild(buttonStyle);

// Testimonial Slider
const testimonialSlider = document.querySelector('.testimonial-slider');
const slides = document.querySelectorAll('.testimonial-slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const indicatorsContainer = document.querySelector('.testimonial-indicators');

let currentSlide = 0;
const slideCount = slides.length;

// Create indicators
slides.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    if (index === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToSlide(index));
    indicatorsContainer.appendChild(indicator);
});

const indicators = document.querySelectorAll('.indicator');

function updateSlider() {
    testimonialSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    updateSlider();
}

// Auto-play functionality
let autoPlayInterval = setInterval(nextSlide, 5000);

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 5000);
}

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
});

// Form Submission
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const eventType = document.getElementById('event-type').value;
    const eventDate = document.getElementById('event-date').value;
    const message = document.getElementById('message').value;

    // Basic validation
    if (!name || !email || !phone || !eventType || !eventDate || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        showNotification('Please enter a valid 10-digit phone number', 'error');
        return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// Notification System
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add icon based on notification type
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    notification.prepend(icon);

    // Add styles to notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '8px',
        color: 'white',
        backgroundColor: type === 'success' ? '#4CAF50' : '#f44336',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        zIndex: '1000',
        animation: 'slideIn 0.5s ease-out',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '300px'
    });

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.event-card, .about-content, .contact-container, .testimonial-slide').forEach(el => {
    observer.observe(el);
});

// Add fade-in animation styles
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
    .event-card, .about-content, .contact-container, .testimonial-slide {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }

    .fade-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(fadeStyle);

// Hero Slider
const heroSlider = document.querySelector('.hero-slider');
const heroSlides = document.querySelectorAll('.hero-slide');
const prevSlideBtn = document.querySelector('.prev-slide');
const nextSlideBtn = document.querySelector('.next-slide');
const slideIndicatorsContainer = document.querySelector('.slide-indicators');

let currentHeroSlide = 0;
const heroSlideCount = heroSlides.length;

// Create indicators for hero slider
heroSlides.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.classList.add('slide-indicator');
    if (index === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToHeroSlide(index));
    slideIndicatorsContainer.appendChild(indicator);
});

const heroIndicators = document.querySelectorAll('.slide-indicator');

function updateHeroSlider() {
    heroSlides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentHeroSlide);
    });
    heroIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentHeroSlide);
    });
}

function goToHeroSlide(index) {
    currentHeroSlide = index;
    updateHeroSlider();
}

function nextHeroSlide() {
    currentHeroSlide = (currentHeroSlide + 1) % heroSlideCount;
    updateHeroSlider();
}

function prevHeroSlide() {
    currentHeroSlide = (currentHeroSlide - 1 + heroSlideCount) % heroSlideCount;
    updateHeroSlider();
}

// Auto-play functionality for hero slider
let heroAutoPlayInterval = setInterval(nextHeroSlide, 5000);

function resetHeroAutoPlay() {
    clearInterval(heroAutoPlayInterval);
    heroAutoPlayInterval = setInterval(nextHeroSlide, 5000);
}

prevSlideBtn.addEventListener('click', () => {
    prevHeroSlide();
    resetHeroAutoPlay();
});

nextSlideBtn.addEventListener('click', () => {
    nextHeroSlide();
    resetHeroAutoPlay();
}); 