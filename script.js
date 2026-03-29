/* ── GLOBAL STATE ─────────────────────────────────────────────────────────── */
var lang = 'en';
var _selectedSwatch = null;

/* ── SWATCH IMAGE MAP ────────────────────────────────────────────────────── */
var SWATCH_IMAGES = {
  "CVG-T01": "images/MARBLE_CVG-T01_BEIGE-MULTICOLOR.jpg",
  "CVG-T02": "images/MARBLE_CVG-T02_BEIGE-DARK-INCLUSIONS.jpg",
  "CVG-T03": "images/MARBLE_CVG-T03_BURGUNDY-SPECKLED.jpg",
  "CVG-T04": "images/MARBLE_CVG-T04_LIGHT-GREY-SPECKLED.jpg",
  "CVG-C07": "images/MARBLE_CVG-C07_WHITE-CALACATTA.jpg",
  "CVG-C08": "images/MARBLE_CVG-C08_GOLDEN-CALACATTA.jpg",
  "CVG-C09": "images/MARBLE_CVG-C09_BLACK-CALACATTA.jpg",
  "CVG-C10": "images/MARBLE_CVG-C10_GREY-CALACATTA.jpg",
  "CVG-G05": "images/MARBLE_CVG-G05_GRAPHITE-DARK-GREY.jpg",
  "CVG-N6":  "images/MARBLE_CVG-N6_NAVONA-GOLDEN-BROWN.jpg",
  "CVG-A11": "images/MARBLE_CVG-A11_ARGENTO-LIGHT-GREY.jpg",
  "CVG-S12": "images/MARBLE_CVG-S12_SILVER-WAVE-SPECKLED.jpg",
  "CVM-B01": "images/WOOD_CVM-B01_SMOKED-OAK.jpg",
  "CVM-B02": "images/WOOD_CVM-B02_NATURAL-LIGHT-OAK.jpg",
  "CVM-B03": "images/WOOD_CVM-B03_SOFT-BROWN-WOOD.jpg",
  "CVM-C04": "images/WOOD_CVM-C04_GOLDEN-WOOD.jpg",
  "CVM-C05": "images/WOOD_CVM-C05_WARM-BROWN-WOOD.jpg",
  "CVM-P06": "images/WOOD_CVM-P06_HERRINGBONE-PARQUET.jpg",
  "CVM-G07": "images/WOOD_CVM-G07_LIGHT-GREY.jpg",
  "CVM-G08": "images/WOOD_CVM-G08_DARK-GREY.jpg",
  "CVM-R09": "images/WOOD_CVM-R09_RUSTIC-MULTI-TONE-PLANK.jpg",
  "CVM-W10": "images/WOOD_CVM-W10_HERRINGBONE-DARK-WOOD.jpg",
  "CVM-W11": "images/WOOD_CVM-W11_DARK-WALNUT-WOOD.jpg",
  "CVM-E01": "images/ELITE_CVM-E01_DEEP-GRAIN-WOOD.jpg",
  "CVM-E02": "images/ELITE_CVM-E02_HONEY-TONED-WOOD.jpg",
  "CVM-E03": "images/ELITE_CVM-E03_NATURAL-WARM-OAK.jpg",
  "CVM-E04": "images/ELITE_CVM-E04_WAVY-WOOD-PATTERN.jpg",
  "CVM-E05": "images/ELITE_CVM-E05_GREY-LIGHT-OAK.jpg"
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
      } else {
        if (picker) picker.style.display = 'none';
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

  /* Contact form */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      var btn  = form.querySelector('button[type="submit"]');
      var orig = btn.textContent;
      btn.textContent = lang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...';
      btn.disabled = true;
      try {
        var res  = await fetch(form.action, { method: 'POST', body: new FormData(form) });
        var data = await res.json();
        if (data.success) {
          btn.textContent = lang === 'ar' ? 'تم الإرسال!' : 'Sent!';
          form.reset();
          setTimeout(function() { btn.textContent = orig; btn.disabled = false; }, 3000);
        } else { throw new Error('Failed'); }
      } catch(err) {
        btn.textContent = lang === 'ar' ? 'حدث خطأ' : 'Error — try again';
        btn.disabled = false;
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
