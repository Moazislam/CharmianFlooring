/* ── GLOBAL STATE ─────────────────────────────────────────────────────────── */
var lang = 'en';
var _selectedSwatch = null;
var _savedScrollY = 0;

/* ── SWATCH IMAGE MAP ────────────────────────────────────────────────────── */
var SWATCH_IMAGES = {
  "CVG-T01": "images/Marble/CVG-T05.jpg",
  "CVG-T02": "images/Marble/CVG-T04.jpg",
  "CVG-T03": "images/Marble/CVG-T03.jpg",
  "CVG-T04": "images/Marble/CVG-T02.jpg",
  "CVG-T05": "images/Marble/CVG-T01.jpg",
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
  closeMob();
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
  document.body.style.top = '';
  window.scrollTo(0, _savedScrollY || 0);
  var ham = document.getElementById('ham');
  if (ham) ham.setAttribute('aria-expanded', 'false');
}

function openMob() {
  var menu = document.getElementById('mobileMenu');
  if (!menu) return;
  _savedScrollY = window.scrollY || window.pageYOffset || 0;
  menu.classList.add('open');
  document.body.classList.add('menu-open');
  document.body.style.top = -_savedScrollY + 'px';
  var ham = document.getElementById('ham');
  if (ham) ham.setAttribute('aria-expanded', 'true');
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
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else if (el.tagName === 'OPTION') {
      // Preserve selected state — only update text, don't touch value
      el.textContent = val;
    } else if (el.tagName === 'SELECT') {
      // Preserve selected value across translation
      var savedVal = el.value;
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
  var selSwatch = document.querySelector('.form-swatch-item.selected');
  if (selSwatch) {
    var dn = document.getElementById('formDesignName');
    if (dn) dn.textContent = selSwatch.getAttribute('data-name-' + l) || selSwatch.getAttribute('data-name-en') || '';
  }
  document.querySelectorAll('.tab-btn').forEach(function(b) {
    var val = b.getAttribute('data-' + l);
    if (val) b.textContent = val;
  });
  try {
    window.localStorage.setItem('siteLang', l);
  } catch (err) {}
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

/* ── GOOGLE SHEETS CONFIG ────────────────────────────────────────────────── */
var SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyoxM5r8hyinpAM5bvrMiRu9T8q2K3tXnEMaJUYO54EZGUy7DTtsLqhNPbNHllAOLKVew/exec';

/* ── GOOGLE SHEETS SUBMISSION ────────────────────────────────────────────── */
async function submitToGoogleSheets(data) {
  try {
    await fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors', // Keeps the browser from blocking the cross-origin request
      headers: {
        // MUST be text/plain to bypass the CORS preflight OPTIONS request
        'Content-Type': 'text/plain;charset=utf-8', 
      },
      // Pass the data as a JSON string
      body: JSON.stringify(data) 
    });
  } catch(err) {
    // Keep the main submission flow successful even if the secondary sync fails.
  }
}

