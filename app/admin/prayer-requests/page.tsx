'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { HeartHandshake, Lock, Globe, Trash2, CheckCircle2, Archive, Filter } from 'lucide-react';
import { PrayerRequest } from '@/lib/models/schema';

export default function AdminPrayerRequestsPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [message, setMessage] = useState('');

  const loadRequests = async () => {
    try {
      const res = await fetch('/api/prayer-requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error('Error loading prayer requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'new' | 'prayed' | 'archived') => {
    try {
      const res = await fetch('/api/prayer-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setMessage(`Request status updated to ${status}`);
        await loadRequests();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prayer request?')) return;
    try {
      const res = await fetch(`/api/prayer-requests?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Prayer request deleted');
        await loadRequests();
      }
    } catch (err) {
      console.error('Error deleting request:', err);
    }
  };

  const filtered = requests.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-navy-200">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-navy-900">Prayer Requests Manager</h1>
            <p className="text-xs text-navy-600 mt-1">Review public & private prayer requests submitted by visitors.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-navy-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-navy-400 ml-2" />
            {['all', 'new', 'prayed', 'archived'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-colors ${
                  filterStatus === status
                    ? 'bg-mpl-500 text-white shadow-xs'
                    : 'text-navy-700 hover:bg-navy-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="font-bold text-xs">Dismiss</button>
          </div>
        )}

        {loading ? (
          <p className="text-xs text-navy-600 animate-pulse">Loading prayer requests...</p>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-navy-100 text-center">
            <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-navy-600">No prayer requests matching filter &quot;{filterStatus}&quot;.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((pr) => (
              <div
                key={pr.id}
                className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-navy-900 text-base">{pr.name}</span>
                    <span className="text-xs text-navy-500">({pr.contact})</span>
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-mpl-100 text-mpl-700">
                      {pr.category}
                    </span>
                    {pr.isPrivate ? (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-crimson-100 text-crimson-700">
                        <Lock className="w-3 h-3 mr-1" /> PRIVATE
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        <Globe className="w-3 h-3 mr-1" /> PUBLIC WALL
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-navy-800 bg-navy-50/70 p-3 rounded-xl border border-navy-100 italic">
                    &ldquo;{pr.message}&rdquo;
                  </p>

                  <div className="text-[10px] text-navy-500">
                    Submitted on {new Date(pr.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Status Badges & Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {pr.status !== 'prayed' && (
                    <button
                      onClick={() => handleUpdateStatus(pr.id, 'prayed')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Prayed
                    </button>
                  )}

                  {pr.status !== 'archived' && (
                    <button
                      onClick={() => handleUpdateStatus(pr.id, 'archived')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-navy-100 hover:bg-navy-200 text-navy-800 transition-colors flex items-center"
                    >
                      <Archive className="w-3.5 h-3.5 mr-1" /> Archive
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(pr.id)}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                    title="Delete Request"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
