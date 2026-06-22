/* ── GLOBAL STATE ─────────────────────────────────────────────────────────── */
let lang = 'en';
let _selectedSwatch = null;
let _savedScrollY = 0;

/* ── SWATCH IMAGE MAP ────────────────────────────────────────────────────── */
const SWATCH_IMAGES = {
  "CVG-T01": "images/Marble/CVG-T01.jpg",
  "CVG-T02": "images/Marble/CVG-T02.jpg",
  "CVG-T03": "images/Marble/CVG-T03.jpg",
  "CVG-T04": "images/Marble/CVG-T04.jpg",
  "CVG-T05": "images/Marble/CVG-T05.jpg",
  "CVG-C07": "images/Marble/CVG-C07.jpeg",
  "CVG-C08": "images/Marble/CVG-C08.jpeg",
  "CVG-C09": "images/Marble/CVG-C09.jpeg",
  "CVG-C10": "images/Marble/CVG-C10.jpeg",
  "CVG-G05": "images/Marble/CVG-G05.jpg",
  "CVM-B01": "images/Wood/CVM-B01.jpg",
  "CVM-B02": "images/Wood/CVM-B02.jpg",
  "CVM-B03": "images/Wood/CVM-B03.jpg",
  "CVM-C04": "images/Wood/CVM-C04.jpg",
  "CVM-C05": "images/Wood/CVM-C05.jpg",
  "CVM-C06": "images/Wood/CVM-C06.jpg",
  "CVM-C07": "images/Wood/CVM-C07.jpg",
  "CVM-C010": "images/Wood/CVM-C010.jpg",
  "CVM-P06": "images/Wood/CVM-P06.jpg",
  "CVM-G07": "images/Wood/CVM-G07.jpg",
  "CVM-R09": "images/Wood/CVM-R09.jpg",
  "CVM-E01": "images/Elite/CVM-E01.jpg",
  "CVM-E02": "images/Elite/CVM-E02.jpg",
  "CVM-E03": "images/Elite/CVM-E03.jpg",
  "CVM-E04": "images/Elite/CVM-E04.jpg",
  "CVM-E05": "images/Elite/CVM-E05.jpg",
  "CVG-T07": "images/Marble/CVG-T07.jpg",
  "CVG-T08": "images/Marble/CVG-T08.jpg",
  "CVG-T09": "images/Marble/CVG-T09.jpg",
  "CVG-G06": "images/Marble/CVG-G06.jpg",
  "CVG-G07": "images/Marble/CVG-G07.jpg",
  "CVG-G08": "images/Marble/CVG-G08.jpg",
  "CVG-G010": "images/Marble/CVG-G010.jpg",
  "CVM-E06": "images/Elite/CVM-E06.jpg",
  "CVM-E07": "images/Elite/CVM-E07.jpg",
  "CVM-E010": "images/Elite/CVM-E010.jpg",
  "CVM-E011": "images/Elite/CVM-E011.jpg"
};

/* ══ GLOBALLY ACCESSIBLE FUNCTIONS (called from inline onclick) ══════════════
   These MUST be in the global scope — do NOT wrap them in DOMContentLoaded   */

function showPage(id) {
  // Multi-page site: navigate to the correct HTML file
  let pageMap = {
    'home':        'index.html',
    'about':       'about.html',
    'collections': 'collections.html',
    'gallery':     'gallery.html',
    'contact':     'contact.html'
  };
  if (pageMap[id]) {
    window.location.href = pageMap[id];
  }
}

