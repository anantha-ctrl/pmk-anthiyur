document.addEventListener("DOMContentLoaded", function () {
    // 1. Sticky Navbar
    const navbar = document.getElementById('main-navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Form Validation and Submission
    const petitionForm = document.getElementById('petitionForm');
    const formSuccess = document.getElementById('formSuccess');

    if (petitionForm) {
        petitionForm.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (petitionForm.checkValidity()) {
                // Get form values
                const fullName = document.getElementById('fullName').value;
                const mobile = document.getElementById('mobile').value;
                const area = document.getElementById('area').value;
                const subject = document.getElementById('subject').value;
                const details = document.getElementById('details').value;

                // Construct WhatsApp message
                const message = `வணக்கம்,\n\nபுதிய மனு பதிவு:\n\n*பெயர்:* ${fullName}\n*மொபைல் எண்:* ${mobile}\n*பகுதி:* ${area}\n*பொருள்:* ${subject}\n*விவரம்:* ${details}`;
                const encodedMessage = encodeURIComponent(message);

                // WhatsApp URL (Using the requested placeholder number)
                const whatsappNumber = "919976326107";
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

                // Show loading state briefly before redirect
                const btn = petitionForm.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> சமர்ப்பிக்கப்படுகிறது...';
                btn.disabled = true;

                setTimeout(() => {
                    // Open WhatsApp in a new tab
                    window.open(whatsappUrl, '_blank');

                    // Show success message on the page
                    petitionForm.classList.add('d-none');
                    formSuccess.classList.remove('d-none');
                    formSuccess.classList.add('animate__animated', 'animate__fadeIn');
                }, 500);
            }

            petitionForm.classList.add('was-validated');
        }, false);
    }

    // 4. Back to Top Button
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 5. Navigation & Mobile Menu Handler
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, a.navbar-brand');
    const navbarCollapse = document.getElementById('navbarNav');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Smooth scrolling for hash links
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }

            // Close mobile menu if open
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
});
