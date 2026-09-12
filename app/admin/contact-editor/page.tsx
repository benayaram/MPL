'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Save, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { ContactInfoData } from '@/lib/models/schema';

export default function AdminContactEditorPage() {
  const [data, setData] = useState<ContactInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadContact() {
      try {
        const res = await fetch('/api/contact');
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error('Error loading contact content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadContact();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const updated = await res.json();
        setData(updated);
        setMessage('Contact & service info updated live!');
      }
    } catch (err) {
      console.error('Error saving contact content:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <AdminLayout>
        <p className="text-xs text-navy-600 animate-pulse">Loading contact editor...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-navy-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-navy-900">Contact & Service Info Editor</h1>
            <p className="text-xs text-navy-600 mt-1">Update service times, address, phone, email, and social handles.</p>
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
              <label className="block text-xs font-semibold text-navy-700 mb-1">Official Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Address / Fellowship Description</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Google Maps Embed URL</label>
            <input
              type="url"
              value={data.mapEmbedUrl}
              onChange={(e) => setData({ ...data, mapEmbedUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none"
            />
          </div>

          {/* Service Times Section */}
          <div className="pt-4 border-t border-navy-100 space-y-4">
            <h3 className="font-bold text-navy-900 text-sm">Fellowship Service Schedule</h3>
            
            {data.serviceTimes.map((st, index) => (
              <div key={index} className="p-4 rounded-xl border border-navy-200 bg-navy-50/40 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <input
                  type="text"
                  placeholder="Day"
                  value={st.day}
                  onChange={(e) => {
                    const newTimes = [...data.serviceTimes];
                    newTimes[index].day = e.target.value;
                    setData({ ...data, serviceTimes: newTimes });
                  }}
                  className="px-3 py-2 rounded-lg border border-navy-200 text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Time"
                  value={st.time}
                  onChange={(e) => {
                    const newTimes = [...data.serviceTimes];
                    newTimes[index].time = e.target.value;
                    setData({ ...data, serviceTimes: newTimes });
                  }}
                  className="px-3 py-2 rounded-lg border border-navy-200 text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={st.title}
                  onChange={(e) => {
                    const newTimes = [...data.serviceTimes];
                    newTimes[index].title = e.target.value;
                    setData({ ...data, serviceTimes: newTimes });
                  }}
                  className="px-3 py-2 rounded-lg border border-navy-200 text-xs bg-white"
                />
              </div>
            ))}
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
