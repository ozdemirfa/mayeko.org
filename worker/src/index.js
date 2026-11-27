// mayeko.org iletişim formu → Cloudflare Email Sending (send_email binding) ile e-posta

const TOPICS = new Set([
  'AB / Uluslararası Proje Ortaklığı',
  'Akademik Araştırma İş Birliği',
  'Kamu / Yerel Yönetim / STK Ortaklığı',
  'Üyelik / Gönüllülük',
  'Genel Bilgi Talebi',
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

// Başlıklara girecek değerlerden satır sonlarını temizle (header injection)
const oneLine = (s) => String(s ?? '').replace(/[\r\n\t]+/g, ' ').trim();
const text = (s) => String(s ?? '').replace(/\r\n?/g, '\n').trim();

async function verifyTurnstile(token, secret, ip) {
  if (!token || !secret) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const data = await res.json().catch(() => ({}));
  return data.success === true;
}

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname !== '/api/contact') {
      return new Response('Not found', { status: 404 });
    }
    if (request.method !== 'POST') {
      return json({ ok: false, error: 'method' }, 405);
    }

    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const origin = request.headers.get('Origin') || '';
    if (!allowed.includes(origin)) {
      return json({ ok: false, error: 'origin' }, 403);
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ ok: false, error: 'validation' }, 400);
    }

    // Honeypot: botlar doldurur; sessizce başarı dön
    if (oneLine(data.website)) {
      return json({ ok: true });
    }

    const name = oneLine(data.name);
    const email = oneLine(data.email);
    const topic = oneLine(data.topic);
    const message = text(data.message);
    const lang = data.lang === 'en' ? 'en' : 'tr';

    if (
      !name || name.length > 200 ||
      !EMAIL_RE.test(email) || email.length > 254 ||
      !TOPICS.has(topic) ||
      !message || message.length > 5000 ||
      data.consent !== true
    ) {
      return json({ ok: false, error: 'validation' }, 400);
    }

    const ip = request.headers.get('CF-Connecting-IP') || '';
    if (!(await verifyTurnstile(data.turnstileToken, env.TURNSTILE_SECRET, ip))) {
      return json({ ok: false, error: 'captcha' }, 400);
    }

    const country = request.cf?.country || '-';
    const date = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

    const body =
      `Ad Soyad / Kurum: ${name}\n` +
      `E-posta: ${email}\n` +
      `Konu: ${topic}\n` +
      `Dil: ${lang.toUpperCase()}\n` +
      `Tarih: ${date}\n` +
      `IP / Ülke: ${ip || '-'} / ${country}\n` +
      `KVKK onayı: Evet\n\n` +
      `Mesaj:\n${message}\n\n` +
      `— Bu e-posta mayeko.org/iletisim formundan gönderildi. Yanıtla dediğinizde gönderene gider.`;

    try {
      await env.EMAIL.send({
        from: { name: 'MAYEKO İletişim Formu', email: env.FROM_ADDRESS },
        to: env.TO_ADDRESS,
        replyTo: { name: name.replace(/["<>]/g, '') || email, email },
        subject: `[mayeko.org] ${topic} — ${name}`,
        text: body,
      });
    } catch (err) {
      console.error('email send failed', err?.code || '', err?.message || err);
      return json({ ok: false, error: 'send' }, 502);
    }

    return json({ ok: true });
  },
};
