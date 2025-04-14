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
