// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Download, Key, User, ShieldAlert, Sparkles, Loader2, Copy, Check, ExternalLink, Receipt, ShieldCheck, FileArchive } from 'lucide-react';
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

  const [activeTab, setActiveTab] = useState<'purchases' | 'downloads' | 'licenses' | 'history' | 'profile'>('purchases');
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
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

  // Load dashboard data (purchases)
  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      try {
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

  // Sync purchase data
  useEffect(() => {
    if (!user) return;
    
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
      setProfileMsg({ type: 'success', text: dict.dashboard.profile.success });
      setProfilePassword('');
    } catch (err) {
      setProfileMsg({ type: 'error', text: dict.dashboard.profile.failed });
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
              className="rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 px-4 py-2 text-xs font-semibold text-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert className="h-4 w-4" /> {dict.dashboard.adminConsole}
            </Link>
          )}
          <button
            onClick={logout}
            className="rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500/30 hover:bg-red-500/5 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 transition-all cursor-pointer"
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
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold transition-all border text-left cursor-pointer ${
              activeTab === 'purchases'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Purchased Products
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold transition-all border text-left cursor-pointer ${
              activeTab === 'downloads'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Download className="h-4 w-4" />
            Downloads
          </button>

          <button
            onClick={() => setActiveTab('licenses')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold transition-all border text-left cursor-pointer ${
              activeTab === 'licenses'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Key className="h-4 w-4" />
            Licenses
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold transition-all border text-left cursor-pointer ${
              activeTab === 'history'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Receipt className="h-4 w-4" />
            Order History
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold transition-all border text-left cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <User className="h-4 w-4" />
            Profile Settings
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
              {/* TAB 1: Purchased Products */}
              {activeTab === 'purchases' && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-base font-bold text-white mb-4">Purchased Products</h2>
                  {purchases.length > 0 ? (
                    purchases.map((item) => (
                      <div key={item.id} className="glass-panel rounded-xl p-5 border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                        <div className="flex gap-4">
                          <div className="h-16 w-24 bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 border border-slate-800 hidden sm:block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.template.screenshots[0]} alt={item.template.title} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <span className="text-3xs font-semibold text-emerald-400 uppercase">{item.template.category}</span>
                            <h3 className="text-sm font-bold text-white mt-0.5 hover:text-emerald-400 transition-colors">
                              <Link href={`/product/${item.template.slug}`} className="flex items-center gap-1">
                                {item.template.title}
                                <ExternalLink className="h-3 w-3 text-slate-500" />
                              </Link>
                            </h3>
                            
                            <p className="text-3xs text-slate-450 mt-1">
                              {dict.dashboard.purchases.purchasedOn} {new Date(item.purchaseDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <Link
                            href={`/product/${item.template.slug}`}
                            className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-slate-900 border border-slate-850 hover:border-slate-700 text-white text-xs font-semibold text-center"
                          >
                            Product Details
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="glass-panel rounded-xl p-10 text-center border-slate-850">
                      <Sparkles className="h-8 w-8 text-slate-650 mx-auto mb-3" />
                      <h3 className="text-sm font-bold text-white mb-1">{dict.dashboard.purchases.emptyTitle}</h3>
                      <p className="text-xs text-slate-450 max-w-sm mx-auto mb-4">{dict.dashboard.purchases.emptyDesc}</p>
                      <Link href="/#templates" className="inline-flex rounded-lg bg-gradient-emerald px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300">
                        {dict.dashboard.purchases.browse}
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Downloads */}
              {activeTab === 'downloads' && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-base font-bold text-white mb-4">Downloads</h2>
                  {purchases.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {purchases.map((item) => {
                        const hasApk = item.template.techStack.includes('CapacitorJS') || item.template.category.includes('APK') || item.template.title.toLowerCase().includes('apk') || item.template.techStack.includes('Flutter');
                        return (
                          <div key={item.id} className="glass-panel rounded-xl p-5 border-slate-850 flex flex-col justify-between">
                            <div>
                              <span className="text-3xs text-emerald-400 font-semibold uppercase">{item.template.category}</span>
                              <h3 className="text-xs font-bold text-white mt-1 line-clamp-1">{item.template.title}</h3>
                              
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-900 text-3xs text-slate-300">
                                  <span className="flex items-center gap-1.5 font-semibold">
                                    <FileArchive className="h-3.5 w-3.5 text-emerald-400" />
                                    Source Code (ZIP)
                                  </span>
                                  <a href={item.template.downloadUrl} download className="text-emerald-400 hover:text-emerald-300 font-bold transition-all">Download</a>
                                </div>

                                {hasApk && (
                                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-900 text-3xs text-slate-300">
                                    <span className="flex items-center gap-1.5 font-semibold">
                                      <Download className="h-3.5 w-3.5 text-emerald-400" />
                                      Installable App (APK)
                                    </span>
                                    <a href="/downloads/mock-application.apk" download className="text-emerald-400 hover:text-emerald-300 font-bold transition-all">Download</a>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-3xs text-slate-500">
                              <span>License Standard Commercial</span>
                              <Link href={`/product/${item.template.slug}`} className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold">
                                Details
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="glass-panel rounded-xl p-10 text-center border-slate-850">
                      <Download className="h-8 w-8 text-slate-650 mx-auto mb-3" />
                      <h3 className="text-sm font-bold text-white mb-1">{dict.dashboard.bookmarks.emptyTitle}</h3>
                      <p className="text-xs text-slate-455 max-w-sm mx-auto">{dict.dashboard.bookmarks.emptyDesc}</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Licenses */}
              {activeTab === 'licenses' && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-base font-bold text-white mb-4">Licenses</h2>
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
                            <code className="text-3xs font-mono text-emerald-400 bg-slate-950 px-2.5 py-1 rounded select-all">
                              {item.licenseKey}
                            </code>
                            <button
                              onClick={() => handleCopyLicense(item.licenseKey)}
                              className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
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

              {/* TAB 4: Order History */}
              {activeTab === 'history' && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-base font-bold text-white mb-4">Order History</h2>
                  {purchases.length > 0 ? (
                    <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-900 text-left text-xs text-slate-300">
                          <thead className="bg-slate-950/60 text-slate-400 text-3xs uppercase font-bold tracking-wider">
                            <tr>
                              <th className="px-5 py-3">Order ID</th>
                              <th className="px-5 py-3">Product</th>
                              <th className="px-5 py-3">Date</th>
                              <th className="px-5 py-3">Amount</th>
                              <th className="px-5 py-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-900 bg-slate-900/10">
                            {purchases.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                                <td className="px-5 py-4 font-mono text-3xs text-slate-400">{item.id}</td>
                                <td className="px-5 py-4 font-bold text-white">{item.template.title}</td>
                                <td className="px-5 py-4 text-3xs text-slate-400">{new Date(item.purchaseDate).toLocaleDateString()}</td>
                                <td className="px-5 py-4 font-extrabold text-emerald-400">${item.amount.toFixed(2)}</td>
                                <td className="px-5 py-4">
                                  <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-3xs font-semibold text-emerald-400">
                                    <ShieldCheck className="h-3 w-3" />
                                    Paid
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="glass-panel rounded-xl p-10 text-center border-slate-850">
                      <Receipt className="h-8 w-8 text-slate-650 mx-auto mb-3" />
                      <h3 className="text-sm font-bold text-white mb-1">No orders found</h3>
                      <p className="text-xs text-slate-450">You haven't completed any transaction yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: Profile Settings */}
              {activeTab === 'profile' && (
                <div className="glass-panel rounded-xl p-5 md:p-6 border-slate-800 animate-fadeIn">
                  <h2 className="text-base font-bold text-white mb-4">{dict.dashboard.profile.title}</h2>

                  {profileMsg.text && (
                    <div className={`mb-4 rounded-lg p-3.5 text-xs font-semibold border ${
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
                        className="w-full glass-input rounded-lg px-3.5 py-2.5 text-xs text-white animate-transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{dict.dashboard.profile.emailLabel}</label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full glass-input rounded-lg px-3.5 py-2.5 text-xs text-white"
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
                        className="w-full glass-input rounded-lg px-3.5 py-2.5 text-xs text-white animate-transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="rounded-lg bg-gradient-emerald px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center gap-1.5 transition-all font-semibold cursor-pointer"
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