/* ══ DOM-DEPENDENT SETUP — runs after page is fully loaded ══════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  try {
    var savedLang = window.localStorage.getItem('siteLang');
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
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
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
      if (!menu) return;
      var isOpen = menu.classList.contains('open');
      if (isOpen) {
        closeMob();
      } else {
        openMob();
      }
    });
  }

  /* Navbar shadow on scroll */
  window.addEventListener('scroll', function() {
    var navbar = document.getElementById('navbar');
    if (navbar) navbar.style.boxShadow = window.scrollY > 20 ? '0 2px 20px rgba(0,0,0,0.25)' : 'none';
  }, { passive: true });

  /* Collection checkboxes + multi-select design picker */
  (function() {
    var picker          = document.getElementById('formDesignPicker');
    var customFields    = document.getElementById('formCustomFields');
    var allSwatchGroups = document.querySelectorAll('.form-swatch-group');
    var selectedDesignsContainer = document.getElementById('formSelectedDesigns');
    var selectedDesignsList = document.getElementById('selectedDesignsList');
    var designInput     = document.getElementById('designCodeInput');
    var clearAllBtn     = document.getElementById('formClearAllDesigns');
    var collectionCheckboxes = document.querySelectorAll('#collectionCheckboxes input[type="checkbox"]');
    var collectionError = document.getElementById('collectionError');
    var pickableCollections = ['marble', 'wood', 'elite'];
    var selectedDesigns = [];

    function updateDesignPicker() {
      var checkedCollections = [];
      collectionCheckboxes.forEach(function(cb) {
        if (cb.checked) checkedCollections.push(cb.value);
      });

      // Hide all swatch groups first
      allSwatchGroups.forEach(function(g) { g.style.display = 'none'; });

      // Check if any pickable collection is selected
      var hasPickable = checkedCollections.some(function(c) {
        return pickableCollections.indexOf(c) !== -1;
      });

      // Check if custom is selected
      var hasCustom = checkedCollections.indexOf('custom') !== -1;

      // Show design picker if any pickable collection is selected
      if (hasPickable) {
        if (picker) picker.style.display = 'block';
        // Show swatch groups for selected collections
        checkedCollections.forEach(function(collVal) {
          if (pickableCollections.indexOf(collVal) !== -1) {
            var group = document.getElementById('formSwatches-' + collVal);
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
        var tag = document.createElement('span');
        tag.className = 'selected-design-tag';
        tag.innerHTML = design.code + '<button type="button" data-code="' + design.code + '">&times;</button>';
        selectedDesignsList.appendChild(tag);
      });

      // Add click handlers to remove buttons
      selectedDesignsList.querySelectorAll('button').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var code = btn.getAttribute('data-code');
          removeDesign(code);
        });
      });
    }

    function addDesign(code, nameEn, nameAr, bg) {
      // Check if already selected
      var exists = selectedDesigns.some(function(d) { return d.code === code; });
      if (!exists) {
        selectedDesigns.push({ code: code, nameEn: nameEn, nameAr: nameAr, bg: bg });
      }
      updateSelectedDesignsDisplay();
    }

    function removeDesign(code) {
      selectedDesigns = selectedDesigns.filter(function(d) { return d.code !== code; });
      // Remove selected class from swatch
      var swatch = document.querySelector('.form-swatch-item[data-code="' + code + '"]');
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
    var item = e.target.closest('.form-swatch-item');
    if (!item) return;
      
      var code   = item.getAttribute('data-code') || '';
      var bg     = item.getAttribute('data-bg') || '';
      var nameEn = item.getAttribute('data-name-en') || code;
      var nameAr = item.getAttribute('data-name-ar') || nameEn;

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
      var keyTarget = e.target.closest('.form-swatch-item, .swatch-item');
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

  /* Contact form — Web3Forms + Google Sheets (parallel) */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Validate collection selection
      var collectionCheckboxes = document.querySelectorAll('#collectionCheckboxes input[type="checkbox"]:checked');
      var collectionError = document.getElementById('collectionError');
      
      // Spam protection: check honeypot fields
      var botcheck = form.querySelector('input[name="botcheck"]');
      var websiteField = form.querySelector('input[name="website"]');
      if ((botcheck && botcheck.value) || (websiteField && websiteField.value)) {
        return; // Silently reject spam submissions
      }
      
      if (collectionCheckboxes.length === 0) {
        if (collectionError) {
          collectionError.style.display = 'block';
          collectionError.textContent = lang === 'ar' ? 'يرجى اختيار مجموعة واحدة على الأقل' : 'Please select at least one collection';
        }
        return;
      }
      
      var btn  = form.querySelector('button[type="submit"]');
      if (!btn) return;
      var orig = btn.textContent;
      btn.textContent = lang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...';
      btn.disabled = true;

      /* ── Collect raw values from the form ── */
      var rawForm = new FormData(form);

      var customerName   = rawForm.get('name')         || '';
      var customerEmail  = rawForm.get('email')        || '';
      var countryCode    = rawForm.get('country_code') || '';
      var phoneNumber    = rawForm.get('phone')        || '';
      var fullPhone      = (countryCode + ' ' + phoneNumber).trim();
      var designCodes    = rawForm.get('design_code')  || 'None selected';
      var thickness      = rawForm.get('thickness')    || 'N/A';
      var pattern        = rawForm.get('pattern')      || 'N/A';
      var userMessage    = rawForm.get('message')      || 'N/A';

      // Collect selected collections
      var selectedCollections = [];
      collectionCheckboxes.forEach(function(cb) {
        selectedCollections.push(cb.value);
      });
      var collectionStr = selectedCollections.join(', ');

      // ── Build one clean plain-text message body ──
      var cleanMessage = [
        'Name:        ' + customerName,
        'Phone:       ' + fullPhone,
        'Email:       ' + customerEmail,
        'Collection:  ' + collectionStr,
        'Designs:     ' + designCodes,
        'Thickness:   ' + thickness,
        'Pattern:     ' + pattern,
        'Message:     ' + userMessage,
      ].join('\n');

      // ── Build a minimal FormData with ONLY the fields Web3Forms needs ──
      // Sending only these prevents Web3Forms from dumping every field as raw text
      var formData = new FormData();
      formData.set('access_key',  rawForm.get('access_key') || '');
      formData.set('subject',     'New Quote Request — Charmain Flooring');
      formData.set('from_name',   'Charmain Flooring Website');
      formData.set('replyto',     customerEmail);
      formData.set('message',     cleanMessage);

      // Google Sheets payload (separate, keeps all structured fields)
      var sheetsPayload = {
        name:         customerName,
        country_code: countryCode,
        phone:        phoneNumber,
        email:        customerEmail,
        collection:   collectionStr,
        design_code:  designCodes,
        thickness:    thickness,
        pattern:      pattern,
        message:      userMessage,
      };

      try {
        /* Submit to Web3Forms */
        var response = await fetch('https://api.web3forms.com/submit', { 
          method: 'POST', 
          body: formData 
        });
        if (!response.ok) {
          throw new Error('Web3Forms request failed with status ' + response.status);
        }
        var data = await response.json();
        
        if (data.success) {
          /* Submit to Google Sheets */
          submitToGoogleSheets(sheetsPayload);

          btn.textContent = lang === 'ar' ? 'تم الإرسال!' : 'Sent!';
          alert(lang === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Success! Your message has been sent.');
          form.reset();
          
          /* Hide design picker and custom fields */
          var picker = document.getElementById('formDesignPicker');
          var customFields = document.getElementById('formCustomFields');
          var selectedDesigns = document.getElementById('formSelectedDesigns');
          if (picker) picker.style.display = 'none';
          if (customFields) customFields.style.display = 'none';
          if (selectedDesigns) selectedDesigns.style.display = 'none';
          if (collectionError) collectionError.style.display = 'none';
          
          /* Clear selected designs */
          if (typeof window.clearAllFormDesigns === 'function') {
            window.clearAllFormDesigns();
          }
          
          setTimeout(function() { btn.textContent = orig; btn.disabled = false; }, 3000);
        } else {
          alert('Error: ' + (data.message || 'Form submission failed'));
          btn.textContent = lang === 'ar' ? 'حدث خطأ' : 'Error — try again';
          setTimeout(function() { btn.textContent = orig; btn.disabled = false; }, 3000);
        }
      } catch (err) {
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
