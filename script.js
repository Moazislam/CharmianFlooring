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

/* ── GLOBAL FUNCTIONS ─────────────────────────────────────────────────────── */

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');
  window.scrollTo(0, 0);
}

function closeMob() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.remove('open');
  document.body.classList.remove('menu-open');
}

/* ── MAIN INIT ───────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function () {

  /* ── NAVBAR SHADOW ───────────────── */
  window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.style.boxShadow =
        window.scrollY > 20 ? '0 2px 20px rgba(0,0,0,0.25)' : 'none';
    }
  });

  /* ── COLLECTION SELECT ───────────── */
  const collectionInput = document.getElementById('collectionVal');
  document.querySelectorAll('.custom-option').forEach(opt => {
    opt.addEventListener('click', function () {
      const value = this.dataset.value;
      if (collectionInput) collectionInput.value = value;
    });
  });

  /* ── DESIGN PICKER ──────────────── */
  const designInput = document.getElementById('designCodeInput');

  document.addEventListener('click', function (e) {
    const item = e.target.closest('.form-swatch-item');
    if (!item) return;

    document.querySelectorAll('.form-swatch-item')
      .forEach(s => s.classList.remove('selected'));

    item.classList.add('selected');

    const code = item.getAttribute('data-code') || '';
    if (designInput) designInput.value = code;
  });

  /* ── CONTACT FORM (FINAL CLEAN VERSION) ───────────────── */

  const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyBYWGQ8fuknmTA5QoHEoZAqhr34G0iWEMJpBUrWhTBsX6H_5DDJlm-t3XVA6nlgeXY7Q/exec';

  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;

      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        const formData = new FormData(form);

        const sheetsPayload = JSON.stringify({
          name: formData.get('name'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          collection: formData.get('collection'),
          design_code: formData.get('design_code'),
          message: formData.get('message')
        });

        // Web3Forms
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (!data.success) throw new Error();

        // Google Sheets
        await fetch(SHEETS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: sheetsPayload
        });

        btn.textContent = 'Sent!';
        form.reset();

      } catch (err) {
        console.error(err);
        btn.textContent = 'Error — try again';
      }

      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 3000);
    });
  }

});
