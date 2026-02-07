/* ==========================================
   HIMANSHU SINGH BAIS — RESUME WEBSITE
   Animation Engine
   GSAP ScrollTrigger + Three.js + Custom Effects
   ========================================== */

// ==========================================
// 1. THREE.JS PARTICLE BACKGROUND
// ==========================================
(function initThreeBackground() {
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle system
    const particleCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
        { r: 0 / 255, g: 255 / 255, b: 212 / 255 },    // #00FFD4
        { r: 84 / 255, g: 101 / 255, b: 255 / 255 },     // #5465FF
        { r: 210 / 255, g: 221 / 255, b: 255 / 255 },    // #D2DDFF
    ];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Connecting lines
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00FFD4,
        transparent: true,
        opacity: 0.03,
        blending: THREE.AdditiveBlending,
    });
    const linePositions = new Float32Array(300 * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 8;

    let mouseX = 0, mouseY = 0;
    let scrollProgress = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('scroll', () => {
        scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    });

    function updateLines() {
        const pPos = geometry.attributes.position.array;
        let lineIdx = 0;
        const maxDist = 3;

        for (let i = 0; i < Math.min(particleCount, 100); i++) {
            for (let j = i + 1; j < Math.min(particleCount, 100); j++) {
                if (lineIdx >= 300) break;
                const dx = pPos[i * 3] - pPos[j * 3];
                const dy = pPos[i * 3 + 1] - pPos[j * 3 + 1];
                const dz = pPos[i * 3 + 2] - pPos[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < maxDist) {
                    linePositions[lineIdx * 6] = pPos[i * 3];
                    linePositions[lineIdx * 6 + 1] = pPos[i * 3 + 1];
                    linePositions[lineIdx * 6 + 2] = pPos[i * 3 + 2];
                    linePositions[lineIdx * 6 + 3] = pPos[j * 3];
                    linePositions[lineIdx * 6 + 4] = pPos[j * 3 + 1];
                    linePositions[lineIdx * 6 + 5] = pPos[j * 3 + 2];
                    lineIdx++;
                }
            }
            if (lineIdx >= 300) break;
        }

        lines.geometry.attributes.position.needsUpdate = true;
    }

    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.0002;

        particles.rotation.x = time * 0.3 + mouseY * 0.1;
        particles.rotation.y = time * 0.2 + mouseX * 0.1;
        particles.position.y = scrollProgress * -5;

        // Wave effect on particles
        const pPos = geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            pPos[i * 3 + 1] += Math.sin(time * 5 + pPos[i * 3] * 0.5) * 0.001;
        }
        geometry.attributes.position.needsUpdate = true;

        updateLines();

        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();

// ==========================================
// 2. PRELOADER
// ==========================================
(function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progress = document.getElementById('preloader-progress');
    const counter = document.getElementById('preloader-counter');
    const letters = document.querySelectorAll('.preloader-letter');

    // Animate letters in
    gsap.to(letters, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.06,
        delay: 0.3,
    });

    // Simulate loading
    let count = 0;
    const interval = setInterval(() => {
        count += Math.random() * 15;
        if (count >= 100) {
            count = 100;
            clearInterval(interval);

            setTimeout(() => {
                // Animate letters out
                gsap.to(letters, {
                    opacity: 0,
                    y: -60,
                    rotateX: -90,
                    duration: 0.5,
                    ease: 'power3.in',
                    stagger: 0.03,
                });

                // Hide preloader
                gsap.to(preloader, {
                    yPercent: -100,
                    duration: 1.2,
                    ease: 'power4.inOut',
                    delay: 0.4,
                    onComplete: () => {
                        preloader.style.display = 'none';
                        initHeroAnimations();
                        initScrollAnimations();
                    }
                });
            }, 500);
        }

        progress.style.width = count + '%';
        counter.textContent = Math.floor(count) + '%';
    }, 50);
})();

// ==========================================
// 3. CUSTOM CURSOR
// ==========================================
(function initCursor() {
    const cursor = document.getElementById('cursor');
    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');

    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    function updateCursor() {
        // Dot follows cursor directly
        dotX += (cursorX - dotX) * 0.2;
        dotY += (cursorY - dotY) * 0.2;
        dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;

        // Ring follows with delay
        ringX += (cursorX - ringX) * 0.08;
        ringY += (cursorY - ringY) * 0.08;
        ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;

        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Cursor effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .magnetic, .work-item, .skill-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.style.width = '12px';
            dot.style.height = '12px';
            ring.style.width = '60px';
            ring.style.height = '60px';
            ring.style.borderColor = 'rgba(0, 255, 212, 0.8)';
        });
        el.addEventListener('mouseleave', () => {
            dot.style.width = '8px';
            dot.style.height = '8px';
            ring.style.width = '40px';
            ring.style.height = '40px';
            ring.style.borderColor = 'rgba(0, 255, 212, 0.5)';
        });
    });
})();

