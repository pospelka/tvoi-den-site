document.addEventListener('DOMContentLoaded', () => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  /* =========================
     ХЕДДЕР
  ========================= */
  const header = document.getElementById('siteHeader');

  if (header) {
    let ticking = false;

    const updateHeaderOnScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderOnScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateHeaderOnScroll();
  }

  /* =========================
     ВСПЛЫВАЮЩЕЕ ОКНО
  ========================= */
  const modal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModal');
  const openModalBtns = qsa('.open-modal');

  if (modal && closeModalBtn && openModalBtns.length) {
    const openModal = () => {
      modal.classList.add('active');
    };

    const closeModal = () => {
      modal.classList.remove('active');
    };

    openModalBtns.forEach((btn) => {
      btn.addEventListener('click', openModal);
    });

    closeModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  /* =========================
     ВИДЕО-МОДАЛКА
  ========================= */
  const videoModal = document.getElementById('videoModal');
  const closeVideoBtn = document.getElementById('closeVideo');
  const modalVideo = document.getElementById('studioVideo');
  const openVideoBtns = qsa('.open-video');

  if (videoModal && closeVideoBtn && modalVideo && openVideoBtns.length) {
    const defaultVideoSrc = qs('source', modalVideo)?.getAttribute('src') || modalVideo.getAttribute('src') || '';

    const stopVideo = () => {
      modalVideo.pause();
      modalVideo.currentTime = 0;
    };

    const closeVideoModal = () => {
      videoModal.classList.remove('active');
      stopVideo();
    };

    const openVideoModal = (src = '') => {
      const targetSrc = src || defaultVideoSrc;

      if (targetSrc && modalVideo.getAttribute('src') !== targetSrc) {
        modalVideo.setAttribute('src', targetSrc);
        modalVideo.load();
      }

      videoModal.classList.add('active');

      const playPromise = modalVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    };

    openVideoBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        openVideoModal(btn.dataset.video || '');
      });
    });

    closeVideoBtn.addEventListener('click', closeVideoModal);

    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });
  }

  /* =========================
     УНИВЕРСАЛЬНЫЙ СЛАЙДЕР
  ========================= */
  function createSlider({
    root,
    trackSelector,
    slideSelector,
    prevSelector,
    nextSelector,
    dotsSelector,
    loop = false,
    hideEdges = true,
    onChange = null,
  }) {
    if (!root) return null;

    const track = qs(trackSelector, root);
    const slides = qsa(slideSelector, root);
    const prevBtn = qs(prevSelector, root);
    const nextBtn = qs(nextSelector, root);
    const dots = dotsSelector ? qsa(dotsSelector, root) : [];

    if (!track || !slides.length) return null;

    let currentIndex = 0;

    const update = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      if (dots.length) {
        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentIndex);
        });
      }

      if (prevBtn && nextBtn && hideEdges) {
        if (loop) {
          prevBtn.style.display = 'flex';
          nextBtn.style.display = 'flex';
        } else if (currentIndex === 0) {
          prevBtn.style.display = 'none';
          nextBtn.style.display = 'flex';
        } else if (currentIndex === slides.length - 1) {
          prevBtn.style.display = 'flex';
          nextBtn.style.display = 'none';
        } else {
          prevBtn.style.display = 'flex';
          nextBtn.style.display = 'flex';
        }
      }

      if (typeof onChange === 'function') {
        onChange(currentIndex, slides);
      }
    };

    const next = () => {
      if (loop) {
        currentIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
      } else if (currentIndex < slides.length - 1) {
        currentIndex += 1;
      }
      update();
    };

    const prev = () => {
      if (loop) {
        currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
      } else if (currentIndex > 0) {
        currentIndex -= 1;
      }
      update();
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', next);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', prev);
    }

    if (dots.length) {
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          currentIndex = index;
          update();
        });
      });
    }

    update();

    return {
      update,
      next,
      prev,
      getIndex: () => currentIndex,
      setIndex: (index) => {
        if (index >= 0 && index < slides.length) {
          currentIndex = index;
          update();
        }
      },
      getSlidesCount: () => slides.length,
    };
  }

  /* =========================
     СВАЙП
  ========================= */
  function addSwipe({
    element,
    onSwipeLeft,
    onSwipeRight,
    minDistance = 40,
  }) {
    if (!element) return;

    let startX = 0;
    let startY = 0;

    element.addEventListener(
      'touchstart',
      (e) => {
        const touch = e.changedTouches[0];
        startX = touch.clientX;
        startY = touch.clientY;
      },
      { passive: true }
    );

    element.addEventListener(
      'touchend',
      (e) => {
        const touch = e.changedTouches[0];
        const endX = touch.clientX;
        const endY = touch.clientY;

        const diffX = endX - startX;
        const diffY = endY - startY;

        if (Math.abs(diffY) > Math.abs(diffX)) return;

        if (diffX < -minDistance && typeof onSwipeLeft === 'function') {
          onSwipeLeft();
        }

        if (diffX > minDistance && typeof onSwipeRight === 'function') {
          onSwipeRight();
        }
      },
      { passive: true }
    );
  }

  /* =========================
     ОБЗОР СТУДИИ — ДЕСКТОП
  ========================= */
  const studioSection = qs('.studio-overview');

  createSlider({
    root: studioSection,
    trackSelector: '.container-studio-overview',
    slideSelector: '.content',
    prevSelector: '.slider-studio-overview .price-arrow-prev',
    nextSelector: '.slider-studio-overview .price-arrow-next',
    dotsSelector: '.dots-studio-overview .dot',
    loop: false,
    hideEdges: true,
  });

  /* =========================
     ПРАЙС-ПАКЕТЫ
  ========================= */
  const priceSection = qs('.price-list');
  const priceSlider = createSlider({
    root: priceSection,
    trackSelector: '.price-list-track',
    slideSelector: '.price-slide',
    prevSelector: '.price-list-arrows .price-arrow-prev',
    nextSelector: '.price-list-arrows .price-arrow-next',
    dotsSelector: '.dots-price-list .dot',
    loop: false,
    hideEdges: true,
  });

  if (priceSection && priceSlider) {
    const priceWindow = qs('.price-list-window', priceSection);

    addSwipe({
      element: priceWindow,
      onSwipeLeft: () => priceSlider.next(),
      onSwipeRight: () => priceSlider.prev(),
    });
  }

  /* =========================
     ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ
  ========================= */
  qsa('.service-card').forEach((card) => {
    createSlider({
      root: card,
      trackSelector: '.service-card__track',
      slideSelector: '.service-card__image',
      prevSelector: '.service-card__media .price-arrow-prev',
      nextSelector: '.service-card__media .price-arrow-next',
      loop: false,
      hideEdges: true,
    });
  });

  /* =========================
     ФОТОГАЛЕРЕЯ
  ========================= */
  const photogallerySlider = qs('.photogallery-slider');

  createSlider({
    root: photogallerySlider,
    trackSelector: '.photogallery-track',
    slideSelector: '.photogallery-slide',
    prevSelector: '.price-arrow-prev',
    nextSelector: '.price-arrow-next',
    loop: false,
    hideEdges: true,
  });

  /* =========================
     ОТЗЫВЫ — ДЕСКТОП
  ========================= */
  const reviewsSection = qs('.reviews');

  createSlider({
    root: reviewsSection,
    trackSelector: '.reviews-track',
    slideSelector: '.reviews-slide',
    prevSelector: '.reviews-slider .price-arrow-prev',
    nextSelector: '.reviews-slider .price-arrow-next',
    dotsSelector: '.dots-reviews .dot',
    loop: true,
    hideEdges: false,
  });

  /* =========================
     ОТЗЫВЫ — МОБИЛЬНЫЕ
  ========================= */
  const reviewsMobileSection = qs('.reviews-mobile');

  const reviewsMobileSlider = createSlider({
    root: reviewsMobileSection,
    trackSelector: '.reviews-track-mobile',
    slideSelector: '.reviews-slide-mobile',
    prevSelector: '.reviews-mobile-prev',
    nextSelector: '.reviews-mobile-next',
    dotsSelector: '.dots-reviews-mobile .dot',
    loop: false,
    hideEdges: true,
  });

  if (reviewsMobileSection && reviewsMobileSlider) {
    const reviewsMobileWindow = qs('.reviews-window-mobile', reviewsMobileSection);

    addSwipe({
      element: reviewsMobileWindow,
      onSwipeLeft: () => reviewsMobileSlider.next(),
      onSwipeRight: () => reviewsMobileSlider.prev(),
    });
  }

  /* =========================
     МОБИЛЬНОЕ МЕНЮ
  ========================= */
  const mobileBurger = qs('.mobile-burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = qs('.mobile-menu-close');
  const mobileMenuLinks = qsa('.mobile-menu-link');

  if (mobileBurger && mobileMenu && mobileMenuClose) {
    const openMenu = () => {
      mobileMenu.classList.add('is-open');
      document.body.classList.add('menu-open');
      mobileBurger.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      mobileBurger.setAttribute('aria-expanded', 'false');
    };

    mobileBurger.addEventListener('click', openMenu);
    mobileMenuClose.addEventListener('click', closeMenu);

    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        closeMenu();
      }
    });

    mobileMenuLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* =========================
     ОБЗОР СТУДИИ — МОБИЛЬНАЯ ВЕРСИЯ
  ========================= */
  const studioOverviewMobile = qs('.studio-overview-mobile');

  if (studioOverviewMobile) {
    const mobileTrack = qs('.studio-overview-mobile-track', studioOverviewMobile);
    const mobileSlides = qsa('.studio-overview-mobile-slide', studioOverviewMobile);
    const nextButton = qs('.studio-overview-mobile-arrow', studioOverviewMobile);
    const dots = qsa('.dots-studio-overview-mobile .dot', studioOverviewMobile);
    const number = qs('.number-studio-overview-mobile', studioOverviewMobile);
    const text = qs('.text-studio-overview-mobile', studioOverviewMobile);

    const slideTexts = [
      'Студия площадью 120 кв.м светлая и стильная, разделена на две зоны — обеденный зал и зал для игр.',
      'Два обеденных стола на 26 персон для Ваших душевных бесед и теплых праздников.',
      'В студии есть кухня с разнообразной посудой, которой можно свободно пользоваться на празднике.',
      'Двухэтажный игровой домик с горкой разделен на две зоны: комнату юных модниц и комнату супергероев.',
      'У нас имеется аккуратная и ухоженная туалетная комната, поддерживаемая в чистоте и порядке.',
      'В зоне для девочек – стильная гримерка с костюмами и деревянные игрушки для игры в салон красоты.',
    ];

    if (mobileTrack && mobileSlides.length) {
      let currentIndex = 0;

      const updateStudioOverviewMobile = () => {
        mobileTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentIndex);
        });

        if (number) {
          number.textContent = String(currentIndex + 1).padStart(2, '0');
        }

        if (text) {
          text.textContent = slideTexts[currentIndex] || '';
        }
      };

      if (nextButton) {
        nextButton.addEventListener('click', () => {
          currentIndex = currentIndex === mobileSlides.length - 1 ? 0 : currentIndex + 1;
          updateStudioOverviewMobile();
        });
      }

      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          currentIndex = index;
          updateStudioOverviewMobile();
        });
      });

      updateStudioOverviewMobile();
    }
  }
});