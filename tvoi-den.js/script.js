// ХЕДДЕР
const header = document.getElementById('siteHeader');

if (header) {
  function toggleHeaderOnScroll() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', toggleHeaderOnScroll);
  toggleHeaderOnScroll();
}


// ВСПЛЫВАЮЩЕЕ ОКНО
const openBtns = document.querySelectorAll('.open-modal');
const modal = document.getElementById('bookingModal');
const closeBtn = document.getElementById('closeModal');

if (modal && closeBtn && openBtns.length) {
  openBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modal.classList.add('active');
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}


// ВИДЕО (универсально: кнопка + play внутри карточек)

const videoButtons = document.querySelectorAll('.open-video');
const videoModal = document.getElementById('videoModal');
const closeVideo = document.getElementById('closeVideo');
const video = document.getElementById('studioVideo');

if (videoButtons.length && videoModal && closeVideo && video) {

  videoButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const videoSrc = btn.dataset.video;

      // если у кнопки есть своё видео — подставляем
      if (videoSrc) {
        video.src = videoSrc;
      }

      videoModal.classList.add('active');
      video.play();
    });
  });

  closeVideo.addEventListener('click', () => {
    videoModal.classList.remove('active');
    video.pause();
    video.currentTime = 0;
  });

  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      videoModal.classList.remove('active');
      video.pause();
      video.currentTime = 0;
    }
  });
}


// ОБЗОР СТУДИИ
const studioSection = document.querySelector('.studio-overview');

if (studioSection) {
  const studioTrack = studioSection.querySelector('.container-studio-overview');
  const studioSlides = studioSection.querySelectorAll('.content');
  const studioPrev = studioSection.querySelector('.price-arrow-prev');
  const studioNext = studioSection.querySelector('.price-arrow-next');
  const studioDots = studioSection.querySelectorAll('.dots-studio-overview .dot');

  let currentStudioSlide = 0;

  function updateStudioSlider() {
    if (!studioTrack) return;

    // движение
    studioTrack.style.transform = `translateX(-${currentStudioSlide * 100}%)`;

    // точки
    studioDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentStudioSlide);
    });

    // 🔥 логика стрелок
    if (studioPrev && studioNext) {
      // первая страница
      if (currentStudioSlide === 0) {
        studioPrev.style.display = 'none';
        studioNext.style.display = 'flex';
      }
      // последняя страница
      else if (currentStudioSlide === studioSlides.length - 1) {
        studioPrev.style.display = 'flex';
        studioNext.style.display = 'none';
      }
      // середина
      else {
        studioPrev.style.display = 'flex';
        studioNext.style.display = 'flex';
      }
    }
  }

  if (studioPrev && studioNext && studioSlides.length) {
    studioNext.addEventListener('click', () => {
      if (currentStudioSlide < studioSlides.length - 1) {
        currentStudioSlide++;
        updateStudioSlider();
      }
    });

    studioPrev.addEventListener('click', () => {
      if (currentStudioSlide > 0) {
        currentStudioSlide--;
        updateStudioSlider();
      }
    });

    studioDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentStudioSlide = index;
        updateStudioSlider();
      });
    });

    updateStudioSlider();
  }
}


// ПРАЙС-ПАКЕТЫ
const priceSection = document.querySelector('.price-list');