// ==========================================
// 4. MAGNETIC ELEMENTS
// ==========================================
(function initMagnetic() {
    const magnetics = document.querySelectorAll('.magnetic');

    magnetics.forEach(el => {
        const strength = parseInt(el.dataset.strength) || 20;

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: x * (strength / 100),
                y: y * (strength / 100),
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
})();

// ==========================================
// 5. HERO ANIMATIONS
// ==========================================
function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Hero words slide up
    tl.to('.hero-word', {
        y: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: 'power4.out',
    })
        // Tag line
        .to('.hero-tag', {
            opacity: 1,
            y: 0,
            duration: 0.8,
        }, '-=1')
        // Subtitle words
        .to('.hero-subtitle-word', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
        }, '-=0.6')
        // CTA buttons
        .to('.hero-cta', {
            opacity: 1,
            y: 0,
            duration: 0.8,
        }, '-=0.4')
        // Scroll indicator
        .to('.hero-scroll-indicator', {
            opacity: 1,
            duration: 0.6,
        }, '-=0.3')
        // Floating badge
        .to('.hero-floating-badge', {
            opacity: 1,
            duration: 0.6,
        }, '-=0.4');
}

// ==========================================
// 6. SCROLL ANIMATIONS (GSAP ScrollTrigger)
// ==========================================
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // ---- Nav scroll effect ----
    ScrollTrigger.create({
        start: 100,
        onUpdate: (self) => {
            const nav = document.getElementById('nav');
            if (self.direction === 1 && self.scroll() > 100) {
                nav.classList.add('scrolled');
            }
            if (self.scroll() < 50) {
                nav.classList.remove('scrolled');
            }
        }
    });

    // ---- Section Labels ----
    gsap.utils.toArray('.section-label').forEach(label => {
        gsap.to(label, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: label,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            }
        });
    });

    // ---- About Text Reveals ----
    gsap.utils.toArray('.about-text').forEach((text, i) => {
        gsap.to(text, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: text,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            }
        });
    });

    // ---- About Image Parallax ----
    gsap.to('#about-image', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
        }
    });

    // ---- Stats Counter Animation ----
    gsap.utils.toArray('.stat-number').forEach(stat => {
        const target = parseInt(stat.dataset.count);
        const duration = target > 100 ? 2.5 : 1.5;

        ScrollTrigger.create({
            trigger: stat,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(stat, {
                    innerText: target,
                    duration: duration,
                    snap: { innerText: 1 },
                    ease: 'power2.out',
                    onUpdate: function () {
                        stat.textContent = Math.floor(this.targets()[0].innerText);
                    }
                });
            },
            once: true,
        });
    });

    // ---- Skill Cards Stagger ----
    gsap.utils.toArray('.skill-card').forEach((card, i) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
            }
        });
    });

    // ---- Skill Bars Fill ----
    gsap.utils.toArray('.skill-fill').forEach(fill => {
        const width = fill.dataset.width;
        ScrollTrigger.create({
            trigger: fill,
            start: 'top 90%',
            onEnter: () => {
                fill.style.width = width + '%';
            },
            once: true,
        });
    });

    // ---- Work Items Stagger ----
    gsap.utils.toArray('.work-item').forEach((item, i) => {
        gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: (i % 3) * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
            }
        });
    });

    // ---- Work Items Parallax ----
    gsap.utils.toArray('.work-image-bg').forEach(bg => {
        gsap.to(bg, {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: {
                trigger: bg.closest('.work-item'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2,
            }
        });
    });

    // ---- Quote Section ----
    const quoteTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.quote-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
        }
    });

    quoteTl.to('.quote-mark', {
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
    })
        .to('.quote-text', {
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
        }, '-=0.3')
        .to('.quote-author', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
        }, '-=0.5');

    // ---- Contact Section ----
    gsap.to('.contact-desc', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.contact-desc',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
        }
    });

    gsap.utils.toArray('.contact-link').forEach((link, i) => {
        gsap.to(link, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: link,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
            }
        });
    });

    // ---- Marquee Speed on Scroll ----
    gsap.to('.marquee-track', {
        x: '-=200',
        ease: 'none',
        scrollTrigger: {
            trigger: '.marquee-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
        }
    });

    // ---- Big Heading Parallax ----
    gsap.utils.toArray('.about-heading, .work-heading, .contact-heading').forEach(heading => {
        gsap.from(heading, {
            y: 60,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: heading,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            }
        });
    });

    // ---- Horizontal Scroll Reveal for Work Gallery ----
    // Smooth reveal on scroll
    ScrollTrigger.matchMedia({
        "(min-width: 1025px)": function () {
            gsap.utils.toArray('.work-item').forEach((item, i) => {
                gsap.to(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                    },
                    y: (i % 2 === 0) ? -30 : -60,
                    ease: 'none',
                });
            });
        }
    });
}

// ==========================================
// 7. NAVIGATION
// ==========================================
(function initNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1.2,
                    scrollTo: { y: target, offsetY: 80 },
                    ease: 'power3.inOut',
                });
            }
        });
    });
})();

// ==========================================
// 8. TILT EFFECT ON SKILL CARDS
// ==========================================
(function initTilt() {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(card, {
                rotateX: -y * 10,
                rotateY: x * 10,
                transformPerspective: 800,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.4)'
            });
        });
    });
})();

