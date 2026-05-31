'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, Layers, Info, BookOpen, MessageSquare, Shield, FileText, Scale } from 'lucide-react';

export default function Footer() {
  const { locale, dict } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 py-16 relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Logo & Description (About Newlera Stack) */}
          <div className="space-y-4 col-span-1 sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Newlera<span className="text-emerald-400">Stack</span>
              </span>
            </Link>
            <h4 className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
              {locale === 'id' ? 'Tentang Newlera Stack' : 'About Newlera Stack'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {dict.footer.desc}
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">
                <Layers className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Links: Products */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              {dict.footer.links1}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#templates" className="text-xs text-slate-400 hover:text-emerald-400 transition-all font-normal">
                  {dict.footer.l1_1}
                </Link>
              </li>
              <li>
                <Link href="/#templates" className="text-xs text-slate-400 hover:text-emerald-400 transition-all font-normal">
                  {dict.footer.l1_2}
                </Link>
              </li>
              <li>
                <Link href="/#templates" className="text-xs text-slate-400 hover:text-emerald-400 transition-all font-normal">
                  {dict.footer.l1_3}
                </Link>
              </li>
              <li>
                <Link href="/#templates" className="text-xs text-slate-400 hover:text-emerald-400 transition-all font-normal">
                  {dict.footer.l1_4}
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Resources */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              {locale === 'id' ? 'Sumber Daya' : 'Resources'}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#templates" className="text-xs text-slate-400 hover:text-emerald-400 transition-all flex items-center gap-1.5 font-normal">
                  <BookOpen className="h-3.5 w-3.5 text-slate-600" />
                  {locale === 'id' ? 'Dokumentasi' : 'Documentation'}
                </a>
              </li>
              <li>
                <a href="#faq" className="text-xs text-slate-400 hover:text-emerald-400 transition-all flex items-center gap-1.5 font-normal">
                  <MessageSquare className="h-3.5 w-3.5 text-slate-600" />
                  {locale === 'id' ? 'Hubungi Kami' : 'Contact Support'}
                </a>
              </li>
              <li>
                <a href="#faq" className="text-xs text-slate-400 hover:text-emerald-400 transition-all flex items-center gap-1.5 font-normal">
                  <Info className="h-3.5 w-3.5 text-slate-600" />
                  FAQ Help Desk
                </a>
              </li>
            </ul>
          </div>

          {/* Links: Legal */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              Legal
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-xs text-slate-400 hover:text-emerald-400 transition-all flex items-center gap-1.5 font-normal">
                  <Shield className="h-3.5 w-3.5 text-slate-600" />
                  {locale === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'}
                </a>
              </li>
              <li>
                <a href="#" className="text-xs text-slate-400 hover:text-emerald-400 transition-all flex items-center gap-1.5 font-normal">
                  <FileText className="h-3.5 w-3.5 text-slate-600" />
                  {locale === 'id' ? 'Ketentuan Layanan' : 'Terms of Service'}
                </a>
              </li>
              <li>
                <a href="#" className="text-xs text-slate-400 hover:text-emerald-400 transition-all flex items-center gap-1.5 font-normal">
                  <Scale className="h-3.5 w-3.5 text-slate-600" />
                  {locale === 'id' ? 'Perjanjian Lisensi' : 'License Agreement'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-slate-500 text-center md:text-left font-normal">
            &copy; {currentYear} {dict.footer.copyright}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-xs text-slate-600 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              {dict.footer.status}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
