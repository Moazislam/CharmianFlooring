/* ── GLOBAL STATE ─────────────────────────────────────────────────────────── */
var lang = 'en';
var _selectedSwatch = null;

/* ── SWATCH IMAGE MAP ────────────────────────────────────────────────────── */
var SWATCH_IMAGES = {
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
  "CVM-E05": "images/Elite/CVM-E05.jpg"
};

/* ══ GLOBALLY ACCESSIBLE FUNCTIONS (called from inline onclick) ══════════════
   These MUST be in the global scope — do NOT wrap them in DOMContentLoaded   */

function showPage(id) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  var page = document.getElementById('page-' + id);
  if (page) { page.classList.add('active'); }
  window.scrollTo(0, 0);
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.remove('active');
    var fn = a.getAttribute('onclick') || '';
    if (fn.indexOf("'" + id + "'") !== -1) a.classList.add('active');
  });
}

function showTab(id) {
  document.querySelectorAll('.collection-panel').forEach(function(p) {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  var panel = document.getElementById('panel-' + id);
  if (panel) {
    panel.classList.add('active');
    panel.style.display = 'block';
    var section = document.querySelector('.collections-page');
    if (section && window.innerWidth < 768) {
      setTimeout(function() { section.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
    }
  }
  document.querySelectorAll('.tab-btn').forEach(function(b) {
    var onclick = b.getAttribute('onclick') || '';
    if (onclick.indexOf("'" + id + "'") !== -1) b.classList.add('active');
  });
}

function closeMob() {
  var menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.remove('open');
  document.body.classList.remove('menu-open');
}

function galleryFilter(cat, btn) {
  document.querySelectorAll('.gf-btn').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.ge-item').forEach(function(item) {
    if (cat === 'all' || item.getAttribute('data-cat') === cat) {
      item.style.opacity = '1';
      item.style.pointerEvents = '';
    } else {
      item.style.opacity = '0.15';
      item.style.pointerEvents = 'none';
    }
  });
}

function applyLang(l) {
  var isAr = l === 'ar';
  document.body.classList.toggle('rtl', isAr);
  document.body.style.fontFamily = isAr ? "'Cairo', sans-serif" : "'Barlow', sans-serif";
  document.documentElement.setAttribute('lang', l);
  document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
  var langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.textContent = isAr ? 'English' : 'عربي';
  var mob = document.getElementById('langBtnMob');
  if (mob) mob.textContent = isAr ? 'English' : 'عربي';
  document.querySelectorAll('[data-en]').forEach(function(el) {
    var val = el.getAttribute('data-' + l);
    if (!val) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { el.placeholder = val; }
    else { el.innerHTML = val; }
  });
  document.querySelectorAll('[data-placeholder-en]').forEach(function(el) {
    el.placeholder = el.getAttribute('data-placeholder-' + l) || el.placeholder;
  });
  document.querySelectorAll('input, textarea, select, button').forEach(function(el) {
    el.style.fontFamily = isAr ? "'Cairo', sans-serif" : "'Barlow', sans-serif";
  });
  var selSwatch = document.querySelector('.form-swatch-item.selected');
  if (selSwatch) {
    var dn = document.getElementById('formDesignName');
    if (dn) dn.textContent = selSwatch.getAttribute('data-name-' + l) || selSwatch.getAttribute('data-name-en') || '';
  }
  document.querySelectorAll('.tab-btn').forEach(function(b) {
    var val = b.getAttribute('data-' + l);
    if (val) b.textContent = val;
  });
}

function openSwatch(bg, code, nameEn, nameAr, thick, descEn, descAr) {
  var lb = document.getElementById('swatchLightbox');
  if (!lb) return;
  var isAr = document.body.classList.contains('rtl');
  _selectedSwatch = { bg: bg, code: code, nameEn: nameEn, nameAr: nameAr, thick: thick };
  var swatchEl = document.getElementById('lbSwatch');
  var imgSrc = SWATCH_IMAGES[code] || null;
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
  var descEl = document.getElementById('lbDesc');
  if (descEl) descEl.textContent = isAr ? (descAr || descEn || '') : (descEn || '');
  lb.querySelectorAll('[data-en]').forEach(function(el) {
    var val = el.getAttribute('data-' + (isAr ? 'ar' : 'en'));
    if (val) el.textContent = val;
  });
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  var lb = document.getElementById('swatchLightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
  document.body.style.removeProperty('overflow');
  if (document.body.classList.contains('menu-open')) {
    document.body.style.overflow = 'hidden';
  }
}

/* ══ DOM-DEPENDENT SETUP — runs after page is fully loaded ══════════════════ */
document.addEventListener('DOMContentLoaded', function() {

  /* Init collection panels */
  document.querySelectorAll('.collection-panel').forEach(function(p) {
    p.style.display = p.classList.contains('active') ? 'block' : 'none';
  });

  /* Lang toggle buttons */
  var langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', function() {
      lang = lang === 'en' ? 'ar' : 'en';
      applyLang(lang);
    });
  }
  var mobLang = document.getElementById('langBtnMob');
  if (mobLang) {
    mobLang.addEventListener('click', function() {
      lang = lang === 'en' ? 'ar' : 'en';
      applyLang(lang);
    });
  }

  /* Hamburger */
  var ham = document.getElementById('ham');
  if (ham) {
    ham.addEventListener('click', function() {
      var menu = document.getElementById('mobileMenu');
      var isOpen = menu.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
    });
  }

  /* Navbar shadow on scroll */
  window.addEventListener('scroll', function() {
    var navbar = document.getElementById('navbar');
    if (navbar) navbar.style.boxShadow = window.scrollY > 20 ? '0 2px 20px rgba(0,0,0,0.25)' : 'none';
  }, { passive: true });

  /* Custom select + design picker */
  (function() {
    var trigger     = document.getElementById('selectTrigger');
    var dropdown    = document.getElementById('customDropdown');
    var triggerText = document.getElementById('triggerText');
    var hiddenInput = document.getElementById('collectionVal');
    var opts        = document.querySelectorAll('.custom-option');
    var picker          = document.getElementById('formDesignPicker');
    var customFields    = document.getElementById('formCustomFields');
    var allSwatchGroups = document.querySelectorAll('.form-swatch-group');
    var selectedDesign  = document.getElementById('formSelectedDesign');
    var swatchPreview   = document.getElementById('formSwatchPreview');
    var designCode      = document.getElementById('formDesignCode');
    var designName      = document.getElementById('formDesignName');
    var designInput     = document.getElementById('designCodeInput');
    var clearBtn        = document.getElementById('formClearDesign');
    var pickableCollections = ['marble', 'wood', 'elite'];

    function showDesignPicker(collVal) {
      allSwatchGroups.forEach(function(g) { g.style.display = 'none'; });
      clearFormDesign();
      if (pickableCollections.indexOf(collVal) !== -1) {
        if (picker) picker.style.display = 'block';
        var group = document.getElementById('formSwatches-' + collVal);
        if (group) group.style.display = 'block';
        if (customFields) customFields.style.display = 'none';
      } else if (collVal === 'custom') {
        if (picker) picker.style.display = 'none';
        if (customFields) customFields.style.display = 'block';
      } else {
        if (picker) picker.style.display = 'none';
        if (customFields) customFields.style.display = 'none';
      }
    }

    function clearFormDesign() {
      if (designInput) designInput.value = '';
      if (selectedDesign) selectedDesign.style.display = 'none';
      document.querySelectorAll('.form-swatch-item.selected').forEach(function(s) {
        s.classList.remove('selected');
      });
    }

    if (!trigger) return;

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
      trigger.classList.toggle('active');
    });

    opts.forEach(function(opt) {
      opt.addEventListener('click', function(e) {
        e.stopPropagation();
        var val  = opt.dataset.value;
        var isAr = document.body.classList.contains('rtl');
        var text = opt.getAttribute('data-' + (isAr ? 'ar' : 'en'));
        triggerText.textContent = text;
        triggerText.setAttribute('data-en', opt.getAttribute('data-en'));
        triggerText.setAttribute('data-ar', opt.getAttribute('data-ar'));
        if (hiddenInput) hiddenInput.value = val;
        opts.forEach(function(o) { o.classList.remove('selected'); });
        opt.classList.add('selected');
        dropdown.classList.remove('open');
        trigger.classList.remove('active');
        showDesignPicker(val);
      });
    });

    document.addEventListener('click', function() {
      if (dropdown) dropdown.classList.remove('open');
      if (trigger) trigger.classList.remove('active');
    });

    /* Form swatch item click */
    document.addEventListener('click', function(e) {
      var item = e.target.closest('.form-swatch-item');
      if (!item) return;
      var group = item.closest('.form-swatch-group');
      if (group) group.querySelectorAll('.form-swatch-item').forEach(function(s) { s.classList.remove('selected'); });
      item.classList.add('selected');
      var code   = item.getAttribute('data-code') || '';
      var bg     = item.getAttribute('data-bg') || '';
      var isAr   = document.body.classList.contains('rtl');
      var nameEn = item.getAttribute('data-name-en') || code;
      var nameAr = item.getAttribute('data-name-ar') || nameEn;
      if (designInput)  designInput.value = code;
      if (designCode)   designCode.textContent = code;
      if (designName)   designName.textContent = isAr ? nameAr : nameEn;
      if (swatchPreview) {
        swatchPreview.style.background = bg.startsWith('images')
          ? 'url("' + bg + '") center/cover no-repeat' : bg;
      }
      if (selectedDesign) selectedDesign.style.display = 'block';
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function() { clearFormDesign(); });
    }
  })();

  /* Contact form — Web3Forms + Google Sheets (parallel) */
  var SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzyy3Yutvw-a5CLT3PGnMyoS03cyFDEmPZ-u1OR9EVMLLrovXX2Tqd8g70_a6bOZntnsA/exec';
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      var btn  = form.querySelector('button[type="submit"]');
      var orig = btn.textContent;
      btn.textContent = lang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...';
      btn.disabled = true;

      /* Create FormData - access_key is already in the HTML hidden input */
      var formData = new FormData(form);

      var sheetsPayload = {
        name:        formData.get('name')        || '',
        phone:       formData.get('phone')       || '',
        email:       formData.get('email')       || '',
        collection:  formData.get('collection')  || '',
        design_code: formData.get('design_code') || '',
        message:     formData.get('message')     || ''
      };

      try {
        /* Submit to Web3Forms */
        var response = await fetch('https://api.web3forms.com/submit', { 
          method: 'POST', 
          body: formData 
        });
        var data = await response.json();
        
        if (data.success) {
          /* Also submit to Google Sheets (fire and forget with no-cors) */
          fetch(SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(sheetsPayload)
          }).catch(function() { /* Ignore sheets errors */ });

          btn.textContent = lang === 'ar' ? 'تم الإرسال!' : 'Sent!';
          alert(lang === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Success! Your message has been sent.');
          form.reset();
          /* Reset custom select trigger text */
          var triggerText = document.getElementById('triggerText');
          if (triggerText) {
            triggerText.textContent = lang === 'ar' ? 'اختر مجموعة…' : 'Select a collection…';
          }
          /* Hide design picker and custom fields */
          var picker = document.getElementById('formDesignPicker');
          var customFields = document.getElementById('formCustomFields');
          var selectedDesign = document.getElementById('formSelectedDesign');
          if (picker) picker.style.display = 'none';
          if (customFields) customFields.style.display = 'none';
          if (selectedDesign) selectedDesign.style.display = 'none';
          document.querySelectorAll('.custom-option').forEach(function(o) { o.classList.remove('selected'); });
          
          setTimeout(function() { btn.textContent = orig; btn.disabled = false; }, 3000);
        } else {
          alert('Error: ' + (data.message || 'Form submission failed'));
          btn.textContent = lang === 'ar' ? 'حدث خطأ' : 'Error — try again';
          setTimeout(function() { btn.textContent = orig; btn.disabled = false; }, 3000);
        }
      } catch (err) {
        console.error('Form error:', err);
        alert(lang === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.');
        btn.textContent = lang === 'ar' ? 'حدث خطأ' : 'Error — try again';
        setTimeout(function() { btn.textContent = orig; btn.disabled = false; }, 3000);
      }
    });
  }

  /* Swatch lightbox — delegated click */
  document.addEventListener('click', function(e) {
    var item = e.target.closest('.swatch-item');
    if (!item) return;
    var bg     = item.getAttribute('data-bg') || '';
    var code   = item.getAttribute('data-code') || '';
    var nameEn = item.getAttribute('data-name-en') || code;
    var nameAr = item.getAttribute('data-name-ar') || nameEn;
    var thick  = item.getAttribute('data-thick') || '0.5–2.0mm';
    var descEn = item.getAttribute('data-desc-en') || '';
    var descAr = item.getAttribute('data-desc-ar') || descEn;
    if (bg && code) openSwatch(bg, code, nameEn, nameAr, thick, descEn, descAr);
  });

  /* Escape key closes lightbox */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
  });

  /* Prevent image download */
  document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') { e.preventDefault(); return false; }
  });
  document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') { e.preventDefault(); return false; }
  });

}); /* end DOMContentLoaded */