// ==========================================
// 9. TEXT SPLITTING UTILITY
// ==========================================
(function initTextSplitting() {
    // Not doing char-level animation for performance,
    // but we add a word-level reveal for headings
    gsap.utils.toArray('.split-text').forEach(text => {
        // Preserve HTML tags (like <em class="accent-text">) while splitting words
        const html = text.innerHTML;
        // Split by spaces but keep HTML tags intact
        const result = html.replace(/(<[^>]+>)|(\S+)/g, (match, tag, word) => {
            if (tag) return tag; // preserve HTML tags as-is
            return `<span class="word-wrapper"><span class="word-inner">${word}</span></span>`;
        });
        text.innerHTML = result;
    });
})();

// ==========================================
// 10. SMOOTH SCROLL PROGRESS BAR
// ==========================================
(function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 2px;
        background: linear-gradient(90deg, #00FFD4, #5465FF);
        z-index: 10000;
        transition: none;
        transform-origin: left;
        transform: scaleX(0);
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        progressBar.style.transform = `scaleX(${scrollPercent})`;
        progressBar.style.width = '100%';
    });
})();

// ==========================================
// 11. INTERSECTION OBSERVER FOR REVEAL
// ==========================================
(function initRevealObserver() {
    const revealElements = document.querySelectorAll('.reveal-text');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));
})();

// ==========================================
// 12. BACKGROUND GLOW ANIMATION
// ==========================================
(function initBackgroundGlow() {
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: fixed;
        width: 600px;
        height: 600px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 255, 212, 0.04), transparent 70%);
        pointer-events: none;
        z-index: 0;
        transform: translate(-50%, -50%);
        transition: left 0.8s cubic-bezier(0.16, 1, 0.3, 1), top 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
})();

// ==========================================
// 13. EASTER EGG: KONAMI CODE
// ==========================================
(function initKonamiCode() {
    const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konami[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konami.length) {
                document.body.style.filter = 'hue-rotate(180deg)';
                setTimeout(() => {
                    document.body.style.filter = '';
                }, 3000);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
})();

console.log('%c🎨 Designed & Developed by Himanshu Singh Bais', 'color: #00FFD4; font-size: 16px; font-weight: bold;');
console.log('%c📸 Light. Composition. Click.', 'color: #5465FF; font-size: 14px;');

// ================================================
// NEW SECTIONS: Gallery, Scripts, Showreel
// ================================================

// ---- Gallery Stagger Animation ----
gsap.utils.toArray('.gallery-item').forEach((item, i) => {
    gsap.fromTo(item, {
        opacity: 0,
        y: 60,
        scale: 0.92,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
        },
        delay: (i % 4) * 0.1, // stagger within visible row
    });
});

// ---- Script Card Animations ----
gsap.utils.toArray('.script-card').forEach((card, i) => {
    gsap.fromTo(card, {
        opacity: 0,
        y: 40,
    }, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
        },
        delay: (i % 3) * 0.12,
    });
});

// ---- Video Card Animations ----
gsap.utils.toArray('.video-card').forEach((card, i) => {
    gsap.fromTo(card, {
        opacity: 0,
        y: 50,
    }, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
        },
        delay: (i % 3) * 0.1,
    });
});

// ---- Video Play/Pause on Click ----
document.querySelectorAll('.video-card').forEach(card => {
    const video = card.querySelector('video');
    const overlay = card.querySelector('.video-play-overlay');

    if (video && overlay) {
        card.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                card.classList.add('playing');
            } else {
                video.pause();
                card.classList.remove('playing');
            }
        });

        video.addEventListener('ended', () => {
            card.classList.remove('playing');
        });
    }
});

// ---- Resume Banner Animation ----
const resumeBanner = document.querySelector('.resume-banner');
if (resumeBanner) {
    gsap.fromTo(resumeBanner, {
        opacity: 0,
        y: 30,
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: resumeBanner,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
        },
    });
}

// ---- Section headings for new sections ----
gsap.utils.toArray('.gallery-heading, .scripts-heading, .showreel-heading').forEach(heading => {
    gsap.fromTo(heading, {
        opacity: 0,
        y: 40,
    }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
        },
    });
});

// ---- Category titles for showreel ----
gsap.utils.toArray('.showreel-category-title').forEach(title => {
    gsap.fromTo(title, {
        opacity: 0,
        x: -30,
    }, {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: title,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
        },
    });
});

// ---- Extend cursor effects for new interactive elements ----
const newInteractive = document.querySelectorAll('.gallery-item, .script-card, .video-card, .script-download, .script-tag');
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
    newInteractive.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.width = '12px';
            cursorDot.style.height = '12px';
            cursorRing.style.width = '60px';
            cursorRing.style.height = '60px';
            cursorRing.style.borderColor = 'rgba(0, 255, 212, 0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.style.width = '8px';
            cursorDot.style.height = '8px';
            cursorRing.style.width = '40px';
            cursorRing.style.height = '40px';
            cursorRing.style.borderColor = 'rgba(0, 255, 212, 0.5)';
        });
    });
}