if (priceSection) {
  const priceTrack = priceSection.querySelector('.price-list-track');
  const priceSlides = priceSection.querySelectorAll('.price-slide');
  const pricePrev = priceSection.querySelector('.price-arrow-prev');
  const priceNext = priceSection.querySelector('.price-arrow-next');
  const priceDots = priceSection.querySelectorAll('.dots-price-list .dot');
  const priceWindow = priceSection.querySelector('.price-list-window');

  let currentPriceSlide = 0;

  function updatePriceSlider() {
    if (!priceTrack) return;

    priceTrack.style.transform = `translateX(-${currentPriceSlide * 100}%)`;

    priceDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentPriceSlide);
    });

    if (pricePrev && priceNext) {
      if (currentPriceSlide === 0) {
        pricePrev.style.display = 'none';
        priceNext.style.display = 'flex';
      } else if (currentPriceSlide === priceSlides.length - 1) {
        pricePrev.style.display = 'flex';
        priceNext.style.display = 'none';
      } else {
        pricePrev.style.display = 'flex';
        priceNext.style.display = 'flex';
      }
    }
  }

  if (pricePrev && priceNext && priceSlides.length) {
    priceNext.addEventListener('click', () => {
      if (currentPriceSlide < priceSlides.length - 1) {
        currentPriceSlide++;
        updatePriceSlider();
      }
    });

    pricePrev.addEventListener('click', () => {
      if (currentPriceSlide > 0) {
        currentPriceSlide--;
        updatePriceSlider();
      }
    });

    priceDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentPriceSlide = index;
        updatePriceSlider();
      });
    });

    updatePriceSlider();
  }

  // SWIPE ДЛЯ МОБИЛКИ
  if (priceWindow) {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    const minSwipeDistance = 40;

    priceWindow.addEventListener(
      'touchstart',
      (e) => {
        const touch = e.changedTouches[0];
        startX = touch.clientX;
        startY = touch.clientY;
      },
      { passive: true }
    );

    priceWindow.addEventListener(
      'touchend',
      (e) => {
        const touch = e.changedTouches[0];
        endX = touch.clientX;
        endY = touch.clientY;

        const diffX = endX - startX;
        const diffY = endY - startY;

        // если жест больше вертикальный — ничего не делаем
        if (Math.abs(diffY) > Math.abs(diffX)) return;

        // свайп влево -> следующий слайд
        if (diffX < -minSwipeDistance && currentPriceSlide < priceSlides.length - 1) {
          currentPriceSlide++;
          updatePriceSlider();
        }

        // свайп вправо -> предыдущий слайд
        if (diffX > minSwipeDistance && currentPriceSlide > 0) {
          currentPriceSlide--;
          updatePriceSlider();
        }
      },
      { passive: true }
    );
  }
}



// ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ
document.querySelectorAll('.service-card').forEach((card) => {
  const track = card.querySelector('.service-card__track');
  const slides = card.querySelectorAll('.service-card__image');
  const prevBtn = card.querySelector('.price-arrow-prev');
  const nextBtn = card.querySelector('.price-arrow-next');

  let currentIndex = 0;
  const totalSlides = slides.length;

  if (!track || !slides.length || !prevBtn || !nextBtn) return;

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    if (currentIndex === 0) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'flex';
    } else if (currentIndex === totalSlides - 1) {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    }
  }

  nextBtn.addEventListener('click', () => {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateSlider();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  updateSlider();
});



// ФОТОГАЛЕРЕЯ
const photogallerySlider = document.querySelector('.photogallery-slider');

if (photogallerySlider) {
  const galleryTrack = photogallerySlider.querySelector('.photogallery-track');
  const gallerySlides = photogallerySlider.querySelectorAll('.photogallery-slide');
  const galleryPrev = photogallerySlider.querySelector('.price-arrow-prev');
  const galleryNext = photogallerySlider.querySelector('.price-arrow-next');

  let galleryIndex = 0;
  const lastGallerySlide = gallerySlides.length - 1;

  function updateGallerySlider() {
    if (!galleryTrack) return;

    galleryTrack.style.transform = `translateX(-${galleryIndex * 100}%)`;

    if (galleryPrev && galleryNext) {
      if (galleryIndex === 0) {
        galleryPrev.style.display = 'none';
        galleryNext.style.display = 'flex';
      } else if (galleryIndex === lastGallerySlide) {
        galleryPrev.style.display = 'flex';
        galleryNext.style.display = 'none';
      } else {
        galleryPrev.style.display = 'flex';
        galleryNext.style.display = 'flex';
      }
    }
  }

  if (galleryNext) {
    galleryNext.addEventListener('click', () => {
      if (galleryIndex < lastGallerySlide) {
        galleryIndex += 1;
        updateGallerySlider();
      }
    });
  }

  if (galleryPrev) {
    galleryPrev.addEventListener('click', () => {
      if (galleryIndex > 0) {
        galleryIndex -= 1;
        updateGallerySlider();
      }
    });
  }

  updateGallerySlider();
}


