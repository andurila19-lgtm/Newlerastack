// src/app/page.tsx
import React from 'react';
import Link from 'next/link';
import { dbService } from '@/lib/dbService';
import TemplateExplorer from '@/components/TemplateExplorer';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Download, RefreshCw, Star } from 'lucide-react';
import TemplateCard from '@/components/TemplateCard';
import { getDictionary } from '@/lib/dictionaries';
import { cookies } from 'next/headers';

export const revalidate = 0; // Disable cache to fetch database data dynamically

export default async function Home() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('nwl_locale')?.value as 'id' | 'en') || 'id';
  const dict = getDictionary(locale);

  const templates = await dbService.getTemplates();
  const trendingTemplates = templates.filter(t => t.isTrending).slice(0, 3);

  // FAQ Items
  const faqItems = [
    { q: dict.faq.q1, a: dict.faq.a1 },
    { q: dict.faq.q2, a: dict.faq.a2 },
    { q: dict.faq.q3, a: dict.faq.a3 },
    { q: dict.faq.q4, a: dict.faq.a4 },
    { q: dict.faq.q5, a: dict.faq.a5 }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Rian Kurniawan",
      role: "CTO, TechVanguard Studio",
      text: dict.testimonials.t1,
      rating: 5
    },
    {
      name: "Amanda Watson",
      role: "Lead Software Architect",
      text: dict.testimonials.t2,
      rating: 5
    },
    {
      name: "Fahri Hidayat",
      role: "Fullstack Freelancer",
      text: dict.testimonials.t3,
      rating: 5
    }
  ];

  return (
    <div className="w-full relative">
      
      {/* 1. Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        {/* Glow gradients behind Hero */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 h-96 w-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/15 mb-6 uppercase tracking-wider animate-pulse">
            <Sparkles className="h-3.5 w-3.5" /> {dict.hero.badge}
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-tight">
            {dict.hero.titlePart1} <span className="text-gradient-emerald">{dict.hero.titlePart2}</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-slate-400 leading-relaxed">
            {dict.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#templates"
              className="rounded-lg bg-gradient-emerald px-6 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2 group font-semibold"
            >
              {dict.hero.exploreBtn}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#pricing"
              className="rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-850"
            >
              {dict.hero.pricingBtn}
            </Link>
          </div>

          {/* Quick core features badges */}
          <div className="mt-16 pt-8 border-t border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>{dict.hero.feature1}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <Zap className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>{dict.hero.feature2}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <Download className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>{dict.hero.feature3}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <RefreshCw className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>{dict.hero.feature4}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trending Section */}
      {trendingTemplates.length > 0 && (
        <section className="py-16 border-t border-slate-900 bg-slate-950/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-3xs font-semibold tracking-wider text-emerald-400 uppercase">{dict.trending.badge}</span>
                <h2 className="text-2xl font-bold text-white mt-1">{dict.trending.title}</h2>
              </div>
              <Link href="#templates" className="text-xs font-semibold text-emerald-400 flex items-center gap-1 hover:text-emerald-300 transition-colors">
                {dict.trending.viewAll} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Main Templates Catalog Section (Interactive) */}
      <TemplateExplorer initialTemplates={templates} />

      {/* 4. Pricing Section */}
      <section id="pricing" className="py-20 border-t border-slate-900 bg-slate-950/50 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-3xs font-semibold tracking-wider text-emerald-400 uppercase">{dict.pricing.badge}</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">{dict.pricing.title}</h2>
            <p className="text-slate-400 text-sm mt-3">{dict.pricing.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Standard Single License */}
            <div className="glass-panel rounded-xl p-8 flex flex-col justify-between border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">{dict.pricing.single.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{dict.pricing.single.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-slate-500 text-sm">{dict.pricing.single.startAt}</span>
                  <span className="text-3xl font-black text-white">$29</span>
                  <span className="text-slate-500 text-xs">{dict.pricing.single.perTemplate}</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{dict.pricing.single.feature1}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{dict.pricing.single.feature2}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{dict.pricing.single.feature3}</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-500 line-through">
                    <span>{dict.pricing.single.feature4}</span>
                  </li>
                </ul>
              </div>
              <Link href="#templates" className="mt-8 block text-center rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 py-2.5 text-xs font-bold text-white transition-colors">
                {dict.pricing.single.btn}
              </Link>
            </div>

            {/* Developer Bundle - Most Popular */}
            <div className="glass-panel rounded-xl p-8 flex flex-col justify-between border-emerald-500/40 relative shadow-[0_0_30px_rgba(16,185,129,0.05)]">
              <div className="absolute -top-3 right-6 rounded-full bg-gradient-emerald px-3 py-0.5 text-3xs font-extrabold text-slate-950 uppercase tracking-wide">
                {dict.pricing.bundle.bestValue}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{dict.pricing.bundle.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{dict.pricing.bundle.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gradient-emerald">$149</span>
                  <span className="text-slate-500 text-xs">{dict.pricing.bundle.payOnce}</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{dict.pricing.bundle.feature1}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{dict.pricing.bundle.feature2}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{dict.pricing.bundle.feature3}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{dict.pricing.bundle.feature4}</span>
                  </li>
                </ul>
              </div>
              <button className="mt-8 block w-full text-center rounded-lg bg-gradient-emerald py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all font-semibold">
                {dict.pricing.bundle.btn}
              </button>
            </div>

            {/* Enterprise Agency */}
            <div className="glass-panel rounded-xl p-8 flex flex-col justify-between border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">{dict.pricing.agency.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{dict.pricing.agency.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">$299</span>
                  <span className="text-slate-500 text-xs">{dict.pricing.bundle.payOnce}</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{dict.pricing.agency.feature1}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{dict.pricing.agency.feature2}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{dict.pricing.agency.feature3}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{dict.pricing.agency.feature4}</span>
                  </li>
                </ul>
              </div>
              <button className="mt-8 block w-full text-center rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 py-2.5 text-xs font-bold text-white transition-colors">
                {dict.pricing.agency.btn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section id="faq" className="py-20 border-t border-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-3xs font-semibold tracking-wider text-emerald-400 uppercase font-bold">{dict.faq.badge}</span>
            <h2 className="text-2xl font-bold text-white mt-1">{dict.faq.title}</h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className="glass-panel rounded-lg p-5 border border-slate-800/80">
                <h3 className="text-sm font-bold text-white flex items-start gap-2">
                  <span className="text-emerald-400 font-extrabold">Q:</span>
                  {item.q}
                </h3>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed pl-5">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-20 border-t border-slate-900 bg-slate-950/40 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-3xs font-semibold tracking-wider text-emerald-400 uppercase">{dict.testimonials.badge}</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">{dict.testimonials.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, idx) => (
              <div key={idx} className="glass-panel rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-900">
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <span className="text-3xs text-slate-500">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA Banner */}
      <section className="py-20 relative overflow-hidden border-t border-slate-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative">
          <div className="glass-panel rounded-2xl p-10 md:p-12 border border-emerald-500/15 bg-slate-900/40 text-center relative overflow-hidden">
            <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-emerald-500/5 blur-[80px]" />
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {dict.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-xs md:text-sm text-slate-400 leading-relaxed">
              {dict.cta.desc}
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="#templates"
                className="rounded-lg bg-gradient-emerald px-8 py-3.5 text-sm font-bold text-slate-950 hover:bg-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 group font-semibold"
              >
                {dict.cta.btn}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
