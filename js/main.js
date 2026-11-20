/**
 * main.js — mayeko.org
 * - TR / EN dil motoru (localStorage + ?lang=en desteği)
 * - Sayfa başlığı/meta çevirisi (<html data-title-tr/en, data-desc-tr/en>)
 * - Eski tek sayfa #anchor bağlantılarını yeni alt sayfalara yönlendirme
 * - Görünür olunca belirme animasyonu
 * - İletişim formu doğrulama ve e-posta taslağı
 */

// Eski index.html#bolum bağlantılarını yeni sayfalara yönlendir
(function redirectLegacyAnchors() {
  const map = {
    hakkimizda: '/hakkimizda',
    alanlar: '/alanlar',
    metodoloji: '/metodoloji',
    isbirligi: '/isbirligi',
    kurumsal: '/kurumsal',
    iletisim: '/iletisim',
  };
  if (document.body && document.body.getAttribute('data-page') === 'home') {
    const target = map[window.location.hash.replace('#', '')];
    if (target) window.location.replace(target + window.location.search);
  }
})();

let currentLang = 'tr';

function applyLanguage(lang) {
  currentLang = lang === 'en' ? 'en' : 'tr';
  const root = document.documentElement;
  root.lang = currentLang;

  const title = root.getAttribute(`data-title-${currentLang}`);
  if (title) document.title = title;
  const desc = root.getAttribute(`data-desc-${currentLang}`);
  const descMeta = document.querySelector('meta[name="description"]');
  if (desc && descMeta) descMeta.setAttribute('content', desc);

  document.querySelectorAll('[data-tr][data-en]').forEach((el) => {
    const val = el.getAttribute(`data-${currentLang}`);
    if (val !== null) el.textContent = val;
  });

  document.querySelectorAll('[data-placeholder-tr][data-placeholder-en]').forEach((el) => {
    const val = el.getAttribute(`data-placeholder-${currentLang}`);
    if (val !== null) el.setAttribute('placeholder', val);
  });

  document.querySelectorAll('[data-bylaws-link]').forEach((link) => {
    link.setAttribute(
      'href',
      currentLang === 'en' ? '/assets/docs/bylaws-summary-en' : '/assets/docs/tuzuk-ozeti-tr'
    );
  });

  // Buton, geçilecek dili gösterir
  document.querySelectorAll('[data-lang-indicator]').forEach((el) => {
    el.textContent = currentLang === 'tr' ? 'EN' : 'TR';
  });

  try {
    localStorage.setItem('mayeko_lang', currentLang);
  } catch {
    /* localStorage kapalı */
  }
}

function toggleLanguage() {
  applyLanguage(currentLang === 'tr' ? 'en' : 'tr');
}

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  const vh = window.innerHeight || document.documentElement.clientHeight;
  els.forEach((el) => {
    // Halihazırda ekranda olanları hemen göster; diğerlerini kaydırınca
    if (el.getBoundingClientRect().top < vh) el.classList.add('is-visible');
    else io.observe(el);
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const feedback = document.getElementById('formFeedback');
  const kvkkCheck = document.getElementById('kvkkConsent');
  const submitBtn = document.getElementById('formSubmit');
  const btnLabel = submitBtn?.querySelector('[data-tr]');
  const tr = currentLang === 'tr';

  const show = (ok, msg) => {
    if (!feedback) return;
    feedback.classList.remove('hidden', 'text-emerald-700', 'text-amber-700');
    feedback.classList.add(ok ? 'text-emerald-700' : 'text-amber-700');
    feedback.textContent = msg;
  };

  if (kvkkCheck && !kvkkCheck.checked) {
    show(false, tr
      ? 'Lütfen göndermeden önce KVKK Aydınlatma Metni onay kutusunu işaretleyin.'
      : 'Please tick the privacy notice consent box before sending.');
    return;
  }

  const val = (n) => (form.elements.namedItem(n)?.value || '').trim();
  const turnstileToken = val('cf-turnstile-response');
  if (!turnstileToken) {
    show(false, tr
      ? 'Lütfen güvenlik doğrulamasının tamamlanmasını bekleyin.'
      : 'Please wait for the security check to complete.');
    return;
  }

  const resetTurnstile = () => {
    try { window.turnstile?.reset(); } catch { /* yoksay */ }
  };
  const setBusy = (busy) => {
    if (!submitBtn) return;
    submitBtn.disabled = busy;
    if (btnLabel) {
      btnLabel.textContent = busy
        ? (tr ? 'Gönderiliyor…' : 'Sending…')
        : btnLabel.getAttribute(`data-${currentLang}`);
    }
  };

  const name = val('senderName');
  setBusy(true);
  feedback?.classList.add('hidden');

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email: val('senderEmail'),
        topic: val('senderTopic'),
        message: val('senderMessage'),
        consent: !!kvkkCheck?.checked,
        website: val('website'),
        turnstileToken,
        lang: currentLang,
      }),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok && data.ok) {
      show(true, tr
        ? `Teşekkürler${name ? ' ' + name : ''}! Mesajınız bize ulaştı; en kısa sürede dönüş yapacağız.`
        : `Thank you${name ? ' ' + name : ''}! Your message has reached us; we will get back to you soon.`);
      form.reset();
    } else if (data.error === 'captcha') {
      show(false, tr
        ? 'Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyin.'
        : 'Security check failed. Please try again.');
    } else if (data.error === 'validation') {
      show(false, tr
        ? 'Lütfen tüm zorunlu alanları geçerli şekilde doldurun.'
        : 'Please fill in all required fields correctly.');
    } else {
      throw new Error(data.error || res.status);
    }
  } catch {
    show(false, tr
      ? 'Mesajınız şu anda gönderilemedi. Lütfen daha sonra tekrar deneyin veya info@mayeko.org adresine yazın.'
      : 'Your message could not be sent right now. Please try again later or write to info@mayeko.org.');
  } finally {
    setBusy(false);
    resetTurnstile();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.remove('no-js');

  const urlLang = new URLSearchParams(window.location.search).get('lang');
  let initialLang = 'tr';
  if (urlLang === 'en' || urlLang === 'tr') {
    initialLang = urlLang;
  } else {
    try {
      const saved = localStorage.getItem('mayeko_lang');
      if (saved === 'en' || saved === 'tr') initialLang = saved;
    } catch {
      /* yoksay */
    }
  }
  applyLanguage(initialLang);
  initReveal();
});
