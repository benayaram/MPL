import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Image as ImageIcon, Sparkles, ArrowRight } from 'lucide-react';
import { dbStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function GalleryPage() {
  const events = await dbStore.getEvents();

  return (
    <div className="py-12 md:py-16 space-y-12">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-mpl-100 text-mpl-700 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-mpl-600" />
          <span>Ministry Gallery</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-navy-900 tracking-tight">
          Photo & Event Album
        </h1>
        <p className="text-navy-600 text-lg max-w-2xl mx-auto">
          Explore moments from our worship gatherings, Friday prayer fellowships, and youth outreach activities.
        </p>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-navy-100 p-8">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy-900">No Photo Albums Yet</h3>
            <p className="text-sm text-navy-600">Check back soon for new photos!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const coverImage = event.images[0]?.url || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80';
              return (
                <Link
                  key={event.id}
                  href={`/gallery/${event.id}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-navy-100 shadow-glass hover:shadow-glass-hover transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-60 w-full bg-navy-100 overflow-hidden">
                    <Image
                      src={coverImage}
                      alt={event.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-semibold flex items-center">
                      <ImageIcon className="w-3.5 h-3.5 mr-1" />
                      {event.images.length} Photos
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h2 className="font-display text-xl font-bold text-navy-900 group-hover:text-mpl-600 transition-colors">
                        {event.name}
                      </h2>
                      {event.description && (
                        <p className="text-xs text-navy-600 mt-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-navy-100 flex items-center justify-between text-xs text-navy-500">
                      <div className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-mpl-500" />
                        <span>{new Date(event.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="font-semibold text-mpl-600 group-hover:translate-x-1 transition-transform flex items-center">
                        View Album <ArrowRight className="w-3 h-3 ml-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
