// =============================================
//  ASIFIWE'S PORTFOLIO — Unified JavaScript
//  Handles: Starfield, Carousels, Music Player
// =============================================

// ===== STARFIELD ANIMATION =====
(function createStarfield() {
    const canvas = document.createElement('canvas');
    canvas.id = 'starfield';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const stars = [];
    for (let i = 0; i < 120; i++) {
        stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            radius: Math.random() * 1.8 + 0.3,
            opacity: Math.random() * 0.6 + 0.4,
            speed: Math.random() * 0.015 + 0.005,
            driftX: (Math.random() - 0.5) * 0.3,
            driftY: (Math.random() - 0.5) * 0.3
        });
    }

    // Shooting stars
    let shootingStars = [];

    function addShootingStar() {
        shootingStars.push({
            x: Math.random() * W,
            y: 0,
            vx: -2 - Math.random() * 3,
            vy: 1 + Math.random() * 2,
            life: 1,
            trail: []
        });
    }

    setInterval(() => {
        if (Math.random() > 0.7) addShootingStar();
    }, 3000);

    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 26, 0.3)';
        ctx.fillRect(0, 0, W, H);

        for (const star of stars) {
            star.opacity += star.speed * (Math.random() > 0.5 ? 1 : -1);
            if (star.opacity > 1 || star.opacity < 0.3) star.speed *= -1;

            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();

            star.x += star.driftX;
            star.y += star.driftY;

            if (star.x < 0) star.x = W;
            if (star.x > W) star.x = 0;
            if (star.y < 0) star.y = H;
            if (star.y > H) star.y = 0;
        }

        // Shooting stars
        shootingStars = shootingStars.filter(s => s.life > 0);
        for (const s of shootingStars) {
            s.x += s.vx;
            s.y += s.vy;
            s.life -= 0.02;
            s.trail.push({ x: s.x, y: s.y });
            if (s.trail.length > 20) s.trail.shift();

            ctx.strokeStyle = `rgba(255, 255, 255, ${s.life * 0.8})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < s.trail.length; i++) {
                const t = s.trail[i];
                if (i === 0) ctx.moveTo(t.x, t.y);
                else ctx.lineTo(t.x, t.y);
            }
            ctx.stroke();

            ctx.fillStyle = `rgba(255, 255, 255, ${s.life})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, W, H);
    animate();
})();

// ===== HOME PAGE CAROUSEL =====
const carouselTrack = document.querySelector('.carousel-track');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicators = document.querySelectorAll('.indicator');

if (carouselTrack && carouselItems.length) {
    let currentIndex = 0;
    const totalItems = carouselItems.length;

    function updateCarousel() {
        const offset = -currentIndex * 100;
        carouselTrack.style.transform = `translateX(${offset}%)`;

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') nextSlide();
            if (event.key === 'ArrowLeft') prevSlide();
        });
    }

    updateCarousel();

    // Auto-advance every 5 seconds
    setInterval(nextSlide, 5000);
}

// ===== PORTFOLIO PAGE CAROUSEL =====
let currentSlideIndex = 0;

function moveCarousel(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides.length) return;

    currentSlideIndex += direction;
    const totalSlides = slides.length;

    if (currentSlideIndex >= totalSlides) currentSlideIndex = 0;
    if (currentSlideIndex < 0) currentSlideIndex = totalSlides - 1;

    updatePortfolioCarousel();
}

function currentSlide(index) {
    currentSlideIndex = index;
    updatePortfolioCarousel();
}

function updatePortfolioCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    slides.forEachslides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (slides[currentSlideIndex]) slides[currentSlideIndex].classList.add('active');
    if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');
}

// Initialize portfolio carousel
const portfolioSlides = document.querySelectorAll('.carousel-slide');
if (portfolioSlides.length) {
    updatePortfolioCarousel();

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') moveCarousel(-1);
        if (event.key === 'ArrowRight') moveCarousel(1);
    });

    // Auto-advance portfolio carousel every 6 seconds
    setInterval(() => moveCarousel(1), 6000);
}

// ===== MUSIC PLAYER =====
document.querySelectorAll('.play-btn').forEach(button => {
    const track = button.getAttribute('data-track');
    if (!track) return;

    const audio = document.getElementById(`audio-${track}`);
    const songItem = document.getElementById(`song-${track}`);
    if (!audio || !songItem) return;

    // Keep track of timeupdate listener to avoid duplicates
    let timeListenerAttached = false;
    let endListenerAttached = false;

    button.addEventListener('click', function(e) {
        e.stopPropagation();

        // Pause any other playing song
        const currentlyPlaying = document.querySelector('.song-item.playing');
        if (currentlyPlaying && currentlyPlaying !== songItem) {
            const otherTrack = currentlyPlaying.id.replace('song-', '');
            const otherAudio = document.getElementById(`audio-${otherTrack}`);
            const otherBtn = currentlyPlaying.querySelector('.play-btn');
            if (otherAudio) { otherAudio.pause(); otherAudio.currentTime = 0; }
            if (otherBtn) otherBtn.textContent = '▶';
            currentlyPlaying.classList.remove('playing');
            const otherBar = currentlyPlaying.querySelector('.progress-bar');
            if (otherBar) otherBar.style.width = '0%';
        }

        // Toggle play/pause
        if (audio.paused) {
            audio.play();
            this.textContent = '⏸';
            songItem.classList.add('playing');

            if (!timeListenerAttached) {
                audio.addEventListener('timeupdate', function onTime() {
                    const bar = songItem.querySelector('.progress-bar');
                    if (bar && audio.duration) {
                        bar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
                    }
                });
                timeListenerAttached = true;
            }

            if (!endListenerAttached) {
                audio.addEventListener('ended', function onEnd() {
                    button.textContent = '▶';
                    songItem.classList.remove('playing');
                    const bar = songItem.querySelector('.progress-bar');
                    if (bar) bar.style.width = '0%';
                });
                endListenerAttached = true;
            }
        } else {
            audio.pause();
            this.textContent = '▶';
            songItem.classList.remove('playing');
        }
    });

    // Click on progress bar to seek
    const progressContainer = songItem.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            if (audio.duration) {
                audio.currentTime = percent * audio.duration;
            }
        });
    }
});