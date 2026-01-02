// --- Portfolio Builder Logic ---
const builderOverlay = document.getElementById('builder-overlay');
const builderForm = document.getElementById('builder-form');
const steps = document.querySelectorAll('.form-step');
let currentStep = 0;


// Skills Data
const availableSkills = {
    "Languages": ["JavaScript", "Python", "Java", "C++", "TypeScript", "Go"],
    "Frontend": ["React", "Vue", "Next.js", "Tailwind CSS", "Sass", "Redux"],
    "Backend": ["Node.js", "Express", "Django", "FastAPI", "Postgres", "MongoDB"],
    "Tools": ["Docker", "Git", "AWS", "Figma", "Firebase", "Linux"]
};
let selectedSkills = new Set();
let profileImageBase64 = null; // New variable for image persistence

// Initialize Builder
function initBuilder() {
    renderSkillSelector();
    
    // Image Handling
    const imgInput = document.getElementById('profile-image-input');
    if (imgInput) {
        imgInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    profileImageBase64 = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const savedData = localStorage.getItem('portfolio_builder_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        if (data.skills) {
             data.skills.forEach(s => selectedSkills.add(s));
             renderSkillSelector(); // Re-render to show selected
        }
        if (data.profileImage) {
            profileImageBase64 = data.profileImage;
        }
        injectPortfolioData(data);
        builderOverlay.classList.add('hidden');
    } else {
        builderOverlay.classList.remove('hidden');
    }
}

function renderSkillSelector() {
    const root = document.getElementById('skills-selection-root');
    if (!root) return;
    
    root.innerHTML = '';
    
    Object.entries(availableSkills).forEach(([category, skills]) => {
        const catDiv = document.createElement('div');
        catDiv.className = 'skill-category';
        
        catDiv.innerHTML = `<h4>${category}</h4>`;
        
        const chipsContainer = document.createElement('div');
        chipsContainer.className = 'skill-chips';
        
        skills.forEach(skill => {
            const chip = document.createElement('div');
            chip.className = `skill-chip ${selectedSkills.has(skill) ? 'selected' : ''}`;
            chip.textContent = skill;
            
            chip.addEventListener('click', () => {
                if (selectedSkills.has(skill)) {
                    selectedSkills.delete(skill);
                    chip.classList.remove('selected');
                } else {
                    selectedSkills.add(skill);
                    chip.classList.add('selected');
                }
            });
            
            chipsContainer.appendChild(chip);
        });
        
        catDiv.appendChild(chipsContainer);
        root.appendChild(catDiv);
    });
}

// Multi-step Navigation
function validateStep(index) {
    const step = steps[index];
    const requiredFields = step.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            // Remove error class on input
            field.addEventListener('input', () => field.classList.remove('error'), { once: true });
        } else {
            field.classList.remove('error');
        }
    });

    if (!isValid) {
        const firstError = step.querySelector('.error');
        if (firstError) firstError.focus();
    }
    return isValid;
}

document.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            steps[currentStep].classList.remove('active');
            currentStep++;
            steps[currentStep].classList.add('active');
        }
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
        
        if (!validateStep(currentStep)) return;

        // Custom validation for skills (optional, ensure at least 1?)
        if (selectedSkills.size === 0 && currentStep === 1) { 
             // Ideally we'd show an error, but let's allow empty for now or add visual feedback
        }

        const formData = new FormData(builderForm);
        
        const data = {
            name: formData.get('name') || 'Sumeet',
            profileImage: profileImageBase64, // Include the image
            skills: Array.from(selectedSkills),
            roles: (formData.get('roles') || '').split(',').map(r => r.trim()).filter(r => r),
            solutionName: formData.get('solutionName'),
            problem: formData.get('problem'),
            solution: formData.get('solution'),
            bio: formData.get('bio'),
            linkedin: formData.get('linkedin'),
            twitter: formData.get('twitter'),
            github: formData.get('github'),
            primaryColor: formData.get('primaryColor'),
            projects: [
                {
                    title: formData.get('p1_title'),
                    desc: formData.get('p1_desc'),
                    tech: (formData.get('p1_tech') || '').split(',').map(t => t.trim()).filter(t => t)
                },
                {
                    title: formData.get('p2_title'),
                    desc: formData.get('p2_desc'),
                    tech: (formData.get('p2_tech') || '').split(',').map(t => t.trim()).filter(t => t)
                },
                {
                    title: formData.get('p3_title'),
                    desc: formData.get('p3_desc'),
                    tech: (formData.get('p3_tech') || '').split(',').map(t => t.trim()).filter(t => t)
                }
            ].filter(p => p.title && p.title.trim()) // Only keep projects with a title
        };

        localStorage.setItem('portfolio_builder_data', JSON.stringify(data));
        injectPortfolioData(data);
        
        // Hide overlay with animation - ensured closure
        builderOverlay.style.opacity = '0';
        setTimeout(() => {
            builderOverlay.classList.add('hidden');
            // Re-trigger scroll reveal for the new content
            const revealElements = document.querySelectorAll('.reveal, .reveal-item, .reveal-left, .reveal-right');
            revealElements.forEach(el => revealObserver.observe(el));
        }, 500);
    });
}

