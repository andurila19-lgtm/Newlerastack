// src/components/TemplateExplorer.tsx
'use client';

import React, { useState, useTransition } from 'react';
import TemplateCard from './TemplateCard';
import { TemplateItem, CATEGORIES } from '@/lib/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

interface TemplateExplorerProps {
  initialTemplates: TemplateItem[];
}

export default function TemplateExplorer({ initialTemplates }: TemplateExplorerProps) {
  const { dict } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  // Handle filter changes with React 19 useTransition hook
  const handleCategorySelect = (category: string) => {
    startTransition(() => {
      setSelectedCategory(category);
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    startTransition(() => {
      setSearchQuery(val);
    });
  };

  // Filter templates
  const filteredTemplates = initialTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      template.title.toLowerCase().includes(query) || 
      template.description.toLowerCase().includes(query) ||
      template.techStack.some(tech => tech.toLowerCase().includes(query)) ||
      template.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="templates" className="py-20 relative">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-0 h-80 w-80 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 h-80 w-80 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/10 mb-4 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> {dict.explorer.badge}
          </div>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white">
            {dict.explorer.title}
          </h2>
          <p className="mt-4 text-slate-400 text-sm">
            {dict.explorer.subtitle}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
          
          {/* Categories Slider */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all border ${
                  selectedCategory === category
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder={dict.explorer.searchPlaceholder}
              defaultValue={searchQuery}
              onChange={handleSearchChange}
              className="w-full glass-input rounded-lg pl-9 pr-4 py-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Templates Display Grid */}
        {isPending ? (
          // Loading Skeleton state
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-panel rounded-xl overflow-hidden h-[400px] flex flex-col p-5 space-y-4">
                <div className="skeleton-loading rounded-lg w-full aspect-video" />
                <div className="skeleton-loading rounded h-6 w-3/4" />
                <div className="skeleton-loading rounded h-4 w-full" />
                <div className="skeleton-loading rounded h-4 w-5/6" />
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-900">
                  <div className="skeleton-loading rounded h-6 w-16" />
                  <div className="skeleton-loading rounded h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="glass-panel rounded-xl p-12 text-center max-w-xl mx-auto border border-dashed border-slate-800">
            <SlidersHorizontal className="h-10 w-10 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">{dict.explorer.noResults}</h3>
            <p className="text-sm text-slate-400">
              {dict.explorer.noResultsDesc}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
