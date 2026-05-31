// src/app/register/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { dict } = useLanguage();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError(dict.auth.register.fillFields);
      return;
    }

    if (password.length < 6) {
      setError(dict.auth.register.passLength);
      return;
    }

    if (password !== confirmPassword) {
      setError(dict.auth.register.passMatch);
      return;
    }

    setLoading(true);
    try {
      const res = await register(name, email, password);
      if (res.success) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(res.error || dict.auth.register.failed);
      }
    } catch (err) {
      setError(dict.auth.register.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
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
          <h2 className="text-xl font-extrabold text-white">{dict.auth.register.title}</h2>
          <p className="text-xs text-slate-400 mt-1.5">{dict.auth.register.subtitle}</p>
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
            <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{dict.auth.register.nameLabel}</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={dict.auth.register.namePlaceholder}
                className="w-full glass-input rounded-lg pl-10 pr-4 py-2.5 text-xs text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{dict.auth.register.emailLabel}</label>
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
            <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{dict.auth.register.passwordLabel}</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={dict.auth.register.passwordPlaceholder}
                className="w-full glass-input rounded-lg pl-10 pr-4 py-2.5 text-xs text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{dict.auth.register.confirmPasswordLabel}</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={dict.auth.register.confirmPasswordPlaceholder}
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
                {dict.auth.register.btnLoading}
              </>
            ) : (
              <>
                {dict.auth.register.btn}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <p className="text-center text-xs text-slate-400 mt-6">
          {dict.auth.register.hasAccount}{' '}
          <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
            {dict.auth.register.signIn}
          </Link>
        </p>
      </div>
    </div>
  );
}
