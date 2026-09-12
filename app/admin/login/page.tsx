'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, User, KeyRound, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mpl-50 via-white to-navy-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-navy-100 shadow-2xl space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 mx-auto bg-white p-2 rounded-2xl shadow-sm border border-navy-100">
            <Image src="/logo.png" alt="MPL Ministries Logo" fill className="object-contain p-1" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-navy-900">MPL Admin Login</h1>
          <p className="text-xs text-navy-600">Sign in to manage prayer requests, gallery, and site content.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-navy-200 text-sm focus:ring-2 focus:ring-mpl-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-navy-200 text-sm focus:ring-2 focus:ring-mpl-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-mpl-500 to-mpl-600 hover:from-mpl-600 hover:to-mpl-700 shadow-md transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In To Dashboard'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>

        <div className="pt-4 border-t border-navy-100 text-center text-xs text-navy-500">
          Default setup: Username <code className="bg-navy-100 px-1.5 py-0.5 rounded text-navy-800">admin</code> / Password <code className="bg-navy-100 px-1.5 py-0.5 rounded text-navy-800">admin123</code>
        </div>

      </div>
    </div>
  );
}
