// Wrap everything in an IIFE or DOMContentLoaded to ensure DOM is ready
(function() {
    'use strict'; // Optional: Enable strict mode

    // --- Smooth Scrolling (JS fallback if CSS `scroll-behavior` isn't supported/enough) ---
    // Consider removing if CSS method works well for you.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('header')?.offsetHeight || 70; // Use header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth' // JS smooth scroll
                });

                // Optional: Close mobile menu if open after clicking a link
                // if (mobileMenuIsOpen) closeMobileMenu();
            } else {
                 console.warn(`Smooth scroll target not found: ${targetId}`);
            }
        });
    });

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const formStatus = document.getElementById('formStatus'); // Get status element once
        const contactContainer = contactForm.closest('.contact-container'); // Get container
        const originalFormHTML = contactForm.outerHTML; // Store original form structure

        const handleContactFormSubmit = async function(e) {
            e.preventDefault();
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const subjectInput = form.querySelector('#subject');
            const subject = subjectInput ? subjectInput.value : 'your inquiry';

            if (!formStatus || !contactContainer || !submitBtn) {
                console.error("Contact form elements not found."); return;
            }

            formStatus.textContent = '';
            formStatus.className = 'form-status';
            formStatus.style.display = 'none';

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

                const response = await fetch(form.action, {
                    method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // --- Success ---
                    const thankYouMessage = `
                        <div class="thank-you-message" style="opacity: 0; transition: opacity 0.5s ease-in-out;">
                            <h3><i class="fas fa-check-circle" style="color: var(--secondary-color); margin-right: 0.5rem;"></i> Thank you!</h3>
                            <p>Your message regarding "${subject}" has been sent successfully.</p>
                            <p>I appreciate you reaching out and will get back to you shortly.</p>
                            <p>Best regards,<br>Extropian Janus</p>
                        </div>
                    `;
                    contactContainer.innerHTML = thankYouMessage;
                    setTimeout(() => { // Fade in
                        const thankYouDiv = contactContainer.querySelector('.thank-you-message');
                        if (thankYouDiv) thankYouDiv.style.opacity = '1';
                    }, 10);
                    contactContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // --- Restore form ---
                    setTimeout(() => {
                        const thankYouDiv = contactContainer.querySelector('.thank-you-message');
                        if (thankYouDiv) thankYouDiv.style.opacity = '0'; // Fade out
                        setTimeout(() => { // Restore after fade
                            contactContainer.innerHTML = originalFormHTML;
                            const newForm = document.getElementById('contactForm');
                            if (newForm) { newForm.addEventListener('submit', handleContactFormSubmit); }
                            else { console.error("Failed to re-attach listener.") }
                        }, 600);
                    }, 10000); // 10 sec delay

                } else { // Handle HTTP errors from fetch/server
                     let errorMessage = 'There was a problem submitting your form.';
                     try { // Try to parse JSON error response
                         const data = await response.json();
                         errorMessage = data?.errors?.map(err => err.message).join(', ') || data.error || `Server error: ${response.statusText}`;
                     } catch (parseError) {
                         console.warn("Could not parse error response as JSON.", parseError);
                         errorMessage = `Server error: ${response.statusText || response.status}`;
                     }
                     throw new Error(errorMessage);
                }

            } catch (error) { // Handle fetch errors (network etc.) or thrown errors
                console.error("Form submission error:", error);
                formStatus.textContent = error.message || 'An unexpected error occurred.';
                formStatus.className = 'form-status error'; // Use CSS class
                formStatus.style.display = 'block';
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } finally { // Runs regardless of success/error
                 const currentSubmitBtn = document.querySelector('#contactForm button[type="submit"]');
                 if (currentSubmitBtn) { // Check if button still exists
                    currentSubmitBtn.disabled = false;
                    currentSubmitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                 }
                 // Auto-hide error message
                 if (formStatus.classList.contains('error')) {
                     setTimeout(() => { formStatus.style.display = 'none'; }, 7000);
                 }
            }
        };
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }


    // --- Debounce Function ---
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => { clearTimeout(timeout); func(...args); };
            clearTimeout(timeout); timeout = setTimeout(later, wait);
        };
    }

    // --- Navbar Scroll Effect ---
    const header = document.querySelector('header');
    if (header) {
        let lastScrollY = window.scrollY;
        const handleScroll = debounce(() => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 70) { // Check if scrolled past header height
                header.classList.add('scrolled');
                // Optional: Hide header on scroll down, show on scroll up
                // if (currentScrollY > lastScrollY) { header.style.top = '-80px'; } // Hide
                // else { header.style.top = '0'; } // Show
            } else {
                header.classList.remove('scrolled');
                 // header.style.top = '0'; // Ensure visible at top
            }
             lastScrollY = currentScrollY; // Update last scroll position
        }, 15); // Slightly increased debounce

        window.addEventListener('scroll', handleScroll, { passive: true }); // Use passive listener
        handleScroll(); // Initial check
    }


    // --- Terminal Typing Effect (Ensure HTML has .typed-text and .cursor) ---
    const terminalTextLines = [ // Updated text lines
        "Welcome to Extropian Janus",
        "Exploring Digital Frontiers...",
        "Blockchain | Web Dev | AI Agents",
        "Ready to build the future?"
    ];
    let lineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 90; // Slightly faster
    const deleteSpeed = 45;
    const pauseEnd = 1800;
    const pauseStart = 250;

    function typeTerminal() {
        const typedTextSpan = document.querySelector(".typed-text");
        const cursorSpan = document.querySelector(".cursor"); // Get cursor too
        if (!typedTextSpan || !cursorSpan) return; // Stop if elements not found

        const currentLine = terminalTextLines[lineIndex];
        let currentDelay;

        cursorSpan.classList.add('typing'); // Show cursor is active

        if (isDeleting) {
            typedTextSpan.textContent = currentLine.substring(0, charIndex - 1);
            charIndex--;
            currentDelay = deleteSpeed;
        } else {
            typedTextSpan.textContent = currentLine.substring(0, charIndex + 1);
            charIndex++;
            currentDelay = typeSpeed;
        }

        if (!isDeleting && charIndex === currentLine.length) {
            isDeleting = true;
            currentDelay = pauseEnd;
             cursorSpan.classList.remove('typing'); // Pause cursor animation
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            lineIndex = (lineIndex + 1) % terminalTextLines.length;
            currentDelay = pauseStart;
        }

        setTimeout(typeTerminal, currentDelay);
    }
    // Start after DOM is ready and a slight delay
    document.addEventListener('DOMContentLoaded', () => {
         setTimeout(typeTerminal, 1500);
    });


    // --- Cursor Trail Effect ---
    let lastCursorTime = 0;
    const trailCooldown = 25; // Shorter cooldown for smoother trail

    document.addEventListener('mousemove', (e) => {
        const currentTime = Date.now();
        if (currentTime - lastCursorTime < trailCooldown) return;
        lastCursorTime = currentTime;
        const trailElement = document.createElement('div');
        trailElement.className = 'cursor-trail';
        trailElement.style.left = e.pageX + 'px'; // Use pageX/Y for absolute positioning
        trailElement.style.top = e.pageY + 'px';
        document.body.appendChild(trailElement);
        trailElement.addEventListener('animationend', () => { trailElement.remove(); }, { once: true });
    }, { passive: true }); // Use passive listener for mousemove


    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1, // Trigger slightly earlier
        rootMargin: '0px 0px -50px 0px' // Start animation 50px before element bottom enters view
    };

    const fadeUpObserver = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observerInstance.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    // Target elements with the .fade-up-on-scroll class (add this class in CSS)
    const elementsToAnimate = document.querySelectorAll('.service-card, .payment-card, .portfolio-card, .contact-container, .chatbot-container');

    elementsToAnimate.forEach(el => {
        el.classList.add('fade-up-on-scroll'); // Add base class for CSS to hide initially
        fadeUpObserver.observe(el);
    });

})(); // IIFE closing
