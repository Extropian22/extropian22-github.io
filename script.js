// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Contact Form Handling
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const formStatus = document.getElementById('formStatus');
    const submitBtn = form.querySelector('button[type="submit"]');
    const subject = form.querySelector('#subject').value;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Create custom thank you message
            const thankYouMessage = `
                <div class="thank-you-message">
                    <h3>Thank you for reaching out!</h3>
                    <p>I have received your message regarding "${subject}".</p>
                    <p>I will review your inquiry and get back to you as soon as possible.</p>
                    <p>Best regards,<br>
                    Extropian Januz<br>
                    Blockchain & Web Development</p>
                </div>
            `;
            
            // Replace form with thank you message
            const contactContainer = document.querySelector('.contact-container');
            contactContainer.innerHTML = thankYouMessage;
            
            // Scroll to message
            contactContainer.scrollIntoView({ behavior: 'smooth' });
            
            // Reset form (though it's hidden now)
            form.reset();
            
            // Restore form after 10 seconds
            setTimeout(() => {
                contactContainer.innerHTML = form.outerHTML;
                // Reattach event listener to new form
                document.getElementById('contactForm').addEventListener('submit', arguments.callee);
            }, 10000);
        } else {
            throw new Error(data.error || 'Something went wrong!');
        }
    } catch (error) {
        formStatus.className = 'form-status error';
        formStatus.textContent = error.message;
        formStatus.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        formStatus.style.display = 'block';
        
        // Hide status message after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
});

// Debounce function for performance
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

// Optimized navbar scroll effect
const handleScroll = debounce(() => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(42, 42, 114, 0.95)';
    } else {
        header.style.background = 'var(--primary-color)';
    }
}, 10);

window.addEventListener('scroll', handleScroll);

// Terminal typing effect
const terminalText = [
    "Welcome to Extropian Janus_",
    "Exploring Digital Frontiers_",
    "Web Development | Blockchain | Smart Contracts_",
    "Ready to launch your next project?_"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeTerminal() {
    const typedTextSpan = document.querySelector(".typed-text");
    if (!typedTextSpan) return;

    const currentText = terminalText[textIndex];
    
    if (isDeleting) {
        typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingDelay = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % terminalText.length;
        typingDelay = 200;
    }

    setTimeout(typeTerminal, isDeleting ? 50 : typingDelay);
}

// Start terminal effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeTerminal, 1000);
});

// Optimized cursor trail effect
let lastCursorTime = 0;
document.addEventListener('mousemove', (e) => {
    const currentTime = Date.now();
    if (currentTime - lastCursorTime < 50) return; // Limit rate of trail creation
    
    lastCursorTime = currentTime;
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
    document.body.appendChild(cursor);

    // Remove element after animation
    cursor.addEventListener('animationend', () => cursor.remove());
});

// Enhanced scroll animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            entry.target.style.filter = 'blur(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .payment-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px) scale(0.95)';
    card.style.filter = 'blur(5px)';
    card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(card);
});

