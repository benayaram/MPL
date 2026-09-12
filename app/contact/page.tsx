import { Mail, Phone, MapPin, Clock, Instagram, Youtube, Sparkles, Send } from 'lucide-react';
import { dbStore } from '@/lib/db/store';

export const revalidate = 60;

export default async function ContactPage() {
  const contact = dbStore.getContact();

  return (
    <div className="py-12 md:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-mpl-100 text-mpl-700 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-mpl-600" />
          <span>Connect With MPL Ministries</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-navy-900 tracking-tight">
          Contact & Fellowship Schedule
        </h1>
        <p className="text-navy-600 text-base sm:text-lg">
          We would love to hear from you. Join our weekly fellowship meetings or connect with us on social media.
        </p>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Service Times & Contact Info */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Fellowship Times Card */}
          <div className="bg-white rounded-3xl p-8 border border-navy-100 shadow-glass">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-mpl-100 text-mpl-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="font-display text-2xl font-bold text-navy-900">Fellowship & Service Times</h2>
            </div>

            <div className="space-y-4">
              {contact.serviceTimes.map((item, index) => (
                <div key={index} className="p-4 rounded-2xl bg-navy-50/60 border border-navy-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-navy-900 text-sm">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-navy-600 mt-0.5">{item.description}</p>
                    )}
                  </div>
                  <div className="text-xs font-semibold px-3 py-1 rounded-full bg-mpl-500 text-white self-start sm:self-center">
                    {item.day}: {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Channels */}
          <div className="bg-white rounded-3xl p-8 border border-navy-100 shadow-glass space-y-6">
            <h2 className="font-display text-2xl font-bold text-navy-900">Direct Contact Channels</h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-center space-x-4 p-3 rounded-2xl bg-navy-50/50">
                <div className="w-10 h-10 rounded-xl bg-mpl-100 text-mpl-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-navy-500 font-medium">Official Email</p>
                  <a href={`mailto:${contact.email}`} className="font-semibold text-navy-900 hover:text-mpl-600 transition-colors">
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-2xl bg-navy-50/50">
                <div className="w-10 h-10 rounded-xl bg-mpl-100 text-mpl-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-navy-500 font-medium">Fellowship Location</p>
                  <p className="font-semibold text-navy-900">{contact.address}</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-navy-100 space-y-3">
              <p className="text-xs font-bold text-navy-900 uppercase tracking-wider">Official Social Profiles</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://www.instagram.com/mpl__ministries?stkn=MWt5ajIxZjhxaG5qNQ%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl border border-navy-200 hover:border-pink-500 flex items-center space-x-3 transition-colors group"
                >
                  <Instagram className="w-5 h-5 text-pink-500" />
                  <span className="text-xs font-semibold text-navy-800 group-hover:text-pink-600">@mpl__ministries</span>
                </a>

                <a
                  href="https://www.instagram.com/mplwarriors?stkn=Y3F5aWVyMzhra3Nj&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl border border-navy-200 hover:border-pink-500 flex items-center space-x-3 transition-colors group"
                >
                  <Instagram className="w-5 h-5 text-pink-500" />
                  <span className="text-xs font-semibold text-navy-800 group-hover:text-pink-600">@mplwarriors</span>
                </a>

                <a
                  href="http://www.youtube.com/@mplministries"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl border border-navy-200 hover:border-red-500 flex items-center space-x-3 transition-colors group sm:col-span-2"
                >
                  <Youtube className="w-5 h-5 text-red-500" />
                  <span className="text-xs font-semibold text-navy-800 group-hover:text-red-600">YouTube: @mplministries</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Map Embed Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-navy-100 shadow-glass space-y-4">
          <h2 className="font-display text-2xl font-bold text-navy-900">Ministry Location Map</h2>
          <p className="text-xs text-navy-600">Visit us or join our regional fellowship centers.</p>
          
          <div className="aspect-square sm:aspect-video lg:aspect-square w-full rounded-2xl overflow-hidden border border-navy-200">
            <iframe
              src={contact.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MPL Ministries Location Map"
            ></iframe>
          </div>
        </div>

      </div>

    </div>
  );
}
