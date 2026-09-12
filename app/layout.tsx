import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mplministries.vercel.app'),
  title: 'MPL Ministries — Youth Fellowship & Prayer Ministry',
  description: 'To spread the Gospel of Jesus Christ, nurture spiritual growth, and build a community of believers equipped to serve God and impact their world with His love.',
  keywords: ['MPL Ministries', 'Youth Fellowship', 'Christian Ministry', 'Fasting and Prayer', 'Evangelism', 'Prayer Requests'],
  openGraph: {
    title: 'MPL Ministries — Youth Fellowship & Prayer Ministry',
    description: 'Connecting youth personally and spiritually through prayer, fellowship, and action.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <body className="bg-[#FAFAFC] text-navy-900 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