function showTab(id) {
  document.querySelectorAll('.collection-panel').forEach(function(p) {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  let panel = document.getElementById('panel-' + id);
  if (panel) {
    panel.classList.add('active');
    panel.style.display = 'block';
    let section = document.querySelector('.collections-page');
    if (section && window.innerWidth < 768) {
      setTimeout(function() { section.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
    }
  }
  document.querySelectorAll('.tab-btn').forEach(function(b) {
    let onclick = b.getAttribute('onclick') || '';
    if (onclick.indexOf("'" + id + "'") !== -1) b.classList.add('active');
  });
}

function closeMob() {
  let menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.remove('open');
  document.body.classList.remove('menu-open');
  document.body.style.top = '';
  window.scrollTo(0, _savedScrollY || 0);
  let ham = document.getElementById('ham');
  if (ham) ham.setAttribute('aria-expanded', 'false');
}

function openMob() {
  let menu = document.getElementById('mobileMenu');
  if (!menu) return;
  _savedScrollY = window.scrollY || window.pageYOffset || 0;
  menu.classList.add('open');
  document.body.classList.add('menu-open');
  document.body.style.top = -_savedScrollY + 'px';
  let ham = document.getElementById('ham');
  if (ham) ham.setAttribute('aria-expanded', 'true');
}

function galleryFilter(cat, btn) {
  document.querySelectorAll('.gf-btn').forEach((b) => {
    const isActive = b === btn;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  document.querySelectorAll('.ge-item').forEach((item) => {
    const isVisible = cat === 'all' || item.getAttribute('data-cat') === cat;
    item.classList.toggle('is-hidden', !isVisible);
    item.hidden = !isVisible;
  });
}

function applyLang(l) {
  let isAr = l === 'ar';
  document.body.classList.toggle('rtl', isAr);
  document.body.style.fontFamily = isAr ? "'Cairo', sans-serif" : "'Barlow', sans-serif";
  document.documentElement.setAttribute('lang', l);
  document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
  let langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.textContent = isAr ? 'English' : 'عربي';
  let mob = document.getElementById('langBtnMob');
  if (mob) mob.textContent = isAr ? 'English' : 'عربي';
  document.querySelectorAll('[data-en]').forEach(function(el) {
    let val = el.getAttribute('data-' + l);
    if (!val) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else if (el.tagName === 'OPTION') {
      // Preserve selected state — only update text, don't touch value
      el.textContent = val;
    } else if (el.tagName === 'SELECT') {
      // Preserve selected value across translation
      let savedVal = el.value;
      el.innerHTML = val;
      el.value = savedVal;
    } else if (el.namespaceURI && el.namespaceURI.indexOf('svg') !== -1) {
      // SVG elements (e.g. <text>) — use textContent, innerHTML unreliable in SVG
      el.textContent = val;
    } else {
      el.innerHTML = val;
    }
  });
  document.querySelectorAll('[data-placeholder-en]').forEach(function(el) {
    el.placeholder = el.getAttribute('data-placeholder-' + l) || el.placeholder;
  });
  document.querySelectorAll('input, textarea, select, button').forEach(function(el) {
    el.style.fontFamily = isAr ? "'Cairo', sans-serif" : "'Barlow', sans-serif";
  });
  let selSwatch = document.querySelector('.form-swatch-item.selected');
  if (selSwatch) {
    let dn = document.getElementById('formDesignName');
    if (dn) dn.textContent = selSwatch.getAttribute('data-name-' + l) || selSwatch.getAttribute('data-name-en') || '';
  }
  document.querySelectorAll('.tab-btn').forEach(function(b) {
    let val = b.getAttribute('data-' + l);
    if (val) b.textContent = val;
  });
  try {
    window.localStorage.setItem('siteLang', l);
  } catch (err) {}
}

function openSwatch(bg, code, nameEn, nameAr, thick, descEn, descAr) {
  let lb = document.getElementById('swatchLightbox');
  if (!lb) return;
  let isAr = document.body.classList.contains('rtl');
  _selectedSwatch = { bg: bg, code: code, nameEn: nameEn, nameAr: nameAr, thick: thick };
  let swatchEl = document.getElementById('lbSwatch');
  let imgSrc = SWATCH_IMAGES[code] || null;
  if (imgSrc) {
    swatchEl.innerHTML = '<img src="' + imgSrc + '" style="width:100%;height:100%;object-fit:cover;object-position:center 70%;border-radius:3px;display:block;" draggable="false">';
    swatchEl.style.cssText =
      'width:100%;height:200px;border-radius:4px;margin-bottom:20px;overflow:hidden;' +
      'border:1px solid rgba(205,161,104,0.3);' +
      'box-shadow:0 0 0 4px rgba(39,44,74,1),0 0 0 5px rgba(205,161,104,0.3),0 12px 32px rgba(0,0,0,0.4);';
  } else {
    swatchEl.innerHTML = '';
    swatchEl.setAttribute('style',
      'width:100%;height:150px;border-radius:4px;margin-bottom:20px;' +
      'border:1px solid rgba(205,161,104,0.3);' +
      'box-shadow:0 0 0 4px rgba(39,44,74,1),0 0 0 5px rgba(205,161,104,0.3),0 12px 32px rgba(0,0,0,0.4);' +
      'background:' + bg + ';'
    );
  }
  document.getElementById('lbCode').textContent = code;
  document.getElementById('lbName').textContent = isAr ? nameAr : nameEn;
  document.getElementById('lbThick').textContent = thick + ' ' + (isAr ? 'سماكة' : 'Thickness');
  let descEl = document.getElementById('lbDesc');
  if (descEl) descEl.textContent = isAr ? (descAr || descEn || '') : (descEn || '');
  lb.querySelectorAll('[data-en]').forEach(function(el) {
    let val = el.getAttribute('data-' + (isAr ? 'ar' : 'en'));
    if (val) el.textContent = val;
  });
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  let lb = document.getElementById('swatchLightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
  document.body.style.removeProperty('overflow');
  if (document.body.classList.contains('menu-open')) {
    document.body.style.overflow = 'hidden';
  }
}

/* ── CONTACT FORM — PHP SUBMISSION ───────────────────────────────────── */

/* ══ DOM-DEPENDENT SETUP — runs after page is fully loaded ══════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  try {
    let savedLang = window.localStorage.getItem('siteLang');
    if (savedLang === 'ar' || savedLang === 'en') {
      lang = savedLang;
    }
  } catch (err) {}

  applyLang(lang);

  /* Init collection panels */
  document.querySelectorAll('.collection-panel').forEach(function(p) {
    p.style.display = p.classList.contains('active') ? 'block' : 'none';
  });

  /* Make clickable swatches keyboard accessible */
  document.querySelectorAll('.swatch-item, .form-swatch-item').forEach(function(item) {
    const code = item.getAttribute('data-code') || '';
    const name = item.getAttribute('data-name-en') || item.textContent.trim() || 'flooring design';
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', code ? `View ${code} ${name}` : `View ${name}`);
  });

  /* Lang toggle buttons */
  let langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', function() {
      lang = lang === 'en' ? 'ar' : 'en';
      applyLang(lang);
    });
  }
  let mobLang = document.getElementById('langBtnMob');
  if (mobLang) {
    mobLang.addEventListener('click', function() {
      lang = lang === 'en' ? 'ar' : 'en';
      applyLang(lang);
    });
  }

  /* Hamburger */
  let ham = document.getElementById('ham');
  if (ham) {
    ham.addEventListener('click', function() {
      let menu = document.getElementById('mobileMenu');
      if (!menu) return;
      let isOpen = menu.classList.contains('open');
      if (isOpen) {
        closeMob();
      } else {
        openMob();
      }
    });
  }

  /* Navbar shadow on scroll */
  window.addEventListener('scroll', function() {
    let navbar = document.getElementById('navbar');
    if (navbar) navbar.style.boxShadow = window.scrollY > 20 ? '0 2px 20px rgba(0,0,0,0.25)' : 'none';
  }, { passive: true });

  /* Collection checkboxes + multi-select design picker */
  (function() {
    let picker          = document.getElementById('formDesignPicker');
    let customFields    = document.getElementById('formCustomFields');
    let allSwatchGroups = document.querySelectorAll('.form-swatch-group');
    let selectedDesignsContainer = document.getElementById('formSelectedDesigns');
    let selectedDesignsList = document.getElementById('selectedDesignsList');
    let designInput     = document.getElementById('designCodeInput');
    let clearAllBtn     = document.getElementById('formClearAllDesigns');
    let collectionCheckboxes = document.querySelectorAll('#collectionCheckboxes input[type="checkbox"]');
    let collectionError = document.getElementById('collectionError');
    let pickableCollections = ['marble', 'wood', 'elite'];
    let selectedDesigns = [];

    function updateDesignPicker() {
      let checkedCollections = [];
      collectionCheckboxes.forEach(function(cb) {
        if (cb.checked) checkedCollections.push(cb.value);
      });

      // Hide all swatch groups first
      allSwatchGroups.forEach(function(g) { g.style.display = 'none'; });

      // Check if any pickable collection is selected
      let hasPickable = checkedCollections.some(function(c) {
        return pickableCollections.indexOf(c) !== -1;
      });

      // Check if custom is selected
      let hasCustom = checkedCollections.indexOf('custom') !== -1;

      // Show design picker if any pickable collection is selected
      if (hasPickable) {
        if (picker) picker.style.display = 'block';
        // Show swatch groups for selected collections
        checkedCollections.forEach(function(collVal) {
          if (pickableCollections.indexOf(collVal) !== -1) {
            let group = document.getElementById('formSwatches-' + collVal);
            if (group) group.style.display = 'block';
          }
        });
      } else {
        if (picker) picker.style.display = 'none';
      }

      // Show custom fields if custom is selected
      if (hasCustom) {
        if (customFields) customFields.style.display = 'block';
      } else {
        if (customFields) customFields.style.display = 'none';
      }

      // Hide collection error when at least one is selected
      if (checkedCollections.length > 0 && collectionError) {
        collectionError.style.display = 'none';
      }
    }

    function updateSelectedDesignsDisplay() {
      if (!selectedDesignsList || !selectedDesignsContainer) return;
      
      selectedDesignsList.innerHTML = '';
      
      if (selectedDesigns.length === 0) {
        selectedDesignsContainer.style.display = 'none';
        if (designInput) designInput.value = '';
        return;
      }

      selectedDesignsContainer.style.display = 'block';
      if (designInput) designInput.value = selectedDesigns.map(function(d) { return d.code; }).join(', ');

      selectedDesigns.forEach(function(design) {
        let tag = document.createElement('span');
        tag.className = 'selected-design-tag';
        tag.innerHTML = design.code + '<button type="button" data-code="' + design.code + '">&times;</button>';
        selectedDesignsList.appendChild(tag);
      });

      // Add click handlers to remove buttons
      selectedDesignsList.querySelectorAll('button').forEach(function(btn) {
        btn.addEventListener('click', function() {
          let code = btn.getAttribute('data-code');
          removeDesign(code);
        });
      });
    }

    function addDesign(code, nameEn, nameAr, bg) {
      // Check if already selected
      let exists = selectedDesigns.some(function(d) { return d.code === code; });
      if (!exists) {
        selectedDesigns.push({ code: code, nameEn: nameEn, nameAr: nameAr, bg: bg });
      }
      updateSelectedDesignsDisplay();
    }

    function removeDesign(code) {
      selectedDesigns = selectedDesigns.filter(function(d) { return d.code !== code; });
      // Remove selected class from swatch
      let swatch = document.querySelector('.form-swatch-item[data-code="' + code + '"]');
      if (swatch) swatch.classList.remove('selected');
      updateSelectedDesignsDisplay();
    }

    function clearAllDesigns() {
      selectedDesigns = [];
      document.querySelectorAll('.form-swatch-item.selected').forEach(function(s) {
        s.classList.remove('selected');
      });
      updateSelectedDesignsDisplay();
    }

    // Collection checkbox change handlers
    collectionCheckboxes.forEach(function(cb) {
      cb.addEventListener('change', updateDesignPicker);
    });

    // Form swatch item click (toggle selection)
  document.addEventListener('click', function(e) {
    let item = e.target.closest('.form-swatch-item');
    if (!item) return;
      
      let code   = item.getAttribute('data-code') || '';
      let bg     = item.getAttribute('data-bg') || '';
      let nameEn = item.getAttribute('data-name-en') || code;
      let nameAr = item.getAttribute('data-name-ar') || nameEn;

      if (item.classList.contains('selected')) {
        // Deselect
        item.classList.remove('selected');
        removeDesign(code);
      } else {
        // Select
        item.classList.add('selected');
        addDesign(code, nameEn, nameAr, bg);
      }
    });

    document.addEventListener('keydown', function(e) {
      let keyTarget = e.target.closest('.form-swatch-item, .swatch-item');
      if (!keyTarget) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        keyTarget.click();
      }
    });

    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', clearAllDesigns);
    }

    // Expose clearAllDesigns for form reset
    window.clearAllFormDesigns = clearAllDesigns;
  })();

  /* Contact form — PHP submission */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(contactForm);
      fetch('contact.php', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          contactForm.reset();
          document.getElementById('formSuccess').style.display = 'block';
          setTimeout(() => {
            document.getElementById('formSuccess').style.display = 'none';
          }, 5000);

          /* Hide design picker and custom fields */
          let picker = document.getElementById('formDesignPicker');
          let customFields = document.getElementById('formCustomFields');
          let selectedDesigns = document.getElementById('formSelectedDesigns');
          let collectionError = document.getElementById('collectionError');
          if (picker) picker.style.display = 'none';
          if (customFields) customFields.style.display = 'none';
          if (selectedDesigns) selectedDesigns.style.display = 'none';
          if (collectionError) collectionError.style.display = 'none';

          /* Clear selected designs */
          if (typeof window.clearAllFormDesigns === 'function') {
            window.clearAllFormDesigns();
          }
        } else {
          document.getElementById('formError').textContent = data.message;
          document.getElementById('formError').style.display = 'block';
        }
      })
      .catch(() => {
        document.getElementById('formError').textContent = 'Something went wrong. Please call us directly on 035833895.';
        document.getElementById('formError').style.display = 'block';
      });
    });
  }

  /* Swatch lightbox — delegated click */
  document.addEventListener('click', function(e) {
    let item = e.target.closest('.swatch-item');
    if (!item) return;
    let bg     = item.getAttribute('data-bg') || '';
    let code   = item.getAttribute('data-code') || '';
    let nameEn = item.getAttribute('data-name-en') || code;
    let nameAr = item.getAttribute('data-name-ar') || nameEn;
    let thick  = item.getAttribute('data-thick') || '0.5–2.0mm';
    let descEn = item.getAttribute('data-desc-en') || '';
    let descAr = item.getAttribute('data-desc-ar') || descEn;
    if (bg && code) openSwatch(bg, code, nameEn, nameAr, thick, descEn, descAr);
  });

  /* Escape key closes lightbox */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
  });

}); /* end DOMContentLoaded */

