// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Download, Bookmark, Key, User, ShieldAlert, Sparkles, Loader2, Copy, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface PurchaseItem {
  id: string;
  template: {
    id: string;
    title: string;
    slug: string;
    price: number;
    category: string;
    screenshots: string[];
    downloadUrl: string;
    techStack: string[];
  };
  licenseKey: string;
  purchaseDate: string;
  amount: number;
}

export default function UserDashboard() {
  const { user, loading, logout } = useAuth();
  const { dict } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'purchases' | 'bookmarks' | 'licenses' | 'profile'>('purchases');
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [copiedKey, setCopiedKey] = useState('');
  
  // Profile form state
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, loading, router]);

  // Load dashboard data (purchases & bookmarks)
  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      try {
        // Fetch purchases
        const pRes = await fetch('/api/purchases');
        let purchasesData = [];
        if (pRes.ok) {
          const data = await pRes.json();
          purchasesData = data.purchases;
          setPurchases(purchasesData);
        } else {
          // Alternative path fallback
          const altRes = await fetch(`/api/purchases?userId=${user.id}`);
          if (altRes.ok) {
            const data = await altRes.json();
            purchasesData = data.purchases;
            setPurchases(purchasesData);
          }
        }

        // Fetch bookmarks
        const bRes = await fetch('/api/bookmarks');
        if (bRes.ok) {
          const data = await bRes.json();
          setBookmarks(data.bookmarks);
        }

        // Prepopulate profile forms
        setProfileName(user.name || '');
        setProfileEmail(user.email || '');

      } catch (err) {
        console.error(err);
      } finally {
        setDataLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Quick fallback fetch for purchases inside endpoint handler helper
  useEffect(() => {
    if (!user) return;
    
    // We will register a client fetch to get purchases directly from database if endpoint needs custom user parsing
    const syncPurchases = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const uData = await res.json();
          if (uData.user) {
            const purRes = await fetch(`/api/purchases?userId=${uData.user.id}`);
            if (purRes.ok) {
              const pData = await purRes.json();
              if (pData.purchases && pData.purchases.length > 0) {
                setPurchases(pData.purchases);
              }
            }
          }
        }
      } catch (e) {}
    };
    
    // Let's run it after a short delay
    const timer = setTimeout(syncPurchases, 1000);
    return () => clearTimeout(timer);
  }, [user]);

  const handleCopyLicense = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setProfileLoading(true);

    try {
      // Simulate profile update API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfileMsg({ type: 'success', text: 'Profile updated successfully! (Simulation)' });
      setProfilePassword('');
    } catch (err) {
      setProfileMsg({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        <p className="text-xs text-slate-400 mt-4">Loading dashboard session...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Dashboard Welcome Header */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border-slate-800 bg-slate-900/30 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center font-extrabold text-lg text-emerald-400">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-3xs font-semibold tracking-wider text-emerald-400 uppercase">{dict.dashboard.title}</span>
            <h1 className="text-xl md:text-2xl font-black text-white">{user.name}</h1>
            <p className="text-xs text-slate-400">{user.email} &bull; {dict.dashboard.memberSince} {new Date().getFullYear()}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 px-4 py-2 text-xs font-semibold text-emerald-400 transition-all flex items-center gap-1.5"
            >
              <ShieldAlert className="h-4 w-4" /> {dict.dashboard.adminConsole}
            </Link>
          )}
          <button
            onClick={logout}
            className="rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500/30 hover:bg-red-500/5 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 transition-all"
          >
            {dict.dashboard.signOut}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2.5">
          <button
            onClick={() => setActiveTab('purchases')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold transition-all border text-left ${
              activeTab === 'purchases'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Download className="h-4.5 w-4.5" />
            {dict.dashboard.tabs.purchases}
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold transition-all border text-left ${
              activeTab === 'bookmarks'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Bookmark className="h-4.5 w-4.5" />
            {dict.dashboard.tabs.bookmarks}
          </button>

          <button
            onClick={() => setActiveTab('licenses')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold transition-all border text-left ${
              activeTab === 'licenses'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Key className="h-4.5 w-4.5" />
            {dict.dashboard.tabs.licenses}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold transition-all border text-left ${
              activeTab === 'profile'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <User className="h-4.5 w-4.5" />
            {dict.dashboard.tabs.profile}
          </button>
        </div>

        {/* Right Dashboard Content Panel */}
        <div className="lg:col-span-3 min-h-[400px]">
          
          {/* Loader Skeleton for dynamic data fetch */}
          {dataLoading && activeTab !== 'profile' ? (
            <div className="space-y-4">
              {[1, 2].map(n => (
                <div key={n} className="glass-panel p-5 rounded-xl flex items-center justify-between">
                  <div className="space-y-2 w-1/2">
                    <div className="skeleton-loading h-5 rounded w-3/4" />
                    <div className="skeleton-loading h-4 rounded w-1/2" />
                  </div>
                  <div className="skeleton-loading h-8 rounded w-28" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* TAB 1: Purchases & Downloads */}
              {activeTab === 'purchases' && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-base font-bold text-white mb-4">{dict.dashboard.purchases.title}</h2>
                  {purchases.length > 0 ? (
                    purchases.map((item) => (
                      <div key={item.id} className="glass-panel rounded-xl p-5 border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <span className="text-3xs font-semibold text-emerald-400 uppercase">{item.template.category}</span>
                          <h3 className="text-sm font-bold text-white mt-0.5 hover:text-emerald-400 transition-colors">
                            <Link href={`/templates/${item.template.slug}`} className="flex items-center gap-1">
                              {item.template.title}
                              <ExternalLink className="h-3 w-3 text-slate-500" />
                            </Link>
                          </h3>
                          
                          {/* Details line */}
                          <p className="text-3xs text-slate-450 mt-1 flex items-center gap-3">
                            <span>{dict.dashboard.purchases.purchasedOn} {new Date(item.purchaseDate).toLocaleDateString()}</span>
                            <span>{dict.dashboard.purchases.price}{item.amount}</span>
                          </p>

                          {/* Quick Key display */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-3xs text-slate-500">{dict.dashboard.purchases.license}</span>
                            <code className="text-2xs font-mono text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded">{item.licenseKey}</code>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
                          <a
                            href={item.template.downloadUrl}
                            download
                            className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-1.5"
                          >
                            <Download className="h-4 w-4" /> {dict.dashboard.purchases.downloadZip}
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="glass-panel rounded-xl p-10 text-center border-slate-850">
                      <Sparkles className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                      <h3 className="text-sm font-bold text-white mb-1">{dict.dashboard.purchases.emptyTitle}</h3>
                      <p className="text-xs text-slate-450 max-w-sm mx-auto mb-4">{dict.dashboard.purchases.emptyDesc}</p>
                      <Link href="/#templates" className="inline-flex rounded-lg bg-gradient-emerald px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300">
                        {dict.dashboard.purchases.browse}
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Bookmarks */}
              {activeTab === 'bookmarks' && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-base font-bold text-white mb-4">{dict.dashboard.bookmarks.title}</h2>
                  {bookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {bookmarks.map((template) => (
                        <div key={template.id} className="glass-panel rounded-xl p-4 border-slate-850 flex flex-col justify-between">
                          <div>
                            <span className="text-3xs text-emerald-400 font-semibold uppercase">{template.category}</span>
                            <h3 className="text-xs font-bold text-white mt-1 line-clamp-1">{template.title}</h3>
                            <p className="text-3xs text-slate-450 mt-1 line-clamp-2">{template.description}</p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center">
                            <span className="text-xs font-bold text-white">${template.price}</span>
                            <Link href={`/templates/${template.slug}`} className="text-3xs font-semibold text-emerald-400 flex items-center gap-0.5 hover:text-emerald-300 transition-colors">
                              {dict.dashboard.bookmarks.viewDetails} <ExternalLink className="h-2.5 w-2.5" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="glass-panel rounded-xl p-10 text-center border-slate-850">
                      <Bookmark className="h-8 w-8 text-slate-650 mx-auto mb-3" />
                      <h3 className="text-sm font-bold text-white mb-1">{dict.dashboard.bookmarks.emptyTitle}</h3>
                      <p className="text-xs text-slate-450 max-w-sm mx-auto">{dict.dashboard.bookmarks.emptyDesc}</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: License Manager */}
              {activeTab === 'licenses' && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-base font-bold text-white mb-4">{dict.dashboard.licenses.title}</h2>
                  <p className="text-xs text-slate-400 mb-4">
                    {dict.dashboard.licenses.desc}
                  </p>
                  
                  {purchases.length > 0 ? (
                    <div className="space-y-3">
                      {purchases.map((item) => (
                        <div key={item.id} className="glass-panel rounded-xl p-4 border-slate-850 flex items-center justify-between gap-4">
                          <div>
                            <h4 className="text-xs font-bold text-white">{item.template.title}</h4>
                            <span className="text-3xs text-slate-500">{dict.dashboard.licenses.standard}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <code className="text-3xs font-mono text-emerald-400 bg-slate-950 px-2.5 py-1 rounded">
                              {item.licenseKey}
                            </code>
                            <button
                              onClick={() => handleCopyLicense(item.licenseKey)}
                              className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                              title="Copy License Key"
                            >
                              {copiedKey === item.licenseKey ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="glass-panel rounded-xl p-10 text-center border-slate-850">
                      <Key className="h-8 w-8 text-slate-650 mx-auto mb-3" />
                      <h3 className="text-sm font-bold text-white mb-1">{dict.dashboard.licenses.emptyTitle}</h3>
                      <p className="text-xs text-slate-450">{dict.dashboard.licenses.emptyDesc}</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Profile Settings */}
              {activeTab === 'profile' && (
                <div className="glass-panel rounded-xl p-5 md:p-6 border-slate-800 animate-fadeIn">
                  <h2 className="text-base font-bold text-white mb-4">{dict.dashboard.profile.title}</h2>

                  {profileMsg.text && (
                    <div className={`mb-4 rounded-lg p-3.5 text-xs font-medium border ${
                      profileMsg.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                      {profileMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{dict.dashboard.profile.nameLabel}</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full glass-input rounded-lg px-3.5 py-2 text-xs text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{dict.dashboard.profile.emailLabel}</label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full glass-input rounded-lg px-3.5 py-2 text-xs text-white"
                        required
                        disabled
                      />
                      <span className="text-3xs text-slate-500 block mt-1">{dict.dashboard.profile.emailTip}</span>
                    </div>

                    <div>
                      <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{dict.dashboard.profile.passLabel}</label>
                      <input
                        type="password"
                        value={profilePassword}
                        onChange={(e) => setProfilePassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full glass-input rounded-lg px-3.5 py-2 text-xs text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="rounded-lg bg-gradient-emerald px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center gap-1.5 transition-all font-semibold"
                    >
                      {profileLoading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          {dict.dashboard.profile.btnLoading}
                        </>
                      ) : (
                        dict.dashboard.profile.btn
                      )}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
