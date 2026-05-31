// src/components/TemplateTabs.tsx
'use client';

import React, { useState } from 'react';
import { Layers, Terminal, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { TemplateItem } from '@/lib/mockData';
import { useLanguage } from '@/context/LanguageContext';

interface TemplateTabsProps {
  template: TemplateItem;
}

export default function TemplateTabs({ template }: TemplateTabsProps) {
  const { dict } = useLanguage();
  const [activeTab, setActiveTab] = useState<'features' | 'tech' | 'changelog' | 'docs'>('features');

  return (
    <div className="mt-8">
      {/* Tab Switcher Headers */}
      <div className="flex border-b border-slate-900 overflow-x-auto whitespace-nowrap mb-6 scrollbar-none">
        <button
          onClick={() => setActiveTab('features')}
          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'features'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-350'
          }`}
        >
          <Layers className="h-4 w-4" />
          {dict.tabs.features}
        </button>

        <button
          onClick={() => setActiveTab('tech')}
          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'tech'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-350'
          }`}
        >
          <Terminal className="h-4 w-4" />
          {dict.tabs.tech}
        </button>

        <button
          onClick={() => setActiveTab('changelog')}
          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'changelog'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-350'
          }`}
        >
          <Clock className="h-4 w-4" />
          {dict.tabs.changelog} ({template.changelog.length})
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'docs'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-350'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          {dict.tabs.docs}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[250px]">
        {/* Panel 1: Features */}
        {activeTab === 'features' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-white mb-2">{dict.tabs.featuresTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {template.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-lg bg-slate-900/40 border border-slate-850 p-3.5">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-normal">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Panel 2: Tech Stack */}
        {activeTab === 'tech' && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-base font-bold text-white">{dict.tabs.techTitle}</h3>
            <p className="text-xs text-slate-400">
              {dict.tabs.techDesc}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {template.techStack.map((tech, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-slate-900 border border-slate-800 px-4 py-2.5 text-xs font-semibold text-white flex items-center gap-2 hover:border-emerald-500/35 transition-colors"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {tech}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Panel 3: Changelog */}
        {activeTab === 'changelog' && (
          <div className="space-y-6 animate-fadeIn">
            {template.changelog.map((log, idx) => (
              <div key={idx} className="relative pl-6 border-l border-slate-800 pb-4 last:pb-0">
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-emerald-400 border border-dark-bg" />
                <div className="flex items-baseline gap-2 mb-2">
                  <h4 className="text-sm font-bold text-white">{log.version}</h4>
                  <span className="text-3xs text-slate-500">{log.date}</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  {log.changes.map((change, cIdx) => (
                    <li key={cIdx}>{change}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Panel 4: Docs */}
        {activeTab === 'docs' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-white">{dict.tabs.docsTitle}</h3>
            <p className="text-xs text-slate-400">
              {dict.tabs.docsDesc}
            </p>
            
            <div className="rounded-lg bg-slate-950 border border-slate-900 p-4 font-mono text-3xs text-slate-300 space-y-2 select-all">
              <p className="text-slate-500"># Extract ZIP & navigate into project folder</p>
              <p>cd {template.slug}</p>
              <p className="text-slate-500"># Install packages</p>
              <p>npm install</p>
              <p className="text-slate-500"># Configure database (Prisma migrations)</p>
              <p>npx prisma db push</p>
              <p className="text-slate-500"># Run local development dev server</p>
              <p>npm run dev</p>
            </div>
            
            <p className="text-3xs text-slate-500 italic">
              {dict.tabs.docsNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
