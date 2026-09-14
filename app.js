(function() {
    'use strict';

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    let settings = null;
    let projects = [];
    let categories = [];
    let particles = [];
    let parallaxElements = [];
    let observers = [];
    let isMenuOpen = false;
    let currentMediaType = 'all';
    let elements = null;

    function log(message) {
        console.log('[App] ' + message);
    }

    function errorLog(message, err) {
        console.error('[App] ' + message + ':', err);
    }

    function hideLoader() {
        try {
            const loader = document.getElementById('loader');
            if (!loader) return;

            // Use the CSS .hidden class for smooth transition
            loader.classList.add('hidden');

            // Fallback: force remove after max timeout in case transition fails
            setTimeout(() => {
                if (loader.style.opacity === '0' || loader.classList.contains('hidden')) {
                    loader.style.display = 'none';
                }
            }, 1200);
        } catch (err) {
            console.warn('[App] Could not hide loader:', err);
            // Emergency fallback
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.display = 'none';
            }
        }
    }

    function getElements() {
        return {
            nav: document.querySelector('.navbar'),
            navLinks: document.querySelectorAll('.nav-link'),
            hamburger: document.querySelector('.hamburger'),
            mobileMenu: document.querySelector('.mobile-menu'),
            hero: document.querySelector('.hero-section'),
            heroTitle: document.querySelector('.hero-title'),
            heroSubtitle: document.querySelector('.hero-subtitle'),
            scrollIndicator: document.querySelector('.scroll-indicator'),
            projectsContainer: document.getElementById('projects-container'),
            projectsEmpty: document.getElementById('projects-empty'),
            skillsContainer: document.getElementById('skills-container'),
            processContainer: document.getElementById('process-container'),
            aboutSection: document.querySelector('.about-section'),
            aboutBio: document.getElementById('about-bio'),
            aboutTools: document.getElementById('about-tools'),
            aboutImage: document.getElementById('about-image'),
            aboutName: document.getElementById('about-name'),
            awardsContainer: document.getElementById('awards-container'),
            awardsList: document.getElementById('awards-list'),
            contactEmail: document.getElementById('contact-email'),
            contactPhone: document.getElementById('contact-phone'),
            contactLocation: document.getElementById('contact-location'),
            contactLinkedin: document.getElementById('contact-linkedin'),
            contactSocials: document.getElementById('contact-socials'),
            contactForm: document.getElementById('contact-form'),
            resumeName: document.getElementById('resume-name'),
            resumeTitle: document.getElementById('resume-title'),
            resumeEmail: document.getElementById('resume-email'),
            resumeLocation: document.getElementById('resume-location'),
            resumeSummary: document.getElementById('resume-summary'),
            resumeExperienceList: document.getElementById('resume-experience-list'),
            resumeSkillsList: document.getElementById('resume-skills-list'),
            resumeSoftwareList: document.getElementById('resume-software-list'),
            servicesContainer: document.getElementById('services-container'),
            educationContent: document.getElementById('education-content'),
            cursor: document.querySelector('.cursor-follower'),
            cursorDot: document.querySelector('.cursor-dot'),
            scrollProgress: document.querySelector('.scroll-progress'),
            skillsCategories: document.getElementById('skills-categories'),
            softwareMarquee: document.getElementById('software-marquee'),
            particles: document.querySelector('.particles-container'),
            mediaFiltersContainer: document.getElementById('media-filters')
        };
    }

    async function loadData() {
        log('Loading data from APIs...');
        try {
            const [settingsRes, projectsRes, categoriesRes, softwareRes] = await Promise.all([
                fetch('/api/settings'),
                fetch('/api/projects'),
                fetch('/api/categories'),
                fetch('/api/software')
            ]);

            if (categoriesRes.ok) {
                categories = await categoriesRes.json();
                log('Categories loaded successfully');
            } else {
                log('Categories API returned status: ' + categoriesRes.status);
            }

            if (settingsRes.ok) {
                settings = await settingsRes.json();
                log('Settings loaded successfully');
            } else {
                log('Settings API returned status: ' + settingsRes.status);
            }

            if (projectsRes.ok) {
                projects = await projectsRes.json();
                log('Projects loaded successfully');
            } else {
                log('Projects API returned status: ' + projectsRes.status);
            }

            if (softwareRes.ok) {
                window.softwareData = await softwareRes.json();
                log('Software loaded successfully');
            } else {
                window.softwareData = [];
                log('Software API returned status: ' + softwareRes.status);
            }

            renderDynamicContent();
        } catch (err) {
            errorLog('API fetch failed, using fallback data', err);
            settings = getFallbackSettings();
            projects = getFallbackProjects();
            categories = getFallbackCategories();
                window.softwareData = [];
            renderDynamicContent();
        }
    }

    function getFallbackSettings() {
        return {
            name: 'Chirag Mahendru',
            title: '3D Environment Artist',
            subtitle: 'Unreal Engine - Game Art - VR - Real-Time Visualization',
            bio: 'I am a 3D Environment Artist specializing in Unreal Engine, with a passion for creating immersive and visually compelling real-time environments.',
            tools: ['Unreal Engine', 'Maya', 'Substance 3D Painter', 'Photoshop'],
            skills: ['3D Rendering', '3D Modeling', '3D Lighting', 'Game Art', 'Environment Design'],
            awards: [
                { event: '24 Frames 2023', achievement: 'Matte Painting - Nomination' },
                { event: '24 Frames 2024', achievement: '3D Environment - Participation' },
                { event: 'Punjab Animation Awards 2025', achievement: 'Recognition' }
            ],
            email: 'hello@chirag.dev'
        };
    }

    function getFallbackCategories() {
        return [
            { id: 'env-art', name: 'Environment Art' },
            { id: 'rt-vr', name: 'Real-Time / VR' },
            { id: 'characters', name: 'Character Art' }
        ];
    }

    function getFallbackProjects() {
        return [
            {
                id: 'project-1',
                title: 'Sample Project',
                description: 'A sample project description',
                coverImage: '/images/project-placeholder.svg',
                software: ['Unreal Engine'],
                categoryId: 'env-art'
            }
        ];
    }

    function renderDynamicContent() {
        log('Rendering dynamic content...');
        renderHero();
        renderProjects();
        renderMediaFilters();
        renderCategoryFilters();
        renderProcess();
        renderSkills();
        renderSkillsCategories();
        renderSoftwareMarquee();
        renderAbout();
        renderResume();
        renderServices();
        renderContact();
    }

    function renderHero() {
        if (elements.heroSubtitle && settings) {
            elements.heroSubtitle.textContent = settings.subtitle || settings.tagline || '';
        }

        const heroVideo = document.getElementById('hero-video');
        if (!heroVideo || !settings) return;

        // Update video source if heroMedia is configured
        if (settings.heroMedia) {
            const source = heroVideo.querySelector('source');
            if (source && source.src !== settings.heroMedia) {
                source.src = settings.heroMedia;
                heroVideo.load();
            }
        }

        // Handle video load errors gracefully
        heroVideo.addEventListener('error', function() {
            console.warn('[App] Hero video failed to load, hiding video container');
            const videoContainer = document.querySelector('.video-container');
            if (videoContainer) {
                videoContainer.style.opacity = '0';
            }
        });

        // Show video once it can play
        heroVideo.addEventListener('canplay', function() {
            const videoContainer = document.querySelector('.video-container');
            if (videoContainer) {
                videoContainer.style.opacity = '1';
            }
        });
    }


    function hasVideo(project) {
        return !!(project.video || project.vrVideo);
    }

    function hasImages(project) {
        if (project.coverImage || project.heroImage) return true;
        if (project.gallery && project.gallery.length > 0) return true;
        return false;
    }

    function renderProjects() {
        if (!elements.projectsContainer) return;

        if (!projects || projects.length === 0) {
            elements.projectsContainer.innerHTML = '';
            if (elements.projectsEmpty) {
                elements.projectsEmpty.classList.remove('hidden');
            }
            return;
        }

        if (elements.projectsEmpty) {
            elements.projectsEmpty.classList.add('hidden');
        }

        const activeCategory = elements.projectsContainer.dataset.activeCategory || '';
        let filtered = activeCategory ? projects.filter(p => p.categoryId === activeCategory) : projects;

        if (currentMediaType === 'images') {
            filtered = filtered.filter(p => hasImages(p));
        } else if (currentMediaType === 'videos') {
            filtered = filtered.filter(p => hasVideo(p));
        }

        const categoryMap = {};
        categories.forEach(cat => { categoryMap[cat.id] = cat.name; });

        elements.projectsContainer.innerHTML = filtered.map(project => {
            const tags = (project.software || []).slice(0, 2);
            const imageUrl = project.coverImage || project.heroImage || '/images/project-placeholder.svg';
            const categoryName = categoryMap[project.categoryId] || '';
            const videoClass = hasVideo(project) ? 'has-video' : '';
            const softwareHtml = (project.software || []).length > 0 
                ? '<div class="project-software">' + (project.software || []).slice(0, 2).join(' / ') + '</div>' 
                : '';
            const playIconHtml = hasVideo(project) ? '<div class="play-icon"></div>' : '';

            return '<article class="project-card ' + videoClass + '" data-category="' + (project.categoryId || '') + '" data-id="' + (project.id || project.slug) + '">' +
                '<div class="project-image">' +
                '<img src="' + imageUrl + '" alt="' + project.title + '" loading="lazy">' +
                '<span class="project-category-badge">' + categoryName + '</span>' +
                playIconHtml +
                '<div class="project-overlay"><span class="view-project">View Project</span></div>' +
                '</div>' +
                '<div class="project-content">' +
                softwareHtml +
                '<h3 class="project-title">' + project.title + '</h3>' +
                '<p class="project-description">' + project.description + '</p>' +
                '<div class="project-tags">' + tags.map(tag => '<span class="tag">' + tag + '</span>').join('') + '</div>' +
                '</div>' +
                '</article>';
        }).join('');

        setupProjectCardListeners();
    }
    function renderCategoryFilters() {
        const container = document.getElementById('category-filters');
        if (!container || !categories.length) return;

        let html = '<button class="category-filter active" data-category="">All</button>';
        categories.forEach(cat => {
            html += '<button class="category-filter" data-category="' + cat.id + '">' + cat.name + '</button>';
        });
        container.innerHTML = html;

        container.querySelectorAll('.category-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const catId = btn.dataset.category;
                if (elements.projectsContainer) {
                    elements.projectsContainer.dataset.activeCategory = catId;
                }
                renderProjects();
            });
        });
    }


    function renderMediaFilters() {
        const container = document.getElementById('media-filters');
        if (!container) return;

        let html = '<button class="media-filter active" data-media="all">All</button>';
        html += '<button class="media-filter" data-media="images">Images</button>';
        html += '<button class="media-filter" data-media="videos">Videos</button>';
        container.innerHTML = html;

        container.querySelectorAll('.media-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.media-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMediaType = btn.dataset.media;
                renderProjects();
            });
        });
    }


    function setupProjectCardListeners() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const img = card.querySelector('img');
                const overlay = card.querySelector('.project-overlay');
                if (img) img.style.transform = 'scale(1.1)';
                if (overlay) overlay.style.opacity = '1';
            });

            card.addEventListener('mouseleave', () => {
                const img = card.querySelector('img');
                const overlay = card.querySelector('.project-overlay');
                if (img) img.style.transform = 'scale(1)';
                if (overlay) overlay.style.opacity = '0';
            });

            card.addEventListener('click', () => {
                const projectId = card.dataset.id;
                window.location.hash = 'project/' + projectId;
            });
        });
    }

    function renderProcess() {
        if (!elements.processContainer) return;

        const processSteps = [
            { step: 1, title: 'Blockout', description: 'Greybox composition, scale, and flow' },
            { step: 2, title: 'Modeling', description: 'High-poly sculpt and low-poly optimization' },
            { step: 3, title: 'Materials', description: 'PBR texture channels and material layering' },
            { step: 4, title: 'Lighting', description: 'Cinematic lighting and atmospheric effects' }
        ];

        elements.processContainer.innerHTML = processSteps.map(step => {
            return '<div class="process-step" data-step="' + step.step + '">' +
                '<div class="process-number">' + step.step + '</div>' +
                '<h3 class="process-title">' + step.title + '</h3>' +
                '<p class="process-description">' + step.description + '</p>' +
                '</div>';
        }).join('');

        initProcessAnimations();
    }

    function renderSkills() {
        if (!elements.skillsContainer || !settings) return;

        const skills = settings.skills || [];
        elements.skillsContainer.innerHTML = skills.map(skill => {
            return '<span class="skill-tag">' + skill + '</span>';
        }).join('');

        initSkillsAnimations();
        renderAwards();
    }

    function renderAwards() {
        if (!elements.awardsList || !settings) return;

        const awards = settings.awards || [];
        if (awards.length === 0) {
            if (elements.awardsContainer) {
                elements.awardsContainer.style.display = 'none';
            }
            return;
        }

        elements.awardsList.innerHTML = awards.map(award => {
            return '<div class="award-item"><span class="award-event">' + award.event + '</span><span class="award-achievement">' + award.achievement + '</span></div>';
        }).join('');
    }

    function renderAbout() {
        if (!settings) return;

        if (elements.aboutBio) {
            elements.aboutBio.textContent = settings.bio || '';
        }

        if (elements.aboutName) {
            elements.aboutName.textContent = settings.name || '';
        }

        if (elements.aboutImage && (settings.profileImage || settings.image || settings.heroImage)) {
            elements.aboutImage.src = settings.profileImage || settings.image || settings.heroImage;
            elements.aboutImage.style.display = 'block';
            const placeholder = document.querySelector('.about-placeholder');
            if (placeholder) placeholder.style.display = 'none';
        }

        if (elements.aboutTools) {
            const tools = settings.tools || [];
            elements.aboutTools.innerHTML = tools.map(tool => {
                return '<span class="tool-tag">' + tool + '</span>';
            }).join('');
        }

            if (elements.educationContent && settings.education) {
                elements.educationContent.innerHTML = settings.education.map(edu => {
                    return '<div class="education-item">' +
                        '<div class="education-institution">' + edu.institution + '</div>' +
                        '<div class="education-degree">' + edu.degree + '</div>' +
                        '<div class="education-focus">' + edu.focus + '</div>' +
                        '<div class="education-specialization">' + edu.specialization + '</div>' +
                        '</div>';
                }).join('');
            }
    }

 function renderContact() {
        if (!settings) return;

        if (elements.contactEmail) {
            elements.contactEmail.textContent = settings.email || '';
            elements.contactEmail.href = 'mailto:' + (settings.email || '');
        }

        if (elements.contactPhone) {
            const phone = settings.phone || '';
            elements.contactPhone.textContent = phone;
            elements.contactPhone.href = 'tel:' + phone;
        }

        if (elements.contactLocation) {
            elements.contactLocation.textContent = settings.location || '';
        }

        if (elements.contactLinkedin) {
            elements.contactLinkedin.href = settings.linkedin || '#';
        }

        if (elements.contactSocials) {
            const socials = settings.socials || {};
            let socialsHtml = '';

            if (socials.linkedin) {
                socialsHtml += '<a href="' + socials.linkedin + '" target="_blank" rel="noopener noreferrer" class="social-link social-linkedin">LinkedIn</a>';
            }
            if (socials.artstation) {
                socialsHtml += '<a href="' + socials.artstation + '" target="_blank" rel="noopener noreferrer" class="social-link social-artstation">ArtStation</a>';
            }
            if (socials.twitter) {
                socialsHtml += '<a href="' + socials.twitter + '" target="_blank" rel="noopener noreferrer" class="social-link social-twitter">Twitter</a>';
            }

            elements.contactSocials.innerHTML = socialsHtml;
        }
    }

    function renderResume() {
        if (!settings) return;

        const resume = settings.resume || {};

        if (elements.resumeName) elements.resumeName.textContent = resume.name || settings.name || '';
        if (elements.resumeTitle) elements.resumeTitle.textContent = resume.title || settings.title || '';
        if (elements.resumeEmail) elements.resumeEmail.textContent = resume.email || settings.email || '';
        if (elements.resumeLocation) elements.resumeLocation.textContent = resume.location || '';

        if (elements.resumeSummary) {
            elements.resumeSummary.textContent = resume.summary || settings.bio || '';
        }

        if (elements.resumeExperienceList) {
            const experience = resume.experience || [];
            elements.resumeExperienceList.innerHTML = experience.map(exp => {
                return '<div class="resume-card">' +
                    '<div class="resume-item-header">' +
                    '<span class="resume-item-role">' + exp.role + '</span>' +
                    '<span class="resume-item-separator">@</span>' +
                    '<span class="resume-item-company">' + exp.company + '</span>' +
                    '</div>' +
                    '<span class="resume-item-period">' + exp.period + '</span>' +
                    '<p class="resume-item-description">' + (exp.description || '') + '</p>' +
                    '</div>';
            }).join('');
        }

        if (elements.resumeSkillsList) {
            const skills = resume.skills || settings.skills || [];
            elements.resumeSkillsList.innerHTML = skills.map(skill => {
                return '<span class="skill-tag">' + skill + '</span>';
            }).join('');
        }

        if (elements.resumeSoftwareList) {
            const software = resume.software || [];
            elements.resumeSoftwareList.innerHTML = software.map(sw => {
                return '<span class="software-item">' + sw + '</span>';
            }).join('');
        }
    }

    function renderServices() {
        if (!settings || !elements.servicesContainer) return;

        const services = settings.services || [];
        elements.servicesContainer.innerHTML = services.map(service => {
            return '<div class="service-card">' +
                '<h3 class="service-title">' + service.title + '</h3>' +
                '<p class="service-description">' + service.description + '</p>' +
                '</div>';
        }).join('');
    }

 function initContactForm() {
        if (!elements.contactForm) return;

        elements.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            log('Contact form submitted:', data);
            alert('Thank you for your message! This is a demo - in production, this would send an email.');
            e.target.reset();
        });
    }

    function setupEventListeners() {
        window.addEventListener('scroll', throttle(() => onScroll(), 16), { passive: true });
        window.addEventListener('resize', debounce(() => onResize(), 10));
        document.addEventListener('click', (e) => handleClick(e));
        document.addEventListener('mousemove', throttle((e) => onMouseMove(e), 16));
        document.addEventListener('mouseleave', () => onMouseLeave());
        window.addEventListener('hashchange', () => handleRouteChange());
    }

    function setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => animateOnScroll.observe(el));
        observers.push(animateOnScroll);
    }

    function onScroll() {
        updateActiveNavLink();
        updateNavStyle();
        updateScrollProgress();
        updateParallax();
    }

    function onResize() {
        if (isMenuOpen && window.innerWidth > 768) {
            toggleMobileMenu();
        }
    }

    function onMouseMove(e) {
        if (elements.cursor) {
            elements.cursor.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
        }
        if (elements.cursorDot) {
            elements.cursorDot.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
        }
    }

    function onMouseLeave() {
        if (elements.cursor) elements.cursor.style.opacity = '0';
        if (elements.cursorDot) elements.cursorDot.style.opacity = '0';
    }

    function handleClick(e) {
        const navLink = e.target.closest('.nav-link');
        if (navLink) {
            e.preventDefault();
            const targetId = navLink.getAttribute('href');
            smoothScrollTo(targetId);
            if (isMenuOpen) toggleMobileMenu();
        }

        const mobileLink = e.target.closest('.mobile-link');
        if (mobileLink) {
            e.preventDefault();
            const targetId = mobileLink.getAttribute('href');
            smoothScrollTo(targetId);
            if (isMenuOpen) toggleMobileMenu();
        }
    }

    function smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + window.innerHeight / 3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                if (elements.navLinks) {
                    elements.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }

    function updateNavStyle() {
        if (elements.nav) {
            if (window.scrollY > 50) {
                elements.nav.classList.add('scrolled');
            } else {
                elements.nav.classList.remove('scrolled');
            }
        }
    }

    function updateScrollProgress() {
        if (elements.scrollProgress) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            elements.scrollProgress.style.width = progress + '%';
        }
    }

    function initCursor() {
        if (!elements.cursor || !elements.cursorDot) return;

        document.querySelectorAll('a, button, .project-card, .skill-tag, .process-step').forEach(el => {
            el.addEventListener('mouseenter', () => {
                elements.cursor.classList.add('hover');
                elements.cursorDot.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                elements.cursor.classList.remove('hover');
                elements.cursorDot.classList.remove('hover');
            });
        });

        elements.cursor.style.opacity = '1';
        elements.cursorDot.style.opacity = '1';
    }

    function initParticles() {
        if (!elements.particles) return;
        const canvas = document.createElement('canvas');
        elements.particles.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const particleCount = 50;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = 'rgba(99, 102, 241, ' + this.opacity + ')';
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
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animateParticles);
        };

        animateParticles();
    }

    function initScrollProgress() {
        if (elements.scrollProgress) {
            elements.scrollProgress.style.background = 'linear-gradient(90deg, #6366f1, #8b5cf6)';
            elements.scrollProgress.style.transition = 'width 0.1s ease-out';
        }
    }

    function initHeroAnimation() {
        if (!elements.heroTitle) return;

        const content = document.getElementById('hero-content');
        if (content) {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
            content.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }

        const scrollIndicator = document.getElementById('scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.transition = 'opacity 0.5s ease';
        }
    }

    function initStickyNav() {
        if (elements.nav) {
            elements.nav.style.transition = 'all 0.3s ease';
        }
    }

    function initMobileMenu() {
        if (elements.hamburger && elements.mobileMenu) {
            elements.hamburger.addEventListener('click', () => toggleMobileMenu());
        }
    }

    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;

        if (elements.hamburger) {
            const menuIcon = document.getElementById('menu-icon');
            const closeIcon = document.getElementById('close-icon');
            if (isMenuOpen) {
                elements.hamburger.classList.add('active');
                if (menuIcon) menuIcon.classList.add('hidden');
                if (closeIcon) closeIcon.classList.remove('hidden');
            } else {
                elements.hamburger.classList.remove('active');
                if (menuIcon) menuIcon.classList.remove('hidden');
                if (closeIcon) closeIcon.classList.add('hidden');
            }
        }

        if (elements.mobileMenu) {
            if (isMenuOpen) {
                elements.mobileMenu.classList.add('active');
                elements.mobileMenu.style.transform = 'translateX(0)';
                elements.mobileMenu.style.opacity = '1';
            } else {
                elements.mobileMenu.classList.remove('active');
                elements.mobileMenu.style.transform = 'translateX(100%)';
                elements.mobileMenu.style.opacity = '0';
            }
        }
    }

    function renderSkillsCategories() {
        if (!elements.skillsCategories || !settings) return;

        const categories = {
            'Environment Modeling': ['Blockout', 'High-poly sculpt', 'Low-poly optimization', 'Retopology', 'UV mapping'],
            'Hard Surface Modeling': ['Prop modeling', 'Mechanical assets', 'Kit-bashing', 'Boolean operations'],
            'Asset Creation': ['Game-ready assets', 'PBR textures', 'Material layering', 'Decals'],
            'Texturing': ['Substance Painter', 'Substance Designer', 'Hand-painting', 'Texture baking'],
            'Lighting': ['UE5 Lighting', 'Cinematic lighting', 'Atmospheric effects', 'HDRI setup'],
            'Rendering': ['Arnold', 'V-Ray', 'Marmoset', 'Real-time rendering']
        };

        let html = '';
        for (const [title, items] of Object.entries(categories)) {
            html += '<div class="skill-category">' +
                '<h3 class="skill-category-title">' + title + '</h3>' +
                '<div class="skill-category-list">' +
                items.map(item => '<span class="skill-category-item">' + item + '</span>').join('') +
                '</div></div>';
        }
        elements.skillsCategories.innerHTML = html;
    }

    function renderSoftwareMarquee() {
        if (!elements.softwareMarquee) return;

        const software = (window.softwareData || []).filter(s => s.isActive);
        software.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

        if (software.length === 0) {
            elements.softwareMarquee.innerHTML = '<p style="text-align:center;color:#6b7280;font-size:14px;padding:40px;">No software configured yet.</p>';
            return;
        }

        const renderItem = (s) => {
            const iconHtml = s.icon
                ? '<img src="' + s.icon + '" alt="' + escapeHtml(s.name) + '" class="marquee-item-icon" loading="lazy">'
                : '<div class="marquee-item-icon" style="display:flex;align-items:center;justify-content:center;font-size:11px;color:#6b7280;background:rgba(255,255,255,0.05);border-radius:8px;">' + (s.name.charAt(0) || '?') + '</div>';
            return '<div class="marquee-item">' +
                iconHtml +
                '<span class="marquee-item-name">' + escapeHtml(s.name) + '</span>' +
                '<span class="marquee-item-category">' + escapeHtml(s.category || '') + '</span>' +
                '</div>';
        };

        const itemsHtml = software.map(renderItem).join('');
        elements.softwareMarquee.innerHTML = itemsHtml + itemsHtml;
    }

    function initResumeAnimations() {
        const resumeSection = document.getElementById('resume');
        if (!resumeSection) return;

        const animatedEls = resumeSection.querySelectorAll('.resume-section-animate, .resume-card');
        if (!animatedEls.length) return;

        animatedEls.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const parent = entry.target;
                    const stagger = parseInt(parent.dataset.animateStagger || '100', 10);
                    const children = parent.querySelectorAll(':scope > .resume-card, :scope > .resume-section-animate');

                    if (children.length > 0) {
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.style.opacity = '1';
                                child.style.transform = 'translateY(0)';
                            }, index * stagger);
                        });
                    } else {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        animatedEls.forEach(el => observer.observe(el));
        observers.push(observer);
    }

    function initSkillsAnimations() {
        const container = document.getElementById('skills-container');
        if (!container) return;

        const skills = container.querySelectorAll('.skill-tag');
        skills.forEach(skill => {
            skill.style.opacity = '0';
            skill.style.transform = 'translateY(20px)';
            skill.style.transition = 'all 0.3s ease';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skills.forEach((skill, index) => {
                        setTimeout(() => {
                            skill.style.opacity = '1';
                            skill.style.transform = 'translateY(0)';
                        }, index * 50);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(container);
        observers.push(observer);
    }

    function initProcessAnimations() {
        const steps = document.querySelectorAll('.process-step');
        if (!steps.length) return;

        steps.forEach(step => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(30px)';
            step.style.transition = 'all 0.5s ease';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    steps.forEach((step, index) => {
                        setTimeout(() => {
                            step.style.opacity = '1';
                            step.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }
            });
        }, { threshold: 0.3 });

        steps.forEach(step => observer.observe(step));
        observers.push(observer);
    }

    function updateParallax() {
        if (!parallaxElements || !parallaxElements.length) return;

        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const rect = el.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const offset = (window.innerHeight / 2 - centerY) * speed;

            el.style.transform = 'translateY(' + offset + 'px)';
        });
    }

    function initRouter() {
        handleRouteChange();
    }

    function handleRouteChange() {
        const hash = window.location.hash.slice(1);
        if (hash.startsWith('project/')) {
            const projectId = hash.split('/')[1];
            showProjectDetail(projectId);
        }
    }

    function showProjectDetail(projectId) {
        const project = projects.find(p => (p.id === projectId || p.slug === projectId));
        if (!project) return;

        const modal = document.getElementById('project-detail-modal');
        const mediaEl = modal.querySelector('.project-detail-media');
        const galleryEl = modal.querySelector('.project-detail-gallery');
        const infoEl = modal.querySelector('.project-detail-info');
        const videoEl = modal.querySelector('.project-detail-video');

        const imagesContent = document.createElement('div');
        imagesContent.className = 'project-detail-tab-content active';
        const videosContent = document.createElement('div');
        videosContent.className = 'project-detail-tab-content';

        const cover = project.coverImage || project.heroImage || '';
        let imagesHtml = '';
        if (cover) {
            imagesHtml += '<img src="' + cover + '" alt="' + project.title + '" style="width:100%;border-radius:8px;margin-bottom:12px;">';
        }
        if (project.gallery && project.gallery.length) {
            imagesHtml += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;">';
            project.gallery.forEach(item => {
                const url = typeof item === 'string' ? item : item.url;
                imagesHtml += '<img src="' + url + '" style="width:100%;height:120px;object-fit:cover;border-radius:8px;">';
            });
            imagesHtml += '</div>';
        }
        imagesContent.innerHTML = imagesHtml || '<p style="color:var(--text-muted);padding:20px;">No images available.</p>';

        let videosHtml = '';
        if (project.video) {
            videosHtml += '<video controls style="width:100%;border-radius:8px;margin-bottom:12px;"><source src="' + project.video + '" type="video/mp4"></video>';
        }
        if (project.vrVideo) {
            videosHtml += '<video controls style="width:100%;border-radius:8px;"><source src="' + project.vrVideo + '" type="video/mp4"></video>';
        }
        videosContent.innerHTML = videosHtml || '<p style="color:var(--text-muted);padding:20px;">No videos available.</p>';

        if (infoEl) {
            infoEl.innerHTML = '<h2 class="project-detail-title">' + project.title + '</h2>' +
                '<p class="project-detail-description">' + (project.description || '') + '</p>' +
                '<div class="project-detail-tags">' + (project.software || []).map(tag => '<span class="tag">' + tag + '</span>').join('') + '</div>';
        }

        const content = modal.querySelector('.project-detail-content');
        
        const oldTabs = content.querySelectorAll('.project-detail-tab-content');
        oldTabs.forEach(t => t.remove());
        
        const oldTabBar = content.querySelector('.project-detail-tabs');
        if (oldTabBar) oldTabBar.remove();

        const closeBtn = content.querySelector('.project-detail-close');
        const tabBar = document.createElement('div');
        tabBar.className = 'project-detail-tabs';
        tabBar.innerHTML = '<button class="project-detail-tab active" data-tab="images">Images</button>' +
            '<button class="project-detail-tab" data-tab="videos">Videos</button>';
        content.insertBefore(tabBar, mediaEl);

        if (mediaEl) mediaEl.innerHTML = '';
        if (galleryEl) galleryEl.innerHTML = '';
        if (videoEl) videoEl.innerHTML = '';

        if (videoEl) {
            videoEl.parentNode.insertBefore(imagesContent, videoEl);
            videoEl.parentNode.insertBefore(videosContent, videoEl);
        } else if (infoEl) {
            infoEl.parentNode.insertBefore(imagesContent, infoEl);
            infoEl.parentNode.insertBefore(videosContent, infoEl);
        }

        tabBar.querySelectorAll('.project-detail-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                tabBar.querySelectorAll('.project-detail-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const tabName = tab.dataset.tab;
                document.querySelectorAll('.project-detail-tab-content').forEach(c => c.classList.remove('active'));
                if (tabName === 'images') imagesContent.classList.add('active');
                if (tabName === 'videos') videosContent.classList.add('active');
            });
        });

        const closeBtnHandler = modal.querySelector('.project-detail-close');
        if (closeBtnHandler) {
            closeBtnHandler.onclick = () => {
                modal.style.display = 'none';
                const tabsToRemove = modal.querySelectorAll('.project-detail-tab-content');
                tabsToRemove.forEach(t => t.remove());
                const tabBarToRemove = modal.querySelector('.project-detail-tabs');
                if (tabBarToRemove) tabBarToRemove.remove();
            };
        }

        modal.style.display = 'flex';
    }
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

    function throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    async function init() {
        console.log('[App] init() started');
        log('Starting app init...');

        try {
            elements = getElements();
            console.log('[App] Elements cached');
            log('Elements cached');

            setupEventListeners();
            console.log('[App] Event listeners setup');
            log('Event listeners setup');

            setupIntersectionObserver();
            console.log('[App] Intersection observer setup');
            log('Intersection observer setup');

            await loadData();
            console.log('[App] Data loaded');
            log('Data loaded');

            // Verify video source is reachable
            const heroVideo = document.getElementById('hero-video');
            if (heroVideo && settings && settings.heroMedia) {
                const source = heroVideo.querySelector('source');
                if (source && source.src) {
                    log('Hero video source set to: ' + source.src);
                }
            }

            initRouter();
            console.log('[App] Router initialized');
            log('Router initialized');

            initCursor();
            console.log('[App] Cursor initialized');
            log('Cursor initialized');

            initParticles();
            console.log('[App] Particles initialized');
            log('Particles initialized');

            initScrollProgress();
            console.log('[App] Scroll progress initialized');
            log('Scroll progress initialized');

            initHeroAnimation();
            console.log('[App] Hero animation initialized');
            log('Hero animation initialized');

            initStickyNav();
            console.log('[App] Sticky nav initialized');
            log('Sticky nav initialized');

            initMobileMenu();
            console.log('[App] Mobile menu initialized');
            log('Mobile menu initialized');

            initSkillsAnimations();
            console.log('[App] Skills animations initialized');
            log('Skills animations initialized');

            initResumeAnimations();
            console.log('[App] Resume animations initialized');
            log('Resume animations initialized');

            initContactForm();
            console.log('[App] Contact form initialized');
            log('Contact form initialized');

            parallaxElements = document.querySelectorAll('[data-parallax]');
            console.log('[App] Parallax elements captured');
            log('Parallax elements captured');

            console.log('[App] Init complete');
            log('Init complete');
        } catch (error) {
            console.error('[App] Init error:', error);
            errorLog('Init error:', error);
        } finally {
            console.log('[App] finally block executing');
            hideLoader();
            console.log('[App] Loader hidden');
            log('Loader hidden');
        }
    }

    // Global error handlers to ensure loader is always hidden
    window.addEventListener('error', function(e) {
        console.error('[App] Global error:', e.message, 'at', e.filename + ':' + e.lineno);
        const loader = document.getElementById('loader');
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    });

    window.addEventListener('unhandledrejection', function(e) {
        console.error('[App] Unhandled promise rejection:', e.reason);
        const loader = document.getElementById('loader');
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init().catch(function(err) {
                console.error('[App] init() promise rejected:', err);
            });
        });
    } else {
        init().catch(function(err) {
            console.error('[App] init() promise rejected:', err);
        });
    }
})();







// Safety net: force-hide loader after 5s regardless of init state
setTimeout(function() {
    const loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('hidden')) {
        console.warn('[App] Safety net: forcing loader hide after timeout');
        loader.classList.add('hidden');
        setTimeout(function() { if (loader) loader.style.display = 'none'; }, 700);
    }
}, 5000);
