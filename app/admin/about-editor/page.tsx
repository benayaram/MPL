'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Save, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { AboutPageData } from '@/lib/models/schema';

export default function AdminAboutEditorPage() {
  const [data, setData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadAbout() {
      try {
        const res = await fetch('/api/about');
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error('Error loading about content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAbout();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const updated = await res.json();
        setData(updated);
        setMessage('About page content updated live on public website!');
      }
    } catch (err) {
      console.error('Error saving about content:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <AdminLayout>
        <p className="text-xs text-navy-600 animate-pulse">Loading editor...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-navy-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-navy-900">About Page Live Editor</h1>
            <p className="text-xs text-navy-600 mt-1">Edit Mission, Vision, and founding story text directly.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-mpl-500 hover:bg-mpl-600 transition-colors shadow-md flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Live Changes'}
          </button>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center justify-between">
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />{message}</span>
            <button onClick={() => setMessage('')} className="font-bold text-xs">Dismiss</button>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl border border-navy-100 shadow-xs space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Page Main Title</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Subtitle / Tagline</label>
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Mission Statement</label>
            <textarea
              rows={3}
              value={data.mission}
              onChange={(e) => setData({ ...data, mission: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Vision Statement</label>
            <textarea
              rows={3}
              value={data.vision}
              onChange={(e) => setData({ ...data, vision: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">MPL Started (Full History Story Text)</label>
            <textarea
              rows={8}
              value={data.story}
              onChange={(e) => setData({ ...data, story: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none resize-y"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-navy-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-mpl-500 hover:bg-mpl-600 transition-colors shadow-md flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Live Changes'}
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
}
