// src/lib/mockData.ts

export interface TemplateItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  screenshots: string[];
  features: string[];
  techStack: string[];
  includedFiles?: string[];
  documentationInfo?: string;
  changelog: { version: string; date: string; changes: string[] }[];
  videoUrl?: string;
  liveDemoUrl?: string;
  downloadUrl: string;
  isTrending: boolean;
  isNew: boolean;
  salesCount: number;
  rating: number;
  badge?: 'Best Seller' | 'New' | 'Premium' | '';
  productFaq?: { q: string; a: string }[];
}

export const CATEGORIES = [
  "All",
  "Business",
  "E-Commerce",
  "Dashboard",
  "IoT",
  "POS",
  "SaaS",
  "Landing Page",
  "Mobile App",
  "Education",
  "Healthcare"
];

export const mockTemplates: TemplateItem[] = [
  {
    id: "tpl-1",
    title: "Newlera Admin Premium",
    slug: "newlera-admin-premium",
    description: "Next-generation admin dashboard template with futuristic neon UI. Features responsive grids, dark mode default, custom analytics widgets, real-time charts, state management, and user roles.",
    price: 49,
    category: "Dashboard",
    screenshots: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Futuristic emerald and slate dashboard theme",
      "Advanced analytical widgets using Recharts",
      "Comprehensive profile and user settings pages",
      "JWT Authentication preconfigured",
      "Fully responsive navigation layouts",
      "Light and dark mode custom toggle",
      "Frictionless state management"
    ],
    techStack: ["Next.js", "TypeScript", "TailwindCSS", "Recharts", "Prisma"],
    includedFiles: [
      "Next.js source code project (.ts/.tsx)",
      "TailwindCSS config & global style files",
      "Interactive Chart components using Recharts",
      "JWT Authentication route templates",
      "Prisma schema & seed configuration files"
    ],
    documentationInfo: "Fully detailed README.md file covering local node setup, package installations, Prisma database migrations, and Vercel hosting setup.",
    changelog: [
      {
        version: "v1.1.0",
        date: "2026-04-15",
        changes: ["Added real-time notification hub", "Upgraded Next.js to latest stable version", "Improved Chart load animation smooth state"]
      },
      {
        version: "v1.0.0",
        date: "2026-02-10",
        changes: ["Initial release with dashboard layouts, authentication pages, and analytics grids"]
      }
    ],
    liveDemoUrl: "https://admin-demo.newlerastack.com",
    downloadUrl: "/downloads/newlera-admin-premium-v1.1.0.zip",
    isTrending: true,
    isNew: false,
    salesCount: 142,
    rating: 4.9,
    badge: "Best Seller",
    productFaq: [
      {
        q: "Apakah dashboard ini bisa dihubungkan ke MySQL atau MongoDB?",
        a: "Ya. Berkat Prisma ORM, Anda hanya perlu mengubah variabel DATABASE_URL di .env dan parameter provider di schema.prisma ke database pilihan Anda (MySQL, SQLite, MongoDB, dll)."
      },
      {
        q: "Apakah template ini menggunakan Server Components?",
        a: "Ya, template ini sepenuhnya dibangun menggunakan paradigma React Server Components (RSC) Next.js untuk performa loading yang optimal."
      }
    ]
  },
  {
    id: "tpl-2",
    title: "ApexCommerce Pro",
    slug: "apex-commerce",
    description: "Lightning-fast headless e-commerce template featuring localized currency, responsive checkout, catalog filtering, and a powerful dashboard client. Fully optimized for high conversion rate.",
    price: 69,
    category: "E-Commerce",
    screenshots: [
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Fully dynamic product catalog filtering",
      "Integrated checkout layout flow with local payments simulation",
      "Responsive navigation and dynamic cart drawer",
      "Fast page load speed scoring 98+ on Lighthouse",
      "Optimized SEO tags and clean semantic markup"
    ],
    techStack: ["Next.js", "React", "TailwindCSS", "TypeScript", "Zustand", "PostgreSQL"],
    includedFiles: [
      "Headless storefront Next.js codebase",
      "Checkout flows & payment form components",
      "Zustand cart global state slice files",
      "Local payment gateway simulation API routes",
      "Responsive layout grids and asset files"
    ],
    documentationInfo: "Step-by-step setup guides to connect the headless catalog with modern headless CMS tools or direct relational databases, plus hosting deployment on Vercel.",
    changelog: [
      {
        version: "v1.0.2",
        date: "2026-05-01",
        changes: ["Fixed cart state persistence bug", "Optimized mobile view sidebar spacing"]
      },
      {
        version: "v1.0.0",
        date: "2026-03-22",
        changes: ["Official marketplace launch with custom store and checkout templates"]
      }
    ],
    liveDemoUrl: "https://shop-demo.newlerastack.com",
    downloadUrl: "/downloads/apexcommerce-pro-v1.0.2.zip",
    isTrending: true,
    isNew: true,
    salesCount: 98,
    rating: 4.8,
    badge: "Premium",
    productFaq: [
      {
        q: "Apakah template ini mendukung integrasi Payment Gateway Indonesia?",
        a: "Ya. Struktur API pembayaran dirancang clean agar Anda mudah mengintegrasikannya dengan Midtrans, Xendit, atau Stripe."
      },
      {
        q: "Apakah database Postgres wajib digunakan?",
        a: "Tidak, kode frontend tidak mengikat pada database tertentu. Anda dapat menghubungkannya ke REST API CMS e-commerce lainnya seperti Shopify, Strapi, atau MedusaJS."
      }
    ]
  },
  {
    id: "tpl-3",
    title: "Vortex POS Web & APK",
    slug: "vortex-pos",
    description: "Sleek Point-of-Sale dashboard suitable for tablets and desktop. Comes with an installable APK for android tablets, receipt printer configuration, and offline support cache.",
    price: 89,
    category: "POS",
    screenshots: [
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Installable Android APK template included via CapacitorJS",
      "Offline transaction syncing using IndexedDB cache layer",
      "Thermal printer Bluetooth and USB connection driver examples",
      "Real-time stock alerts and receipt generation templates",
      "Responsive POS cash register view grids designed for tablets"
    ],
    techStack: ["React", "TypeScript", "TailwindCSS", "CapacitorJS", "SQLite"],
    includedFiles: [
      "React SPA dashboard web project",
      "CapacitorJS Android config files",
      "IndexedDB offline sync service layers",
      "Thermal printer setup snippets (Bluetooth/USB)",
      "Preconfigured local SQLite template file"
    ],
    documentationInfo: "Comprehensive setup documents for building the APK using Android Studio, registering thermal Bluetooth devices, and deploying the POS system web app.",
    changelog: [
      {
        version: "v2.0.0",
        date: "2026-05-10",
        changes: ["Added Android APK build template", "Thermal printer drivers auto-detect toggle", "Upgraded design to premium dark mode glassmorphism"]
      },
      {
        version: "v1.0.0",
        date: "2026-01-18",
        changes: ["Web POS layout with quick-search items list and receipt summary card"]
      }
    ],
    liveDemoUrl: "https://pos-demo.newlerastack.com",
    downloadUrl: "/downloads/vortex-pos-v2.0.0.zip",
    isTrending: false,
    isNew: true,
    salesCount: 65,
    rating: 4.7,
    badge: "Premium",
    productFaq: [
      {
        q: "Bagaimana cara melakukan build APK untuk dicoba di Android Tablet?",
        a: "Dokumentasi kami menyertakan petunjuk command line: jalankan 'npm run build', ikuti dengan 'npx cap sync android', lalu buka folder 'android' di Android Studio untuk melakukan compile ke berkas APK."
      },
      {
        q: "Apakah printer thermal harus tipe tertentu?",
        a: "Driver printer kami menggunakan standar ESC/POS yang kompatibel dengan 95% printer thermal Bluetooth & USB di pasaran."
      }
    ]
  },
  {
    id: "tpl-4",
    title: "Chronos IoT Dashboard",
    slug: "chronos-iot",
    description: "High-performance IoT monitoring dashboard for smart homes and industrial devices. Complete with telemetry panels, dynamic gauge controllers, and notifications log. Includes installable mobile app template.",
    price: 79,
    category: "IoT",
    screenshots: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "WebSockets/MQTT integration configuration models",
      "Custom responsive dashboard widgets (Gauges, Lines, Alarms)",
      "High performance layouts rendering 60fps telemetry changes",
      "Android APK configuration for industrial monitoring screens",
      "Fully reactive state controls and thresholds manager"
    ],
    techStack: ["Next.js", "TypeScript", "TailwindCSS", "MQTT", "Recharts", "CapacitorJS"],
    includedFiles: [
      "Next.js telemetry dashboard source files",
      "Capacitor mobile build files & android assets",
      "MQTT Websocket client helper modules",
      "Recharts gauge widgets custom implementations",
      "Alert notification routing configs"
    ],
    documentationInfo: "Detailed guide for establishing connection to popular MQTT brokers (HiveMQ, Mosquitto, EMQX), subscribing to telemetry channels, and building APKs.",
    changelog: [
      {
        version: "v1.0.0",
        date: "2026-04-30",
        changes: ["First launch featuring gauge metrics, WebSockets endpoints documentation, and APK starter files"]
      }
    ],
    liveDemoUrl: "https://iot-demo.newlerastack.com",
    downloadUrl: "/downloads/chronos-iot-v1.0.0.zip",
    isTrending: true,
    isNew: true,
    salesCount: 84,
    rating: 4.9,
    badge: "New",
    productFaq: [
      {
        q: "Apakah dashboard ini bisa memantau ribuan sensor sekaligus?",
        a: "Ya, arsitektur data dashboard kami dioptimalkan dengan throttle state update untuk rendering performa tinggi (60fps) tanpa membebani browser client."
      },
      {
        q: "Bagaimana cara melakukan tes simulasi data telemetri?",
        a: "Kami menyertakan file script node simulator ('npm run mock-iot') yang otomatis mengirimkan data sensor tiruan (suhu, kelembapan) ke MQTT broker publik untuk pengetesan awal."
      }
    ]
  },
  {
    id: "tpl-5",
    title: "Helix Premium CRM",
    slug: "helix-crm",
    description: "Comprehensive client management layout. Built-in funnel pipelines, drag-and-drop boards, customer details view, email integration, and automatic reports creator templates.",
    price: 59,
    category: "SaaS",
    screenshots: [
      "https://images.unsplash.com/photo-1552581230-c01bc0d4840d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Interactive Sales Funnel pipelines and tasks boards",
      "Detailed contact profile tabs & purchase logs",
      "CSV templates export/import controller models",
      "Weekly automated PDF report layouts",
      "Advanced user permissions dashboard UI"
    ],
    techStack: ["Next.js", "TypeScript", "TailwindCSS", "Zustand", "Prisma"],
    includedFiles: [
      "Next.js full projects with Kanban board view",
      "CRM customer database schema for PostgreSQL",
      "Zustand drag-and-drop state controllers",
      "Automated CSV/PDF exports utilities modules",
      "User role middleware filters layouts"
    ],
    documentationInfo: "Instruction guidelines on deploying to Node production environments, setting up PostgreSQL schemas, and configuring dynamic SMTP email templates.",
    changelog: [
      {
        version: "v1.0.5",
        date: "2026-05-18",
        changes: ["Performance optimization for large user list rendering", "Improved drag-and-drop animations"]
      },
      {
        version: "v1.0.0",
        date: "2026-02-28",
        changes: ["Launch of core CRM dashboard with client management features"]
      }
    ],
    liveDemoUrl: "https://crm-demo.newlerastack.com",
    downloadUrl: "/downloads/helix-crm-v1.0.5.zip",
    isTrending: false,
    isNew: false,
    salesCount: 110,
    rating: 4.6,
    badge: "Best Seller",
    productFaq: [
      {
        q: "Apakah fitur drag-and-drop Kanban Board responsif untuk perangkat mobile?",
        a: "Ya, Kanban Board kami mendukung gestur touch untuk swipe, drag, dan drop di Android, iOS, tablet, maupun layar desktop."
      },
      {
        q: "Bagaimana cara kerja autentikasi hak akses (roles)?",
        a: "Terdapat middleware Next.js bawaan yang melakukan verifikasi apakah sesi pengguna masuk sebagai Administrator, Sales Agent, atau Client."
      }
    ]
  },
  {
    id: "tpl-6",
    title: "Zephyr Company Profile",
    slug: "zephyr-profile",
    description: "An elegant, premium company profile website. Packed with interactive layouts, glassmorphism hero elements, team slide controls, services section, dynamic contact forms, and premium animations.",
    price: 29,
    category: "Landing Page",
    screenshots: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Ultra premium and aesthetic glassmorphism elements",
      "Dynamic blog lists and service card grids",
      "Contact form routing with validation UI",
      "SEO semantic structures and quick load speed",
      "Highly responsive animations on scroll"
    ],
    techStack: ["React", "TypeScript", "TailwindCSS", "Framer Motion"],
    includedFiles: [
      "React static profile files containing landing page",
      "Framer Motion custom transitions & entrance loaders",
      "Dynamic contact forms submission validators",
      "Metadata and optimized images configurations",
      "Complete global CSS utility classes"
    ],
    documentationInfo: "Quick-start guide containing configuration instructions, how to edit services list and team members, and guide to deploy to Vercel/Netlify in 1 click.",
    changelog: [
      {
        version: "v1.0.0",
        date: "2026-03-10",
        changes: ["Initial release containing landing profile, blog template, and contact forms"]
      }
    ],
    liveDemoUrl: "https://company-demo.newlerastack.com",
    downloadUrl: "/downloads/zephyr-profile-v1.0.0.zip",
    isTrending: false,
    isNew: false,
    salesCount: 153,
    rating: 4.8,
    badge: "",
    productFaq: [
      {
        q: "Apakah template ini mendukung Multi-bahasa (i18n)?",
        a: "Ya. Struktur template kami sudah dikonfigurasi untuk memudahkan pelokalan bahasa langsung melalui berkas JSON kamus terpusat."
      },
      {
        q: "Apakah animasi Framer Motion berjalan lancar di browser seluler lama?",
        a: "Ya. Seluruh animasi dideklarasikan secara efisien agar tetap berjalan lancar tanpa frame drop di perangkat mobile berspesifikasi menengah."
      }
    ]
  },
  {
    id: "tpl-7",
    title: "Swift Mobile App Starter",
    slug: "swift-mobile",
    description: "Highly polished Flutter mobile application template integrated with Firebase Authentication, state management, and modern glassmorphic dashboard views. Ideal for SaaS companion apps.",
    price: 39,
    category: "Mobile App",
    screenshots: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Premium glassmorphic mobile UI dashboard layouts",
      "Firebase Auth (Email, Google sign-in) pre-integrated",
      "Clean architecture with BLoC state management",
      "Dark and light theme support out of the box",
      "Push notification integration templates"
    ],
    techStack: ["Flutter", "Dart", "Firebase", "BLoC"],
    includedFiles: [
      "Flutter source code project structure",
      "Firebase security rules templates",
      "Custom UI kits, buttons, and input components",
      "Assets files and pre-scaled app icons templates"
    ],
    documentationInfo: "Comprehensive guides to link your Firebase project console, configure google-services.json / GoogleService-Info.plist, and compile to APK/IPA.",
    changelog: [
      {
        version: "v1.0.0",
        date: "2026-05-12",
        changes: ["Initial release with Firebase authentication templates, dark theme configurations, and custom BLoC files"]
      }
    ],
    liveDemoUrl: "https://mobile-demo.newlerastack.com",
    downloadUrl: "/downloads/swift-mobile-v1.0.0.zip",
    isTrending: false,
    isNew: true,
    salesCount: 42,
    rating: 4.8,
    badge: "New",
    productFaq: [
      {
        q: "Apakah template ini bisa di-compile untuk iOS dan Android?",
        a: "Tentu saja. Flutter memungkinkan satu basis kode untuk di-compile ke Android (.apk) dan iOS (.ipa) dengan visual UI yang identik."
      },
      {
        q: "Apakah status Firebase gratis?",
        a: "Ya, Firebase menyediakan Free Tier (Spark Plan) yang sangat melimpah, sangat cukup untuk masa pengembangan dan uji coba awal."
      }
    ]
  },
  {
    id: "tpl-8",
    title: "Newlera Business Suite",
    slug: "newlera-business",
    description: "Premium enterprise management platform layout. Contains invoice generators, customer portals, employee tracking grids, dynamic database schemas, and finance reports templates.",
    price: 99,
    category: "Business",
    screenshots: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Modern Business Administration control center layout",
      "Dynamic invoice generator with automatic PDF layouts",
      "Client management portals with secure authentication layers",
      "Relational database architecture built with Prisma schema",
      "Interactive data charts depicting corporate cashflows"
    ],
    techStack: ["Next.js", "TypeScript", "TailwindCSS", "Supabase", "Prisma"],
    includedFiles: [
      "Enterprise suite web application files",
      "Prisma DB schema files pre-linked to Supabase PostgreSQL",
      "Dynamic PDF invoice render helpers modules",
      "Sleek SVG icons package and CSS stylings"
    ],
    documentationInfo: "Complete guides on setting up Supabase project, database tables migrations using Prisma ORM CLI, and deploying variables config to Vercel.",
    changelog: [
      {
        version: "v1.0.0",
        date: "2026-05-20",
        changes: ["Initial release with corporate controls, database integrations, invoice generation, and customer profile tables"]
      }
    ],
    liveDemoUrl: "https://business-demo.newlerastack.com",
    downloadUrl: "/downloads/newlera-business-v1.0.0.zip",
    isTrending: true,
    isNew: false,
    salesCount: 31,
    rating: 4.9,
    badge: "Premium",
    productFaq: [
      {
        q: "Apakah template ini aman untuk mengolah data keuangan perusahaan?",
        a: "Ya. Seluruh data transaksi diolah secara aman dan terenkripsi menggunakan modul middleware otentikasi serta role access control (RLS) bawaan Supabase."
      },
      {
        q: "Bagaimana cara kerja fitur Invoice Generator?",
        a: "Generator invoice kami berjalan di sisi client/server, otomatis mengubah tabel data HTML transaksi menjadi format berkas PDF berkualitas tinggi yang siap dicetak."
      }
    ]
  },
  {
    id: "tpl-9",
    title: "EduLearn SaaS Portal",
    slug: "edulearn-portal",
    description: "Premium learning management system template. Includes online course galleries, virtual classroom dashboard layouts, assignments tracker grids, student database models, and quiz controllers.",
    price: 49,
    category: "Education",
    screenshots: [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Comprehensive digital classroom dashboard UI layouts",
      "Interactive course explorer with filter tabs",
      "Student study progress tracking dashboards",
      "Quizzes and exam result tables designs",
      "Highly customizable courses management grids"
    ],
    techStack: ["Laravel", "React", "TypeScript", "TailwindCSS", "MySQL"],
    includedFiles: [
      "Laravel backend directory with controllers & models",
      "React client application pages (.tsx)",
      "Database schema and SQL migrations scripts",
      "Custom components styling files and UI assets"
    ],
    documentationInfo: "Step-by-step documentation detailing Laravel composer setup, database tables migrations, React build configurations, and hosting deployments.",
    changelog: [
      {
        version: "v1.0.0",
        date: "2026-04-10",
        changes: ["Initial release with student portal, teacher dashboards, course listings, and custom database migrations"]
      }
    ],
    liveDemoUrl: "https://education-demo.newlerastack.com",
    downloadUrl: "/downloads/edulearn-portal-v1.0.0.zip",
    isTrending: false,
    isNew: false,
    salesCount: 77,
    rating: 4.7,
    badge: "",
    productFaq: [
      {
        q: "Apakah template ini menggunakan Laravel Inertia?",
        a: "Ya, template ini dikonfigurasi menggunakan Laravel Inertia.js untuk menghubungkan backend Laravel dengan frontend React/TypeScript secara seamless."
      },
      {
        q: "Apakah modul pemutaran video pembelajaran sudah dioptimalkan?",
        a: "Ya. Pemutar video dirancang kustom dengan layout responsif yang mendukung integrasi direct link mp4, YouTube, Vimeo, maupun HLS streaming."
      }
    ]
  },
  {
    id: "tpl-10",
    title: "MedCare Health Dashboard",
    slug: "medcare-dashboard",
    description: "Futuristic medical administration and electronic health records dashboard template. Features patient check-in flows, telemetry monitor panels, appointments calendars, and billing layouts.",
    price: 59,
    category: "Healthcare",
    screenshots: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584515901387-a7f18e26524b?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Sleek and clean UI suitable for clinical administration",
      "Electronic Health Records (EHR) database tables templates",
      "Interactive appointments booking calendars",
      "Real-time health telemetry monitor panels widgets",
      "Prescription generator and medical invoice layouts"
    ],
    techStack: ["Next.js", "TypeScript", "TailwindCSS", "Supabase", "Recharts"],
    includedFiles: [
      "Next.js patient dashboard source files",
      "Patient records schema pre-linked to Supabase database",
      "Appointment scheduler calendar components",
      "Interactive charts for clinical diagnostics",
      "TailwindCSS utilities configuration"
    ],
    documentationInfo: "Guide to database deployment on Supabase dashboard, importing patient tables schemas, setting up security policies (RLS), and deploying application on Vercel.",
    changelog: [
      {
        version: "v1.0.0",
        date: "2026-05-15",
        changes: ["Initial release featuring hospital dashboard, patient data tables, scheduler calendar, and Supabase config files"]
      }
    ],
    liveDemoUrl: "https://healthcare-demo.newlerastack.com",
    downloadUrl: "/downloads/medcare-dashboard-v1.0.0.zip",
    isTrending: false,
    isNew: false,
    salesCount: 23,
    rating: 4.8,
    badge: "",
    productFaq: [
      {
        q: "Apakah template ini mematuhi standar privasi data medis?",
        a: "Kami merancang database schema ini siap-integrasi dengan standard privasi data pasien. Namun, kepatuhan HIPAA/GDPR penuh tetap bergantung pada server hosting produksi yang Anda gunakan."
      },
      {
        q: "Apakah appointment scheduler terintegrasi dengan Google Calendar?",
        a: "Kami menyediakan helper module javascript dan layout form yang siap dihubungkan dengan Google Calendar API menggunakan token OAuth."
      }
    ]
  }
];
