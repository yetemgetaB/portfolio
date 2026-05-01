// ============================================
// PORTFOLIO JAVASCRIPT - All Interactive Features
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // 1. PARTICLE BACKGROUND SYSTEM
    // ============================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let isActive = true;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(24, 66, 193, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const particleCount = window.innerWidth < 768 ? 25 : 50;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        const maxDistance = 100;
        const maxConnections = 3;

        for (let i = 0; i < particles.length; i++) {
            let connections = 0;
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance && connections < maxConnections) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(24, 66, 193, ${0.1 * (1 - distance / maxDistance)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    connections++;
                }
            }
        }
    }

    function animateParticles() {
        if (!isActive) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        animationId = requestAnimationFrame(animateParticles);
    }

    // Only run particles on non-touch devices
    if (!window.matchMedia('(pointer: coarse)').matches) {
        resizeCanvas();
        initParticles();
        animateParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        // Pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            isActive = !document.hidden;
            if (isActive) animateParticles();
        });
    }

    // ============================================
    // 2. ANIMATED TYPEWRITER WITH MULTIPLE WORDS
    // ============================================
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const words = JSON.parse(typingElement.getAttribute('data-words') || '["Web Developer"]');
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeWriter() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // Pause before typing next word
            }

            setTimeout(typeWriter, typingSpeed);
        }

        setTimeout(typeWriter, 1000);
    }

    // ============================================
    // 3. SCROLL PROGRESS INDICATOR
    // ============================================
    const progressBar = document.querySelector('.scroll-progress-bar');
    const mainContent = document.querySelector('.main-content');

    function updateScrollProgress() {
        if (mainContent && progressBar) {
            const scrollTop = mainContent.scrollTop;
            const scrollHeight = mainContent.scrollHeight - mainContent.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    if (mainContent) {
        mainContent.addEventListener('scroll', updateScrollProgress, { passive: true });
    }

    // ============================================
    // 4. ANIMATED COUNTERS
    // ============================================
    const counters = document.querySelectorAll('.stat-item');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const numberElement = counter.querySelector('.stat-number');
            let current = 0;
            const increment = target / 50;
            const duration = 2000;
            const stepTime = duration / 50;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    numberElement.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    numberElement.textContent = Math.floor(current);
                }
            }, stepTime);
        });
        
        countersAnimated = true;
    }

    // ============================================
    // 5. SCROLL REVEAL ANIMATIONS
    // ============================================
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    function revealSections() {
        if (!mainContent) return;
        
        const scrollPosition = mainContent.scrollTop;
        const windowHeight = mainContent.clientHeight;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionMiddle = sectionTop + sectionHeight / 2;
            
            // Reveal section when it's in view
            if (scrollPosition + windowHeight > sectionTop + 100) {
                section.classList.add('revealed');
            }

            // Update active nav link
            if (scrollPosition >= sectionTop - sectionHeight / 3) {
                const currentSection = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + currentSection) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Trigger counters when stats section is visible
        const homeSection = document.querySelector('.home-section');
        if (homeSection && homeSection.classList.contains('revealed') && !countersAnimated) {
            setTimeout(animateCounters, 500);
        }
    }

    if (mainContent) {
        mainContent.addEventListener('scroll', revealSections, { passive: true });
    }
    revealSections();

    // ============================================
    // 6. SKILL PROGRESS BARS ANIMATION
    // ============================================
    const skillBars = document.querySelectorAll('.progress');
    let skillsAnimated = false;

    function animateSkillBars() {
        if (skillsAnimated) return;
        
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 200);
        });
        
        skillsAnimated = true;
    }

    // Trigger skill bars when skills section is visible
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection && mainContent) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                }
            });
        }, { threshold: 0.3, root: mainContent });
        
        skillsObserver.observe(skillsSection);
    }

    // ============================================
    // 7. 3D TILT EFFECT FOR CARDS
    // ============================================
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.querySelector('.card-content').style.transform = 
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.card-content').style.transform = 
                'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // ============================================
    // 8. THEME TOGGLE
    // ============================================
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            showToast(newTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled', 'info');
        });
    }

    // ============================================
    // 9. CONTACT FORM HANDLING
    // ============================================
    const contactForm = document.querySelector('.contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                    contactForm.reset();
                    showToast('Message sent successfully!', 'success');
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Failed to send message. Please try again or email me directly.';
                showToast('Failed to send message', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // ============================================
    // 10. TOAST NOTIFICATION SYSTEM
    // ============================================
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        
        toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ============================================
    // 11. GITHUB STATS FETCH
    // ============================================
    async function fetchGitHubStats() {
        const username = 'yetemgetaB';
        
        try {
            // Fetch user data
            const userResponse = await fetch(`https://api.github.com/users/${username}`);
            const userData = await userResponse.json();
            
            // Update repository count
            const repoCount = document.getElementById('repo-count');
            if (repoCount) {
                repoCount.textContent = userData.public_repos || '--';
            }
            
            // Fetch repos to count stars
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
            const repos = await reposResponse.json();
            
            const starCount = document.getElementById('star-count');
            if (starCount && Array.isArray(repos)) {
                const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
                starCount.textContent = totalStars;
            }
            
        } catch (error) {
            console.log('GitHub stats fetch failed:', error);
        }
    }

    // Fetch GitHub stats on load
    fetchGitHubStats();

    // ============================================
    // 12. SMOOTH SCROLL FOR NAV LINKS
    // ============================================
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection && mainContent) {
                mainContent.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // 13. KEYBOARD NAVIGATION
    // ============================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const currentSection = document.querySelector('.nav-link.active');
            const currentIndex = Array.from(navLinks).indexOf(currentSection);
            
            let nextIndex;
            if (e.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % navLinks.length;
            } else {
                nextIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
            }
            
            navLinks[nextIndex].click();
        }
    });

    // ============================================
    // INITIALIZATION
    // ============================================
    showToast('Welcome to my portfolio!', 'info');
});

// ============================================
// UTILITY FUNCTIONS (Global Scope)
// ============================================

// Copy to clipboard function
function copyToClipboard(text, message) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(message || 'Copied to clipboard!', 'success');
    });
}

// Show toast globally
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}