'use client';

import { useState, useEffect } from 'react';
import { Youtube, Radio, PlayCircle, RefreshCw } from 'lucide-react';
import { LiveStatusCache } from '@/lib/models/schema';

export default function LiveStreamEmbed() {
  const [status, setStatus] = useState<LiveStatusCache | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/live-status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching live status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const videoId = status?.videoId && status.videoId !== 'live_stream_placeholder' 
    ? status.videoId 
    : 'dQw4w9WgXcQ'; // default clean embed fallback or channel embed

  const isLive = Boolean(status?.isLive);

  return (
    <div className="bg-white rounded-3xl border border-navy-100 shadow-glass overflow-hidden transition-all duration-300 hover:shadow-glass-hover">
      
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          {isLive ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white animate-pulse">
              <Radio className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              LIVE NOW
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-mpl-500/20 text-mpl-400 border border-mpl-500/30">
              <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
              LATEST WORSHIP & BROADCAST
            </span>
          )}
          <h3 className="text-sm font-semibold truncate max-w-md hidden sm:block">
            {status?.title || 'MPL Ministries Online Fellowship'}
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadStatus}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-navy-700 transition-colors"
            title="Check Live Status"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <a
            href="http://www.youtube.com/@mplministries"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            <Youtube className="w-3.5 h-3.5 mr-1" />
            <span>Subscribe</span>
          </a>
        </div>
      </div>

      {/* Video Player Container */}
      <div className="relative aspect-video bg-navy-950 w-full overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-mpl-500 mb-2" />
            <p className="text-sm">Connecting to YouTube live feed...</p>
          </div>
        ) : isLive && status?.videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${status.videoId}?autoplay=1&mute=0`}
            title="MPL Ministries YouTube Live Stream"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          ></iframe>
        ) : status?.videoId && status.videoId !== 'live_stream_placeholder' ? (
          <iframe
            src={`https://www.youtube.com/embed/${status.videoId}`}
            title="MPL Ministries Latest Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          ></iframe>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-br from-navy-900 to-navy-950">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mb-4 border border-red-500/30">
              <Youtube className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold mb-1">No Active Live Stream Currently</h4>
            <p className="text-sm text-slate-300 max-w-md mb-4">
              We broadcast weekly online fellowship services. Subscribe to our YouTube channel to receive notifications when we go live!
            </p>
            <a
              href="http://www.youtube.com/@mplministries"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 rounded-full font-semibold text-sm bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all"
            >
              <Youtube className="w-4 h-4 mr-2" />
              Visit @mplministries YouTube Channel
            </a>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-navy-50/50 border-t border-navy-100 flex flex-col sm:flex-row items-center justify-between text-xs text-navy-600 gap-2">
        <span>📍 Online Live Broadcasts • Fridays & Sundays</span>
        <span className="text-mpl-600 font-semibold">Join us in prayer & testimony</span>
      </div>
    </div>
  );
}