// Data Injection
function injectPortfolioData(data) {
    if (!data) return;

    // Basic Info
    const logoName = document.getElementById('dynamic-logo-name');
    const heroName = document.getElementById('dynamic-hero-name');
    const bio = document.getElementById('dynamic-bio');

    if (logoName) logoName.textContent = data.name;
    if (heroName) heroName.textContent = data.name + "'s";
    if (bio) bio.textContent = data.bio;
    
    // Impact Section
    const problem = document.getElementById('dynamic-problem');
    const solutionName = document.getElementById('dynamic-solution-name');
    const solutionDesc = document.getElementById('dynamic-solution-desc');

    if (problem) problem.textContent = data.problem;
    if (solutionName) solutionName.textContent = data.solutionName;
    if (solutionDesc) solutionDesc.textContent = data.solution;
    
    // Skills Injection
    const skillsGrid = document.getElementById('dynamic-skills-grid');
    if (skillsGrid && data.skills) {
        skillsGrid.innerHTML = '';
        data.skills.forEach(skill => {
            const tag = document.createElement('div');
            tag.className = 'skill-tag reveal-item';
            tag.innerHTML = `<span>+</span> ${skill}`;
            skillsGrid.appendChild(tag);
        });
    }

    // Profile Image
    const imgContainer = document.getElementById('dynamic-profile-image');
    const imgWrapper = document.querySelector('.about-image-container');
    if (imgContainer && imgWrapper) {
        if (data.profileImage) {
            imgContainer.innerHTML = `<img src="${data.profileImage}" alt="Profile" class="profile-img">`;
            imgWrapper.style.display = 'flex';
        } else {
            imgWrapper.style.display = 'none';
        }
    }

    // Social Links
    const footerLinkedin = document.getElementById('footer-linkedin');
    const footerGithub = document.getElementById('footer-github');
    const footerTwitter = document.getElementById('footer-twitter');

    if (footerLinkedin) {
        footerLinkedin.href = data.linkedin || '#';
        footerLinkedin.style.display = data.linkedin ? 'inline-block' : 'none';
    }
    if (footerGithub) {
        footerGithub.href = data.github || '#';
        footerGithub.style.display = data.github ? 'inline-block' : 'none';
    }
    if (footerTwitter) {
        footerTwitter.href = data.twitter || '#';
        footerTwitter.style.display = data.twitter ? 'inline-block' : 'none';
    }
    
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
    if (data.primaryColor) {
        document.documentElement.style.setProperty('--primary', data.primaryColor);
        const darkerColor = darkenColor(data.primaryColor, 20);
        document.documentElement.style.setProperty('--primary-dark', darkerColor);
    }
    
    // Restart typing effect if active
    if (typingTimeout) clearTimeout(typingTimeout);
    charIndex = 0;
    wordIndex = 0;
    isDeleting = false;
    type();

    // Re-observe newly injected content
    const revealElements = document.querySelectorAll('.reveal, .reveal-item, .reveal-left, .reveal-right');
    revealElements.forEach(el => revealObserver.observe(el));

    // Store globally for chatbot context
    window.currentPortfolioData = data;
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
    const currentWords = window.portfolioRoles && window.portfolioRoles.length > 0 ? window.portfolioRoles : words;
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
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-item, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

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

// --- AI Chatbot & Export Logic ---

class Chatbot {
    constructor() {
        this.container = document.getElementById('ai-chatbot');
        this.trigger = document.getElementById('chatbot-trigger');
        this.window = document.getElementById('chat-window');
        this.closeBtn = document.getElementById('close-chat');
        this.messagesContainer = document.getElementById('chat-messages');
        this.input = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-btn');
        this.voiceBtn = document.getElementById('voice-btn');
        this.ttsToggle = document.getElementById('tts-toggle');
        
        this.isVoiceEnabled = false;
        this.isRecording = false;
        this.recognition = null;
        
        this.init();
    }

    init() {
        this.trigger.addEventListener('click', () => this.toggleWindow());
        this.closeBtn.addEventListener('click', () => this.toggleWindow());
        this.sendBtn.addEventListener('click', () => this.handleSendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendMessage();
        });

        this.ttsToggle.addEventListener('click', () => {
            this.isVoiceEnabled = !this.isVoiceEnabled;
            this.ttsToggle.querySelector('.icon').textContent = this.isVoiceEnabled ? '🔊' : '🔇';
            this.ttsToggle.classList.toggle('active', this.isVoiceEnabled);
        });

        this.initVoice();
    }

    toggleWindow() {
        this.window.classList.toggle('active');
        if (this.window.classList.contains('active')) {
            this.input.focus();
        }
    }

    addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        this.messagesContainer.appendChild(msgDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        if (sender === 'bot' && this.isVoiceEnabled) {
            this.speak(text);
        }
    }

    async handleSendMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        this.input.value = '';
        
        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.textContent = '...';
        this.messagesContainer.appendChild(typingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

        try {
            const response = await this.getAIResponse(text);
            this.messagesContainer.removeChild(typingDiv);
            this.addMessage(response, 'bot');
        } catch (error) {
            this.messagesContainer.removeChild(typingDiv);
            this.addMessage("Sorry, I'm having trouble connecting right now.", 'bot');
        }
    }

    async getAIResponse(userText) {
        const data = window.currentPortfolioData || JSON.parse(localStorage.getItem('portfolio_builder_data') || '{}');
        const name = data.name || 'Awarthi';
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const lowerText = userText.toLowerCase();
        
        // Context-aware responses
        if (lowerText.includes('name') || lowerText.includes('who are you')) {
            return `This is ${name}'s Professional Portfolio Generator context! I'm the AI assistant here to support you.`;
        }
        if (lowerText.includes('project') || lowerText.includes('work')) {
            const projects = data.projects?.map(p => p.title).join(', ') || 'innovative applications';
            return `You can explore ${name}'s key projects like ${projects}. Each one represents a unique challenge solved!`;
        }
        if (lowerText.includes('skill') || lowerText.includes('tech')) {
            return `${name} is proficient in technologies like ${data.roles?.join(', ') || 'web development and design'}.`;
        }
        if (lowerText.includes('hello') || lowerText.includes('hi')) {
            return `Hello! I'm ${name}'s AI assistant. I can tell you about their projects, skills, or professional bio. What would you like to know?`;
        }
        if (lowerText.includes('contact') || lowerText.includes('reach')) {
            return `You can reach out to ${name} via the contact form at the bottom of the page!`;
        }
        
        // Highly robust default response
        return `I'm here to help you learn more about ${name}. You can ask me about their projects, expertise, or the Professional Portfolio Generator itself. What can I help you find?`;
    }

    initVoice() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.input.value = transcript;
                this.handleSendMessage();
                this.stopRecording();
            };

            this.recognition.onerror = () => this.stopRecording();
            this.recognition.onend = () => this.stopRecording();

            this.voiceBtn.addEventListener('click', () => {
                if (this.isRecording) {
                    this.stopRecording();
                } else {
                    this.startRecording();
                }
            });
        } else {
            this.voiceBtn.style.display = 'none';
        }
    }

    startRecording() {
        this.isRecording = true;
        this.voiceBtn.classList.add('recording');
        this.recognition.start();
    }

    stopRecording() {
        this.isRecording = false;
        this.voiceBtn.classList.remove('recording');
        try { this.recognition.stop(); } catch(e) {}
    }

    speak(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }
}

