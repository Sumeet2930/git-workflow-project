// --- Portfolio Builder Logic ---
const builderOverlay = document.getElementById('builder-overlay');
const builderForm = document.getElementById('builder-form');
const steps = document.querySelectorAll('.form-step');
let currentStep = 0;

// Initialize Builder
function initBuilder() {
    const savedData = localStorage.getItem('portfolio_builder_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        injectPortfolioData(data);
        builderOverlay.classList.add('hidden');
    } else {
        builderOverlay.classList.remove('hidden');
    }
}

// Multi-step Navigation
document.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', () => {
        steps[currentStep].classList.remove('active');
        currentStep++;
        steps[currentStep].classList.add('active');
    });
});

document.querySelectorAll('.prev-step').forEach(btn => {
    btn.addEventListener('click', () => {
        steps[currentStep].classList.remove('active');
        currentStep--;
        steps[currentStep].classList.add('active');
    });
});

// Form Submission
if (builderForm) {
    builderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(builderForm);
        
        const data = {
            name: formData.get('name'),
            roles: formData.get('roles').split(',').map(r => r.trim()),
            solutionName: formData.get('solutionName'),
            problem: formData.get('problem'),
            solution: formData.get('solution'),
            bio: formData.get('bio'),
            primaryColor: formData.get('primaryColor'),
            projects: [
                {
                    title: formData.get('p1_title'),
                    desc: formData.get('p1_desc'),
                    tech: formData.get('p1_tech').split(',').map(t => t.trim())
                },
                {
                    title: formData.get('p2_title'),
                    desc: formData.get('p2_desc'),
                    tech: formData.get('p2_tech').split(',').map(t => t.trim())
                },
                {
                    title: formData.get('p3_title'),
                    desc: formData.get('p3_desc'),
                    tech: (formData.get('p3_tech') || '').split(',').map(t => t.trim())
                }
            ].filter(p => p.title) // Only keep projects with a title
        };

        localStorage.setItem('portfolio_builder_data', JSON.stringify(data));
        injectPortfolioData(data);
        
        // Hide overlay with animation
        builderOverlay.style.opacity = '0';
        setTimeout(() => {
            builderOverlay.classList.add('hidden');
            // Re-trigger scroll reveal for the new content
            document.querySelectorAll('.reveal, .reveal-item').forEach(el => revealObserver.observe(el));
        }, 500);
    });
}

// Data Injection
function injectPortfolioData(data) {
    // Basic Info
    document.getElementById('dynamic-logo-name').textContent = data.name;
    document.getElementById('dynamic-hero-name').textContent = data.name + "'s";
    document.getElementById('dynamic-bio').textContent = data.bio;
    
    // Impact Section
    document.getElementById('dynamic-problem').textContent = data.problem;
    document.getElementById('dynamic-solution-name').textContent = data.solutionName;
    document.getElementById('dynamic-solution-desc').textContent = data.solution;
    
    // Projects Injection
    const grid = document.getElementById('dynamic-projects-grid');
    if (grid && data.projects) {
        grid.innerHTML = '';
        data.projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card reveal-item';
            card.setAttribute('data-category', 'web'); // Default category
            
            card.innerHTML = `
                <div class="project-glow"></div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.desc}</p>
                    <div class="project-tech">
                        ${project.tech.map(t => `<span>${t}</span>`).join('')}
                    </div>
                </div>
            `;
            grid.appendChild(card);
            
            // Re-bind mousemove for glow effect
            const glow = card.querySelector('.project-glow');
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                glow.style.left = x + 'px';
                glow.style.top = y + 'px';
            });
            
            // Re-bind cursor effects
            card.addEventListener('mouseenter', () => cursor.classList.add('link-hover'));
            card.addEventListener('mouseleave', () => cursor.classList.remove('link-hover'));
        });
    }
    
    // Update Typing Words
    window.portfolioRoles = data.roles; 
    
    // Update Theme Color
    document.documentElement.style.setProperty('--primary', data.primaryColor);
    // Auto-generate a darker version for hovers
    const darkerColor = darkenColor(data.primaryColor, 20);
    document.documentElement.style.setProperty('--primary-dark', darkerColor);
    
    // Restart typing effect if active
    if (typingTimeout) clearTimeout(typingTimeout);
    charIndex = 0;
    wordIndex = 0;
    isDeleting = false;
    type();
}

// Edit Profile Button
const editProfileBtn = document.getElementById('edit-profile-btn');
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
        builderOverlay.classList.remove('hidden');
        builderOverlay.style.opacity = '1';
        currentStep = 0;
        steps.forEach((s, i) => s.classList.toggle('active', i === 0));
    });
}

// --- End Portfolio Builder Logic ---

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .project-card, .filter-btn').forEach(link => {
    link.addEventListener('mouseenter', () => cursor.classList.add('link-hover'));
    link.addEventListener('mouseleave', () => cursor.classList.remove('link-hover'));
});

// Mobile Menu Toggle
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('open');
    });
}

// Typing Effect
const typingText = document.getElementById('typing-text');
let typingTimeout;
let words = ['Experiences.', 'Solutions.', 'Interfaces.', 'Innovations.'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWords = window.portfolioRoles || words;
    const currentWord = currentWords[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typingTimeout = setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % currentWords.length;
        typingTimeout = setTimeout(type, 500);
    } else {
        typingTimeout = setTimeout(type, isDeleting ? 50 : 150);
    }
}

// Intersection Observer for Reveal System
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Animate progress bars if the element is the skills section container
            if (entry.target.classList.contains('reveal') && entry.target.querySelector('.progress')) {
                const bars = entry.target.querySelectorAll('.progress');
                bars.forEach(bar => {
                    bar.style.width = bar.getAttribute('data-width');
                });
            }
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-item').forEach(el => revealObserver.observe(el));

// Project Filtering
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    });
});

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

async function submitForm(event) {
    event.preventDefault();
    const btn = document.getElementById('submitBtn');
    const msgDiv = document.getElementById("msg");
    const form = event.target;

    btn.classList.add('loading');
    await new Promise(resolve => setTimeout(resolve, 2000));

    btn.classList.remove('loading');
    msgDiv.textContent = "Message sent successfully! I'll get back to you soon.";
    msgDiv.style.color = "var(--primary)";
    msgDiv.style.marginTop = "1rem";
    form.reset();
    
    setTimeout(() => msgDiv.textContent = "", 5000);
}

// Helper to darken a color for hover states
function darkenColor(hex, percent) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.floor(r * (1 - percent / 100));
    g = Math.floor(g * (1 - percent / 100));
    b = Math.floor(b * (1 - percent / 100));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initBuilder();
    if (localStorage.getItem('portfolio_builder_data')) {
        type();
    }
});
