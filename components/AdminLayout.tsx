'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Image as ImageIcon, HeartHandshake, FileText, Phone, Settings, LogOut, ShieldAlert } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setAuthenticated(true);
          } else {
            router.push('/admin/login');
          }
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/gallery', label: 'Gallery Manager', icon: ImageIcon },
    { href: '/admin/prayer-requests', label: 'Prayer Requests', icon: HeartHandshake },
    { href: '/admin/about-editor', label: 'About Page', icon: FileText },
    { href: '/admin/contact-editor', label: 'Contact Info', icon: Phone },
    { href: '/admin/settings', label: 'Settings & Security', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-mpl-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-navy-600 font-semibold">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-navy-900 text-slate-300 p-6 flex flex-col justify-between border-r border-navy-800">
        <div className="space-y-8">
          
          {/* Header Branding */}
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 bg-white p-1 rounded-xl shadow-xs">
              <Image src="/logo.png" alt="MPL Logo" fill className="object-contain" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-base leading-tight">MPL Admin</h2>
              <span className="text-[10px] text-mpl-400 font-semibold uppercase tracking-wider">Control Center</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-mpl-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout & Public Site Link */}
        <div className="pt-6 border-t border-navy-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-slate-400 hover:text-white transition-colors px-2 py-1.5"
          >
            <span>View Public Website</span>
            <span>↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 bg-navy-950 hover:bg-red-950/40 border border-red-900/30 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
