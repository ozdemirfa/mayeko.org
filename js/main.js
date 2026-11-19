/**
 * main.js — mayeko.org (Mavi ve Yeşil Ekosistem Geliştirme Derneği | BGEDA)
 * - TR / EN İki Dilli İçerik Motoru (localStorage + ?lang=en URL parametresi desteği)
 * - Mobil Menü Kontrolü
 * - Tüzük Maddeleri & KVKK / Gizlilik Politikası Modal Yönetimi
 * - Stratejik Dönüşüm Eksenleri Filtreleme
 * - Proje Ortaklığı & İletişim Formu Doğrulama ve Gönderim
 */

let currentLang = 'tr';

const PAGE_META = {
  tr: {
    title: 'Mavi ve Yeşil Ekosistem Geliştirme Derneği (MAYEKO / BGEDA) | mayeko.org',
    description:
      'Ortahisar/Trabzon merkezli Mavi ve Yeşil Ekosistem Geliştirme Derneği (MAYEKO / BGEDA); mavi ekonomi, yeşil dönüşüm ve dijital uyum eksenlerinde yerel, ulusal ve uluslararası projeler geliştirir.',
  },
  en: {
    title: 'Blue and Green Ecosystem Development Association (BGEDA / MAYEKO) | mayeko.org',
    description:
      'Headquartered in Ortahisar/Trabzon, Türkiye, the Blue and Green Ecosystem Development Association (BGEDA / MAYEKO) develops local, national, and international projects across blue, green, and digital transformation.',
  },
};

function applyLanguage(lang) {
  currentLang = lang === 'en' ? 'en' : 'tr';
  document.documentElement.lang = currentLang;

  // Sayfa başlığı ve meta açıklama
  if (PAGE_META[currentLang]) {
    document.title = PAGE_META[currentLang].title;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', PAGE_META[currentLang].description);
  }

  // Metin elemanları ([data-tr][data-en])
  const textEls = document.querySelectorAll('[data-tr][data-en]');
  textEls.forEach((el) => {
    const val = el.getAttribute(`data-${currentLang}`);
    if (val !== null) {
      el.textContent = val;
    }
  });

  // Form placeholder'ları ([data-placeholder-tr][data-placeholder-en])
  const inputEls = document.querySelectorAll('[data-placeholder-tr][data-placeholder-en]');
  inputEls.forEach((el) => {
    const val = el.getAttribute(`data-placeholder-${currentLang}`);
    if (val !== null) {
      el.setAttribute('placeholder', val);
    }
  });

  // Tüzük indirme linklerini aktif dile göre güncelle
  const bylawsLinks = document.querySelectorAll('[data-bylaws-link]');
  bylawsLinks.forEach((link) => {
    link.setAttribute(
      'href',
      currentLang === 'en'
        ? 'assets/docs/bylaws-summary-en.html'
        : 'assets/docs/tuzuk-ozeti-tr.html'
    );
  });

  // Dil butonlarının aktif görünümü
  const langIndicators = document.querySelectorAll('[data-lang-indicator]');
  langIndicators.forEach((badge) => {
    badge.textContent = currentLang === 'tr' ? 'TR • EN' : 'EN • TR';
  });

  try {
    localStorage.setItem('mayeko_lang', currentLang);
  } catch {
    // localStorage kapalıysa yoksay
  }
}

function toggleLanguage() {
  applyLanguage(currentLang === 'tr' ? 'en' : 'tr');
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  menu.classList.toggle('hidden');
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
  }
}

function filterThemes(theme) {
  const cards = document.querySelectorAll('[data-theme-card]');
  const buttons = document.querySelectorAll('[data-theme-btn]');

  buttons.forEach((btn) => {
    const isMatch = btn.getAttribute('data-theme-btn') === theme;
    if (isMatch) {
      btn.classList.add('bg-marine', 'text-white', 'border-marine');
      btn.classList.remove('bg-white', 'text-charcoal', 'border-slate-200');
    } else {
      btn.classList.remove('bg-marine', 'text-white', 'border-marine');
      btn.classList.add('bg-white', 'text-charcoal', 'border-slate-200');
    }
  });

  cards.forEach((card) => {
    const cardTheme = card.getAttribute('data-theme-card');
    if (theme === 'all' || cardTheme === theme) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const feedback = document.getElementById('formFeedback');
  const kvkkCheck = document.getElementById('kvkkConsent');

  if (kvkkCheck && !kvkkCheck.checked) {
    if (feedback) {
      feedback.classList.remove('hidden', 'text-emerald-300');
      feedback.classList.add('text-amber-300');
      feedback.textContent =
        currentLang === 'tr'
          ? 'Lütfen mesaj göndermeden önce KVKK Aydınlatma Metni onay kutusunu işaretleyin.'
          : 'Please check the Data Protection & Privacy Notice consent box before sending your message.';
    }
    return;
  }

  const name = (form.elements.namedItem('senderName')?.value || '').trim();
  const email = (form.elements.namedItem('senderEmail')?.value || '').trim();
  const topic = (form.elements.namedItem('senderTopic')?.value || '').trim();
  const message = (form.elements.namedItem('senderMessage')?.value || '').trim();

  if (feedback) {
    feedback.classList.remove('hidden', 'text-amber-300');
    feedback.classList.add('text-emerald-300');
    feedback.textContent =
      currentLang === 'tr'
        ? `Teşekkürler ${name || ''}! Mesajınız kaydedildi ve e-posta istemciniz (info@mayeko.org) hazırlandı. Yönetim kurulumuz en kısa sürede dönüş yapacaktır.`
        : `Thank you ${name || ''}! Your inquiry has been recorded and your email client (info@mayeko.org) is ready. Our board will respond shortly.`;
  }

  // Kurumsal e-posta taslağı da hazırla (statik barındırmada hiçbir mesaj kaybolmasın)
  const subject = encodeURIComponent(`[mayeko.org] ${topic || 'Proje & İş Birliği Başvurusu'} — ${name}`);
  const body = encodeURIComponent(
    `Ad Soyad / Kurum: ${name}\nE-posta: ${email}\nKonu: ${topic}\n\nMesaj:\n${message}`
  );
  const mailtoLink = document.getElementById('mailtoFallbackLink');
  if (mailtoLink) {
    mailtoLink.setAttribute('href', `mailto:info@mayeko.org?subject=${subject}&body=${body}`);
    mailtoLink.classList.remove('hidden');
  }

  form.reset();
}

// Sayfa yüklendiğinde dil tercihini başlat ve ESC ile modalları kapat
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lang');
  let initialLang = 'tr';

  if (urlLang === 'en' || urlLang === 'tr') {
    initialLang = urlLang;
  } else {
    try {
      const saved = localStorage.getItem('mayeko_lang');
      if (saved === 'en' || saved === 'tr') initialLang = saved;
    } catch {
      // ignore
    }
  }

  applyLanguage(initialLang);

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      closeModal('bylawsModal');
      closeModal('kvkkModal');
    }
  });
});
