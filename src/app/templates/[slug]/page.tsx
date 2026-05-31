// src/app/templates/[slug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { dbService } from '@/lib/dbService';
import { verifyToken } from '@/lib/auth';
import { getDictionary } from '@/lib/dictionaries';
import TemplateCheckoutCard from '@/components/TemplateCheckoutCard';
import TemplateTabs from '@/components/TemplateTabs';
import { ArrowLeft, Star, Tag, Folder } from 'lucide-react';
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
      title: `${locale === 'id' ? 'Template Tidak Ditemukan' : 'Template Not Found'} | Newlera Stack`,
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

export default async function TemplateDetailPage({ params }: PageProps) {
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
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        {dict.templateDetails.back}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Column: Media Gallery, Info, and Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Headline & Breadcrumbs info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3.5">
              <span className="inline-flex items-center gap-1 text-3xs font-semibold uppercase bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-emerald-400">
                <Folder className="h-3 w-3" />
                {template.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-400 pl-2">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-semibold">{template.rating.toFixed(1)}</span>
                <span className="text-slate-500 text-3xs">({template.salesCount} {dict.templateDetails.sales})</span>
              </div>
            </div>
            
            <h1 className="text-2xl font-black md:text-3xl text-white tracking-tight">
              {template.title}
            </h1>
          </div>

          {/* Main Cover Image Display */}
          <div className="aspect-video w-full rounded-xl overflow-hidden glass-panel border-slate-800 relative bg-slate-900/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={template.screenshots[0]}
              alt={template.title}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Screenshot thumbnails list */}
          {template.screenshots.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {template.screenshots.slice(1, 4).map((shot: string, index: number) => (
                <div key={index} className="aspect-video rounded-lg overflow-hidden glass-panel border-slate-850">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={shot} alt={`Screenshot ${index + 2}`} className="h-full w-full object-cover object-center" />
                </div>
              ))}
            </div>
          )}

          {/* About description */}
          <div className="pt-4">
            <h2 className="text-base font-bold text-white mb-2.5">{dict.templateDetails.about}</h2>
            <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-normal">
              {template.description}
            </p>
          </div>

          {/* Content Tabs (Features, Tech Stack, Changelog, Docs) */}
          <TemplateTabs template={template} />

        </div>

        {/* Right Column: Checkout Pricing Card */}
        <div className="lg:col-span-1">
          <TemplateCheckoutCard template={template} initialPurchased={isPurchased} />
        </div>

      </div>
    </div>
  );
}
