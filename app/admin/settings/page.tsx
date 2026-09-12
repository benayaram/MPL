'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Save, CheckCircle2, Youtube, Mail, KeyRound, ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  const [youtubeChannelId, setYoutubeChannelId] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setYoutubeChannelId(data.youtubeChannelId || '');
          setNotificationEmail(data.notificationEmail || '');
          setNewUsername(data.username || 'admin');
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtubeChannelId,
          notificationEmail,
          newUsername,
          ...(newPassword && { newPassword })
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage('Settings and security credentials updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Failed to update settings');
      }
    } catch {
      setError('Network error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-xs text-navy-600 animate-pulse">Loading settings...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-navy-200">
          <h1 className="font-display text-3xl font-extrabold text-navy-900">Site Settings & Security</h1>
          <p className="text-xs text-navy-600 mt-1">Configure YouTube Channel ID, Resend Email alerts, and Admin credentials.</p>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center justify-between">
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />{message}</span>
            <button onClick={() => setMessage('')} className="font-bold text-xs">Dismiss</button>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Integration Settings Card */}
          <div className="bg-white p-8 rounded-2xl border border-navy-100 shadow-xs space-y-4">
            <h2 className="font-display font-bold text-navy-900 text-lg flex items-center">
              <Youtube className="w-5 h-5 text-red-600 mr-2" /> Live Stream & Email Notifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">YouTube Channel ID / Handle *</label>
                <input
                  type="text"
                  required
                  value={youtubeChannelId}
                  onChange={(e) => setYoutubeChannelId(e.target.value)}
                  placeholder="@mplministries"
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none"
                />
                <p className="text-[11px] text-navy-500 mt-1">Used by automated live stream detector on Home page.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Admin Notification Email *</label>
                <input
                  type="email"
                  required
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  placeholder="ministriesmpl7@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none"
                />
                <p className="text-[11px] text-navy-500 mt-1">Receives Resend alerts whenever a new prayer request is submitted.</p>
              </div>
            </div>
          </div>

          {/* Password Security Card */}
          <div className="bg-white p-8 rounded-2xl border border-navy-100 shadow-xs space-y-4">
            <h2 className="font-display font-bold text-navy-900 text-lg flex items-center">
              <ShieldCheck className="w-5 h-5 text-mpl-600 mr-2" /> Admin Credentials
            </h2>

            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Admin Username</label>
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">New Password (Leave blank to keep current)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-7 py-3 rounded-xl font-bold text-xs text-white bg-mpl-500 hover:bg-mpl-600 transition-colors shadow-md flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Updating Settings...' : 'Save Settings & Credentials'}
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
}
