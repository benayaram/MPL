import Image from 'next/image';
import Link from 'next/link';
import { Flame, Heart, BookOpen, Users, Sparkles, ArrowRight, HeartHandshake } from 'lucide-react';
import { dbStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
  const about = await dbStore.getAbout();

  return (
    <div className="py-12 md:py-16 space-y-16">
      
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-mpl-100 text-mpl-700 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-mpl-600" />
          <span>About MPL Ministries</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-navy-900 tracking-tight">
          {about.title}
        </h1>
        <p className="text-navy-600 text-lg max-w-3xl mx-auto">
          {about.subtitle}
        </p>
      </section>

      {/* Mission & Vision Detailed Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 border border-navy-100 shadow-glass relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-mpl-100 text-mpl-600 flex items-center justify-center font-bold">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-mpl-600 uppercase tracking-wider">Core Purpose</span>
                <h2 className="font-display text-2xl font-bold text-navy-900">Our Mission</h2>
              </div>
            </div>
            <p className="text-navy-700 leading-relaxed text-base">
              {about.mission}
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-3xl p-8 border border-navy-100 shadow-glass relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-crimson-100 text-crimson-600 flex items-center justify-center font-bold">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-crimson-600 uppercase tracking-wider">Guiding Light</span>
                <h2 className="font-display text-2xl font-bold text-navy-900">Our Vision</h2>
              </div>
            </div>
            <p className="text-navy-700 leading-relaxed text-base">
              {about.vision}
            </p>
          </div>

        </div>
      </section>

      {/* MPL Started (History Story) Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-navy-100 shadow-glass">
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="inline-flex items-center space-x-2 text-mpl-600 font-semibold text-sm">
              <BookOpen className="w-4 h-4" />
              <span>How MPL Started</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-900">
              The Journey of Faith, Fasting, & Fellowship
            </h2>

            <div className="prose prose-slate max-w-none text-navy-700 leading-relaxed text-base space-y-4 whitespace-pre-line font-normal">
              {about.story}
            </div>

          </div>
        </div>
      </section>

      {/* Core Ministry Pillars */}
      {about.pillars && about.pillars.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display text-3xl font-bold text-navy-900">Four Pillars of MPL</h2>
            <p className="text-navy-600 text-sm mt-1">What drives our daily service and fellowship</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {about.pillars.map((pillar, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-navy-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-mpl-50 text-mpl-600 flex items-center justify-center mb-4 font-bold text-lg">
                  0{index + 1}
                </div>
                <h3 className="font-display font-bold text-navy-900 text-lg mb-2">{pillar.title}</h3>
                <p className="text-navy-600 text-xs leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-display text-2xl font-bold">Want to Connect or Join Friday Prayer?</h3>
            <p className="text-slate-300 text-sm">Reach out directly to our team via email or social media.</p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-full bg-mpl-500 hover:bg-mpl-600 text-white font-semibold text-sm shadow-md transition-colors"
          >
            Get In Touch
          </Link>
        </div>
      </section>

    </div>
  );
}
