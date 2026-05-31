// src/components/TemplateExplorer.tsx
'use client';

import React, { useState, useTransition } from 'react';
import TemplateCard from './TemplateCard';
import { TemplateItem, CATEGORIES } from '@/lib/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { Search, SlidersHorizontal, Sparkles, Check, X } from 'lucide-react';

interface TemplateExplorerProps {
  initialTemplates: TemplateItem[];
}

const TECHNOLOGIES = [
  "React",
  "Next.js",
  "Laravel",
  "Flutter",
  "TypeScript",
  "TailwindCSS",
  "Supabase",
  "Firebase"
];

export default function TemplateExplorer({ initialTemplates }: TemplateExplorerProps) {
  const { dict } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    startTransition(() => {
      setSelectedCategory(category);
    });
  };

  // Handle tech toggle
  const handleTechToggle = (tech: string) => {
    startTransition(() => {
      setSelectedTechs((prev) =>
        prev.includes(tech)
          ? prev.filter((t) => t !== tech)
          : [...prev, tech]
      );
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    startTransition(() => {
      setSelectedCategory('All');
      setSelectedTechs([]);
      setSearchQuery('');
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    startTransition(() => {
      setSearchQuery(val);
    });
  };

  // Filter templates based on Category, Search Query, and selected Tech Stacks
  const filteredTemplates = initialTemplates.filter(template => {
    // 1. Category Filter
    const matchesCategory = selectedCategory === 'All' || template.category.toLowerCase() === selectedCategory.toLowerCase();

    // 2. Search Query Filter
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      template.title.toLowerCase().includes(query) || 
      template.description.toLowerCase().includes(query) ||
      template.category.toLowerCase().includes(query) ||
      template.techStack.some(tech => tech.toLowerCase().includes(query));

    // 3. Tech Stack Filter (Must match all selected technologies)
    const matchesTech = selectedTechs.length === 0 || selectedTechs.every(tech => {
      const normTech = tech.toLowerCase().replace(/[^a-z0-9]/g, '');
      return template.techStack.some(t => {
        const normT = t.toLowerCase().replace(/[^a-z0-9]/g, '');
        return normT === normTech;
      });
    });

    return matchesCategory && matchesSearch && matchesTech;
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
          <p className="mt-4 text-slate-400 text-sm font-normal">
            {dict.explorer.subtitle}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-5 mb-10">
          
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-900/30 p-4 rounded-xl border border-slate-900">
            {/* Search Box */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder={dict.explorer.searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full glass-input rounded-lg pl-10 pr-4 py-2.5 text-xs text-white"
              />
              {searchQuery && (
                <button 
                  onClick={() => handleSearchChange({ target: { value: '' } } as any)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-350"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Categories tab list (Horizontal Scrolling) */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto pb-2 lg:pb-0 scroll-smooth">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all border whitespace-nowrap cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Technology Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/20 border border-slate-900/50">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-3xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Filter Technology:</span>
              {TECHNOLOGIES.map((tech) => {
                const isSelected = selectedTechs.includes(tech);
                return (
                  <button
                    key={tech}
                    onClick={() => handleTechToggle(tech)}
                    className={`px-3 py-1.5 rounded-full text-3xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-950/20 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-emerald-400" />}
                    {tech}
                  </button>
                );
              })}
            </div>

            {/* Reset Button */}
            {(selectedCategory !== 'All' || selectedTechs.length > 0 || searchQuery !== '') && (
              <button
                onClick={handleClearFilters}
                className="text-3xs text-slate-400 hover:text-red-400 font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X className="h-3 w-3" /> Clear Filters
              </button>
            )}
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
            <p className="text-sm text-slate-400 font-normal">
              {dict.explorer.noResultsDesc}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
