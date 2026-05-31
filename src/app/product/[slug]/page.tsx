// src/app/product/[slug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { dbService } from '@/lib/dbService';
import { verifyToken } from '@/lib/auth';
import { getDictionary } from '@/lib/dictionaries';
import TemplateCheckoutCard from '@/components/TemplateCheckoutCard';
import TemplateTabs from '@/components/TemplateTabs';
import ProductPreviewSimulator from '@/components/ProductPreviewSimulator';
import { ArrowLeft, Star, Folder, CheckSquare, FileCode2, BookOpen, HelpCircle } from 'lucide-react';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = await dbService.getTemplateBySlug(slug);
  const cookieStore = await cookies();
  const locale = cookieStore.get('nwl_locale')?.value || 'id';

  if (!template) {
    return {
      title: `${locale === 'id' ? 'Produk Tidak Ditemukan' : 'Product Not Found'} | Newlera Stack`,
    };
  }

  const titleSuffix = locale === 'id' ? 'Template Premium' : 'Premium Template';

  return {
    title: `${template.title} - ${titleSuffix} | Newlera Stack`,
    description: template.description,
    openGraph: {
      title: `${template.title} | Newlera Stack`,
      description: template.description,
      images: [{ url: template.screenshots[0] }],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const template = await dbService.getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  // Check purchase status if cookie is present
  let isPurchased = false;
  const cookieStore = await cookies();
  const token = cookieStore.get('nwl_auth_token')?.value;

  if (token) {
    const decoded = await verifyToken(token);
    if (decoded) {
      isPurchased = await dbService.checkUserPurchase(decoded.userId, template.id);
    }
  }

  const locale = cookieStore.get('nwl_locale')?.value || 'id';
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Back button link */}
      <Link
        href="/#templates"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-8 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        {dict.templateDetails.back}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Column: Preview Simulator, Gallery, Info, included files, and Tabs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Headline & Breadcrumbs info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3.5">
              <span className="inline-flex items-center gap-1 text-3xs font-semibold uppercase bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-emerald-400">
                <Folder className="h-3 w-3" />
                {template.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-400 pl-2 border-l border-slate-800">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-semibold">{(template.rating ?? 4.8).toFixed(1)}</span>
                <span className="text-slate-500 text-3xs">({template.salesCount ?? 0} {dict.templateDetails.sales})</span>
              </div>
            </div>
            
            <h1 className="text-2xl font-black md:text-3.5xl text-white tracking-tight">
              {template.title}
            </h1>
          </div>

          {/* Interactive Responsive Device Preview Simulator */}
          <ProductPreviewSimulator screenshots={template.screenshots} title={template.title} />

          {/* About description */}
          <div className="pt-4 border-t border-slate-900">
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              {dict.templateDetails.about}
            </h2>
            <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-normal">
              {template.description}
            </p>
          </div>

          {/* Included Files Section */}
          {template.includedFiles && template.includedFiles.length > 0 && (
            <div className="glass-panel p-5 rounded-xl border border-slate-900/50">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <FileCode2 className="h-4 w-4 text-emerald-400" />
                {locale === 'id' ? 'Berkas yang Termasuk (Included Files)' : 'Included Files'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {template.includedFiles.map((file: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckSquare className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span className="font-normal">{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documentation Info Section */}
          {template.documentationInfo && (
            <div className="glass-panel p-5 rounded-xl border border-slate-900/50">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-400" />
                {locale === 'id' ? 'Informasi Dokumentasi' : 'Documentation Info'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-normal">
                {template.documentationInfo}
              </p>
            </div>
          )}

          {/* Content Tabs (Features, Tech Stack, Changelog, Docs) */}
          <TemplateTabs template={template} />

          {/* Product Specific FAQs Section */}
          {template.productFaq && template.productFaq.length > 0 && (
            <div className="pt-8 border-t border-slate-900 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-emerald-400" />
                {locale === 'id' ? 'Pertanyaan Terkait Produk' : 'Product FAQ'}
              </h3>
              
              <div className="space-y-3">
                {template.productFaq.map((faqItem: { q: string; a: string }, idx: number) => (
                  <div key={idx} className="glass-panel rounded-xl p-4.5 border border-slate-800/80">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-start gap-2">
                      <span className="text-emerald-400">Q:</span>
                      {faqItem.q}
                    </h4>
                    <p className="text-xs text-slate-400 mt-2 pl-5 leading-relaxed font-normal">
                      {faqItem.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Checkout Pricing Card */}
        <div className="lg:col-span-1">
          <TemplateCheckoutCard template={template} initialPurchased={isPurchased} />
        </div>

      </div>
    </div>
  );
}
