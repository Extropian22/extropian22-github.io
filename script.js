document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling (Using CSS scroll-behavior, JS fallback or for offsets if needed) ---
    // Basic smooth scroll already handled by CSS html { scroll-behavior: smooth; }
    // Keep JS for potential future needs like offset calculations if header height changes dynamically
    /*
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate offset if header is fixed and opaque
                // const headerOffset = document.querySelector('header')?.offsetHeight || 70;
                // const elementPosition = targetElement.getBoundingClientRect().top;
                // const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // window.scrollTo({
                //      top: offsetPosition,
                //      behavior: "smooth"
                // });

                // Simpler version without offset:
                 targetElement.scrollIntoView({
                     behavior: 'smooth',
                     block: 'start' // Aligns target to the top
                 });
            }
        });
    });
    */

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formStatus = document.getElementById('formStatus');
        const contactContainer = form.closest('.contact-container');
        const submitBtn = form.querySelector('button[type="submit"]');
        const subjectInput = form.querySelector('#subject');
        const subject = subjectInput ? subjectInput.value : 'your inquiry';

        if (!formStatus || !contactContainer || !submitBtn) {
            console.error("Contact form elements not found.");
            return;
        }

        formStatus.style.display = 'none';
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            const contentType = response.headers.get("content-type");
            let data;

            if (response.ok) { // Primarily check the HTTP status code
                 if (contentType && contentType.indexOf("application/json") !== -1) {
                     data = await response.json();
                 } else {
                     // Treat OK non-JSON response as success (e.g., simple redirect page from Formspree)
                     data = { ok: true }; // Assume Formspree 'ok' field would be true
                     console.log("Received non-JSON OK response, assuming success.");
                 }
            } else {
                // If response is not OK, try to parse error from JSON, or use status text
                let errorMessage = `Submission failed: ${response.status} ${response.statusText}`;
                 if (contentType && contentType.indexOf("application/json") !== -1) {
                     try {
                         data = await response.json();
                         errorMessage = data.error || errorMessage; // Use Formspree error if available
                     } catch (jsonError) {
                        console.error("Could not parse error JSON:", jsonError);
                     }
                 }
                 throw new Error(errorMessage);
            }

            // Process successful submission (based on data.ok or implicit ok)
            const thankYouMessageHTML = `
                <div class="thank-you-message">
                    <h3><i class="fas fa-check-circle"></i> Thank you for reaching out!</h3>
                    <p>I have received your message regarding "<strong>${escapeHTML(subject)}</strong>".</p>
                    <p>I'll review your inquiry and get back to you as soon as possible (usually within 24-48 hours).</p>
                    <p>Best regards,<br>
                    Extropian Janus<br>
                    Blockchain, Web & AI Development</p>
                </div>
            `;

            contactContainer.innerHTML = thankYouMessageHTML;
            contactContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Form restored manually by user refreshing or navigating away
            // Optional: Add a "Send another message" button dynamically if needed

        } catch (error) {
            console.error("Form submission error:", error);
            formStatus.className = 'form-status error';
            formStatus.textContent = `${error.message}`;
            formStatus.style.display = 'block';

            // Re-enable button only on error
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';

            // Hide status message after a delay
            setTimeout(() => {
                if (formStatus) formStatus.style.display = 'none';
            }, 7000);

        }
        // No finally block needed as button state is handled within try/catch
    }

    // Helper function to escape HTML characters
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }


    // --- Navbar Scroll Effect ---
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    const scrollThreshold = 50; // Pixels to scroll before effect triggers

    if (header) {
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Optional: Hide header on scroll down, show on scroll up
            // if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight){
            //    header.style.top = `-${header.offsetHeight}px`; // Hide
            // } else {
            //    header.style.top = "0"; // Show
            // }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        }, { passive: true }); // Use passive listener for performance
    }

    // --- Terminal Typing Effect ---
    const terminalText = [
        "Initializing Cosmic Development Interface...",
        "Loading Web3 Modules...",
        "Compiling Smart Contracts...",
        "Training AI Agents...",
        "Establishing Pi Network Connection...",
        "Extropian Janus | Blockchain_ Web_ AI_",
        "Ready for Input >>"
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 80;
    const deletingSpeed = 40;
    const pauseEnd = 1800;
    const pauseStart = 150;
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");

    function typeTerminal() {
        if (!typedTextSpan || !cursorSpan) return;

        const currentText = terminalText[textIndex];
        let typeDelay = typingSpeed;

        // Hide cursor while deleting/pausing for better effect
        cursorSpan.style.display = 'inline-block';

        if (isDeleting) {
            typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = deletingSpeed;
        } else {
            typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typeDelay = pauseEnd;
            cursorSpan.style.display = 'inline-block'; // Ensure cursor shows at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % terminalText.length;
            typeDelay = pauseStart;
            cursorSpan.style.display = 'none'; // Hide cursor briefly before typing next
        }

        setTimeout(typeTerminal, typeDelay);
    }

    if (typedTextSpan) {
        setTimeout(typeTerminal, 1200); // Initial delay before starting
    }

    // --- Cursor Trail Effect (Removed as it can be distracting/performant issue) ---
    /*
    let trailActive = false; // Disabled by default
    if (trailActive) {
        document.addEventListener('mousemove', (e) => {
            const cursor = document.createElement('div');
            cursor.className = 'cursor-trail'; // Ensure this class exists in CSS
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            document.body.appendChild(cursor);
            setTimeout(() => { cursor.remove(); }, 1000);
        });
    }
    */

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px' // Start animation slightly before fully in view
    };

    const fadeUpObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.service-card, .payment-card, .portfolio-card, .contact-container');

    if (elementsToAnimate.length > 0) {
        elementsToAnimate.forEach(el => {
             el.classList.add('fade-up-hidden'); // Add initial state class
             fadeUpObserver.observe(el);
        });
    }

}); // End DOMContentLoaded
