import { mediaIndex } from './media-index.js';

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Header Scroll Effect & Navigation Active State
  // ==========================================
  const header = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    // Glassmorphism header toggle on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Simple scrollspy active state for navigation links
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 2. Mobile Burger Menu
  // ==========================================
  const burgerBtn = document.getElementById('mobile-burger-btn');
  const mainNav = document.getElementById('main-nav');
  
  burgerBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    // Rotate/Change burger icon
    if (mainNav.classList.contains('active')) {
      burgerBtn.innerHTML = `
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
        </svg>
      `;
    } else {
      burgerBtn.innerHTML = `
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
        </svg>
      `;
    }
  });

  // Close nav on mobile when item clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      burgerBtn.innerHTML = `
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
        </svg>
      `;
    });
  });

  // ==========================================
  // 3. Leaflet Interactive Map
  // ==========================================
  const coordinates = [49.266706, 23.216516]; // Bystrytsia-Hirska coordinates
  
  const map = L.map('leaflet-map', {
    center: coordinates,
    zoom: 14,
    zoomControl: false,
    scrollWheelZoom: false // Disable scroll zoom so user can scroll down the page
  });

  // Add custom zoom control in bottom right
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map);

  // Premium Dark Matter Tile Layer that matches dark forest aesthetics
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  // Custom marker icon with HTML elements for pulsing glow
  const customIcon = L.divIcon({
    className: 'custom-map-marker',
    html: '<div class="marker-pulse"></div><div class="marker-pin"></div>',
    iconSize: [30, 30],
    iconAnchor: [0, 0]
  });

  L.marker(coordinates, { icon: customIcon }).addTo(map)
    .bindPopup(`<strong style="color:#080d0a;">Чан «У Василя»</strong><br><span style="color:#333;">с. Бистриця-Гірська</span>`, {
      closeButton: false,
      offset: L.point(0, -10)
    })
    .openPopup();

  // Re-fit map on container size change
  setTimeout(() => {
    map.invalidateSize();
  }, 500);

  // ==========================================
  // 4. Dynamic Media Gallery & Filtering
  // ==========================================
  const galleryGrid = document.getElementById('photo-gallery-grid');
  const loadMoreBtn = document.getElementById('load-more-media-btn');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Nature photo numbers as defined in plan
  const naturePhotoNumbers = [4, 5, 6, 7, 8, 9, 13, 14, 15, 16, 17, 18, 19, 20, 31, 32, 33, 34, 35, 36, 37, 38, 39];
  
  // Combine photos and videos from mediaIndex
  const allMediaItems = [];

  // Add videos with descriptive titles
  if (mediaIndex && mediaIndex.videos) {
    mediaIndex.videos.forEach(video => {
      let title = 'Затишне вирування чану';
      let subtitle = 'Відеоогляд комплексу';
      
      if (video.includes('4382')) {
        title = 'Вечірній чан з аеромасажем';
        subtitle = 'Панорама гарячого чану під світлом ліхтариків';
      } else if (video.includes('4541')) {
        title = 'Бульбашки аеромасажу';
        subtitle = 'Процес активного вирування джерельної води';
      } else if (video.includes('4542')) {
        title = 'Панорама зони відпочинку';
        subtitle = 'Вигляд на чашу чану та затишну альтанку';
      } else if (video.includes('4563')) {
        title = 'Краєвид Карпат';
        subtitle = 'Мальовничі гірські хребти села Бистриця-Гірська';
      } else if (video.includes('4564')) {
        title = 'Паріння у чані';
        subtitle = 'Гармонія гарячої води та чистого карпатського повітря';
      } else if (video.includes('4565')) {
        title = 'Вечірня магія вогню';
        subtitle = 'Розпалювання дров під чавунною чашею';
      } else if (video.includes('4590')) {
        title = 'Екскурсія територією';
        subtitle = 'Повний огляд простору комплексу відпочинку';
      }

      allMediaItems.push({
        type: 'video',
        src: video,
        category: 'video',
        title: title,
        subtitle: subtitle
      });
    });
  }

  // Add photos with highly specific captions reflecting content
  if (mediaIndex && mediaIndex.photos) {
    mediaIndex.photos.forEach(photo => {
      const match = photo.match(/photo_(\d+)_/);
      const photoNum = match ? parseInt(match[1], 10) : 0;
      
      const isNature = naturePhotoNumbers.includes(photoNum);
      const category = isNature ? 'nature' : 'chan';
      
      let title = 'Теплий Берег';
      let subtitle = 'Чан та відпочинок';

      if (photoNum === 13) {
        title = 'Панорама комплексу';
        subtitle = 'Затишна альтанка та кам\'яний льох на схилі';
      } else if (photoNum === 10 || photoNum === 11 || photoNum === 12) {
        title = 'Альтанка зсередини';
        subtitle = 'Дерев\'яний стіл та лави для дружньої компанії';
      } else if (photoNum === 21 || photoNum === 22 || photoNum === 23) {
        title = 'Гарячий чан на дровах';
        subtitle = 'Оздоблення чану натуральним деревом та аеромасаж';
      } else if (photoNum === 31) {
        title = 'Різьблені дерев\'яні деталі';
        subtitle = 'Герб комплексу «Теплий Берег» ручної роботи';
      } else if (photoNum >= 1 && photoNum <= 9) {
        title = 'Чан та зона паріння';
        subtitle = 'Чаша нашого оздоровчого чану з джерельною водою';
      } else if (photoNum >= 14 && photoNum <= 20) {
        title = 'Дерев\'яна тераса';
        subtitle = 'Зручний простір для релаксу між сеансами паріння';
      } else if (photoNum >= 24 && photoNum <= 30) {
        title = 'Контрастне обливання';
        subtitle = 'Відро-водоспад з чистою гірською водою';
      } else if (photoNum >= 32 && photoNum <= 39) {
        title = 'Вечірня ілюмінація';
        subtitle = 'Романтичне підсвічування комплексу в сутінках';
      } else if (photoNum >= 40 && photoNum <= 50) {
        title = 'Краса навколишніх гір';
        subtitle = 'Мальовничі краєвиди Бистриці-Гірської';
      } else if (photoNum >= 51 && photoNum <= 60) {
        title = 'Дерев\'яні скульптури';
        subtitle = 'Витвори мистецтва карпатських майстрів на території';
      } else if (photoNum >= 61 && photoNum <= 69) {
        title = 'Мангальна зона';
        subtitle = 'Приготування страв на грилі та якісні дрова';
      }

      allMediaItems.push({
        type: 'image',
        src: photo,
        category: category,
        title: title,
        subtitle: subtitle
      });
    });
  }

  // Shuffle or arrange items: Let's put a couple of videos at the start, then mix photos.
  // We want to make sure the layout looks interesting.
  // Let's give specific items special sizes for Bento Grid look
  allMediaItems.forEach((item, index) => {
    // Cycle patterns for grid aesthetics
    if (index % 7 === 0) {
      item.gridClass = 'big';
    } else if (index % 5 === 0) {
      item.gridClass = 'wide';
    } else if (index % 4 === 0) {
      item.gridClass = 'tall';
    } else {
      item.gridClass = 'normal';
    }
  });

  let currentFilter = 'all';
  let itemsToShow = 8;
  const itemsPerLoad = 8;
  let filteredItems = [];

  function filterMedia() {
    if (currentFilter === 'all') {
      filteredItems = allMediaItems;
    } else {
      filteredItems = allMediaItems.filter(item => item.category === currentFilter);
    }
  }

  function renderGallery() {
    galleryGrid.innerHTML = '';
    const itemsToRender = filteredItems.slice(0, itemsToShow);

    if (itemsToRender.length === 0) {
      galleryGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--color-text-muted);">Немає медіафайлів у цій категорії.</div>';
      loadMoreBtn.style.display = 'none';
      return;
    }

    itemsToRender.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `gallery-item ${item.gridClass}`;
      card.dataset.index = index;

      let mediaHtml = '';
      if (item.type === 'video') {
        mediaHtml = `
          <video src="${item.src}" muted loop playsinline></video>
          <div class="video-badge">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        `;
      } else {
        mediaHtml = `<img src="${item.src}" alt="${item.title}" loading="lazy">`;
      }

      card.innerHTML = `
        ${mediaHtml}
        <div class="gallery-item-overlay">
          <div class="gallery-item-info">
            <h4>${item.title}</h4>
            <p>${item.subtitle}</p>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openLightbox(index);
      });

      galleryGrid.appendChild(card);
      
      // Auto play video previews on hover
      if (item.type === 'video') {
        const videoElement = card.querySelector('video');
        card.addEventListener('mouseenter', () => {
          videoElement.play().catch(() => {});
        });
        card.addEventListener('mouseleave', () => {
          videoElement.pause();
          videoElement.currentTime = 0;
        });
      }
    });

    // Toggle Load More button visibility
    if (itemsToShow >= filteredItems.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-flex';
    }
  }

  // Load more trigger
  loadMoreBtn.addEventListener('click', () => {
    itemsToShow += itemsPerLoad;
    renderGallery();
  });

  // Filter change trigger
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      itemsToShow = 8; // Reset back to initial size
      filterMedia();
      renderGallery();
    });
  });

  // Initialize gallery arrays
  filterMedia();
  renderGallery();

  // ==========================================
  // 5. Lightbox Modal Logic
  // ==========================================
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');
  const lightboxMediaContainer = document.getElementById('lightbox-media-container');
  const lightboxCaptionText = document.getElementById('lightbox-caption-text');
  
  let activeLightboxIndex = 0;

  function openLightbox(index) {
    activeLightboxIndex = index;
    lightboxModal.classList.add('active');
    updateLightboxMedia();
    document.body.style.overflow = 'hidden'; // Lock scrolling
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxMediaContainer.innerHTML = ''; // Clear media
    document.body.style.overflow = ''; // Unlock scrolling
  }

  function updateLightboxMedia() {
    lightboxMediaContainer.innerHTML = '';
    const item = filteredItems[activeLightboxIndex];

    if (!item) return;

    if (item.type === 'video') {
      lightboxMediaContainer.innerHTML = `
        <video src="${item.src}" controls autoplay loop playsinline style="max-height:80vh; width:100%;"></video>
      `;
    } else {
      lightboxMediaContainer.innerHTML = `
        <img src="${item.src}" alt="${item.title}">
      `;
    }

    lightboxCaptionText.textContent = `${item.title} — ${item.subtitle}`;
  }

  function lightboxPrev() {
    if (activeLightboxIndex > 0) {
      activeLightboxIndex--;
    } else {
      activeLightboxIndex = filteredItems.length - 1; // Wrap around to end
    }
    updateLightboxMedia();
  }

  function lightboxNext() {
    if (activeLightboxIndex < filteredItems.length - 1) {
      activeLightboxIndex++;
    } else {
      activeLightboxIndex = 0; // Wrap around to start
    }
    updateLightboxMedia();
  }

  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightboxPrevBtn.addEventListener('click', lightboxPrev);
  lightboxNextBtn.addEventListener('click', lightboxNext);

  // Close lightbox on clicking outside background
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      lightboxPrev();
    } else if (e.key === 'ArrowRight') {
      lightboxNext();
    }
  });

  // ==========================================
  // 6. Interactive Pricing Calculator
  // ==========================================
  const hoursSelect = document.getElementById('hours-select');
  const peopleSelect = document.getElementById('people-select');
  const priceDisplay = document.getElementById('calc-price-display');
  const bookingForm = document.getElementById('calc-booking-form');

  function calculatePrice() {
    const hours = parseInt(hoursSelect.value, 10);
    const people = parseInt(peopleSelect.value, 10);
    
    // Base pricing system
    // Minimal booking is 2 hours for 2000 UAH
    let price = 2000;
    
    // Each additional hour adds 500 UAH
    if (hours > 2) {
      price += (hours - 2) * 500;
    }
    
    // Surcharge based on group size
    if (people === 6) {
      price += 200;
    } else if (people === 8) {
      price += 400;
    }
    
    priceDisplay.textContent = `${price} ₴`;
    return price;
  }

  hoursSelect.addEventListener('change', calculatePrice);
  peopleSelect.addEventListener('change', calculatePrice);

  // Form submission: redirect to Messenger booking with pre-filled message
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const hours = hoursSelect.value;
    const peopleText = peopleSelect.options[peopleSelect.selectedIndex].text;
    const estimatedPrice = priceDisplay.textContent;
    
    const baseMessage = `Доброго дня! Бажаю забронювати відпочинок у комплексі «Теплий Берег» (село Бистриця-Гірська). 
Деталі замовлення:
- Час парення: ${hours} год.
- Кількість гостей: ${peopleText}
- Очікувана вартість: ${estimatedPrice}

Будь ласка, зв'яжіться зі мною для підтвердження бронювання та узгодження вільного часу.`;

    const encodedMessage = encodeURIComponent(baseMessage);
    
    // Redirect to Telegram with pre-filled text as fallback or main trigger
    // You can also ask the user which one they prefer, but Telegram/WhatsApp is best
    const telegramUrl = `https://t.me/share/url?url=https://maps.apple.com/?q=49.266706,23.216516&text=${encodedMessage}`;
    const waUrl = `https://wa.me/380982380098?text=${encodedMessage}`;
    const phoneFallback = `tel:0982380098`;

    // We can open a beautiful confirmation modal or directly redirect to WhatsApp (since it is the most popular for business chat)
    window.open(waUrl, '_blank');
  });

  // Run initial calculation
  calculatePrice();
});