// ОТЗЫВЫ
const reviewsSection = document.querySelector('.reviews');

if (reviewsSection) {
  const reviewsTrack = reviewsSection.querySelector('.reviews-track');
  const reviewsSlides = reviewsSection.querySelectorAll('.reviews-slide');
  const reviewsPrev = reviewsSection.querySelector('.price-arrow-prev');
  const reviewsNext = reviewsSection.querySelector('.price-arrow-next');
  const reviewsDots = reviewsSection.querySelectorAll('.dots-reviews .dot');

  let reviewsIndex = 0;

  function updateReviewsSlider() {
    if (!reviewsTrack) return;

    reviewsTrack.style.transform = `translateX(-${reviewsIndex * 100}%)`;

    reviewsDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === reviewsIndex);
    });
  }

  if (reviewsPrev && reviewsNext && reviewsSlides.length) {
    reviewsNext.addEventListener('click', () => {
      reviewsIndex = reviewsIndex === reviewsSlides.length - 1 ? 0 : reviewsIndex + 1;
      updateReviewsSlider();
    });

    reviewsPrev.addEventListener('click', () => {
      reviewsIndex = reviewsIndex === 0 ? reviewsSlides.length - 1 : reviewsIndex - 1;
      updateReviewsSlider();
    });

    reviewsDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        reviewsIndex = index;
        updateReviewsSlider();
      });
    });

    updateReviewsSlider();
  }
}



// ОТЗЫВЫ МОБИЛЬНЫЕ
const reviewsMobileSection = document.querySelector('.reviews-mobile');

if (reviewsMobileSection) {
  const reviewsMobileTrack = reviewsMobileSection.querySelector('.reviews-track-mobile');
  const reviewsMobileSlides = reviewsMobileSection.querySelectorAll('.reviews-slide-mobile');
  const reviewsMobilePrev = reviewsMobileSection.querySelector('.reviews-mobile-prev');
  const reviewsMobileNext = reviewsMobileSection.querySelector('.reviews-mobile-next');
  const reviewsMobileDots = reviewsMobileSection.querySelectorAll('.dots-reviews-mobile .dot');
  const reviewsMobileWindow = reviewsMobileSection.querySelector('.reviews-window-mobile');

  let reviewsMobileIndex = 0;
  let startX = 0;
  let startY = 0;
  const minSwipeDistance = 40;

  function updateMobileReviewsSlider() {
    if (!reviewsMobileTrack) return;

    reviewsMobileTrack.style.transform = `translateX(-${reviewsMobileIndex * 100}%)`;

    reviewsMobileDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === reviewsMobileIndex);
    });

    if (reviewsMobilePrev && reviewsMobileNext) {
      if (reviewsMobileIndex === 0) {
        reviewsMobilePrev.style.display = 'none';
        reviewsMobileNext.style.display = 'flex';
      } else if (reviewsMobileIndex === reviewsMobileSlides.length - 1) {
        reviewsMobilePrev.style.display = 'flex';
        reviewsMobileNext.style.display = 'none';
      } else {
        reviewsMobilePrev.style.display = 'flex';
        reviewsMobileNext.style.display = 'flex';
      }
    }
  }

  if (reviewsMobilePrev && reviewsMobileNext && reviewsMobileSlides.length) {
    reviewsMobileNext.addEventListener('click', () => {
      if (reviewsMobileIndex < reviewsMobileSlides.length - 1) {
        reviewsMobileIndex++;
        updateMobileReviewsSlider();
      }
    });

    reviewsMobilePrev.addEventListener('click', () => {
      if (reviewsMobileIndex > 0) {
        reviewsMobileIndex--;
        updateMobileReviewsSlider();
      }
    });

    reviewsMobileDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        reviewsMobileIndex = index;
        updateMobileReviewsSlider();
      });
    });

    if (reviewsMobileWindow) {
      reviewsMobileWindow.addEventListener(
        'touchstart',
        (e) => {
          const touch = e.changedTouches[0];
          startX = touch.clientX;
          startY = touch.clientY;
        },
        { passive: true }
      );

      reviewsMobileWindow.addEventListener(
        'touchend',
        (e) => {
          const touch = e.changedTouches[0];
          const endX = touch.clientX;
          const endY = touch.clientY;

          const diffX = endX - startX;
          const diffY = endY - startY;

          if (Math.abs(diffY) > Math.abs(diffX)) return;

          if (diffX < -minSwipeDistance && reviewsMobileIndex < reviewsMobileSlides.length - 1) {
            reviewsMobileIndex++;
            updateMobileReviewsSlider();
          }

          if (diffX > minSwipeDistance && reviewsMobileIndex > 0) {
            reviewsMobileIndex--;
            updateMobileReviewsSlider();
          }
        },
        { passive: true }
      );
    }

    updateMobileReviewsSlider();
  }
}

