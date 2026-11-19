# Mavi ve Yeşil Ekosistem Geliştirme Derneği (MAYEKO / BGEDA)
## `mayeko.org` Kurumsal Kimlik, Web Sitesi Tasarım Planı ve Geliştirme Dokümanı

Bu doküman, **Mavi ve Yeşil Ekosistem Geliştirme Derneği (Blue and Green Ecosystem Development Association — MAYEKO / BGEDA)** tüzüğü (Madde 1–27) ve tanıtım sunumu esas alınarak **`mayeko.org`** alan adı için geliştirilen kurumsal, iki dilli (`TR / EN`), erişilebilir ve uluslararası fon programlarına (Horizon Europe, Erasmus+, Interreg NEXT Karadeniz Havzası, Kalkınma Ajansları vb.) güven veren web sitesinin mimarisini tanımlar.

---

## 1. Kurumsal Kimlik ve Renk Yelpazesi (Color Palette)

| Renk Rolü | Renk Adı | HEX Kodu | RGB Kodu | Kullanım Alanı |
| :--- | :--- | :--- | :--- | :--- |
| **Ana Renk (Primary)** | Derin Karadeniz Mavisi (`Deep Marine Blue`) | `#0B3954` | `11, 57, 84` | Ana başlıklar, üst menü, Hero zemini, alt bilgi (Footer), birincil butonlar |
| **İkincil Renk (Secondary)** | Ekosistem Yeşili (`Emerald Forest`) | `#1B7F5C` | `27, 127, 92` | Yeşil dönüşüm vurguları, başarı metrikleri, ikincil butonlar |
| **Vurgu Rengi (Accent)** | Dijital Turkuaz (`Digital Cyan`) | `#00A896` | `0, 168, 150` | Dijital dönüşüm ikonları, hover efektleri, bağlantı vurguları |
| **Yumuşak Vurgu** | Buzul Mavisi (`Soft Glacier`) | `#E8F4F8` | `232, 244, 248` | Kart arka planları, bölüm ayırıcı açık yüzeyler |
| **Arka Plan (Background)** | Saf Kırık Beyaz (`Off-White`) | `#F9FBFD` | `249, 251, 253` | Sayfa ana zemini |
| **Metin Rengi (Text)** | Koyu Antrasit (`Slate Charcoal`) | `#1E293B` | `30, 41, 59` | Gövde metinleri ve açıklamalar |
| **İkincil Metin** | Nötr Gri (`Muted Slate`) | `#64748B` | `100, 116, 139` | Alt başlıklar, tarih, tüzük madde referansları |

---

## 2. Klasör ve Dosya Mimarisi

```text
mayeko.org/
├── WEBSITE_DEVELOPMENT_PLAN.md      # Kurumsal kimlik ve geliştirme planı
├── index.html                       # Ana kurumsal web sitesi (TR / EN iki dilli)
├── css/
│   └── style.css                    # Kurumsal CSS değişkenleri (:root), bileşen ve animasyon stilleri
├── js/
│   └── main.js                      # TR/EN dil motoru, mobil menü, tüzük/KVKK modalları, ortaklık formu
└── assets/
    ├── docs/
    │   ├── tuzuk-ozeti-tr.html      # Yazdırılabilir / PDF kaydedilebilir Dernek Tüzüğü Özeti (TR)
    │   └── bylaws-summary-en.html   # Printable / PDF-ready Association Bylaws Summary (EN)
    └── img/
        ├── logo.svg                 # MAYEKO / BGEDA vektörel kurumsal logo
        └── favicon.svg              # Tarayıcı sekme ikonu
```
