'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Image as ImageIcon, Maximize2 } from 'lucide-react';
import Lightbox from '@/components/Lightbox';
import { GalleryEvent } from '@/lib/models/schema';

interface Context {
  params: Promise<{ eventId: string }>;
}

export default function EventGalleryPage({ params }: Context) {
  const { eventId } = use(params);
  const [event, setEvent] = useState<GalleryEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await fetch(`/api/gallery/${eventId}`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data);
        }
      } catch (err) {
        console.error('Error loading event:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-navy-600 text-sm animate-pulse">Loading photo album...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold text-navy-900">Event Not Found</h1>
        <p className="text-sm text-navy-600">The photo album you are looking for does not exist or has been removed.</p>
        <Link href="/gallery" className="inline-flex items-center text-mpl-600 font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header & Back Navigation */}
      <div className="space-y-4">
        <Link href="/gallery" className="inline-flex items-center text-xs font-semibold text-navy-600 hover:text-mpl-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Photo Albums
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-navy-100">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-900">{event.name}</h1>
            {event.description && (
              <p className="text-navy-600 text-sm mt-2 max-w-3xl">{event.description}</p>
            )}
          </div>
          <div className="flex items-center text-xs font-medium text-navy-500 bg-white px-3 py-1.5 rounded-full border border-navy-100 shadow-xs">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-mpl-500" />
            <span>{new Date(event.createdAt).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <ImageIcon className="w-3.5 h-3.5 mr-1 text-mpl-500" />
            <span>{event.images.length} Photos</span>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      {event.images.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-navy-100">
          <p className="text-sm text-navy-600">No images have been uploaded to this album yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {event.images.map((img, index) => (
            <div
              key={img.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-square bg-navy-100 rounded-2xl overflow-hidden cursor-pointer border border-navy-100 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <Image
                src={img.url}
                alt={img.caption || `Gallery photo ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white p-3">
                <Maximize2 className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
              </div>
              {img.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-xs font-medium truncate">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <Lightbox
          images={event.images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(index) => setLightboxIndex(index)}
        />
      )}

    </div>
  );
}
