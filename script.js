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
  
      // 스크롤 위치에 따른 배경색 조정
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
  
      // 네비게이션 바는 항상 보이도록 transform 제거
      navbar.style.transform = 'translateY(0)';
      
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
  
        // 단순히 숫자만 표시
        element.textContent = Math.floor(progress * (end - start) + start);
  
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
  
    // 스무스 스크롤 개선
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const navHeight = navbar.offsetHeight; // 네비게이션 높이
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        
        // 네비게이션 바 높이를 고려한 스크롤 위치 계산
        window.scrollTo({
          top: targetPosition - navHeight,
          behavior: 'smooth'
        });
      });
    });
  
    // ★ 중복되는 initTestimonialSlider 함수 제거 (initSliders에서 Awards와 Testimonials 모두 처리)
  
    // 슬라이더 기능 (Awards & Testimonials)
    // 만약 모든 화면에서 슬라이더 기능을 원한다면 조건문을 제거하세요.
    const initSliders = () => {
      const sliders = [
        { container: '.awards-grid', cards: '.award-card' },
        { container: '.testimonials-grid', cards: '.testimonial-card' }
      ];
  
      sliders.forEach(({ container, cards }) => {
        const slider = document.querySelector(container);
        const items = document.querySelectorAll(cards);
  
        if (!slider || items.length === 0) return;
  
        let currentIndex = 0;
        let autoSlideInterval;
  
        // 슬라이드 이동 함수
        const moveToSlide = (index) => {
          currentIndex = index;
          const cardWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight);
          
          // 부모 요소(슬라이더 래퍼)를 스크롤 시킵니다.
          slider.parentNode.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
          });
  
          // 활성 카드 표시
          items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
          });
  
          // 인디케이터 업데이트
          const dots = slider.parentNode.querySelectorAll('.slide-indicator');
          dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
          });
        };
  
        // 다음 슬라이드로 이동
        const moveToNextSlide = () => {
          let nextIndex = (currentIndex + 1) % items.length;
          moveToSlide(nextIndex);
        };
  
        // 자동 슬라이드 시작
        const startAutoSlide = () => {
          stopAutoSlide();
          autoSlideInterval = setInterval(moveToNextSlide, 3000);
        };
  
        // 자동 슬라이드 정지
        const stopAutoSlide = () => {
          if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
          }
        };
  
        // 인디케이터 생성
        let indicators = slider.parentNode.querySelector('.slide-indicators');
        if (!indicators) {
          indicators = document.createElement('div');
          indicators.className = 'slide-indicators';
          slider.parentNode.appendChild(indicators);
        } else {
          indicators.innerHTML = ''; // 기존 인디케이터 초기화
        }
  
        items.forEach((_, index) => {
          const dot = document.createElement('div');
          dot.className = `slide-indicator ${index === 0 ? 'active' : ''}`;
          dot.addEventListener('click', () => {
            moveToSlide(index);
            stopAutoSlide();
            startAutoSlide(); // 클릭 후 자동 슬라이드 재시작
          });
          indicators.appendChild(dot);
        });
  
        // 터치 이벤트 처리
        let touchStartX = 0;
        slider.parentNode.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
          stopAutoSlide();
        }, { passive: true });
  
        slider.parentNode.addEventListener('touchend', (e) => {
          const touchEndX = e.changedTouches[0].clientX;
          const diff = touchStartX - touchEndX;
  
          if (Math.abs(diff) > 50) {
            if (diff > 0) {
              moveToSlide(Math.min(currentIndex + 1, items.length - 1));
            } else {
              moveToSlide(Math.max(currentIndex - 1, 0));
            }
          }
          startAutoSlide(); // 터치 후 자동 슬라이드 재시작
        }, { passive: true });
  
        // 마우스 이벤트 처리
        slider.parentNode.addEventListener('mouseenter', stopAutoSlide);
        slider.parentNode.addEventListener('mouseleave', startAutoSlide);
  
        // 초기 상태 설정
        moveToSlide(0);
        startAutoSlide();
  
        // 페이지 가시성 변경 시 자동 슬라이드 제어
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            stopAutoSlide();
          } else {
            startAutoSlide();
          }
        });
      });
    };
  
    // 슬라이더 초기화 (모바일뿐만 아니라 모든 화면에서 작동하도록 조건문을 제거)
    initSliders();
  
    // 스와이프 힌트 관리 (옵션)
    const initSwipeHints = () => {
      const sliders = document.querySelectorAll('.slider-wrapper');
      sliders.forEach(slider => {
        const hint = slider.querySelector('.swipe-hint');
        const grid = slider.querySelector('.awards-grid, .testimonials-grid');
        if (!hint || !grid) return;
  
        let isFirstScroll = true;
        grid.addEventListener('scroll', () => {
          if (isFirstScroll) {
            hint.classList.add('fade-out');
            setTimeout(() => {
              hint.style.display = 'none';
            }, 500);
            isFirstScroll = false;
          }
        });
  
        grid.addEventListener('touchstart', () => {
          if (isFirstScroll) {
            hint.classList.add('fade-out');
            setTimeout(() => {
              hint.style.display = 'none';
            }, 500);
            isFirstScroll = false;
          }
        }, { passive: true });
      });
    };
  
    initSwipeHints();
  });
  