// Export Functions
function exportToJSON() {
    const data = localStorage.getItem('portfolio_builder_data');
    if (!data) return alert("No portfolio data found!");
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = JSON.parse(localStorage.getItem('portfolio_builder_data') || '{}');

    if (!data.name) return alert("No portfolio data found! Please generate your portfolio first.");

    // PDF Configuration
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (2 * margin);
    let y = 25;

    // Helper: Add Section Header
    const addSectionHeader = (title) => {
        y += 10;
        doc.setFont("times", "bold");
        doc.setFontSize(14);
        doc.text(title.toUpperCase(), margin, y);
        y += 2;
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 7;
    };

    // Header: Name & Roles
    doc.setFont("times", "bold");
    doc.setFontSize(26);
    doc.text(data.name, margin, y);
    y += 10;
    
    doc.setFontSize(12);
    doc.setFont("times", "italic");
    const rolesStr = data.roles?.join(' | ') || 'Professional';
    doc.text(rolesStr, margin, y);
    y += 6;

    // Social Links in Header
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.setTextColor(56, 189, 248); // Use primary-like color for links
    let socialLinks = [];
    if (data.linkedin) socialLinks.push(`LinkedIn: ${data.linkedin}`);
    if (data.github) socialLinks.push(`GitHub: ${data.github}`);
    if (data.twitter) socialLinks.push(`Twitter: ${data.twitter}`);
    
    if (socialLinks.length > 0) {
        const socialStr = socialLinks.join('  |  ');
        doc.text(socialStr, margin, y);
        y += 4;
    }
    doc.setTextColor(0); // Reset to black

    // Section: Professional Summary
    addSectionHeader("Professional Summary");
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    const bioLines = doc.splitTextToSize(data.bio || '', contentWidth);
    doc.text(bioLines, margin, y);
    y += (bioLines.length * 6) + 5;

    // Section: Technical Skills
    if (data.skills && data.skills.length > 0) {
        addSectionHeader("Technical Skills");
        doc.setFont("times", "normal");
        doc.setFontSize(11);
        const skillsStr = data.skills.join(', ');
        const skillLines = doc.splitTextToSize(skillsStr, contentWidth);
        doc.text(skillLines, margin, y);
        y += (skillLines.length * 6) + 5;
    }

    // Section: Impact & Innovation
    if (data.problem || data.solution) {
        addSectionHeader("Impact & Innovation");
        
        // Problem
        doc.setFont("times", "bold");
        doc.text("Problem Addressed:", margin, y);
        y += 6;
        doc.setFont("times", "normal");
        const probLines = doc.splitTextToSize(data.problem || '', contentWidth);
        doc.text(probLines, margin, y);
        y += (probLines.length * 6) + 4;

        // Solution
        doc.setFont("times", "bold");
        doc.text(`Solution: ${data.solutionName || 'The Project'}`, margin, y);
        y += 6;
        doc.setFont("times", "normal");
        const solLines = doc.splitTextToSize(data.solution || '', contentWidth);
        doc.text(solLines, margin, y);
        y += (solLines.length * 6) + 5;
    }

    // Section: Featured Projects
    if (data.projects && data.projects.length > 0) {
        addSectionHeader("Featured Projects");
        
        data.projects.forEach(p => {
            // Project Title
            doc.setFont("times", "bold");
            doc.setFontSize(12);
            doc.text(p.title, margin, y);
            y += 6;

            // Project Tech
            if (p.tech && p.tech.length > 0) {
                doc.setFont("times", "italic");
                doc.setFontSize(10);
                doc.text(`Technologies: ${p.tech.join(', ')}`, margin, y);
                y += 5;
            }

            // Project Description
            doc.setFont("times", "normal");
            doc.setFontSize(11);
            const descLines = doc.splitTextToSize(p.desc || '', contentWidth);
            doc.text(descLines, margin, y);
            y += (descLines.length * 6) + 8;

            // Page break check
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });
    }

    // Footer
    const date = new Date().toLocaleDateString();
    doc.setFontSize(9);
    doc.setFont("times", "italic");
    doc.setTextColor(100);
    doc.text(`Generated via Portfolio Builder | ${date}`, margin, 285);

    doc.save(`${data.name.replace(/\s+/g, '-')}-Resume.pdf`);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initBuilder();
    new Chatbot();
});