// МОБИЛЬНОЕ МЕНЮ
const mobileBurger = document.querySelector('.mobile-burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

if (mobileBurger && mobileMenu && mobileMenuClose) {
  mobileBurger.addEventListener('click', () => {
    mobileMenu.classList.add('is-open');
    document.body.classList.add('menu-open');
    mobileBurger.setAttribute('aria-expanded', 'true');
  });

  mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    mobileBurger.setAttribute('aria-expanded', 'false');
  });

  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      mobileBurger.setAttribute('aria-expanded', 'false');
    }
  });

  mobileMenuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      mobileBurger.setAttribute('aria-expanded', 'false');
    });
  });
}



// ОБЗОР СТУДИИ — МОБИЛЬНАЯ ВЕРСИЯ
const studioOverviewMobile = document.querySelector('.studio-overview-mobile');

if (studioOverviewMobile) {
  const track = studioOverviewMobile.querySelector('.studio-overview-mobile-track');
  const slides = studioOverviewMobile.querySelectorAll('.studio-overview-mobile-slide');
  const nextButton = studioOverviewMobile.querySelector('.studio-overview-mobile-arrow');
  const dots = studioOverviewMobile.querySelectorAll('.dots-studio-overview-mobile .dot');
  const number = studioOverviewMobile.querySelector('.number-studio-overview-mobile');
  const text = studioOverviewMobile.querySelector('.text-studio-overview-mobile');

  const slideTexts = [
    'Студия площадью 120 кв.м светлая и стильная, разделена на две зоны — обеденный зал и зал для игр.',
    'Два обеденных стола на 26 персон для Ваших душевных бесед и теплых праздников.',
    'В студии есть кухня с разнообразной посудой, которой можно свободно пользоваться на празднике.',
    'Двухэтажный игровой домик с горкой разделен на две зоны: комнату юных модниц и комнату супергероев.',
    'У нас имеется аккуратная и ухоженная туалетная комната, поддерживаемая в чистоте и порядке.',
    'В зоне для девочек – стильная гримерка с костюмами и деревянные игрушки для игры в салон красоты.'
  ];

  let currentIndex = 0;

  function updateStudioOverviewMobile() {
    if (!track) return;

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });

    if (number) {
      number.textContent = String(currentIndex + 1).padStart(2, '0');
    }

    if (text) {
      text.textContent = slideTexts[currentIndex];
    }
  }

  if (nextButton && slides.length) {
    nextButton.addEventListener('click', () => {
      currentIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
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