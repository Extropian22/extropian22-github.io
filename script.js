// Wrap everything in an IIFE or DOMContentLoaded to ensure DOM is ready
(function() {
    'use strict'; // Optional: Enable strict mode

    // --- Smooth Scrolling (JS fallback/enhancement) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('header')?.offsetHeight || 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            } else { console.warn(`Smooth scroll target not found: ${targetId}`); }
        });
    });

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const formStatus = document.getElementById('formStatus');
        const contactContainer = contactForm.closest('.contact-container');
        const originalFormHTML = contactContainer.innerHTML; // Store container's content including form

        const handleContactFormSubmit = async function(e) {
            e.preventDefault();
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const subjectInput = form.querySelector('#subject');
            const subject = subjectInput ? subjectInput.value : 'your inquiry';

            if (!formStatus || !contactContainer || !submitBtn) { console.error("Contact form elements not found."); return; }
            formStatus.textContent = ''; formStatus.className = 'form-status'; formStatus.style.display = 'none';

            try {
                submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });

                if (response.ok) {
                    const thankYouMessage = `
                        <div class="thank-you-message" style="opacity: 0; transition: opacity 0.5s ease-in-out;">
                            <h3><i class="fas fa-check-circle" style="color: var(--secondary-color); margin-right: 0.5rem;"></i> Thank you!</h3>
                            <p>Your message regarding "${subject}" has been sent successfully.</p><p>I appreciate you reaching out and will get back to you shortly.</p>
                            <p>Best regards,<br>Extropian Janus</p>
                        </div>`;
                    contactContainer.innerHTML = thankYouMessage;
                    setTimeout(() => { const thankYouDiv = contactContainer.querySelector('.thank-you-message'); if (thankYouDiv) thankYouDiv.style.opacity = '1'; }, 10);
                    contactContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        const thankYouDiv = contactContainer.querySelector('.thank-you-message');
                        if (thankYouDiv) thankYouDiv.style.opacity = '0';
                        setTimeout(() => {
                            contactContainer.innerHTML = originalFormHTML;
                            const newForm = document.getElementById('contactForm'); // Re-get after restoring HTML
                            if (newForm) { newForm.addEventListener('submit', handleContactFormSubmit); }
                        }, 600);
                    }, 10000);
                } else {
                     let errorMessage = 'There was a problem submitting your form.';
                     try { const data = await response.json(); errorMessage = data?.errors?.map(err => err.message).join(', ') || data.error || `Server error: ${response.statusText}`; }
                     catch (parseError) { errorMessage = `Server error: ${response.statusText || response.status}`; }
                     throw new Error(errorMessage);
                }
            } catch (error) {
                console.error("Form submission error:", error);
                formStatus.textContent = error.message || 'An unexpected error occurred.'; formStatus.className = 'form-status error'; formStatus.style.display = 'block';
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } finally {
                 const currentSubmitBtn = contactContainer.querySelector('#contactForm button[type="submit"]'); // Query within container
                 if (currentSubmitBtn) { currentSubmitBtn.disabled = false; currentSubmitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message'; }
                 if (formStatus.classList.contains('error')) { setTimeout(() => { formStatus.style.display = 'none'; }, 7000); }
            }
        };
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }

    // --- Debounce Function ---
    function debounce(func, wait) { let timeout; return function executedFunction(...args) { const later = () => { clearTimeout(timeout); func(...args); }; clearTimeout(timeout); timeout = setTimeout(later, wait); }; }

    // --- Navbar Scroll Effect ---
    const header = document.querySelector('header');
    if (header) {
        let lastScrollY = window.scrollY;
        const handleScroll = debounce(() => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 70) { header.classList.add('scrolled'); }
            else { header.classList.remove('scrolled'); }
            lastScrollY = currentScrollY;
        }, 15);
        window.addEventListener('scroll', handleScroll, { passive: true }); handleScroll();
    }

    // --- Terminal Typing Effect ---
    const terminalTextLines = [ "Welcome to Extropian Janus", "Exploring Digital Frontiers...", "Blockchain | Web Dev | AI Agents", "Ready to build the future?" ];
    let lineIndex = 0; let charIndex = 0; let isDeleting = false;
    const typeSpeed = 90; const deleteSpeed = 45; const pauseEnd = 1800; const pauseStart = 250;

    function typeTerminal() {
        const typedTextSpan = document.querySelector(".typed-text"); const cursorSpan = document.querySelector(".cursor");
        if (!typedTextSpan || !cursorSpan) return;
        const currentLine = terminalTextLines[lineIndex]; let currentDelay;
        cursorSpan.style.display = 'inline-block'; // Ensure cursor is visible
        if (isDeleting) { typedTextSpan.textContent = currentLine.substring(0, charIndex - 1); charIndex--; currentDelay = deleteSpeed; }
        else { typedTextSpan.textContent = currentLine.substring(0, charIndex + 1); charIndex++; currentDelay = typeSpeed; }
        if (!isDeleting && charIndex === currentLine.length) { isDeleting = true; currentDelay = pauseEnd; cursorSpan.style.animationName = 'none'; } // Stop blinking
        else if (isDeleting && charIndex === 0) { isDeleting = false; lineIndex = (lineIndex + 1) % terminalTextLines.length; currentDelay = pauseStart; }
        else { cursorSpan.style.animationName = 'blink'; } // Resume blinking
        setTimeout(typeTerminal, currentDelay);
    }
    document.addEventListener('DOMContentLoaded', () => { setTimeout(typeTerminal, 1500); });

    // --- Cursor Trail Effect ---
    let lastCursorTime = 0; const trailCooldown = 25;
    document.addEventListener('mousemove', (e) => {
        const currentTime = Date.now(); if (currentTime - lastCursorTime < trailCooldown) return;
        lastCursorTime = currentTime; const trailElement = document.createElement('div'); trailElement.className = 'cursor-trail';
        trailElement.style.left = e.pageX + 'px'; trailElement.style.top = e.pageY + 'px';
        document.body.appendChild(trailElement);
        trailElement.addEventListener('animationend', () => { trailElement.remove(); }, { once: true });
    }, { passive: true });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const fadeUpObserver = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observerInstance.unobserve(entry.target); } });
    }, observerOptions);
    const elementsToAnimate = document.querySelectorAll('.service-card, .payment-card, .portfolio-card, .contact-container, .chatbot-container');
    elementsToAnimate.forEach(el => { el.classList.add('fade-up-on-scroll'); fadeUpObserver.observe(el); });

    // --- Background Audio Control ---
    const audio = document.getElementById('backgroundAudio');
    const audioControlBtn = document.getElementById('audioControlBtn');

    if (audio && audioControlBtn) {
        const btnIcon = audioControlBtn.querySelector('i'); // Get icon element inside the button

        // Attempt initial muted play
        audio.play().catch(error => { console.log("Autoplay prevented (expected):", error.message); });

        audioControlBtn.addEventListener('click', () => {
             // Check context *before* playing (important for first interaction)
            const context = new (window.AudioContext || window.webkitAudioContext)();
            if (context.state === 'suspended') {
                context.resume(); // Resume context if suspended by browser
            }

            if (audio.muted) {
                audio.muted = false;
                if (btnIcon) btnIcon.className = 'fas fa-volume-up';
                audioControlBtn.setAttribute('aria-label', 'Mute Background Music');
                // Play if paused (might be paused if autoplay failed)
                if (audio.paused) {
                     audio.play().catch(e => console.error("Error playing audio on unmute:", e));
                }
            } else {
                audio.muted = true;
                if (btnIcon) btnIcon.className = 'fas fa-volume-mute';
                audioControlBtn.setAttribute('aria-label', 'Unmute Background Music');
            }
        });
    } else { console.warn("Audio control elements not found."); }

})(); // IIFE closing
