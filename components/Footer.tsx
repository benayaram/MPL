import Link from 'next/link';
import Image from 'next/image';
import { Mail, Instagram, Youtube, Lock, Heart, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-300 pt-16 pb-12 border-t border-navy-800 relative overflow-hidden">
      {/* Background Decorative Accent Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-mpl-500 to-transparent opacity-60"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-navy-800">
          
          {/* Brand & Mission Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3 group inline-flex">
              <div className="relative w-12 h-12 flex-shrink-0 bg-white p-1 rounded-full shadow-sm">
                <Image
                  src="/logo.png"
                  alt="MPL Ministries Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-white tracking-tight">
                  MPL Ministries
                </span>
                <span className="text-xs font-semibold text-mpl-400 tracking-wider uppercase">
                  Youth Fellowship
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Spreading love and blessings, inspiring young generations through faith, fasting, prayer, and Christ-centered fellowship.
            </p>
            <div className="flex items-center space-x-2 text-xs text-mpl-400 font-medium pt-2">
              <Heart className="w-3.5 h-3.5 fill-mpl-500 text-mpl-500" />
              <span>Rooted in Prayer • Driven by Love</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h3 className="text-white font-display text-sm font-semibold uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-mpl-400 transition-colors flex items-center">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-mpl-400 transition-colors flex items-center">
                  <span>Our Story & Vision</span>
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-mpl-400 transition-colors flex items-center">
                  <span>Photo Gallery</span>
                </Link>
              </li>
              <li>
                <Link href="/prayer-request" className="hover:text-mpl-400 transition-colors flex items-center">
                  <span>Submit Prayer Request</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-mpl-400 transition-colors flex items-center">
                  <span>Contact & Service Info</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Social Handles */}
          <div>
            <h3 className="text-white font-display text-sm font-semibold uppercase tracking-wider mb-4">
              Connect With Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://www.instagram.com/mpl__ministries?stkn=MWt5ajIxZjhxaG5qNQ%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-slate-300 hover:text-mpl-400 transition-colors group"
                >
                  <Instagram className="w-4 h-4 mr-2.5 text-pink-500" />
                  <span>@mpl__ministries</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/mplwarriors?stkn=Y3F5aWVyMzhra3Nj&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-slate-300 hover:text-mpl-400 transition-colors group"
                >
                  <Instagram className="w-4 h-4 mr-2.5 text-pink-500" />
                  <span>@mplwarriors</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="http://www.youtube.com/@mplministries"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-slate-300 hover:text-mpl-400 transition-colors group"
                >
                  <Youtube className="w-4 h-4 mr-2.5 text-red-500" />
                  <span>@mplministries</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:ministriesmpl7@gmail.com"
                  className="inline-flex items-center text-slate-300 hover:text-mpl-400 transition-colors group"
                >
                  <Mail className="w-4 h-4 mr-2.5 text-mpl-400" />
                  <span>ministriesmpl7@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Ministry Hours & Administration */}
          <div>
            <h3 className="text-white font-display text-sm font-semibold uppercase tracking-wider mb-4">
              Fellowship Times
            </h3>
            <div className="space-y-2 text-xs text-slate-400">
              <p><span className="text-white font-medium">Friday Fasting & Prayer:</span> 12:00 PM</p>
              <p><span className="text-white font-medium">Sunday Youth Worship:</span> 6:30 PM</p>
              <p><span className="text-white font-medium">Wednesday Word Study:</span> 8:00 PM</p>
            </div>

            <div className="mt-6 pt-4 border-t border-navy-800">
              <Link
                href="/admin/login"
                className="inline-flex items-center text-xs text-slate-400 hover:text-mpl-400 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 mr-1.5" />
                <span>Admin Dashboard</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MPL Ministries. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">To God Be The Glory Forever</p>
        </div>
      </div>
    </footer>
  );
}
