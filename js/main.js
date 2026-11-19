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
    hakkimizda: 'hakkimizda.html',
    alanlar: 'alanlar.html',
    metodoloji: 'metodoloji.html',
    isbirligi: 'isbirligi.html',
    kurumsal: 'kurumsal.html',
    iletisim: 'iletisim.html',
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
      currentLang === 'en' ? 'assets/docs/bylaws-summary-en.html' : 'assets/docs/tuzuk-ozeti-tr.html'
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

function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const feedback = document.getElementById('formFeedback');
  const kvkkCheck = document.getElementById('kvkkConsent');

  const show = (ok, msg) => {
    if (!feedback) return;
    feedback.classList.remove('hidden', 'text-emerald-700', 'text-amber-700');
    feedback.classList.add(ok ? 'text-emerald-700' : 'text-amber-700');
    feedback.textContent = msg;
  };

  if (kvkkCheck && !kvkkCheck.checked) {
    show(
      false,
      currentLang === 'tr'
        ? 'Lütfen göndermeden önce KVKK Aydınlatma Metni onay kutusunu işaretleyin.'
        : 'Please tick the privacy notice consent box before sending.'
    );
    return;
  }

  const val = (n) => (form.elements.namedItem(n)?.value || '').trim();
  const name = val('senderName');
  const email = val('senderEmail');
  const topic = val('senderTopic');
  const message = val('senderMessage');

  const subject = encodeURIComponent(`[mayeko.org] ${topic || 'İletişim'} — ${name}`);
  const body = encodeURIComponent(`Ad Soyad / Kurum: ${name}\nE-posta: ${email}\nKonu: ${topic}\n\nMesaj:\n${message}`);
  const href = `mailto:info@mayeko.org?subject=${subject}&body=${body}`;

  const mailtoLink = document.getElementById('mailtoFallbackLink');
  if (mailtoLink) {
    mailtoLink.setAttribute('href', href);
    mailtoLink.classList.remove('hidden');
  }

  show(
    true,
    currentLang === 'tr'
      ? `Teşekkürler${name ? ' ' + name : ''}! E-posta uygulamanız mesajınızla açılıyor. Açılmazsa aşağıdaki bağlantıyı kullanın.`
      : `Thank you${name ? ' ' + name : ''}! Your email app is opening with your message. If it doesn't, use the link below.`
  );

  window.location.href = href;
  form.reset();
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
