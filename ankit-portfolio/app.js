// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('show');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(var(--color-surface-rgb, 255, 255, 253), 0.98)';
            header.style.boxShadow = 'var(--shadow-sm)';
        } else {
            header.style.background = 'rgba(var(--color-surface-rgb, 255, 255, 253), 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // Skill bars animation
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillsSection = document.getElementById('skills');
    let skillsAnimated = false;

    function animateSkills() {
        if (skillsAnimated) return;
        
        const skillsRect = skillsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (skillsRect.top < windowHeight * 0.8) {
            skillBars.forEach(bar => {
                const skillLevel = bar.getAttribute('data-skill');
                setTimeout(() => {
                    bar.style.width = skillLevel + '%';
                }, 200);
            });
            skillsAnimated = true;
        }
    }

    window.addEventListener('scroll', animateSkills);

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    const formInputs = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        message: document.getElementById('message')
    };
    const formErrors = {
        name: document.getElementById('name-error'),
        email: document.getElementById('email-error'),
        message: document.getElementById('message-error')
    };

    // Form validation functions
    function validateName(name) {
        if (name.trim().length < 2) {
            return 'Name must be at least 2 characters long';
        }
        return '';
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    }

    function validateMessage(message) {
        if (message.trim().length < 10) {
            return 'Message must be at least 10 characters long';
        }
        return '';
    }

    // Real-time validation
    formInputs.name.addEventListener('blur', function() {
        const error = validateName(this.value);
        formErrors.name.textContent = error;
        this.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
    });

    formInputs.email.addEventListener('blur', function() {
        const error = validateEmail(this.value);
        formErrors.email.textContent = error;
        this.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
    });

    formInputs.message.addEventListener('blur', function() {
        const error = validateMessage(this.value);
        formErrors.message.textContent = error;
        this.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
    });

    // Clear errors when user starts typing
    Object.keys(formInputs).forEach(key => {
        formInputs[key].addEventListener('input', function() {
            if (formErrors[key].textContent) {
                formErrors[key].textContent = '';
                this.style.borderColor = 'var(--color-border)';
            }
        });
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        Object.keys(formErrors).forEach(key => {
            formErrors[key].textContent = '';
            formInputs[key].style.borderColor = 'var(--color-border)';
        });

        // Validate all fields
        const errors = {
            name: validateName(formInputs.name.value),
            email: validateEmail(formInputs.email.value),
            message: validateMessage(formInputs.message.value)
        };

        let hasErrors = false;
        Object.keys(errors).forEach(key => {
            if (errors[key]) {
                formErrors[key].textContent = errors[key];
                formInputs[key].style.borderColor = 'var(--color-error)';
                hasErrors = true;
            }
        });

        if (!hasErrors) {
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                // Show success message
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        }
    });

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: var(--color-surface);
            border: 1px solid var(--color-${type === 'success' ? 'success' : type === 'error' ? 'error' : 'info'});
            border-radius: var(--radius-base);
            padding: 1rem;
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            max-width: 400px;
            transform: translateX(120%);
            transition: transform var(--duration-normal) var(--ease-standard);
        `;

        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        `;

        const notificationMessage = notification.querySelector('.notification-message');
        notificationMessage.style.cssText = `
            color: var(--color-${type === 'success' ? 'success' : type === 'error' ? 'error' : 'info'});
            font-weight: var(--font-weight-medium);
        `;

        const closeButton = notification.querySelector('.notification-close');
        closeButton.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--color-text-secondary);
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close functionality
        closeButton.addEventListener('click', () => {
            closeNotification(notification);
        });

        // Auto close after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                closeNotification(notification);
            }
        }, 5000);
    }

    function closeNotification(notification) {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 300);
    }

    // Hero buttons functionality - FIXED NAVIGATION
    const viewWorkButton = document.querySelector('.hero-buttons .btn--primary');
    const getInTouchButton = document.querySelector('.hero-buttons .btn--outline');

    if (viewWorkButton) {
        viewWorkButton.addEventListener('click', function(e) {
            e.preventDefault();
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                const offsetTop = projectsSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }

    if (getInTouchButton) {
        getInTouchButton.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const offsetTop = contactSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .about-content, .contact-info, .contact-form');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Add animation styles
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .skill-card,
        .project-card,
        .about-content,
        .contact-info,
        .contact-form {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        
        .skill-card.animate-in,
        .project-card.animate-in,
        .about-content.animate-in,
        .contact-info.animate-in,
        .contact-form.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .project-card.animate-in {
            transition-delay: 0.1s;
        }
        
        .skill-card.animate-in {
            transition-delay: 0.05s;
        }
    `;
    document.head.appendChild(animationStyles);

    // Initialize skills animation on page load if skills section is visible
    setTimeout(animateSkills, 500);

    // Performance optimization: Throttle scroll events
    let ticking = false;
    
    function throttledScrollHandler() {
        if (!ticking) {
            requestAnimationFrame(function() {
                highlightNavigation();
                animateSkills();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Replace direct scroll listeners with throttled version
    window.removeEventListener('scroll', highlightNavigation);
    window.removeEventListener('scroll', animateSkills);
    window.addEventListener('scroll', throttledScrollHandler);

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
            
            // Close any notifications
            const notification = document.querySelector('.notification');
            if (notification) {
                closeNotification(notification);
            }
        }
    });

    // Initialize page
    highlightNavigation();
    console.log('Portfolio website initialized successfully!');
});