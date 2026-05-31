// src/components/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, X, LayoutDashboard, Settings, LogOut, Shield, Bookmark, Sparkles, Globe } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { locale, setLocale, dict } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 group-hover:border-emerald-400 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all">
                <Sparkles className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Newlera<span className="text-emerald-400 font-extrabold">Stack</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/#templates"
              className={`text-sm font-medium transition-colors hover:text-emerald-400 ${
                isActive('/#templates') ? 'text-emerald-400' : 'text-slate-300'
              }`}
            >
              {dict.nav.templates}
            </Link>
            <Link
              href="/#pricing"
              className={`text-sm font-medium transition-colors hover:text-emerald-400 ${
                isActive('/#pricing') ? 'text-emerald-400' : 'text-slate-300'
              }`}
            >
              {dict.nav.pricing}
            </Link>
            <Link
              href="/#faq"
              className={`text-sm font-medium transition-colors hover:text-emerald-400 ${
                isActive('/#faq') ? 'text-emerald-400' : 'text-slate-300'
              }`}
            >
              {dict.nav.faq}
            </Link>

            {user && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Bookmark className="h-4 w-4" /> {dict.nav.bookmarks}
              </Link>
            )}
          </div>

          {/* User Section (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 mr-2">
              <button 
                onClick={() => setLocale('id')} 
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${locale === 'id' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                ID
              </button>
              <button 
                onClick={() => setLocale('en')} 
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${locale === 'en' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                EN
              </button>
            </div>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-white">{user.name}</span>
                  <span className="text-xs text-slate-400 capitalize">{user.role.toLowerCase()}</span>
                </div>

                <div 
                  className="relative"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    onMouseEnter={() => setProfileDropdownOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-white font-medium hover:border-emerald-500/50 transition-colors"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </button>

                  {/* Dropdown Menu */}
                  <div className={`absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-slate-900 border border-slate-800 p-1 shadow-2xl transition-all duration-200 ${
                    profileDropdownOpen 
                      ? 'opacity-100 scale-100 pointer-events-auto' 
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}>
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
                      >
                        <Shield className="h-4 w-4 text-emerald-400" />
                        {dict.nav.adminPanel}
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-emerald-400" />
                      {dict.nav.userDashboard}
                    </Link>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      {dict.nav.signOut}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {dict.nav.logIn}
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-gradient-emerald px-4 py-1.5 text-sm font-medium text-slate-950 hover:bg-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all font-semibold"
                >
                  {dict.nav.getStarted}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-850 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-900 bg-slate-950/95 py-4 px-4 space-y-3">
          <Link
            href="/#templates"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-emerald-400"
          >
            {dict.nav.templates}
          </Link>
          <Link
            href="/#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-emerald-400"
          >
            {dict.nav.pricing}
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-emerald-400"
          >
            {dict.nav.faq}
          </Link>

          {user && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-emerald-400"
            >
              {dict.nav.bookmarks}
            </Link>
          )}

          {/* Mobile Language Toggle */}
          <div className="px-3 py-2 flex items-center justify-between border-t border-slate-900 mt-2 pt-4">
            <span className="text-sm font-medium text-slate-400 flex items-center gap-2"><Globe className="h-4 w-4" /> Language</span>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button 
                onClick={() => setLocale('id')} 
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${locale === 'id' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                ID
              </button>
              <button 
                onClick={() => setLocale('en')} 
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${locale === 'en' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1 flex items-center justify-between">
                  <div>
                    <div className="text-base font-semibold text-white">{user.name}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </div>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 font-medium">
                    {user.role}
                  </span>
                </div>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-emerald-400"
                  >
                    <Shield className="h-5 w-5 text-emerald-400" />
                    {dict.nav.adminPanel}
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-emerald-400"
                >
                  <LayoutDashboard className="h-5 w-5 text-emerald-400" />
                  {dict.nav.userDashboard}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-red-400 hover:bg-slate-900"
                >
                  <LogOut className="h-5 w-5" />
                  {dict.nav.signOut}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center rounded-lg border border-slate-800 py-2 text-sm font-medium text-slate-300 hover:text-white"
                >
                  {dict.nav.logIn}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center rounded-lg bg-gradient-emerald py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
                >
                  {dict.nav.getStarted}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
