// src/app/layout.tsx
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import { cookies } from 'next/headers';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Newlera Stack - Premium Website Templates & Installable APKs',
  description: 'Buy premium website templates and installable android APKs. High-performance admin dashboards, online shops, CRM, POS, IoT panels, and business apps.',
  keywords: 'Next.js template, admin dashboard, e-commerce, CRM, POS, IoT monitoring, business APKs, React dashboard',
  authors: [{ name: 'Newlera Stack Team' }],
  metadataBase: new URL('https://newlerastack.com'),
  openGraph: {
    title: 'Newlera Stack - Premium Website Templates & APKs',
    description: 'High-performance admin dashboards, online shops, CRM, POS, IoT panels, and business apps ready to install.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Newlera Stack',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLocale = (cookieStore.get('nwl_locale')?.value as 'id' | 'en') || 'id';

  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-dark-bg text-slate-100 bg-grid-cyber font-sans">
        <LanguageProvider initialLocale={initialLocale}>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 w-full relative">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
