// src/components/TemplateCard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, Star, Smartphone, Laptop } from 'lucide-react';
import { TemplateItem } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface TemplateCardProps {
  template: TemplateItem;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const { user } = useAuth();
  const { dict } = useLanguage();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if bookmarked on load
  useEffect(() => {
    if (!user) return;
    
    const checkBookmark = async () => {
      try {
        const res = await fetch('/api/bookmarks');
        if (res.ok) {
          const data = await res.json();
          const exists = data.bookmarks.some((b: any) => b.id === template.id);
          setIsBookmarked(exists);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkBookmark();
  }, [user, template.id]);

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert(dict.card.loginBookmark);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id })
      });
      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(data.bookmarked);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const hasApk = template.techStack.includes('CapacitorJS') || template.category.includes('APK') || template.title.toLowerCase().includes('apk');

  return (
    <div className="glass-panel glass-panel-hover flex flex-col rounded-xl overflow-hidden group">
      {/* Screenshot Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={template.screenshots[0]}
          alt={template.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
          {template.isTrending && (
            <span className="rounded-md bg-emerald-500/90 text-slate-950 px-2 py-0.5 text-2xs font-extrabold tracking-wide uppercase shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              🔥 Trending
            </span>
          )}
          {template.isNew && (
            <span className="rounded-md bg-cyan-500/90 text-slate-950 px-2 py-0.5 text-2xs font-extrabold tracking-wide uppercase">
              ✨ New
            </span>
          )}
        </div>

        {/* Favorite Icon */}
        <button
          onClick={handleBookmarkToggle}
          disabled={loading}
          className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md border transition-all ${
            isBookmarked 
              ? 'bg-red-500/20 border-red-500/50 text-red-500 hover:bg-red-500/30' 
              : 'bg-slate-950/40 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
          }`}
        >
          <Heart className={`h-4 w-4 ${isBookmarked ? 'fill-red-500' : ''}`} />
        </button>

        {/* Floating Stack Capability Icon */}
        <div className="absolute bottom-3 right-3 flex gap-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950/80 border border-white/10 text-slate-300">
            <Laptop className="h-3.5 w-3.5" />
          </div>
          {hasApk && (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/80 border border-emerald-400/20 text-slate-950" title="Includes Android APK template">
              <Smartphone className="h-3.5 w-3.5 font-bold" />
            </div>
          )}
        </div>
      </div>

      {/* Info Container */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xs font-semibold tracking-wider text-emerald-400 uppercase">
              {template.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-white font-medium">{template.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/templates/${template.slug}`} className="block">
            <h3 className="text-base font-bold text-white hover:text-emerald-400 transition-colors line-clamp-1">
              {template.title}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {template.description}
          </p>

          {/* Tech stack badges */}
          <div className="flex flex-wrap gap-1 mt-4">
            {template.techStack.slice(0, 4).map((tech, idx) => (
              <span key={idx} className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-3xs font-medium text-slate-300">
                {tech}
              </span>
            ))}
            {template.techStack.length > 4 && (
              <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-3xs font-medium text-slate-500">
                +{template.techStack.length - 4} {dict.card.more}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-3xs text-slate-500 uppercase tracking-wider">{dict.card.licensePrice}</span>
            <span className="text-lg font-black text-white">${template.price}</span>
          </div>

          <Link
            href={`/templates/${template.slug}`}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 px-3.5 py-1.5 text-xs font-semibold hover:text-white transition-all group-hover:border-emerald-400/50"
          >
            {dict.card.details}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
