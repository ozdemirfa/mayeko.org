/**
 * layout.js — mayeko.org ortak sayfa iskeleti
 * Header, mobil menü ve footer tek bir NAV dizisinden üretilir.
 * Kullanım: <body data-page="alanlar"> + <div id="site-header"></div> ... <div id="site-footer"></div>
 * main.js'ten ÖNCE yüklenmelidir (dil motoru enjekte edilen metni de çevirir).
 */
(function () {
  const NAV = [
    { id: 'hakkimizda', href: 'hakkimizda.html', tr: 'Hakkımızda', en: 'About' },
    { id: 'alanlar', href: 'alanlar.html', tr: 'Stratejik Alanlar', en: 'Focus Areas' },
    { id: 'metodoloji', href: 'metodoloji.html', tr: 'Metodoloji', en: 'Methodology' },
    { id: 'isbirligi', href: 'isbirligi.html', tr: 'İş Birlikleri', en: 'Partnerships' },
    { id: 'kurumsal', href: 'kurumsal.html', tr: 'Kurumsal', en: 'Governance' },
  ];

  const page = document.body.getAttribute('data-page') || '';
  const current = (id) => (id === page ? ' aria-current="page"' : '');

  const globeIcon =
    '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';

  const brand = (light) => `
    <a href="index.html" class="flex items-center gap-3 shrink-0" aria-label="MAYEKO — Ana Sayfa">
      <img src="assets/img/logo.svg" alt="" class="w-10 h-10 rounded-xl" />
      <span class="leading-tight">
        <span class="block font-heading font-extrabold text-[1.05rem] tracking-tight ${light ? 'text-white' : 'text-marine'}">MAYEKO</span>
        <span class="block text-[0.72rem] font-medium ${light ? 'text-slate-300' : 'text-mutedSlate'}"
          data-tr="Mavi ve Yeşil Ekosistem Derneği" data-en="Blue &amp; Green Ecosystem Assoc.">Mavi ve Yeşil Ekosistem Derneği</span>
      </span>
    </a>`;

  const headerHTML = `
  <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:bg-white focus:rounded-lg focus:shadow"
     data-tr="İçeriğe geç" data-en="Skip to content">İçeriğe geç</a>
  <header class="site-header" id="siteHeader">
    <div class="container-x">
      <div class="bar flex items-center justify-between gap-6">
        ${brand(false)}

        <nav class="hidden lg:flex items-center gap-8" aria-label="Ana menü">
          ${NAV.map((n) => `<a href="${n.href}" class="nav-link"${current(n.id)} data-tr="${n.tr}" data-en="${n.en}">${n.tr}</a>`).join('')}
        </nav>

        <div class="flex items-center gap-2.5">
          <button type="button" class="lang-btn" onclick="toggleLanguage()" aria-label="Dil değiştir / Switch language">
            ${globeIcon}<span data-lang-indicator>EN</span>
          </button>
          <a href="iletisim.html" class="btn btn-primary hidden sm:inline-flex !py-2.5 !px-5 !text-sm"${current('iletisim')}
             data-tr="İletişim" data-en="Contact">İletişim</a>
          <button type="button" id="menuBtn" class="lg:hidden inline-grid place-items-center w-10 h-10 rounded-full border border-slate-200 text-marine"
                  aria-label="Menü" aria-expanded="false" aria-controls="mobileMenu">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <nav id="mobileMenu" class="mobile-menu hidden lg:hidden pb-5 pt-1 space-y-1" aria-label="Mobil menü">
        ${NAV.map((n) => `<a href="${n.href}" class="block px-4 py-3 rounded-xl text-charcoal hover:bg-glacier"${current(n.id)} data-tr="${n.tr}" data-en="${n.en}">${n.tr}</a>`).join('')}
        <a href="iletisim.html" class="block px-4 py-3 rounded-xl text-charcoal hover:bg-glacier"${current('iletisim')} data-tr="İletişim" data-en="Contact">İletişim</a>
      </nav>
    </div>
  </header>`;

  const year = new Date().getFullYear();

  const footerHTML = `
  <footer class="site-footer">
    <div class="container-x pt-16 pb-10">
      <div class="grid gap-12 md:grid-cols-12">
        <div class="md:col-span-5 space-y-5">
          ${brand(true)}
          <p class="max-w-sm text-sm leading-relaxed"
             data-tr="Mavi ekonomi, yeşil dönüşüm ve dijital uyum alanlarında Trabzon'dan dünyaya proje, araştırma ve iş birliği."
             data-en="Projects, research and partnerships in blue economy, green transition and digital adaptation — from Trabzon to the world.">
            Mavi ekonomi, yeşil dönüşüm ve dijital uyum alanlarında Trabzon'dan dünyaya proje, araştırma ve iş birliği.
          </p>
        </div>

        <div class="md:col-span-3">
          <h4 class="mb-4" data-tr="Sayfalar" data-en="Pages">Sayfalar</h4>
          <ul class="space-y-2.5 text-sm">
            ${NAV.map((n) => `<li><a href="${n.href}" data-tr="${n.tr}" data-en="${n.en}">${n.tr}</a></li>`).join('')}
          </ul>
        </div>

        <div class="md:col-span-4">
          <h4 class="mb-4" data-tr="İletişim" data-en="Contact">İletişim</h4>
          <ul class="space-y-2.5 text-sm">
            <li><a href="mailto:info@mayeko.org">info@mayeko.org</a></li>
            <li data-tr="Ortahisar / Trabzon, Türkiye" data-en="Ortahisar / Trabzon, Türkiye">Ortahisar / Trabzon, Türkiye</li>
            <li class="pt-2"><a href="iletisim.html" class="link-arrow !text-digitalCyan hover:!text-white">
              <span data-tr="Bize yazın" data-en="Get in touch">Bize yazın</span><span>→</span></a></li>
          </ul>
        </div>
      </div>

      <div class="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-between text-xs text-slate-400">
        <p>© ${year} <span data-tr="Mavi ve Yeşil Ekosistem Geliştirme Derneği (MAYEKO / BGEDA)" data-en="Blue and Green Ecosystem Development Association (BGEDA / MAYEKO)">Mavi ve Yeşil Ekosistem Geliştirme Derneği (MAYEKO / BGEDA)</span></p>
        <div class="flex gap-5">
          <a href="kurumsal.html#tuzuk" data-tr="Dernek Tüzüğü" data-en="Bylaws">Dernek Tüzüğü</a>
          <a href="gizlilik.html" data-tr="KVKK &amp; Gizlilik" data-en="Privacy">KVKK &amp; Gizlilik</a>
        </div>
      </div>
    </div>
  </footer>`;

  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');
  if (headerSlot) headerSlot.outerHTML = headerHTML;
  if (footerSlot) footerSlot.outerHTML = footerHTML;

  // Mobil menü
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('hidden') === false;
      menuBtn.setAttribute('aria-expanded', String(open));
    });
  }

  // Scroll'da header gölgesi
  const header = document.getElementById('siteHeader');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
