// Scroll-based Navigation Highlighting
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mainContent = document.querySelector('.main-content');

    // Function to update active nav link based on scroll position
    function updateActiveNav() {
        let currentSection = '';
        
        // Get current scroll position within main content
        const scrollPosition = mainContent.scrollTop;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Check if scroll position is within this section
            if (scrollPosition >= sectionTop - sectionHeight / 3) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Listen for scroll events on main content
    if (mainContent) {
        mainContent.addEventListener('scroll', updateActiveNav);
    }

    // Update on page load
    updateActiveNav();
});