// src/app/login/page.tsx
'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

function LoginForm() {
  const { login } = useAuth();
  const { dict } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError(dict.auth.login.fillFields);
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        router.push(redirectPath);
        router.refresh();
      } else {
        setError(res.error || dict.auth.login.invalid);
      }
    } catch (err) {
      setError(dict.auth.login.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 sm:p-8 glass-panel rounded-2xl border-slate-800 shadow-2xl relative">
      <div className="absolute -top-12 -left-12 h-24 w-24 rounded-full bg-emerald-500/5 blur-[50px] pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-cyan-500/5 blur-[50px] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>
          <span className="text-xl font-bold text-white">Newlera<span className="text-emerald-400">Stack</span></span>
        </Link>
        <h2 className="text-xl font-extrabold text-white">{dict.auth.login.title}</h2>
        <p className="text-xs text-slate-400 mt-1.5">{dict.auth.login.subtitle}</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-3.5 text-xs font-medium text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{dict.auth.login.emailLabel}</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={dict.auth.login.emailPlaceholder}
              className="w-full glass-input rounded-lg pl-10 pr-4 py-2.5 text-xs text-white"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">{dict.auth.login.passwordLabel}</label>
            <a href="#" className="text-3xs font-semibold text-emerald-400 hover:text-emerald-300">{dict.auth.login.forgotPassword}</a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={dict.auth.login.passwordPlaceholder}
              className="w-full glass-input rounded-lg pl-10 pr-4 py-2.5 text-xs text-white"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 rounded-lg bg-gradient-emerald py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center gap-1.5 transition-all font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {dict.auth.login.btnLoading}
            </>
          ) : (
            <>
              {dict.auth.login.btn}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Tips */}
      <div className="mt-6 pt-4 border-t border-slate-900/60 text-center">
        <div className="inline-block rounded-lg bg-slate-950/60 border border-slate-800 p-3 text-3xs text-left max-w-full">
          <p className="font-semibold text-emerald-400 mb-1">{dict.auth.login.demoTitle}</p>
          <p className="text-slate-300">👤 Customer: <code className="text-white">demo@newlera.com</code> / <code className="text-white">demo123</code></p>
          <p className="text-slate-300">🔑 Admin: <code className="text-white">admin@newlera.com</code> / <code className="text-white">admin123</code></p>
        </div>
      </div>

      {/* Switch to Register */}
      <p className="text-center text-xs text-slate-400 mt-6">
        {dict.auth.login.noAccount}{' '}
        <Link href="/register" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
          {dict.auth.login.createAccount}
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={
        <div className="glass-panel p-8 rounded-2xl w-full max-w-md flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-xs text-slate-400 mt-4">Loading login form...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
