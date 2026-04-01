import { Github, Instagram, Linkedin, MessageCircle, Send, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

// Import gambar agar bundler (Vite/webpack) bisa resolve path-nya (opsional tapi disarankan)
import photo from './assets/profile2.jpg'; // sesuaikan path relatif ke lokasi file tsx ini

type ServiceId =
  | 'landing-page'
  | 'company-profile'
  | 'ecommerce'
  | 'web-app'
  | 'mobile-app'
  | 'maintenance';

type ServiceInfo = {
  id: ServiceId;
  name: string;
  short: string;
  priceRange: string;
  delivery: string;
  features: string[];
};

type ExampleProject = { title: string; url?: string; notes?: string };

type ChatQuickReply = { label: string; value: string };

type ChatMessage = {
  id: string;
  role: 'user' | 'bot';
  text: string;
  quickReplies?: ChatQuickReply[];
};

type FaqCtx = { service: ServiceInfo | null };

type FaqEntry = {
  id: string;
  triggers: string[];
  answer: (ctx: FaqCtx) => string;
  
  quickReplies?: (ctx: FaqCtx) => ChatQuickReply[];
};

const SERVICE_CATALOG: ServiceInfo[] = [
  {
    id: 'landing-page',
    name: 'Landing Page',
    short: 'Cocok untuk promosi produk/jasa + CTA WhatsApp.',
    priceRange: 'Rp 500rb – 2,5jt',
    delivery: '2–7 hari',
    features: [
      'Desain modern + responsive',
      'CTA WhatsApp / form sederhana',
      'Basic SEO (title, meta, OG)',
      'Deploy (Vercel/Netlify)',
    ],
  },
  {
    id: 'company-profile',
    name: 'Company Profile',
    short: 'Web profil bisnis: layanan, galeri, testimoni, kontak.',
    priceRange: 'Rp 500rb – 6jt',
    delivery: '5–14 hari',
    features: [
      'Multi halaman (Home, About, Services, Contact)',
      'Form kontak + integrasi WhatsApp',
      'Basic SEO + sitemap/robots',
      'Optimasi performa ringan',
    ],
  },
  {
    id: 'ecommerce',
    name: 'E‑Commerce (Basic)',
    short: 'Katalog produk + checkout sederhana (custom/3rd party).',
    priceRange: 'Rp 1,5jt – 15jt',
    delivery: '2–6 minggu',
    features: [
      'Katalog + detail produk',
      'Keranjang + checkout (sesuai kebutuhan)',
      'Admin ringan / integrasi spreadsheet',
      'Integrasi pembayaran (opsional)',
    ],
  },
  {
    id: 'web-app',
    name: 'Web App (Custom)',
    short: 'Aplikasi web: dashboard, booking, inventory, dsb.',
    priceRange: 'Rp 3jt – 40jt+',
    delivery: '3–10 minggu',
    features: [
      'Auth (login/roles) (opsional)',
      'Dashboard + CRUD',
      'Integrasi API/WA/email (opsional)',
      'Dokumentasi handover singkat',
    ],
  },
  {
    id: 'mobile-app',
    name: 'Mobile App (MVP)',
    short: 'Aplikasi Android/iOS (MVP) sesuai scope.',
    priceRange: 'Rp 2,5jt – 15jt+',
    delivery: '6–14 minggu',
    features: [
      'UI/UX dasar + flow utama',
      'Auth + data utama (opsional)',
      'Build rilis (APK/AAB) (opsional)',
      'Testing basic + perbaikan bug',
    ],
  },
  {
    id: 'maintenance',
    name: 'Maintenance / Support',
    short: 'Update konten, bugfix, optimasi, monitoring.',
    priceRange: 'Rp 300rb – 2jt/bulan',
    delivery: 'Sesuai SLA',
    features: [
      'Perubahan minor konten & layout',
      'Bugfix prioritas',
      'Backup & monitoring sederhana',
      'Laporan perubahan',
    ],
  },
];

const SERVICE_KEYWORDS: Record<ServiceId, string[]> = {
  'landing-page': ['landing', 'lp', 'promo', 'sales page'],
  'company-profile': ['company', 'profil', 'profile', 'perusahaan'],
  ecommerce: ['ecommerce', 'e-commerce', 'toko', 'shop', 'produk', 'katalog'],
  'web-app': ['web app', 'dashboard', 'sistem', 'aplikasi web', 'booking', 'inventory'],
  'mobile-app': ['mobile', 'android', 'ios', 'apk', 'app', 'aplikasi'],
  maintenance: ['maintenance', 'maintain', 'support', 'bugfix', 'perawatan'],
};

// Mapping contoh project untuk kedepannya (bisa diisi URL demo/portfolio per layanan)
const EXAMPLE_PROJECTS: Partial<Record<ServiceId, ExampleProject[]>> = {
  'landing-page': [],
  'company-profile': [],
  ecommerce: [],
  'web-app': [],
  'mobile-app': [],
  maintenance: [],
};

function normalizeText(input: string) {
  return input
    .toLowerCase()
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Match `pattern` as a whole word (or whole phrase) inside `text`. */
function wordMatch(text: string, pattern: string): boolean {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`).test(text);
}

function findServiceId(text: string): ServiceId | null {
  const t = normalizeText(text);
  for (const [id, keywords] of Object.entries(SERVICE_KEYWORDS) as [ServiceId, string[]][]) {
    if (keywords.some((k) => wordMatch(t, normalizeText(k)))) return id;
  }
  return null;
}

function buildServiceList() {
  return SERVICE_CATALOG.map(
    (s, idx) =>
      `${idx + 1}. ${s.name} — ${s.priceRange}\n   • ${s.short}\n   • Estimasi: ${s.delivery}`,
  ).join('\n\n');
}

const App = () => {
  // Protect images from being downloaded
  useEffect(() => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Prevent right-click context menu
      img.addEventListener('contextmenu', (e) => e.preventDefault());
      // Prevent drag
      img.addEventListener('dragstart', (e) => e.preventDefault());
    });
  }, []);
  const PortoLink = 'https://raflitriofansyah.vercel.app';
  const whatsappNumber = "6285728961516";
  const whatsappLinkBuat = `https://wa.me/${whatsappNumber}?text=Halo%20Rafli%2C%20saya%20mau%20Konsultasi%20Pembuatan%20Website%2FApp`;
  const buyLink = "https://lynk.id/ratro";
  const penilaianLink = "https://docs.google.com/forms/d/e/1FAIpQLSeymgjupzRKxAlRWARgq4LY5MSg9YsCbtVtkZMfPVKQcUBJyg/viewform?usp=publish-editor";
  const blog ="https://raflitriofansyah.blogspot.com";

  const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: makeId(),
      role: 'bot',
      text:
        'Halo! Aku Ratro Assistant.\nAku bisa bantu jelasin jasa yang tersedia, kisaran harga, fitur yang didapat, dan contoh project.',
      quickReplies: [
        { label: 'Lihat layanan', value: 'layanan' },
        { label: 'Cek harga', value: 'harga' },
        { label: 'Contoh project', value: 'contoh' },
        { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
      ],
    },
  ]);

  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  const lastQuickReplies = useMemo(() => {
    for (let i = chatMessages.length - 1; i >= 0; i -= 1) {
      const m = chatMessages[i];
      if (m.role === 'bot' && m.quickReplies && m.quickReplies.length > 0) return m.quickReplies;
    }
    return [] as ChatQuickReply[];
  }, [chatMessages]);

  useEffect(() => {
    if (!isChatOpen) return;
    const el = chatBodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [chatMessages, isChatOpen, isTyping]);

  const openWhatsApp = () => {
    window.open(whatsappLinkBuat, '_blank', 'noopener,noreferrer');
  };

  const buildServiceDetails = (service: ServiceInfo) => {
    const features = service.features.map((f) => `• ${f}`).join('\n');
    return `${service.name}\nKisaran harga: ${service.priceRange}\nEstimasi pengerjaan: ${service.delivery}\n\nFitur yang didapat:\n${features}\n\nCatatan: harga bisa naik/turun tergantung scope (jumlah halaman, kompleksitas, integrasi, deadline).`;
  };

  const buildExampleText = (service: ServiceInfo) => {
    const items = EXAMPLE_PROJECTS[service.id] ?? [];
    if (items.length === 0) {
      return (
        `${service.name} — Contoh Project\n` +
        `Saat ini link contoh publik belum ditaruh di halaman ini.\n` +
        `Kamu bisa cek portofolio: ${PortoLink}\n` +
        `Atau chat WhatsApp biar aku kirim contoh yang relevan.`
      );
    }

    const lines = items
      .map((p, idx) => {
        const url = p.url ? ` — ${p.url}` : '';
        const notes = p.notes ? ` (${p.notes})` : '';
        return `${idx + 1}. ${p.title}${notes}${url}`;
      })
      .join('\n');

    return `${service.name} — Contoh Project\n${lines}`;
  };

  const FAQ_ENTRIES: FaqEntry[] = useMemo(
    () => [
      {
        id: 'help',
        triggers: ['help', 'bantuan', 'faq', 'pertanyaan umum', 'info', 'menu bot', 'bisa bantu apa'],
        answer: () =>
          'Aku bisa jawab pertanyaan seperti:\n' +
          '• layanan/jasa yang tersedia\n' +
          '• harga/biaya/kisaran budget\n' +
          '• fitur yang didapat\n' +
          '• estimasi waktu pengerjaan\n' +
          '• cara order + data yang dibutuhkan\n' +
          '• revisi, pembayaran/DP, invoice\n' +
          '• domain/hosting/deploy\n' +
          '• SEO, analytics/pixel\n' +
          '• login/role, admin panel, database\n' +
          '• contoh project per layanan',
        quickReplies: () => [
          { label: 'Lihat layanan', value: 'layanan' },
          { label: 'Cek harga', value: 'harga' },
          { label: 'Estimasi waktu', value: 'berapa lama pengerjaan?' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'cara-order',
        triggers: ['cara pesan', 'cara order', 'gimana order', 'alur order', 'cara mulai', 'mulai project', 'proses kerja'],
        answer: () =>
          'Alur singkatnya:\n' +
          '1) Kamu jelasin kebutuhan (tujuan, fitur, referensi).\n' +
          '2) Aku buat estimasi scope + harga + timeline.\n' +
          '3) Deal → mulai pengerjaan (biasanya DP dulu).\n' +
          '4) Review & revisi.\n' +
          '5) Launch/deploy + handover.',
        quickReplies: () => [
          { label: 'Data yang dibutuhkan', value: 'butuh data apa?' },
          { label: 'Cek harga', value: 'harga' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'butuh-data',
        triggers: ['butuh apa', 'perlu apa', 'data apa', 'brief', 'materi apa', 'konten apa saja', 'yang harus disiapkan','butuh apa aja'],
        answer: () =>
          'Yang biasanya dibutuhkan:\n' +
          '• Nama brand + logo (kalau ada)\n' +
          '• Deskripsi bisnis/produk\n' +
          '• Warna/style referensi (opsional)\n' +
          '• Konten: teks, harga, foto, testimoni\n' +
          '• Fitur wajib (contoh: form, WA, login, dashboard)\n' +
          '• Domain (kalau sudah punya) + akun deploy (Vercel/Netlify) (opsional)',
        quickReplies: () => [
          { label: 'Estimasi waktu', value: 'berapa lama pengerjaan?' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'revisi',
        triggers: ['revisi', 'berapa kali revisi', 'minta revisi', 'ubah desain', 'ubah fitur', 'perubahan'],
        answer: () =>
          'Revisi bisa, biasanya kita pisahkan:\n' +
          '• Revisi minor (teks, warna, layout kecil)\n' +
          '• Revisi mayor (ubah flow besar, tambah modul/fitur baru)\n\n' +
          'Agar rapi, revisi mayor biasanya dihitung sebagai scope tambahan.',
        quickReplies: () => [
          { label: 'Cara order', value: 'cara order' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'pembayaran',
        triggers: ['pembayaran', 'bayar', 'dp', 'down payment', 'termin', 'pelunasan', 'cicil'],
        answer: () =>
          'Pembayaran fleksibel, umumnya:\n' +
          '• DP untuk mulai pengerjaan\n' +
          '• Pelunasan saat sebelum launch / setelah progress sesuai kesepakatan\n\n' +
          'Kalau butuh invoice/kwitansi juga bisa.',
        quickReplies: () => [
          { label: 'Butuh invoice?', value: 'invoice' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'invoice',
        triggers: ['invoice', 'kwitansi', 'faktur', 'pajak', 'npwp'],
        answer: () =>
          'Bisa bantuin invoice/kwitansi (format sederhana).\n' +
          'Untuk kebutuhan pajak/NPWP, tinggal info requirement kamu ya.',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'kontrak',
        triggers: ['kontrak', 'spk', 'mou', 'perjanjian', 'legal'],
        answer: () =>
          'Bisa. Kalau kamu butuh SPK/MoU/kontrak kerja, kita bisa samakan scope, timeline, dan term-nya dulu.',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'nda',
        triggers: ['nda', 'rahasia', 'confidential', 'jangan dipublikasi'],
        answer: () =>
          'Bisa bahas NDA/kerahasiaan. Alternatifnya, aku juga bisa tidak menampilkan project ke publik tanpa izin.',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'domain-hosting',
        triggers: ['domain', 'hosting', 'server', 'deploy', 'vercel', 'netlify', 'cpanel', 'shared hosting', 'ssl', 'https'],
        answer: () =>
          'Untuk domain/hosting:\n' +
          '• Bisa pakai domain kamu, atau aku bantu arahkan cara belinya.\n' +
          '• Deploy bisa ke Vercel/Netlify (umum untuk web modern) atau hosting lain sesuai kebutuhan.\n' +
          '• SSL/HTTPS biasanya bisa diaktifkan otomatis dari platform hosting.',
        quickReplies: () => [
          { label: 'Basic SEO', value: 'seo' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'seo',
        triggers: ['seo', 'google', 'search', 'meta', 'sitemap', 'robots', 'og', 'title', 'description'],
        answer: () =>
          'SEO yang biasanya termasuk (basic):\n' +
          '• Title/description + OG image\n' +
          '• Sitemap + robots\n' +
          '• Struktur heading & performa basic\n\n' +
          'Kalau butuh SEO advanced (keyword research, content plan), itu scope terpisah.',
        quickReplies: () => [
          { label: 'Analytics/Pixel', value: 'analytics' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'analytics',
        triggers: ['analytics', 'ga4', 'google analytics', 'pixel', 'facebook pixel', 'tiktok pixel', 'tracking', 'gtm', 'google tag manager'],
        answer: () =>
          'Bisa pasang tracking seperti GA4 / GTM / Pixel (FB/TikTok) kalau kamu punya akun/ID-nya.\n' +
          'Nanti kita tentukan event yang mau di-track (klik WA, submit form, checkout, dll).',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'konten',
        triggers: ['konten', 'copywriting', 'isi teks', 'materi tulisan', 'artikel', 'blog'],
        answer: () =>
          'Konten bisa dari kamu (paling cepat).\n' +
          'Kalau kamu belum punya, aku bisa bantu rapihin struktur + penulisan basic (copywriting ringan).\n' +
          'Untuk artikel/blog banyak, biasanya ada scope tambahan.',
        quickReplies: () => [
          { label: 'Company Profile', value: 'detail company profile' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'design',
        triggers: ['desain', 'ui', 'ux', 'figma', 'mockup', 'wireframe', 'layout'],
        answer: () =>
          'Bisa. Alurnya biasanya: wireframe → desain UI → implement → review.\n' +
          'Kalau kamu sudah punya desain Figma, aku bisa langsung implement ke web/app.',
        quickReplies: () => [
          { label: 'Revisi', value: 'revisi' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'responsive',
        triggers: ['responsive', 'mobile friendly', 'tampilan hp', 'tablet', 'desktop'],
        answer: () =>
          'Iya, default-nya aku buat responsive (HP/Tablet/Desktop) + layout tetap rapi.',
      },
      {
        id: 'performance',
        triggers: ['speed', 'performance', 'loading', 'cepat', 'lighthouse', 'core web vitals'],
        answer: () =>
          'Bisa dioptimasi performa (gambar, lazy load, minify, caching).\n' +
          'Target skor tergantung konten (gambar/video) dan platform hostingnya.',
      },
      {
        id: 'security',
        triggers: ['security', 'keamanan', 'xss', 'sql injection', 'rate limit', 'captcha'],
        answer: () =>
          'Untuk keamanan, minimal yang biasa dilakukan:\n' +
          '• HTTPS/SSL\n' +
          '• Validasi input + proteksi basic\n' +
          '• Kalau ada form/login: bisa tambah captcha/rate limit (opsional)',
      },
      {
        id: 'tech-stack',
        triggers: ['tech stack', 'teknologi', 'framework', 'react', 'next', 'vite', 'tailwind', 'typescript'],
        answer: () =>
          'Untuk web modern biasanya pakai React/Vite + Tailwind (seperti website ini).\n' +
          'Kalau butuh backend/database bisa disesuaikan (misal API + DB).',
        quickReplies: () => [
          { label: 'Web App', value: 'detail web app' },
          { label: 'Backend/Database', value: 'backend' },
        ],
      },
      {
        id: 'wordpress',
        triggers: ['wordpress', 'wp', 'elementor'],
        answer: () =>
          'Bisa juga kalau kamu prefer WordPress (misal company profile + mudah update konten).\n' +
          'Nanti aku sarankan pilihan terbaik sesuai kebutuhan + budget.',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'backend',
        triggers: ['backend', 'api', 'database', 'db', 'server', 'crud'],
        answer: (ctx: FaqCtx) =>
          ctx.service?.id === 'web-app' || ctx.service?.id === 'ecommerce'
            ? 'Bisa. Untuk Web App/E‑Commerce biasanya ada backend + database untuk CRUD (produk, order, user, dsb).\nSebutkan fitur utama kamu, nanti aku buatin struktur modulnya.'
            : 'Bisa. Kalau kamu butuh fitur data dinamis (login, dashboard, CRUD), itu masuk kategori Web App (Custom).',
        quickReplies: () => [
          { label: 'Web App', value: 'detail web app' },
          { label: 'Login/Roles', value: 'login' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'login',
        triggers: ['login', 'register', 'auth', 'role', 'hak akses', 'multi user', 'admin', 'user'],
        answer: () =>
          'Bisa buat login + role/hak akses (admin/staff/user).\n' +
          'Tinggal tentukan role-nya apa saja dan masing-masing boleh akses fitur apa.',
        quickReplies: () => [
          { label: 'Web App', value: 'detail web app' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'admin-panel',
        triggers: ['admin panel', 'dashboard', 'kelola konten', 'cms', 'panel admin'],
        answer: () =>
          'Bisa dibuat dashboard/admin panel untuk kelola data (konten, produk, order, user, dll).\n' +
          'Kalau cuma butuh update konten sederhana, bisa juga pakai CMS/headless CMS (opsional).',
        quickReplies: () => [
          { label: 'Backend/Database', value: 'backend' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'integrasi-wa',
        triggers: ['whatsapp', 'wa', 'chat wa', 'click to chat', 'wa api'],
        answer: () =>
          'Bisa integrasi WhatsApp:\n' +
          '• tombol “Chat WA” (klik langsung)\n' +
          '• prefilled message (pesan otomatis)\n' +
          '• WA API (kalau butuh auto-reply/CRM) itu opsional & butuh setup tambahan',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'payment-gateway',
        triggers: ['payment gateway', 'midtrans', 'xendit', 'duitku', 'qris', 'pembayaran online'],
        answer: () =>
          'Bisa integrasi payment gateway (Midtrans/Xendit/dll) kalau diperlukan.\n' +
          'Biasanya scope tergantung model bisnis (sekali bayar, subscription, invoice, dsb).',
        quickReplies: () => [
          { label: 'E‑Commerce', value: 'detail e-commerce' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'ecommerce',
        triggers: ['checkout', 'keranjang', 'cart', 'produk', 'stok', 'inventory', 'order', 'ongkir'],
        answer: () =>
          'Untuk E‑Commerce, fitur umum:\n' +
          '• katalog + detail produk\n' +
          '• keranjang + checkout\n' +
          '• pengelolaan stok/order (opsional)\n' +
          '• payment gateway + ongkir (opsional)',
        quickReplies: () => [
          { label: 'Harga E‑Commerce', value: 'harga e-commerce' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'timeline-general',
        triggers: ['berapa lama', 'lama pengerjaan', 'estimasi waktu', 'deadline', 'durasi', 'berapa hari', 'berapa minggu'],
        answer: (ctx: FaqCtx) =>
          ctx.service
            ? `Estimasi pengerjaan ${ctx.service.name}: ${ctx.service.delivery}.\nKalau ada deadline tertentu, bilang ya—nanti kita cek bisa dikejar atau perlu penyesuaian scope.`
            : `Estimasi (kasar) tergantung layanan. Ini gambaran singkat:\n\n${buildServiceList()}\n\nKalau kamu sebutkan layanan yang kamu mau, aku jawab lebih spesifik.`,
        quickReplies: (ctx: FaqCtx) =>
          ctx.service
            ? [
                { label: `Fitur ${ctx.service.name}`, value: `fitur ${ctx.service.name}` },
                { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
              ]
            : [
                { label: 'Lihat layanan', value: 'layanan' },
                { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
              ],
      },
      {
        id: 'maintenance',
        triggers: ['maintenance', 'support bulanan', 'perawatan', 'update bulanan', 'bugfix bulanan'],
        answer: () =>
          'Maintenance bisa (bulanan/on-demand). Contohnya:\n' +
          '• update konten\n' +
          '• bugfix\n' +
          '• monitoring sederhana\n' +
          '• optimasi performa ringan\n\n' +
          'SLA menyesuaikan paketnya.',
        quickReplies: () => [{ label: 'Harga maintenance', value: 'harga maintenance' }],
      },
      {
        id: 'garansi',
        triggers: ['garansi', 'bugfix', 'after sales', 'support setelah launch', 'after-sales'],
        answer: () =>
          'Setelah launch, biasanya ada masa support untuk bugfix (sesuai kesepakatan).\n' +
          'Kalau mau support jangka panjang, bisa ambil maintenance bulanan.',
        quickReplies: () => [
          { label: 'Maintenance', value: 'maintenance' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'source-code',
        triggers: ['source code', 'kode sumber', 'github', 'repo', 'akses repository'],
        answer: () =>
          'Untuk source code bisa dibahas saat deal (opsi akses repo / handover).\n' +
          'Yang penting: scope & ownership kita samakan dulu biar jelas.',
        quickReplies: () => [{ label: 'Ownership', value: 'hak milik' }],
      },
      {
        id: 'ownership',
        triggers: ['hak milik', 'milik siapa', 'ownership', 'hak cipta'],
        answer: () =>
          'Umumnya hasil project jadi milik klien setelah pembayaran selesai (sesuai kesepakatan).\n' +
          'Untuk aset pihak ketiga (font/stock) mengikuti lisensi masing-masing.',
      },
      {
        id: 'contoh',
        triggers: ['contoh web', 'contoh website', 'contoh aplikasi', 'contoh app', 'contoh project', 'demo project'],
        answer: () =>
          `Bisa. Kamu mau contoh untuk layanan yang mana?\n` +
          `Atau cek dulu portofolio: ${PortoLink}`,
        quickReplies: () => [
          { label: 'Landing Page', value: 'contoh landing page' },
          { label: 'Company Profile', value: 'contoh company profile' },
          { label: 'Web App', value: 'contoh web app' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'web-vs-app',
        triggers: ['web atau app', 'website atau aplikasi', 'lebih bagus web atau app', 'mending web atau app'],
        answer: () =>
          'Tergantung kebutuhan:\n' +
          '• Kalau butuh cepat, murah, dan mudah diakses: biasanya mulai dari Web/Landing Page.\n' +
          '• Kalau butuh fitur data + login/dashboard: Web App.\n' +
          '• Kalau butuh akses device (kamera, push notif) / pengalaman native: Mobile App.',
        quickReplies: () => [
          { label: 'Landing Page', value: 'detail landing page' },
          { label: 'Web App', value: 'detail web app' },
          { label: 'Mobile App', value: 'detail mobile app' },
        ],
      },
      {
        id: 'publish',
        triggers: ['play store', 'app store', 'publish', 'rilis', 'release', 'upload apk', 'aab'],
        answer: () =>
          'Bisa dibantu sampai build rilis (APK/AAB).\n' +
          'Untuk publish ke Play Store/App Store biasanya butuh akun developer milik kamu (berbayar) + persyaratan store.',
        quickReplies: () => [
          { label: 'Mobile App', value: 'detail mobile app' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'meeting',
        triggers: ['meeting', 'zoom', 'gmeet', 'google meet', 'call', 'konsultasi', 'diskusi'],
        answer: () =>
          'Bisa. Kita bisa diskusi via chat atau call/meet singkat biar scope-nya jelas.\n' +
          'Kalau kamu siap, klik “Konsultasi WhatsApp”.',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'refund',
        triggers: ['refund', 'pembatalan', 'cancel', 'batalkan', 'batal project', 'uang kembali'],
        answer: () =>
          'Untuk pembatalan/refund, biasanya tergantung progress pengerjaan.\n' +
          'Kita bisa bahas opsi paling fair (misal: stop di milestone tertentu).',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'rush',
        triggers: ['urgent', 'kejar deadline', 'rush', 'secepatnya', 'hari ini', 'besok'],
        answer: () =>
          'Bisa coba dikejar kalau scope-nya realistis.\n' +
          'Biasanya opsi: kurangi fitur dulu (MVP) atau tambah prioritas pengerjaan (rush).',
        quickReplies: () => [
          { label: 'Estimasi waktu', value: 'berapa lama pengerjaan?' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'biaya-domain-hosting',
        triggers: ['biaya domain', 'harga domain', 'harga hosting', 'perpanjangan domain', 'renewal domain', 'renewal hosting'],
        answer: () =>
          'Biaya domain/hosting biasanya terpisah dari biaya pembuatan.\n' +
          '• Domain: umumnya per tahun\n' +
          '• Hosting/VPS: per bulan atau per tahun\n\n' +
          'Kalau kamu sebut domain (misal .com/.id) dan kebutuhan traffic, aku bisa saranin opsi yang pas.',
        quickReplies: () => [{ label: 'Domain/Hosting', value: 'domain hosting' }],
      },
      {
        id: 'update-sendiri',
        triggers: ['bisa update sendiri', 'edit konten sendiri', 'ganti teks sendiri', 'ubah foto sendiri', 'admin konten'],
        answer: () =>
          'Bisa. Ada beberapa opsi:\n' +
          '• Update via CMS/admin panel (lebih mudah)\n' +
          '• Update via file/source (lebih fleksibel, tapi teknis)\n\n' +
          'Nanti aku sarankan opsi paling pas sesuai tipe websitenya.',
        quickReplies: () => [
          { label: 'Admin Panel', value: 'admin panel' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'training',
        triggers: ['training', 'tutorial', 'cara pakai', 'panduan', 'handover'],
        answer: () =>
          'Bisa. Setelah selesai, aku bisa handover singkat (video/screenshot/meet) untuk cara pakai admin atau alur operasional.',
      },
      {
        id: 'backup',
        triggers: ['backup', 'restore', 'cadangan', 'rollback'],
        answer: () =>
          'Bisa atur backup (tergantung hosting/DB).\n' +
          'Untuk project yang ada database, backup otomatis sangat disarankan.',
      },
      {
        id: 'migrasi',
        triggers: ['migrasi', 'pindah hosting', 'pindah domain', 'pindah web', 'transfer hosting'],
        answer: () =>
          'Bisa bantu migrasi (domain/hosting).\n' +
          'Biasanya aku cek dulu: stack, akses server, dan downtime tolerance.',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'redesign',
        triggers: ['redesign', 'revamp', 'rework', 'ubah total', 'ganti tampilan'],
        answer: () =>
          'Bisa redesign. Biasanya aku butuh:\n' +
          '• link website sekarang (kalau ada)\n' +
          '• goal redesign (lebih modern, lebih cepat, lebih banyak leads, dll)\n' +
          '• referensi style',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'integrasi',
        triggers: ['integrasi', 'api pihak ketiga', 'third party', 'webhook', 'payment', 'maps', 'google maps'],
        answer: () =>
          'Bisa integrasi dengan layanan pihak ketiga (Maps, payment, email, WA, dsb).\n' +
          'Tinggal sebutkan layanan apa yang mau diintegrasikan + tujuan integrasinya.',
        quickReplies: () => [
          { label: 'Backend/Database', value: 'backend' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'email-bisnis',
        triggers: ['email bisnis', 'email domain', 'info@', 'admin@', 'google workspace', 'gsuite'],
        answer: () =>
          'Bisa bantu setup email bisnis (misal info@domainkamu.com).\n' +
          'Biasanya pakai provider seperti Google Workspace/Zoho atau email hosting bawaan domain.',
      },
      {
        id: 'multi-bahasa',
        triggers: ['multi bahasa', 'bahasa inggris', 'english', 'translation', 'terjemah'],
        answer: () =>
          'Bisa multi-bahasa. Tinggal tentukan:\n' +
          '• bahasa yang dipakai\n' +
          '• apakah pakai URL terpisah (/en) atau toggle\n' +
          '• konten terjemahan dari kamu atau dibantu',
      },
      {
        id: 'tambah-fitur',
        triggers: ['tambah fitur', 'nambah fitur', 'upgrade', 'update fitur', 'fitur baru', 'improve'],
        answer: () =>
          'Bisa. Biasanya aku tanya dulu:\n' +
          '• fitur baru apa\n' +
          '• prioritasnya\n' +
          '• deadline\n\n' +
          'Nanti aku hitung sebagai scope tambahan (atau masuk paket maintenance kalau minor).',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'booking',
        triggers: ['booking', 'reservasi', 'appointment', 'jadwal', 'antrian'],
        answer: () =>
          'Bisa buat sistem booking/appointment (web app).\n' +
          'Contohnya: pilih jadwal, konfirmasi, notifikasi (email/WA) (opsional).',
        quickReplies: () => [
          { label: 'Web App', value: 'detail web app' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'chatbot-info',
        triggers: ['chatbot', 'auto reply', 'chat ai', 'bot ini', 'fitur bot', 'kemampuan bot'],
        answer: () =>
          'Asisten ini bisa bantu kamu dengan:\n' +
          '• Info layanan & kisaran harga\n' +
          '• Estimasi waktu pengerjaan\n' +
          '• Fitur yang didapat per layanan\n' +
          '• Alur order & data yang dibutuhkan\n' +
          '• Pertanyaan umum seputar project\n\n' +
          'Kalau butuh diskusi lebih lanjut, langsung klik "Konsultasi WhatsApp".',
        quickReplies: () => [
          { label: 'Lihat layanan', value: 'layanan' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'metode-bayar',
        triggers: ['transfer', 'qris', 'ovo', 'gopay', 'dana', 'bank'],
        answer: () =>
          'Metode pembayaran bisa disesuaikan (transfer bank/dll).\n' +
          'Untuk detailnya, paling enak via WhatsApp ya.',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'siapa',
        triggers: ['siapa kamu', 'siapa rafli', 'siapa ini', 'tentang kamu', 'about', 'profil kamu', 'portfolio kamu','lu siapa'],
        answer: () =>
          `Aku Ratro Assistant, bot milik Rafli Triofansyah — Fullstack Developer.\n` +
          `Rafli spesialis bikin web & aplikasi: landing page, company profile, e-commerce, web app, sampai mobile app.\n\n` +
          `Cek portofolio lengkap: ${PortoLink}`,
        quickReplies: () => [
          { label: 'Lihat layanan', value: 'layanan' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'pengalaman',
        triggers: ['pengalaman', 'berapa tahun', 'sudah lama', 'jam terbang', 'skill', 'keahlian', 'spesialisasi'],
        answer: () =>
          'Rafli berpengalaman di:\n' +
          '• Frontend: React, Next.js, Vite, Tailwind CSS\n' +
          '• Backend: Node.js, API REST\n' +
          '• Mobile: React Native / Flutter (MVP)\n' +
          '• Deploy: Vercel, Netlify, dan sejenisnya\n\n' +
          'Sudah handle berbagai jenis project dari landing page hingga web app custom.',
        quickReplies: () => [
          { label: 'Tech Stack', value: 'tech stack' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'remote',
        triggers: ['remote', 'freelance', 'wfh', 'online', 'kerja jarak jauh', 'bisa dari luar kota', 'bisa dari luar negeri'],
        answer: () =>
          'Iya, seratus persen remote/online.\n' +
          'Koordinasi biasanya via WhatsApp / chat + call kalau perlu diskusi lebih dalam.',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'lokasi',
        triggers: ['lokasi', 'domisili', 'kota', 'tinggal dimana', 'indonesia', 'wni'],
        answer: () =>
          'Berbasis di Indonesia, full remote — jadi bisa handle project dari mana saja.',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'testimoni',
        triggers: ['testimoni', 'review', 'ulasan', 'rating', 'feedback klien', 'penilaian', 'bintang'],
        answer: () =>
          'Kamu bisa kasih penilaian atau lihat feedback lewat form penilaian.\n' +
          'Untuk testimoni klien sebelumnya, bisa ditanya langsung via WhatsApp ya.',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'free-konsultasi',
        triggers: ['gratis', 'free', 'konsultasi gratis', 'tanya gratis', 'tidak bayar dulu', 'tanpa bayar'],
        answer: () =>
          'Konsultasi awal gratis! Ceritain kebutuhan kamu, nanti aku bantu estimasi scope, harga, dan timeline.\n' +
          'Klik "Konsultasi WhatsApp" untuk mulai.',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'kerja-tim',
        triggers: ['kerja sama tim', 'kolaborasi', 'tim kamu', 'punya tim', 'solo', 'sendirian', 'ada partner'],
        answer: () =>
          'Untuk sekarang aku handle sendiri (solo developer).\n' +
          'Kalau project besar butuh kolaborasi, bisa dibahas opsinya ya.',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'kontak-info',
        triggers: ['email', 'nomor hp', 'nomor telepon', 'kontak lain', 'sosmed', 'instagram', 'linkedin', 'github'],
        answer: () =>
          'Kontak yang bisa dihubungi:\n' +
          '• WhatsApp: paling cepat & mudah\n' +
          '• Instagram: @raflitriii_\n' +
          '• LinkedIn: Rafli Triofansyah\n' +
          '• GitHub: github.com/raflitrio',
        quickReplies: () => [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
      },
      {
        id: 'tidak-jadi',
        triggers: ['tidak jadi', 'batal saja', 'cancel saja', 'gak jadi', 'pikir pikir dulu', 'nanti dulu'],
        answer: () =>
          'Oke, santai. Kalau sudah siap atau mau tanya lagi, chat aku kapan saja ya!',
      },
      {
        id: 'terima-kasih',
        triggers: ['terima kasih', 'makasih', 'thanks', 'thank you', 'thx', 'mantap', 'oke siap', 'oke thanks'],
        answer: () =>
          'Sama-sama! Semoga bisa lanjut kerja sama. Kalau ada pertanyaan lain, tanya aja ya 😊',
        quickReplies: () => [
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
      {
        id: 'harga-terlalu-mahal',
        triggers: ['mahal', 'terlalu mahal', 'kurang budget', 'budget terbatas', 'ada yang murah', 'yang paling murah'],
        answer: () =>
          'Bisa dibahas! Biasanya ada opsi:\n' +
          '• Kurangi fitur dulu (MVP), nanti di-upgrade\n' +
          '• Cicil pembayaran sesuai progress\n' +
          '• Pilih layanan yang sesuai budget (misal: mulai dari landing page)\n\n' +
          'Ceritain kebutuhan + budget kamu, nanti aku cari solusi terbaik.',
        quickReplies: () => [
          { label: 'Landing Page', value: 'detail landing page' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
    ],
    [PortoLink],
  );

  const getBotReply = (raw: string): ChatMessage[] => {
    const t = normalizeText(raw);
    const serviceId = findServiceId(t);
    const service = serviceId ? SERVICE_CATALOG.find((s) => s.id === serviceId) ?? null : null;

    const hasAny = (words: string[]) => words.some((w) => t.includes(w));

    const isGreeting = hasAny(['halo', 'hai', 'hello', 'assalam', 'pagi', 'siang', 'sore', 'malam']);
    const askServices = hasAny(['layanan', 'jasa', 'service', 'bisa apa', 'menu']);
    const askTimeline = hasAny([
      'berapa lama',
      'lama pengerjaan',
      'estimasi waktu',
      'deadline',
      'durasi',
      'berapa hari',
      'berapa minggu',
    ]);
    const askPrice = hasAny(['harga', 'biaya', 'budget', 'kisaran', 'range']);
    const askFeatures = hasAny(['fitur', 'dapat apa', 'include', 'termasuk']);
    const askExample = hasAny(['contoh', 'demo', 'sample', 'portfolio', 'portofolio', 'referensi']);

    const serviceButtons: ChatQuickReply[] = SERVICE_CATALOG.map((s) => ({
      label: s.name,
      value: `detail ${s.name}`,
    }));

    if (isGreeting) {
      return [
        {
          id: makeId(),
          role: 'bot',
          text:
            'Halo! Mau tanya layanan apa? Kamu bisa ketik misalnya: “harga landing page”, “fitur web app”, atau “contoh company profile”.',
          quickReplies: [
            { label: 'Lihat layanan', value: 'layanan' },
            { label: 'Cek harga', value: 'harga' },
            { label: 'Contoh project', value: 'contoh' },
            { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
          ],
        },
      ];
    }

    if (askServices) {
      return [
        {
          id: makeId(),
          role: 'bot',
          text: `Layanan yang tersedia (estimasi):\n\n${buildServiceList()}`,
          quickReplies: [
            ...serviceButtons.slice(0, 3),
            { label: 'Web App (Custom)', value: 'detail web app' },
            { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
          ],
        },
      ];
    }

    if (askExample) {
      if (!service) {
        return [
          {
            id: makeId(),
            role: 'bot',
            text: 'Kamu mau contoh untuk layanan yang mana? (landing page / company profile / e-commerce / web app / mobile app)',
            quickReplies: [...serviceButtons.slice(0, 4), { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
          },
        ];
      }

      return [
        {
          id: makeId(),
          role: 'bot',
          text: buildExampleText(service),
          quickReplies: [
            { label: `Harga ${service.name}`, value: `harga ${service.name}` },
            { label: `Fitur ${service.name}`, value: `fitur ${service.name}` },
            { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
          ],
        },
      ];
    }

    if (askTimeline) {
      const ctx: FaqCtx = { service };
      const entry = FAQ_ENTRIES.find((e) => e.id === 'timeline-general');
      return [
        {
          id: makeId(),
          role: 'bot',
          text: entry ? entry.answer(ctx) : service ? `Estimasi pengerjaan ${service.name}: ${service.delivery}.` : buildServiceList(),
          quickReplies: entry?.quickReplies ? entry.quickReplies(ctx) : [{ label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
        },
      ];
    }

    if (askPrice) {
      if (!service) {
        return [
          {
            id: makeId(),
            role: 'bot',
            text:
              'Boleh. Untuk cek kisaran harga, kamu mau layanan yang mana? Kalau kamu sebutkan kebutuhan singkat (contoh: “landing page 1 produk”), aku bisa estimasi lebih tepat.',
            quickReplies: [...serviceButtons.slice(0, 4), { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
          },
        ];
      }

      return [
        {
          id: makeId(),
          role: 'bot',
          text: buildServiceDetails(service),
          quickReplies: [
            { label: `Contoh ${service.name}`, value: `contoh ${service.name}` },
            { label: 'Lihat layanan', value: 'layanan' },
            { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
          ],
        },
      ];
    }

    if (askFeatures) {
      if (!service) {
        return [
          {
            id: makeId(),
            role: 'bot',
            text: 'Fitur untuk layanan yang mana? (contoh: “fitur landing page” / “fitur web app”)',
            quickReplies: [...serviceButtons.slice(0, 4), { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' }],
          },
        ];
      }

      return [
        {
          id: makeId(),
          role: 'bot',
          text: buildServiceDetails(service),
          quickReplies: [
            { label: `Harga ${service.name}`, value: `harga ${service.name}` },
            { label: `Contoh ${service.name}`, value: `contoh ${service.name}` },
            { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
          ],
        },
      ];
    }

    // FAQ / pertanyaan umum (mapping sebanyak mungkin)
    {
      const ctx: FaqCtx = { service };

      const scoreEntry = (entry: FaqEntry) =>
        entry.triggers.reduce((acc, trigger) => {
          const trig = normalizeText(trigger);
          if (!trig) return acc;
          return wordMatch(t, trig) ? acc + 1 : acc;
        }, 0);

      let best: { entry: FaqEntry; score: number } | null = null;
      for (const entry of FAQ_ENTRIES) {
        const score = scoreEntry(entry);
        if (score <= 0) continue;
        if (!best || score > best.score) best = { entry, score };
      }

      if (best) {
        return [
          {
            id: makeId(),
            role: 'bot',
            text: best.entry.answer(ctx),
            quickReplies: best.entry.quickReplies ? best.entry.quickReplies(ctx) : undefined,
          },
        ];
      }
    }

    if (service) {
      return [
        {
          id: makeId(),
          role: 'bot',
          text: buildServiceDetails(service),
          quickReplies: [
            { label: `Harga ${service.name}`, value: `harga ${service.name}` },
            { label: `Contoh ${service.name}`, value: `contoh ${service.name}` },
            { label: 'Lihat layanan', value: 'layanan' },
          ],
        },
      ];
    }

    return [
      {
        id: makeId(),
        role: 'bot',
        text:
          'Aku belum nangkep maksudnya. Kamu bisa tanya seperti:\n- “layanan apa saja?”\n- “harga landing page”\n- “fitur web app”\n- “contoh company profile”',
        quickReplies: [
          { label: 'Lihat layanan', value: 'layanan' },
          { label: 'Cek harga', value: 'harga' },
          { label: 'Contoh project', value: 'contoh' },
          { label: 'Konsultasi WhatsApp', value: '__OPEN_WA__' },
        ],
      },
    ];
  };

  const handleSend = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || isTyping) return;

    if (trimmed === '__OPEN_WA__') {
      setChatMessages((prev) => [
        ...prev,
        { id: makeId(), role: 'user', text: 'Konsultasi WhatsApp' },
      ]);
      setIsTyping(true);
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { id: makeId(), role: 'bot', text: 'Siap, aku bukakan WhatsApp ya.' },
        ]);
        setIsTyping(false);
        openWhatsApp();
      }, 600);
      return;
    }

    const userMsg: ChatMessage = { id: makeId(), role: 'user', text: trimmed };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => {
      const botMsgs = getBotReply(trimmed);
      setChatMessages((prev) => [...prev, ...botMsgs]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-5 relative"
      style={{
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
        background: "linear-gradient(145deg, #f0f4f8 0%, #e2e8f0 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-7"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          zIndex: 0,
        }}
      ></div>

      <div className="w-full max-w-xs text-center relative z-10">
        {/* Foto + Blog Bubble */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border border-white bg-white flex-shrink-0">
            <img
              src={photo}
              alt="Rafli Triofansyah"
              className="w-full h-full object-cover"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>

          {/* Blog Bubble */}
          <a
            href={blog}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-50/90 backdrop-blur-sm
                      shadow-md border border-slate-200/60
                      rounded-2xl px-4 py-2.5
                      text-left hover:shadow-lg transition
                      max-w-[160px]"
          >
            <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wide leading-none mb-1">Blog</p>
            <p className="text-slate-600 text-xs leading-snug font-medium">
              Kunjungi blog baru saya →
            </p>
          </a>
        </div>

        {/* Nama & Profesi */}
        <h1 className="text-xl font-semibold text-gray-800">RAFLI TRIOFANSYAH</h1>
        <p className="text-gray-600 text-sm mb-7">Fullstack Developer</p>

        {/* 3 Tombol */}
        <div className="space-y-3 mb-8">
          <a
            href={PortoLink}
            className="block w-full bg-[#4CAF8E] hover:bg-[#3E9B7A] text-white py-4 px-5 rounded-xl font-medium text-base shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center"
          >
            Portofolio
          </a>
          
          <a
            href={whatsappLinkBuat}
            className="block w-full bg-[#4a6fa5] hover:bg-[#3d5a80] text-white py-4 px-5 rounded-xl font-medium text-base shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center"
          >
            Konsultasi Gratis
          </a>

          <a
            href={buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#8678a5] hover:bg-[#6d5f8c] text-white py-4 px-5 rounded-xl font-medium text-base shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center"
          >
            Template Web/App
          </a>

          <a
            href={penilaianLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#f4a261] hover:bg-[#e76f51] text-white py-4 px-5 rounded-xl font-medium text-base shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center"
          >
            Berikan Penilaian
          </a>
        </div>

        {/* Sosial Media */}
        <div className="flex justify-center gap-4">
          <a
            href="https://github.com/raflitrio"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#313647] hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/rafli-triofansyah-359031322/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#0a66c2] hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/raflitriii_/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#e1306c] hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Chat bot */}
      {/* Backdrop overlay on mobile when chat is open */}
      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 sm:hidden"
          onClick={() => setIsChatOpen(false)}
        />
      )}

      <div className={
        isChatOpen
          ? 'fixed inset-x-0 bottom-0 z-30 sm:inset-auto sm:bottom-5 sm:right-5'
          : 'fixed bottom-5 right-5 z-20'
      }>
        {!isChatOpen ? (
          <div className="flex items-end gap-3">
            {/* Info bubble */}
            <div className="mb-1 bg-white text-slate-700 text-xs rounded-2xl rounded-br-sm px-3 py-2 shadow-lg border border-slate-200 max-w-[160px] leading-snug">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="relative flex items-center justify-center">
                  {/* Glow Pulse */}
                  <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-green-400 opacity-75 animate-ping"></span>
                  
                  {/* Solid Dot */}
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                </div>
                <p className="font-semibold text-slate-800">
                  Ratro Assistant
                </p>
              </div>
              <p className="text-slate-500">
                Tanya jasa, harga, fitur & contoh project
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="w-14 h-14 rounded-full bg-slate-700 text-white shadow-xl hover:bg-slate-800 transition flex items-center justify-center flex-shrink-0"
              aria-label="Buka chat bot"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>
        ) : (
          /* Bottom sheet on mobile, floating panel on desktop */
          <div className="flex flex-col bg-white overflow-hidden border border-slate-200 shadow-2xl
            rounded-t-2xl h-[85dvh]
            sm:rounded-2xl sm:w-[360px] sm:h-[520px]">

            {/* Drag handle — mobile only */}
            <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
              <div className="w-9 h-1 rounded-full bg-slate-300" />
            </div>

            {/* Header */}
            <div className="px-4 py-3 bg-slate-700 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-left">
  
              {/* Online Indicator */}
              <div className="relative flex items-center justify-center">
                {/* Glow */}
                <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-green-400 opacity-75 animate-ping"></span>
                
                {/* Dot */}
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-200">
                  Ratro Assistant
                </p>
                <p className="text-xs text-slate-300">
                  Tanya jasa, harga, fitur, contoh
                </p>
              </div>
            </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-600 text-slate-300 transition-colors"
                aria-label="Tutup chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={chatBodyRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-white">
              {chatMessages.map((m) => (
                <div
                  key={m.id}
                  className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div
                    className={
                      m.role === 'user'
                        ? 'max-w-[85%] rounded-2xl px-3 py-2 bg-slate-900 text-white'
                        : 'max-w-[85%] rounded-2xl px-3 py-2 bg-slate-100 text-slate-900'
                    }
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-3 bg-slate-100">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="p-3 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2 max-w-full">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend(chatInput);
                }}
                placeholder="Tulis pertanyaan..."
                className="
                  flex-1
                  min-w-0
                  rounded-lg sm:rounded-xl
                  border border-slate-200
                  px-3 py-2
                  text-sm
                  focus:outline-none
                  focus:ring-2 focus:ring-slate-300
                "
              />

              <button
                type="button"
                onClick={() => handleSend(chatInput)}
                disabled={!chatInput.trim() || isTyping}
                className="
                  w-10 h-10
                  sm:w-11 sm:h-11
                  rounded-lg sm:rounded-xl
                  bg-slate-900 text-white
                  flex items-center justify-center
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:bg-slate-800 transition
                  flex-shrink-0
                "
                aria-label="Kirim"
              >
                <Send className="w-4 h-4" />
              </button>

            </div>

              {!isTyping && lastQuickReplies.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {lastQuickReplies.map((q) => (
                    <button
                      key={q.label}
                      type="button"
                      onClick={() => handleSend(q.value)}
                      className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;