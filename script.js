// Global Variables
let isMenuOpen = false;
const phoneNumber = '+919876543210';
const whatsappMessage = 'Hi! I am interested in your book covering services. Can you provide more information?';

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    setupEventListeners();
    startAnimations();
});

// Initialize Website
function initializeWebsite() {
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Initialize counters
    initializeCounters();
    
    // Setup intersection observer for animations
    setupScrollAnimations();
    
    // Auto-hide header on scroll
    setupHeaderScroll();
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation links smooth scroll
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Form submission
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', handleFormSubmission);
    }
    
    // Pricing card interactions
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', animatePricingCard);
        card.addEventListener('mouseleave', resetPricingCard);
    });
    
    // Testimonial carousel
    setupTestimonialCarousel();
    
    // WhatsApp floating button animation
    animateWhatsAppButton();
    
    // Window resize handler
    window.addEventListener('resize', handleWindowResize);
    
    // Scroll to top on logo click
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => scrollToTop());
    }
}

// Mobile Menu Functions
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle i');
    
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        navLinks.classList.add('mobile-open');
        mobileMenuToggle.classList.replace('fa-bars', 'fa-times');
        document.body.style.overflow = 'hidden';
    } else {
        navLinks.classList.remove('mobile-open');
        mobileMenuToggle.classList.replace('fa-times', 'fa-bars');
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    if (isMenuOpen) {
        toggleMobileMenu();
    }
}

// Navigation Functions
function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    scrollToSection(targetId);
    closeMobileMenu();
}

function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Contact Functions
function openWhatsApp() {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
    
    // Track engagement
    trackEvent('whatsapp_click', 'contact', 'whatsapp_button');
}

function makeCall() {
    window.location.href = `tel:${phoneNumber}`;
    trackEvent('phone_call', 'contact', 'call_button');
}

// Form Handling
function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formObject = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        formObject[key] = value;
    }
    
    // Validate form
    if (validateForm(formObject)) {
        // Show loading state
        showFormLoading(true);
        
        // Simulate form submission
        setTimeout(() => {
            processFormSubmission(formObject);
            showFormLoading(false);
        }, 2000);
    }
}

function validateForm(data) {
    const requiredFields = ['name', 'phone', 'books', 'service'];
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    // Check each required field
    for (let field of requiredFields) {
        const input = document.querySelector(`[name="${field}"]`);
        if (!data[field] || data[field].trim() === '') {
            showFieldError(input, 'This field is required');
            isValid = false;
        }
    }
    
    // Validate phone number
    if (data.phone && !isValidPhoneNumber(data.phone)) {
        const phoneInput = document.querySelector('[name="phone"]');
        showFieldError(phoneInput, 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function isValidPhoneNumber(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

function showFieldError(input, message) {
    input.classList.add('error');
    
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
}

function clearFormErrors() {
    const errorInputs = document.querySelectorAll('.error');
    const errorMessages = document.querySelectorAll('.error-message');
    
    errorInputs.forEach(input => input.classList.remove('error'));
    errorMessages.forEach(message => message.remove());
}

function showFormLoading(isLoading) {
    const submitBtn = document.querySelector('#quoteForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function processFormSubmission(formData) {
    // Create WhatsApp message with form data
    const message = `Hi! I'd like to get a quote for book covering:
    
Name: ${formData.name}
Phone: ${formData.phone}
Number of Books: ${formData.books}
Service Type: ${formData.service}

Please provide me with more details and pricing.`;
    
    // Open WhatsApp with pre-filled message
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    document.getElementById('quoteForm').reset();
    
    // Track conversion
    trackEvent('form_submission', 'lead', 'quote_form');
}

function showSuccessMessage() {
    // Create success popup
    const successPopup = document.createElement('div');
    successPopup.className = 'success-popup';
    successPopup.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Request Sent Successfully!</h3>
            <p>We'll contact you shortly with your quote. You can also continue chatting with us on WhatsApp.</p>
            <button onclick="closeSuccessPopup()" class="btn btn-primary">Got it!</button>
        </div>
    `;
    
    document.body.appendChild(successPopup);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        closeSuccessPopup();
    }, 5000);
}

function closeSuccessPopup() {
    const popup = document.querySelector('.success-popup');
    if (popup) {
        popup.classList.add('fade-out');
        setTimeout(() => popup.remove(), 300);
    }
}

// Animation Functions
function startAnimations() {
    // Animate hero elements
    animateHeroElements();
    
    // Start counter animations when visible
    observeCounters();
    
    // Animate pricing cards on scroll
    animatePricingCardsOnScroll();
}

function animateHeroElements() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroTitle.style.transition = 'all 0.8s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
    }
    
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroSubtitle.style.transition = 'all 0.8s ease';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 600);
    }
    
    if (heroButtons) {
        heroButtons.style.opacity = '0';
        heroButtons.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroButtons.style.transition = 'all 0.8s ease';
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
        }, 900);
    }
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature, .step, .testimonial-card, .pricing-card');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

function animatePricingCard(e) {
    const card = e.currentTarget;
    card.style.transform = 'translateY(-15px) scale(1.02)';
    card.style.transition = 'all 0.3s ease';
}

function resetPricingCard(e) {
    const card = e.currentTarget;
    card.style.transform = 'translateY(0) scale(1)';
}

function animatePricingCardsOnScroll() {
    const pricingSection = document.querySelector('.pricing');
    if (!pricingSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.pricing-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = 'slideInUp 0.6s ease forwards';
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(pricingSection);
}

// Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        counter.textContent = '0';
    });
}

function observeCounters() {
    const counterSection = document.querySelector('.stats');
    if (!counterSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(counterSection);
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Testimonial Carousel
function setupTestimonialCarousel() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length === 0) return;
    
    let currentTestimonial = 0;
    
    // Auto-rotate testimonials
    setInterval(() => {
        testimonialCards[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        testimonialCards[currentTestimonial].classList.add('active');
    }, 5000);
    
    // Initialize first testimonial
    if (testimonialCards.length > 0) {
        testimonialCards[0].classList.add('active');
    }
}

// WhatsApp Button Animation
function animateWhatsAppButton() {
    const whatsappButton = document.querySelector('.whatsapp-float');
    if (!whatsappButton) return;
    
    // Entrance animation
    setTimeout(() => {
        whatsappButton.style.transform = 'scale(1)';
        whatsappButton.style.opacity = '1';
    }, 3000);
    
    // Periodic attention animation
    setInterval(() => {
        whatsappButton.style.animation = 'bounce 1s ease';
        setTimeout(() => {
            whatsappButton.style.animation = '';
        }, 1000);
    }, 15000);
}

// Header Scroll Effect
function setupHeaderScroll() {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        // Add background on scroll
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Utility Functions
function handleWindowResize() {
    // Close mobile menu on resize
    if (window.innerWidth > 768 && isMenuOpen) {
        closeMobileMenu();
    }
    
    // Recalculate scroll positions
    updateScrollPositions();
}

function updateScrollPositions() {
    // Update any scroll-dependent calculations
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        // Update scroll trigger positions if needed
    });
}

// Analytics and Tracking
function trackEvent(action, category, label) {
    // Google Analytics 4 tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    
    // Console log for development
    console.log(`Event tracked: ${action} - ${category} - ${label}`);
}

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy Loading Images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Track errors if analytics is available
    trackEvent('javascript_error', 'error', e.error.message);
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for global access
window.scrollToSection = scrollToSection;
window.openWhatsApp = openWhatsApp;
window.makeCall = makeCall;
window.closeSuccessPopup = closeSuccessPopup;