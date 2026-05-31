// src/components/ProductPreviewSimulator.tsx
'use client';

import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, Maximize2, Sparkles } from 'lucide-react';

interface ProductPreviewSimulatorProps {
  screenshots: string[];
  title: string;
}

export default function ProductPreviewSimulator({ screenshots, title }: ProductPreviewSimulatorProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Define width configurations for device simulations
  const getDeviceWidth = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-[360px] h-[580px]';
      case 'tablet':
        return 'max-w-[680px] h-[500px]';
      case 'desktop':
      default:
        return 'max-w-full h-auto aspect-video';
    }
  };

  return (
    <div className="space-y-4">
      {/* Device Viewport Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/30 p-3.5 rounded-xl border border-slate-900">
        <span className="text-3xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          Interactive Device Preview
        </span>

        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-900 rounded-lg p-0.5">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-2 rounded-md transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
            title="Desktop Mode"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-2 rounded-md transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              deviceMode === 'tablet'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
            title="Tablet Mode"
          >
            <Tablet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-2 rounded-md transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
            title="Mobile Mode"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* Simulator Viewer Frame */}
      <div className="w-full flex items-center justify-center p-6 bg-slate-950/40 rounded-2xl border border-slate-900 overflow-hidden min-h-[380px] md:min-h-[480px] transition-all">
        <div 
          className={`w-full transition-all duration-300 ease-in-out relative border overflow-y-auto hide-scrollbar rounded-xl bg-slate-900/60 shadow-[0_20px_50px_rgba(3,7,18,0.5)] border-slate-800 ${getDeviceWidth()}`}
        >
          {/* Bezel frame overlay for device modes */}
          {deviceMode !== 'desktop' && (
            <div className="absolute top-0 inset-x-0 h-4 bg-slate-950 border-b border-slate-850 flex items-center justify-center pointer-events-none z-10">
              <span className="h-1.5 w-12 rounded-full bg-slate-800" />
            </div>
          )}
          
          <div className={`${deviceMode !== 'desktop' ? 'pt-4' : ''} h-full w-full`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshots[activeImageIndex]}
              alt={`${title} Preview (${deviceMode})`}
              className={`object-cover object-top w-full h-full transition-all duration-300`}
            />
          </div>
        </div>
      </div>

      {/* Thumbnails list */}
      {screenshots.length > 1 && (
        <div className="grid grid-cols-5 gap-3 max-w-sm">
          {screenshots.map((shot: string, index: number) => (
            <button
              key={index}
              onClick={() => setActiveImageIndex(index)}
              className={`aspect-video rounded-lg overflow-hidden glass-panel border transition-all cursor-pointer ${
                activeImageIndex === index 
                  ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                  : 'border-slate-850 hover:border-slate-700'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={shot} 
                alt={`Screenshot ${index + 1}`} 
                className="h-full w-full object-cover object-center" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
