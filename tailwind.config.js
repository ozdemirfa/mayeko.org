/** @type {import('tailwindcss').Config} */
module.exports = {
  // layout.js header/footer sınıflarını şablon metinlerinde taşıdığı için taranmalı
  content: ['./*.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        marine: '#0B3954',      // Derin Karadeniz Mavisi
        emeraldEco: '#1B7F5C',  // Ekosistem Yeşili
        digitalCyan: '#00A896', // Dijital Turkuaz
        glacier: '#E8F4F8',     // Buzul Mavisi
        offWhite: '#F9FBFD',    // Kırık Beyaz
        charcoal: '#1E293B',    // Koyu Antrasit
        mutedSlate: '#64748B',  // Nötr Gri
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
};
