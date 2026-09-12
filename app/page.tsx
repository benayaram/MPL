import Image from 'next/image';
import Link from 'next/link';
import { Heart, Flame, Users, Calendar, ArrowRight, HeartHandshake, ShieldCheck, Sparkles, Video } from 'lucide-react';
import LiveStreamEmbed from '@/components/LiveStreamEmbed';
import { dbStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const about = await dbStore.getAbout();
  const events = (await dbStore.getEvents()).slice(0, 3);

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-mpl-50/80 via-white to-[#FAFAFC] pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-navy-100/60">
        
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-mpl-300/20 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-crimson-200/20 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Text Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-mpl-100/80 border border-mpl-200 text-mpl-700 text-xs font-semibold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-mpl-600" />
                <span>MPL Ministries • Youth Fellowship</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-[1.15]">
                Spreading the Gospel & <span className="text-transparent bg-clip-text bg-gradient-to-r from-mpl-600 via-amber-500 to-mpl-500">Nurturing Youth</span> Through Faith & Prayer
              </h1>

              <p className="text-lg sm:text-xl text-navy-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Born through dedicated Friday fasting and prayer, MPL Team connects young believers worldwide to grow spiritually, share testimonies, and impact communities with Christ’s love.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/prayer-request"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-full text-base font-semibold text-white bg-gradient-to-r from-mpl-500 to-mpl-600 hover:from-mpl-600 hover:to-mpl-700 shadow-lg hover:shadow-mpl-500/25 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <HeartHandshake className="w-5 h-5 mr-2.5" />
                  Submit Prayer Request
                </Link>

                <Link
                  href="/about"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-full text-base font-semibold text-navy-800 bg-white hover:bg-navy-50 border border-navy-200 shadow-sm transition-all duration-200"
                >
                  Read Our Story
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-navy-100 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-navy-600">
                <div className="flex items-center space-x-1.5">
                  <Heart className="w-4 h-4 text-crimson-600 fill-crimson-100" />
                  <span>Personal Evangelism</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Flame className="w-4 h-4 text-mpl-500" />
                  <span>Friday Fasting & Prayer</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-navy-700" />
                  <span>Christ-Centered Youth</span>
                </div>
              </div>

            </div>

            {/* Hero Branding & Logo Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 bg-white rounded-3xl p-8 shadow-2xl border border-navy-100 flex flex-col items-center justify-center text-center transform hover:scale-[1.02] transition-transform duration-300 group">
                
                <div className="absolute inset-0 bg-gradient-to-tr from-mpl-50/50 via-transparent to-crimson-50/30 rounded-3xl pointer-events-none"></div>

                <div className="relative w-48 h-48 sm:w-60 sm:h-60 mb-4 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/logo.png"
                    alt="MPL Ministries Logo Emblem"
                    fill
                    className="object-contain drop-shadow-md"
                    priority
                  />
                </div>

                <div className="relative z-10">
                  <h3 className="font-display font-bold text-navy-900 text-lg">MAKE PEOPLE FOR THE LORD</h3>
                  <p className="text-xs text-mpl-600 font-semibold tracking-wider uppercase mt-0.5">MPL Ministries</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Live YouTube Stream & Worship Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            <Video className="w-3.5 h-3.5 mr-1.5" />
            <span>Live Fellowship & Media</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-900">
            Join Our Live Online Broadcasts
          </h2>
          <p className="text-navy-600 text-base">
            Tune in for live praise, prayer, and word. If we are not currently live, enjoy our most recent worship stream.
          </p>
        </div>

        <LiveStreamEmbed />
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 border border-navy-100 shadow-glass hover:shadow-glass-hover transition-all duration-300 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-mpl-100 text-mpl-600 flex items-center justify-center mb-6 font-bold text-xl group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-navy-900 mb-3">Our Mission</h3>
            <p className="text-navy-700 leading-relaxed text-base">
              {about.mission}
            </p>
            <div className="mt-6 pt-4 border-t border-navy-100 text-xs font-semibold text-mpl-600 uppercase tracking-wider">
              Equipping Believers • Impacting Society
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-3xl p-8 border border-navy-100 shadow-glass hover:shadow-glass-hover transition-all duration-300 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-crimson-100 text-crimson-600 flex items-center justify-center mb-6 font-bold text-xl group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-navy-900 mb-3">Our Vision</h3>
            <p className="text-navy-700 leading-relaxed text-base">
              {about.vision}
            </p>
            <div className="mt-6 pt-4 border-t border-navy-100 text-xs font-semibold text-crimson-600 uppercase tracking-wider">
              Spiritual Growth • Personal Evangelism
            </div>
          </div>

        </div>
      </section>

      {/* Founding Story Snippet */}
      <section className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-mpl-500/20 text-mpl-400 border border-mpl-500/30">
                <span>The Story of MPL</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Born Through Simple Faith & Dedicated Prayer
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                During her college days, one student set aside her Friday lunch hours to fast and pray. Soon a classmate joined her. What started with two members quickly grew into a vibrant fellowship connecting youth across locations.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3.5 rounded-full text-sm font-semibold bg-mpl-500 hover:bg-mpl-600 text-white shadow-lg transition-all"
              >
                Read Full Ministry Story
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-navy-900">Ministry Photo Events</h2>
            <p className="text-navy-600 text-sm mt-1">Moments of worship, fellowship, and outreach</p>
          </div>
          <Link
            href="/gallery"
            className="mt-4 sm:mt-0 text-sm font-semibold text-mpl-600 hover:text-mpl-700 flex items-center"
          >
            View All Events & Photos
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => {
            const coverImage = event.images[0]?.url || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80';
            return (
              <Link
                key={event.id}
                href={`/gallery/${event.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-navy-100 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 w-full overflow-hidden bg-navy-100">
                  <Image
                    src={coverImage}
                    alt={event.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-medium">
                    {event.images.length} Photos
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-display font-bold text-lg text-navy-900 group-hover:text-mpl-600 transition-colors">
                    {event.name}
                  </h3>
                  {event.description && (
                    <p className="text-xs text-navy-600 line-clamp-2">{event.description}</p>
                  )}
                  <div className="pt-2 text-xs text-navy-600 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    <span>{new Date(event.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Prayer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-mpl-500 to-amber-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Have a Prayer Need? We Are Here For You.</h2>
            <p className="text-mpl-100 text-sm sm:text-base max-w-xl">
              Submit your prayer request confidentially or share it with our prayer wall team. We believe God answers prayer.
            </p>
          </div>
          <Link
            href="/prayer-request"
            className="px-7 py-3.5 rounded-full bg-white text-mpl-700 font-bold text-sm hover:bg-mpl-50 shadow-md transition-colors whitespace-nowrap"
          >
            Submit Prayer Request
          </Link>
        </div>
      </section>

    </div>
  );
}
