'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { Image as ImageIcon, HeartHandshake, FileText, Phone, Settings, Radio, Sparkles, ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    eventsCount: 0,
    prayerCount: 0,
    newPrayerCount: 0,
    liveStatus: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [eventsRes, prayerRes, liveRes] = await Promise.all([
          fetch('/api/gallery'),
          fetch('/api/prayer-requests'),
          fetch('/api/live-status')
        ]);

        const events = eventsRes.ok ? await eventsRes.json() : [];
        const prayer = prayerRes.ok ? await prayerRes.json() : [];
        const live = liveRes.ok ? await liveRes.json() : { isLive: false };

        const newCount = Array.isArray(prayer) ? prayer.filter((p: any) => p.status === 'new').length : 0;

        setStats({
          eventsCount: Array.isArray(events) ? events.length : 0,
          prayerCount: Array.isArray(prayer) ? prayer.length : 0,
          newPrayerCount: newCount,
          liveStatus: Boolean(live.isLive)
        });
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-navy-200">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-navy-900">Dashboard Overview</h1>
            <p className="text-xs text-navy-600 mt-1">Welcome back, Admin. Here is your ministry site control summary.</p>
          </div>
          <div className="flex items-center space-x-2">
            {stats.liveStatus ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white animate-pulse">
                <Radio className="w-3.5 h-3.5 mr-1.5" /> YOUTUBE LIVE
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-navy-200 text-navy-700">
                YouTube Broadcast Standby
              </span>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Photo Events</p>
              <p className="font-display text-3xl font-extrabold text-navy-900 mt-1">{loading ? '...' : stats.eventsCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-mpl-100 text-mpl-600 flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Total Prayer Requests</p>
              <p className="font-display text-3xl font-extrabold text-navy-900 mt-1">{loading ? '...' : stats.prayerCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-crimson-100 text-crimson-600 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider">New Requests</p>
              <p className="font-display text-3xl font-extrabold text-emerald-600 mt-1">{loading ? '...' : stats.newPrayerCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Management Links */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-navy-900">Content & System Management</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/gallery" className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-mpl-50 text-mpl-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy-900 text-base mb-1 group-hover:text-mpl-600 transition-colors">Gallery Manager</h3>
              <p className="text-xs text-navy-600 mb-4">Create photo events, upload images, drag-and-drop reorder images.</p>
              <span className="text-xs font-semibold text-mpl-600 flex items-center">Open Gallery Admin <ArrowRight className="w-3.5 h-3.5 ml-1" /></span>
            </Link>

            <Link href="/admin/prayer-requests" className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-crimson-50 text-crimson-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy-900 text-base mb-1 group-hover:text-crimson-600 transition-colors">Prayer Requests</h3>
              <p className="text-xs text-navy-600 mb-4">View public & private requests, mark prayed, filter categories.</p>
              <span className="text-xs font-semibold text-crimson-600 flex items-center">Review Requests <ArrowRight className="w-3.5 h-3.5 ml-1" /></span>
            </Link>

            <Link href="/admin/about-editor" className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy-900 text-base mb-1 group-hover:text-blue-600 transition-colors">About Page Editor</h3>
              <p className="text-xs text-navy-600 mb-4">Edit Mission, Vision, MPL History story text & pillars without code deploy.</p>
              <span className="text-xs font-semibold text-blue-600 flex items-center">Edit About Content <ArrowRight className="w-3.5 h-3.5 ml-1" /></span>
            </Link>

            <Link href="/admin/contact-editor" className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy-900 text-base mb-1 group-hover:text-amber-600 transition-colors">Contact & Service Info</h3>
              <p className="text-xs text-navy-600 mb-4">Update service schedules, email, phone, map embed URL, and social links.</p>
              <span className="text-xs font-semibold text-amber-600 flex items-center">Edit Contact Info <ArrowRight className="w-3.5 h-3.5 ml-1" /></span>
            </Link>

            <Link href="/admin/settings" className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs hover:shadow-md transition-all group sm:col-span-2 lg:col-span-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy-900 text-base mb-1 group-hover:text-slate-900 transition-colors">Site Settings & Password</h3>
              <p className="text-xs text-navy-600 mb-4">Configure YouTube Channel ID, Resend notification email, and update Admin Password.</p>
              <span className="text-xs font-semibold text-slate-800 flex items-center">Manage System Settings <ArrowRight className="w-3.5 h-3.5 ml-1" /></span>
            </Link>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
