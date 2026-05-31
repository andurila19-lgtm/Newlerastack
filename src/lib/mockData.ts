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
  changelog: { version: string; date: string; changes: string[] }[];
  videoUrl?: string;
  liveDemoUrl?: string;
  downloadUrl: string;
  isTrending: boolean;
  isNew: boolean;
  salesCount: number;
  rating: number;
}

export const CATEGORIES = [
  "All",
  "Admin Dashboard",
  "E-Commerce",
  "CRM / POS",
  "IoT / Monitoring",
  "Company Profile",
  "Business App"
];

export const mockTemplates: TemplateItem[] = [
  {
    id: "tpl-1",
    title: "Newlera Admin Premium",
    slug: "newlera-admin-premium",
    description: "Next-generation admin dashboard template with futuristic neon UI. Features responsive grids, dark mode default, custom analytics widgets, real-time charts, state management, and user roles.",
    price: 49,
    category: "Admin Dashboard",
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
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Recharts", "Prisma"],
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
    rating: 4.9
  },
  {
    id: "tpl-2",
    title: "ApexCommerce Pro",
    slug: "apexcommerce-pro",
    description: "Lightning-fast headless e-commerce template featuring localized currency, responsive checkout, catalog filtering, and a powerful dashboard client. Fully optimized for high conversion rate.",
    price: 69,
    category: "E-Commerce",
    screenshots: [
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Fully dynamic product catalog filtering",
      "Integrated checkout layout flow with local payments simulation",
      "Responsive navigation and dynamic cart drawer",
      "Fast page load speed scoring 98+ on Lighthouse",
      "Optimized SEO tags and clean semantic markup"
    ],
    techStack: ["Next.js", "React", "Tailwind CSS", "Zustand", "PostgreSQL"],
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
    rating: 4.8
  },
  {
    id: "tpl-3",
    title: "Vortex POS Web & APK",
    slug: "vortex-pos-web-apk",
    description: "Sleek Point-of-Sale dashboard suitable for tablets and desktop. Comes with an installable APK for android tablets, receipt printer configuration, and offline support cache.",
    price: 89,
    category: "CRM / POS",
    screenshots: [
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Installable Android APK template included",
      "Offline transaction syncing using IndexedDB",
      "Thermal printer Bluetooth and USB connection driver examples",
      "Inventory tracking notifications",
      "Responsive POS cash register view grids"
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "CapacitorJS", "SQLite"],
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
    rating: 4.7
  },
  {
    id: "tpl-4",
    title: "Chronos IoT Dashboard",
    slug: "chronos-iot-dashboard",
    description: "High-performance IoT monitoring dashboard for smart homes and industrial devices. Complete with telemetry panels, dynamic gauge controllers, and notifications log. Includes installable mobile app template.",
    price: 79,
    category: "IoT / Monitoring",
    screenshots: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "WebSockets/MQTT integration configuration models",
      "Custom responsive dashboard widgets (Gauges, Lines, Alarms)",
      "High performance layouts rendering 60fps telemetry changes",
      "Android APK configuration for industrial monitoring screens",
      "Fully reactive state controls"
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "MQTT", "Recharts", "CapacitorJS"],
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
    rating: 4.9
  },
  {
    id: "tpl-5",
    title: "Helix Premium CRM",
    slug: "helix-premium-crm",
    description: "Comprehensive client management layout. Built-in funnel pipelines, drag-and-drop boards, customer details view, email integration, and automatic reports creator templates.",
    price: 59,
    category: "CRM / POS",
    screenshots: [
      "https://images.unsplash.com/photo-1552581230-c01bc0d4840d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Interactive Sales Funnel pipelines and tasks boards",
      "Detailed contact profile tabs & purchase logs",
      "CSV templates export/import controller models",
      "Weekly automated PDF report layouts",
      "Advanced user permissions dashboard UI"
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand", "Prisma"],
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
    rating: 4.6
  },
  {
    id: "tpl-6",
    title: "Zephyr Company Profile",
    slug: "zephyr-company-profile",
    description: "An elegant, premium company profile website. Packed with interactive layouts, glassmorphism hero elements, team slide controls, services section, dynamic contact forms, and premium animations.",
    price: 29,
    category: "Company Profile",
    screenshots: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Ultra premium and aesthetic glassmorphism elements",
      "Dynamic blog lists and service card grids",
      "Contact form routing with validation UI",
      "SEO semantic structures and quick load speed",
      "Highly responsive animations on scroll"
    ],
    techStack: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
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
    rating: 4.8
  }
];
