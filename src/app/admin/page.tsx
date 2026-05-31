// src/app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { LayoutDashboard, Database, Users, Key, Loader2, Plus, Sparkles, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface AnalyticsData {
  revenue: number;
  salesCount: number;
  downloads: number;
  visitors: number;
  revenueHistory: { name: string; revenue: number; sales: number }[];
  recentPurchases: any[];
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const { dict } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'users' | 'licenses'>('overview');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  
  const [dataLoading, setDataLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Template upload form states (Inline Modal)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('Admin Dashboard');
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDownloadUrl, setFormDownloadUrl] = useState('');
  const [formLiveDemoUrl, setFormLiveDemoUrl] = useState('');
  const [formTechStack, setFormTechStack] = useState('');
  const [formFeatures, setFormFeatures] = useState('');
  const [formScreenshots, setFormScreenshots] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=/admin');
      } else if (user.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  const loadAdminData = async () => {
    try {
      setDataLoading(true);
      
      // Fetch analytics
      const aRes = await fetch('/api/analytics');
      if (aRes.ok) {
        const data = await aRes.json();
        setAnalytics(data);
      }

      // Fetch templates
      const tRes = await fetch('/api/templates');
      if (tRes.ok) {
        const data = await tRes.json();
        setTemplates(data.templates);
      }

      // Fetch users
      const uRes = await fetch('/api/users');
      if (uRes.ok) {
        const data = await uRes.json();
        setUsersList(data.users);
      }

      // Fetch licenses
      const lRes = await fetch('/api/licenses');
      if (lRes.ok) {
        const data = await lRes.json();
        setLicenses(data.licenses);
      }

    } catch (err) {
      console.error('Failed to load admin logs', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      loadAdminData();
    }
  }, [user]);

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTemplates(templates.filter(t => t.id !== id));
      } else {
        alert('Failed to delete template');
      }
    } catch (e) {
      alert('Error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditTemplateClick = (t: any) => {
    setEditingTemplateId(t.id);
    setFormTitle(t.title);
    setFormSlug(t.slug);
    setFormCategory(t.category);
    setFormPrice(t.price.toString());
    setFormDescription(t.description);
    setFormDownloadUrl(t.downloadUrl);
    setFormLiveDemoUrl(t.liveDemoUrl || '');
    setFormTechStack(t.techStack.join(', '));
    setFormFeatures(t.features.join('\n'));
    setFormScreenshots(t.screenshots.join('\n'));
    setFormError('');
    setIsFormOpen(true);
  };

  const handleAddTemplateClick = () => {
    setEditingTemplateId(null);
    setFormTitle('');
    setFormSlug('');
    setFormCategory('Admin Dashboard');
    setFormPrice('');
    setFormDescription('');
    setFormDownloadUrl('');
    setFormLiveDemoUrl('');
    setFormTechStack('Next.js, TypeScript, Tailwind CSS');
    setFormFeatures('Aesthetic Dark Theme\nFully Responsive\nClean Code');
    setFormScreenshots('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setActionLoading(true);

    const body = {
      title: formTitle,
      slug: formSlug,
      category: formCategory,
      price: parseFloat(formPrice),
      description: formDescription,
      downloadUrl: formDownloadUrl,
      liveDemoUrl: formLiveDemoUrl,
      techStack: formTechStack.split(',').map(s => s.trim()).filter(Boolean),
      features: formFeatures.split('\n').map(s => s.trim()).filter(Boolean),
      screenshots: formScreenshots.split('\n').map(s => s.trim()).filter(Boolean),
      changelog: editingTemplateId ? undefined : [
        { version: 'v1.0.0', date: new Date().toISOString().split('T')[0], changes: ['Initial release'] }
      ]
    };

    try {
      const url = editingTemplateId ? `/api/templates/${editingTemplateId}` : '/api/templates';
      const method = editingTemplateId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (res.ok) {
        setIsFormOpen(false);
        loadAdminData(); // Reload stats and lists
      } else {
        setFormError(data.error || 'Failed to save template');
      }
    } catch (err) {
      setFormError('Network error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeLicense = async (licenseKey: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'REVOKED' : 'ACTIVE';
    if (!confirm(`Are you sure you want to change status to ${nextStatus}?`)) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/licenses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey, status: nextStatus })
      });
      if (res.ok) {
        setLicenses(licenses.map(l => l.licenseKey === licenseKey ? { ...l, status: nextStatus } : l));
      }
    } catch (e) {
      alert('Error updating status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        <p className="text-xs text-slate-400 mt-4">Loading Admin panel session...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Admin Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <span className="text-3xs font-semibold tracking-wider text-emerald-400 uppercase flex items-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5" /> {dict.admin.subtitle}
          </span>
          <h1 className="text-2xl font-black text-white">{dict.admin.title}</h1>
          <p className="text-xs text-slate-400">{dict.admin.desc}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAddTemplateClick}
            className="rounded-lg bg-gradient-emerald px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center gap-1.5 font-semibold"
          >
            <Plus className="h-4 w-4" /> {dict.admin.addTemplate}
          </button>
          <Link
            href="/dashboard"
            className="rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-350"
          >
            {dict.admin.goToDashboard}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold transition-all border text-left ${
              activeTab === 'overview'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-4.5 w-4.5" />
            {dict.admin.tabs.overview}
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold transition-all border text-left ${
              activeTab === 'templates'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Database className="h-4.5 w-4.5" />
            {dict.admin.tabs.templates} ({templates.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold transition-all border text-left ${
              activeTab === 'users'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Users className="h-4.5 w-4.5" />
            {dict.admin.tabs.users} ({usersList.length})
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
            {dict.admin.tabs.licenses} ({licenses.length})
          </button>
        </div>

        {/* Right Dashboard panel */}
        <div className="lg:col-span-3 min-h-[450px]">
          
          {dataLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="glass-panel p-5 rounded-xl h-24 flex flex-col justify-between">
                    <div className="skeleton-loading h-4 rounded w-1/2" />
                    <div className="skeleton-loading h-6 rounded w-3/4" />
                  </div>
                ))}
              </div>
              <div className="glass-panel h-64 rounded-xl skeleton-loading w-full" />
            </div>
          ) : (
            <>
              {/* TAB 1: Overview and Analytics */}
              {activeTab === 'overview' && analytics && (
                <div className="space-y-8 animate-fadeIn">
                  
                  {/* Metrics stat cards grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="glass-panel p-5 rounded-xl">
                      <span className="text-3xs text-slate-500 uppercase tracking-wider block">{dict.admin.overview.revenue}</span>
                      <span className="text-xl font-black text-white block mt-2">${analytics.revenue}</span>
                      <span className="text-3xs text-emerald-400 mt-1 block font-medium">+15.2% vs last month</span>
                    </div>

                    <div className="glass-panel p-5 rounded-xl">
                      <span className="text-3xs text-slate-500 uppercase tracking-wider block">{dict.admin.overview.sales}</span>
                      <span className="text-xl font-black text-white block mt-2">{analytics.salesCount}</span>
                      <span className="text-3xs text-emerald-400 mt-1 block font-medium">+8% conversion rate</span>
                    </div>

                    <div className="glass-panel p-5 rounded-xl">
                      <span className="text-3xs text-slate-500 uppercase tracking-wider block">{dict.admin.overview.downloads}</span>
                      <span className="text-xl font-black text-white block mt-2">{analytics.downloads}</span>
                      <span className="text-3xs text-slate-400 mt-1 block font-medium">ZIP and APK archives</span>
                    </div>

                    <div className="glass-panel p-5 rounded-xl">
                      <span className="text-3xs text-slate-500 uppercase tracking-wider block">{dict.admin.overview.visitors}</span>
                      <span className="text-xl font-black text-white block mt-2">{analytics.visitors}</span>
                      <span className="text-3xs text-emerald-400 mt-1 block font-medium">1,240 unique views</span>
                    </div>
                  </div>

                  {/* Revenue History Chart placeholder */}
                  <div className="glass-panel rounded-xl p-5 md:p-6">
                    <h3 className="text-xs font-bold text-white mb-4">{dict.admin.overview.chartTitle}</h3>
                    
                    {/* SVG Drawn Line graph to be completely independent and robust */}
                    <div className="relative h-44 w-full flex items-end justify-between px-2 pt-6 border-b border-l border-slate-900">
                      
                      {analytics.revenueHistory.map((item, idx) => {
                        const maxVal = Math.max(...analytics.revenueHistory.map(h => h.revenue));
                        const pct = maxVal > 0 ? (item.revenue / maxVal) * 80 : 20; // max height 80%

                        return (
                          <div key={idx} className="flex flex-col items-center flex-1 group">
                            <span className="text-3xs font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">${item.revenue}</span>
                            <div 
                              style={{ height: `${pct}%` }} 
                              className="w-10 sm:w-16 rounded-t bg-gradient-to-t from-emerald-500/10 to-emerald-500/60 border-t border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.1)] transition-all group-hover:to-emerald-400"
                            />
                            <span className="text-3xs text-slate-500 mt-2 font-medium">{item.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent sales history table */}
                  <div className="glass-panel rounded-xl p-5">
                    <h3 className="text-xs font-bold text-white mb-4">{dict.admin.overview.tableTitle}</h3>
                    
                    {analytics.recentPurchases.length > 0 ? (
                      <div className="overflow-x-auto whitespace-nowrap">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-900 text-3xs text-slate-500 uppercase tracking-wider">
                              <th className="py-2.5">User</th>
                              <th className="py-2.5">Product</th>
                              <th className="py-2.5">Price</th>
                              <th className="py-2.5">Date</th>
                            </tr>
                          </thead>
                          <tbody className="text-xs divide-y divide-slate-900/65 text-slate-350">
                            {analytics.recentPurchases.map((pur) => (
                              <tr key={pur.id}>
                                <td className="py-2.5">{pur.user?.name || 'Demo Customer'}</td>
                                <td className="py-2.5 font-bold text-white">{pur.template?.title || 'Unknown template'}</td>
                                <td className="py-2.5 text-emerald-400">${pur.amount}</td>
                                <td className="py-2.5">{new Date(pur.purchaseDate).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">{dict.admin.overview.emptyTx}</p>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 2: Manage Templates CRUD Table */}
              {activeTab === 'templates' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-bold text-white">{dict.admin.templates.title}</h2>
                  </div>

                  <div className="glass-panel rounded-xl overflow-hidden border-slate-800">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-900 text-3xs text-slate-500 uppercase tracking-wider bg-slate-950/40">
                            <th className="p-3">{dict.admin.templates.col1}</th>
                            <th className="p-3">{dict.admin.templates.col2}</th>
                            <th className="p-3">{dict.admin.templates.col3}</th>
                            <th className="p-3 text-right">{dict.admin.templates.col4}</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs text-slate-350 divide-y divide-slate-900/60">
                          {templates.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-900/10">
                              <td className="p-3">
                                <span className="font-bold text-white block">{t.title}</span>
                                <span className="text-3xs text-emerald-400 font-semibold">{t.category}</span>
                              </td>
                              <td className="p-3 font-semibold text-white">${t.price}</td>
                              <td className="p-3 font-mono">{t.salesCount}</td>
                              <td className="p-3 text-right space-x-1">
                                <button
                                  onClick={() => handleEditTemplateClick(t)}
                                  className="p-1 text-slate-400 hover:text-emerald-400 inline-flex"
                                  title="Edit Template details"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTemplate(t.id)}
                                  disabled={actionLoading}
                                  className="p-1 text-slate-400 hover:text-red-400 inline-flex"
                                  title="Delete Template"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Manage Users Table */}
              {activeTab === 'users' && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-base font-bold text-white mb-4">{dict.admin.users.title}</h2>
                  
                  <div className="glass-panel rounded-xl overflow-hidden border-slate-800">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-900 text-3xs text-slate-500 uppercase bg-slate-950/40">
                            <th className="p-3">{dict.admin.users.col1}</th>
                            <th className="p-3">{dict.admin.users.col2}</th>
                            <th className="p-3">{dict.admin.users.col3}</th>
                            <th className="p-3 text-right">{dict.admin.users.col4}</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs text-slate-350 divide-y divide-slate-900/60">
                          {usersList.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-900/10">
                              <td className="p-3">
                                <span className="font-bold text-white block">{u.name}</span>
                                <span className="text-3xs text-slate-500">{u.email}</span>
                              </td>
                              <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-3xs font-bold ${
                                  u.role === 'ADMIN' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={async () => {
                                    const targetRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
                                    if (!confirm(`Promote/Demote ${u.name} to ${targetRole}?`)) return;
                                    setActionLoading(true);
                                    try {
                                      const res = await fetch('/api/users', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ userId: u.id, role: targetRole })
                                      });
                                      if (res.ok) loadAdminData();
                                    } catch (e) {} finally { setActionLoading(false); }
                                  }}
                                  disabled={actionLoading}
                                  className="text-3xs font-bold text-emerald-400 hover:text-emerald-350 bg-slate-900 border border-slate-800 px-2 py-1 rounded"
                                >
                                  {u.role === 'ADMIN' ? dict.admin.users.makeUser : dict.admin.users.makeAdmin}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Licenses Manager Table */}
              {activeTab === 'licenses' && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-base font-bold text-white mb-4">{dict.admin.licenses.title}</h2>
                  
                  <div className="glass-panel rounded-xl overflow-hidden border-slate-800">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-900 text-3xs text-slate-500 uppercase bg-slate-950/40">
                            <th className="p-3">{dict.admin.licenses.col1}</th>
                            <th className="p-3">{dict.admin.licenses.col2}</th>
                            <th className="p-3">{dict.admin.licenses.col3}</th>
                            <th className="p-3 text-right">{dict.admin.licenses.col4}</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs text-slate-350 divide-y divide-slate-900/60">
                          {licenses.map((l) => (
                            <tr key={l.id} className="hover:bg-slate-900/10">
                              <td className="p-3">
                                <code className="font-mono font-bold text-white select-all bg-slate-950 p-1 rounded text-3xs">{l.licenseKey}</code>
                              </td>
                              <td className="p-3">{new Date(l.createdAt).toLocaleDateString()}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-3xs font-bold ${
                                  l.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                }`}>
                                  {l.status}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleRevokeLicense(l.licenseKey, l.status)}
                                  disabled={actionLoading}
                                  className={`text-3xs font-bold px-2 py-1 rounded border transition-colors ${
                                    l.status === 'ACTIVE'
                                      ? 'text-red-400 bg-red-500/5 border-red-500/20 hover:bg-red-500/10'
                                      : 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10'
                                  }`}
                                >
                                  {l.status === 'ACTIVE' ? dict.admin.licenses.revoke : dict.admin.licenses.activate}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </>
          )}

        </div>
      </div>

      {/* 9. Inline Upload Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 sm:p-8 glass-panel rounded-2xl border-slate-800 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
              {editingTemplateId ? 'Edit Product Template' : 'Add New Product Template'}
            </h3>
            
            {formError && (
              <div className="mb-4 rounded bg-red-500/10 border border-red-500/20 p-2.5 text-xs text-red-400">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => {
                      setFormTitle(e.target.value);
                      if (!editingTemplateId) {
                        setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                      }
                    }}
                    placeholder="E.g. Helix POS"
                    className="w-full glass-input rounded px-3 py-1.5 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-3xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Slug URL</label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="helix-pos"
                    className="w-full glass-input rounded px-3 py-1.5 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full glass-input rounded px-3 py-1.5 text-xs text-slate-350 bg-slate-900 border border-slate-800"
                  >
                    <option value="Admin Dashboard">Admin Dashboard</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="CRM / POS">CRM / POS</option>
                    <option value="IoT / Monitoring">IoT / Monitoring</option>
                    <option value="Company Profile">Company Profile</option>
                    <option value="Business App">Business App</option>
                  </select>
                </div>
                <div>
                  <label className="block text-3xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="E.g. 59"
                    className="w-full glass-input rounded px-3 py-1.5 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-3xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Short Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Summary of product features..."
                  rows={2}
                  className="w-full glass-input rounded px-3 py-1.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Zip Download URL</label>
                  <input
                    type="text"
                    value={formDownloadUrl}
                    onChange={(e) => setFormDownloadUrl(e.target.value)}
                    placeholder="/downloads/template.zip"
                    className="w-full glass-input rounded px-3 py-1.5 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-3xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Live Demo URL (Optional)</label>
                  <input
                    type="text"
                    value={formLiveDemoUrl}
                    onChange={(e) => setFormLiveDemoUrl(e.target.value)}
                    placeholder="https://demo.example.com"
                    className="w-full glass-input rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-3xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={formTechStack}
                  onChange={(e) => setFormTechStack(e.target.value)}
                  placeholder="Next.js, TypeScript, Tailwind CSS"
                  className="w-full glass-input rounded px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-3xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Key Features (one per line)</label>
                <textarea
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  placeholder="Feature details..."
                  rows={2}
                  className="w-full glass-input rounded px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-3xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Screenshots (Image URLs, one per line)</label>
                <textarea
                  value={formScreenshots}
                  onChange={(e) => setFormScreenshots(e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                  rows={2}
                  className="w-full glass-input rounded px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded bg-gradient-emerald px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300 font-semibold"
                >
                  {actionLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
