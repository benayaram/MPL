'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, HeartHandshake, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/gallery', label: 'Photo Gallery' },
    { href: '/prayer-request', label: 'Prayer Wall' },
    { href: '/contact', label: 'Contact & Worship' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-navy-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="MPL Ministries Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-navy-900 tracking-tight leading-tight group-hover:text-mpl-600 transition-colors">
                MPL Ministries
              </span>
              <span className="text-xs font-semibold text-mpl-500 tracking-wider uppercase">
                Youth Fellowship
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-mpl-50 text-mpl-600 font-semibold shadow-xs'
                      : 'text-navy-700 hover:text-mpl-600 hover:bg-navy-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Action Button */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/prayer-request"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-mpl-500 to-mpl-600 hover:from-mpl-600 hover:to-mpl-700 shadow-md hover:shadow-lg hover:shadow-mpl-500/20 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <HeartHandshake className="w-4 h-4 mr-2" />
              Need Prayer?
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-navy-700 hover:bg-navy-100 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-navy-100 shadow-xl px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  active
                    ? 'bg-mpl-50 text-mpl-600 font-semibold'
                    : 'text-navy-700 hover:bg-navy-50 hover:text-mpl-600'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3">
            <Link
              href="/prayer-request"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center px-5 py-3 rounded-xl text-base font-semibold text-white bg-mpl-500 hover:bg-mpl-600 shadow-md text-center"
            >
              <HeartHandshake className="w-5 h-5 mr-2" />
              Need Prayer? Submit Request
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
