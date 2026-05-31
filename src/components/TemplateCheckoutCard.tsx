// src/components/TemplateCheckoutCard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { CreditCard, Download, ShieldCheck, ExternalLink, Sparkles, CheckCircle2, Loader2, Key } from 'lucide-react';
import { TemplateItem } from '@/lib/mockData';

interface TemplateCheckoutCardProps {
  template: TemplateItem;
  initialPurchased: boolean;
}

export default function TemplateCheckoutCard({ template, initialPurchased }: TemplateCheckoutCardProps) {
  const { user } = useAuth();
  const { dict } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [purchased, setPurchased] = useState(initialPurchased);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'processing' | 'success'>('details');
  const [licenseKey, setLicenseKey] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  const hasApk = template.techStack.includes('CapacitorJS') || template.category.includes('APK') || template.title.toLowerCase().includes('apk') || template.techStack.includes('Flutter');

  const handleBuyClick = () => {
    if (!user) {
      router.push(`/login?redirect=/product/${template.slug}`);
      return;
    }
    setCheckoutStep('details');
    setCheckoutError('');
    setIsCheckoutOpen(true);
  };

  useEffect(() => {
    const triggerCheckout = searchParams.get('checkout');
    if (triggerCheckout === 'true' && !purchased) {
      handleBuyClick();
      // Clean query parameter from address bar
      const url = new URL(window.location.href);
      url.searchParams.delete('checkout');
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  }, [searchParams, purchased, user]);

  const handleSimulatePayment = async () => {
    setCheckoutStep('processing');
    setCheckoutError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setLicenseKey(data.purchase.licenseKey);
        setPurchased(true);
        setCheckoutStep('success');
        router.refresh();
      } else {
        setCheckoutError(data.error || 'Payment simulation failed');
        setCheckoutStep('details');
      }
    } catch (err) {
      setCheckoutError('Network error occurred during checkout');
      setCheckoutStep('details');
    }
  };

  return (
    <>
      <div className="glass-panel rounded-xl p-6 border-slate-800 sticky top-24">
        {/* Price Tag */}
        <div className="mb-6">
          <span className="text-3xs text-slate-500 uppercase tracking-wider block">{dict.templateDetails.checkout.oneTime}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-black text-white">${template.price}</span>
            <span className="text-slate-400 text-xs">USD</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {purchased ? (
            <>
              {/* Download ZIP */}
              <a
                href={template.downloadUrl}
                download
                className="w-full rounded-lg bg-gradient-emerald py-3 text-xs font-bold text-slate-950 hover:bg-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center gap-2 transition-all font-semibold"
              >
                <Download className="h-4.5 w-4.5" />
                {dict.templateDetails.checkout.downloadZip}
              </a>

              {/* Download APK (if available) */}
              {hasApk && (
                <a
                  href="/downloads/mock-application.apk"
                  download
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 py-3 text-xs font-semibold text-emerald-400 hover:text-white hover:border-slate-700 flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="h-4.5 w-4.5 text-emerald-400" />
                  {dict.templateDetails.checkout.downloadApk}
                </a>
              )}
            </>
          ) : (
            <button
              onClick={handleBuyClick}
              className="w-full rounded-lg bg-gradient-emerald py-3 text-xs font-bold text-slate-950 hover:bg-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center gap-2 transition-all font-semibold"
            >
              <CreditCard className="h-4.5 w-4.5" />
              {dict.templateDetails.checkout.buy}
            </button>
          )}

          {/* Live Demo Link */}
          {template.liveDemoUrl && (
            <a
              href={template.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 py-3 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all"
            >
              {dict.templateDetails.checkout.liveDemo}
              <ExternalLink className="h-4 w-4 text-slate-500" />
            </a>
          )}
        </div>

        {/* Security badges */}
        <div className="mt-6 pt-4 border-t border-slate-900/80 space-y-2">
          <div className="flex items-center gap-2 text-3xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>{dict.templateDetails.checkout.secureCheckout}</span>
          </div>
          <div className="flex items-center gap-2 text-3xs text-slate-400">
            <Key className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>{dict.templateDetails.checkout.instantDelivery}</span>
          </div>
        </div>

        {/* License Box (If purchased) */}
        {purchased && (
          <div className="mt-5 rounded-lg bg-slate-950/60 border border-slate-800 p-3">
            <div className="text-3xs text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>{dict.templateDetails.checkout.licenseKeyLabel}</span>
              <span className="text-emerald-400 font-bold">{dict.templateDetails.checkout.active}</span>
            </div>
            <code className="text-xs font-mono text-white block select-all break-all bg-slate-900 border border-slate-850 p-1.5 rounded text-center">
              {licenseKey || 'NWL-DEMO-VALID-KEY-9801'}
            </code>
          </div>
        )}
      </div>

      {/* 8. Simulative Checkout Modal Overlay */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 sm:p-8 glass-panel rounded-2xl border-slate-800 shadow-2xl relative">
            
            {/* Close button (only shown if not processing) */}
            {checkoutStep !== 'processing' && (
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}

            {/* Error state */}
            {checkoutError && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs font-semibold text-red-400">
                {checkoutError}
              </div>
            )}

            {/* STEP 1: Details and simulation checkout */}
            {checkoutStep === 'details' && (
              <div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                  {dict.templateDetails.checkout.title}
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  {dict.templateDetails.checkout.desc}
                </p>

                {/* Summary Box */}
                <div className="rounded-lg bg-slate-950/70 border border-slate-900 p-4 mb-6">
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>{dict.templateDetails.checkout.licenseType}</span>
                    <span className="text-white font-medium">{dict.templateDetails.checkout.singleDev}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mb-4 pb-2.5 border-b border-slate-900">
                    <span>{dict.templateDetails.checkout.templateLabel}</span>
                    <span className="text-white font-medium truncate max-w-[200px]">{template.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white font-bold">{dict.templateDetails.checkout.totalPrice}</span>
                    <span className="text-emerald-400 font-extrabold">${template.price}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3.5 text-3xs text-emerald-300 mb-6 leading-relaxed">
                  💡 <strong>{dict.templateDetails.checkout.simulatorMode}</strong> {dict.templateDetails.checkout.simulatorDesc}
                </div>

                <button
                  onClick={handleSimulatePayment}
                  className="w-full rounded-lg bg-gradient-emerald py-3 text-xs font-bold text-slate-950 hover:bg-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center gap-1.5 font-semibold"
                >
                  {dict.templateDetails.checkout.simulateBtn}
                </button>
              </div>
            )}

            {/* STEP 2: Processing state */}
            {checkoutStep === 'processing' && (
              <div className="py-8 text-center flex flex-col items-center">
                <Loader2 className="h-10 w-10 text-emerald-400 animate-spin mb-4" />
                <h3 className="text-base font-bold text-white mb-2">{dict.templateDetails.checkout.processing}</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  {dict.templateDetails.checkout.processingDesc}
                </p>
              </div>
            )}

            {/* STEP 3: Success state */}
            {checkoutStep === 'success' && (
              <div className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{dict.templateDetails.checkout.purchased}</h3>
                <p className="text-xs text-slate-400 mb-6">
                  {dict.templateDetails.checkout.successDesc}
                </p>

                {/* Generated key */}
                <div className="rounded-lg bg-slate-950/70 border border-slate-900 p-4 mb-6">
                  <span className="text-3xs text-slate-500 uppercase block mb-1">{dict.templateDetails.checkout.uniqueLicenseKey}</span>
                  <code className="text-xs font-mono text-emerald-400 font-bold block select-all break-all">
                    {licenseKey}
                  </code>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={template.downloadUrl}
                    download
                    className="flex-1 rounded-lg bg-gradient-emerald py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-300 text-center font-semibold"
                  >
                    {dict.templateDetails.checkout.downloadZipShort}
                  </a>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="flex-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 py-2.5 text-xs font-semibold text-white"
                  >
                    {dict.templateDetails.checkout.goDashboard}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
