document.addEventListener('DOMContentLoaded', () => {
    // AOS 초기화
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // 네비게이션 스크롤 효과
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.style.background = 'rgba(28, 28, 30, 0.8)';
        } else if (currentScroll > lastScroll) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
            navbar.style.background = 'rgba(28, 28, 30, 0.95)';
        }

        lastScroll = currentScroll;
    });

    // 패럴랙스 효과
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    });

    // 숫자 카운트 애니메이션
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start) + '%';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Intersection Observer로 숫자 애니메이션 트리거
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    const value = parseInt(statNumber.textContent);
                    animateValue(statNumber, 0, value, 2000);
                    statNumber.classList.add('animated');
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-item').forEach(stat => {
        observer.observe(stat);
    });

    // 타임라인 아이템 애니메이션
    const observerOptions = {
        threshold: 0.5
    };

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.timeline-item').forEach(item => {
        timelineObserver.observe(item);
    });

    // 스무스 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // 추천사 슬라이더 기능
    const initTestimonialSlider = () => {
        const slider = document.querySelector('.testimonials-slider');
        const cards = document.querySelectorAll('.testimonial-card');
        const prevBtn = document.querySelector('.testimonial-nav-button.prev');
        const nextBtn = document.querySelector('.testimonial-nav-button.next');
        const dotsContainer = document.querySelector('.testimonial-dots');
        
        let currentIndex = 0;
        
        // 도트 생성
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.testimonial-dot');
        
        const updateSlider = () => {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // 활성화된 카드와 도트 업데이트
            cards.forEach((card, index) => {
                card.classList.toggle('active', index === currentIndex);
            });
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };
        
        const goToSlide = (index) => {
            currentIndex = index;
            updateSlider();
        };
        
        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateSlider();
        };
        
        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateSlider();
        };
        
        // 자동 슬라이드
        let slideInterval = setInterval(nextSlide, 5000);
        
        // 마우스 호버 시 자동 슬라이드 멈춤
        slider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
        
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // 초기 상태 설정
        updateSlider();
    };

    // DOM 로드 시 슬라이더 초기화
    initTestimonialSlider();
}); 