/* ── Force autoplay on all background videos (iOS Safari fix) ─────────── */
(function() {
  const BG_CLASSES = [
    'hero-video-bg', 'ab-inline-video',
    'ab-cinematic-video', 'w-video'
  ];

  function forcePlay(video) {
    if (!video) return;

    // Safari/iOS requirements
    video.muted       = true;
    video.defaultMuted = true;
    video.playsInline  = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('disableRemotePlayback', '');
    
    // Ensure no controls are shown
    video.controls = false;
    video.removeAttribute('controls');

    // If already playing or ready, show it immediately
    if (video.readyState >= 3) {
      video.classList.add('loaded');
      video.classList.add('is-playing');
    }

    // Handle "loaded" state smoothly
    video.addEventListener('playing', function() {
      video.classList.add('loaded');
      video.classList.add('is-playing');
    }, { once: true });

    // Initial play attempt
    let promise = video.play();
    if (promise !== undefined) {
      promise.catch(function() {
        // Autoplay was prevented (e.g. Low Power Mode)
        // We'll retry on first user interaction
        let retry = function() {
          video.play().then(function() {
            video.classList.add('loaded');
            video.classList.add('is-playing');
          }).catch(function(){});
          document.removeEventListener('touchstart', retry);
          document.removeEventListener('click', retry);
        };
        document.addEventListener('touchstart', retry, { once: true });
        document.addEventListener('click',      retry, { once: true });
      });
    }

    // Safari fix: Resume if suspended or stalled
    video.addEventListener('suspend', function() {
      if (video.paused && !document.hidden) {
        video.play().catch(function(){});
      }
    });
  }

  function initVideos() {
    BG_CLASSES.forEach(function(cls) {
      document.querySelectorAll('video.' + cls).forEach(function(v) {
        // Force loop on background videos
        if (v.getAttribute('loop') !== 'false') {
          v.loop = true;
        }
        forcePlay(v);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideos);
  } else {
    initVideos();
  }

  // Also retry on visibility change (tab switch / screen wake on iOS)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) { initVideos(); }
  });
})();
