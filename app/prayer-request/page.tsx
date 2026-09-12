'use client';

import { useState, useEffect } from 'react';
import { HeartHandshake, ShieldCheck, Send, CheckCircle2, Lock, Globe, Sparkles, MessageSquare } from 'lucide-react';
import { PrayerRequest } from '@/lib/models/schema';

export default function PrayerRequestPage() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState<'Healing' | 'Family' | 'Financial' | 'Guidance' | 'Spiritual' | 'Other'>('Healing');
  const [message, setMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // Anti-spam honeypot
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [publicRequests, setPublicRequests] = useState<PrayerRequest[]>([]);
  const [loadingWall, setLoadingWall] = useState(true);

  const fetchWall = async () => {
    try {
      const res = await fetch('/api/prayer-requests');
      if (res.ok) {
        const data = await res.json();
        setPublicRequests(data);
      }
    } catch (error) {
      console.error('Error fetching public wall:', error);
    } finally {
      setLoadingWall(false);
    }
  };

  useEffect(() => {
    fetchWall();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/prayer-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact,
          category,
          message,
          isPrivate,
          honeypot
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setName('');
        setContact('');
        setMessage('');
        setIsPrivate(false);
        fetchWall();
      } else {
        const err = await res.json();
        setErrorMessage(err.error || 'Failed to submit request');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-mpl-100 text-mpl-700 text-xs font-semibold uppercase tracking-wider">
          <HeartHandshake className="w-3.5 h-3.5 mr-1.5 text-mpl-600" />
          <span>Standing In Faith Together</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-navy-900 tracking-tight">
          Submit A Prayer Request
        </h1>
        <p className="text-navy-600 text-base sm:text-lg">
          No matter what burden or need you are carrying, our dedicated prayer fellowship will intercede with you in faith.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Form Container */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-navy-100 shadow-glass">
          <h2 className="font-display text-2xl font-bold text-navy-900 mb-2">Share Your Need</h2>
          <p className="text-xs text-navy-600 mb-6">Fill in your prayer details below. Mark private if you only want our leadership team to view it.</p>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-bold text-navy-900">Prayer Request Received!</h3>
              <p className="text-sm text-navy-700">
                Thank you for reaching out. Our MPL Ministries prayer warriors are interceding for your request right now.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-full bg-mpl-500 hover:bg-mpl-600 text-white text-xs font-semibold transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Honeypot Spam Protection Field (Hidden) */}
              <input
                type="text"
                name="website_url"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Brother John"
                    className="w-full px-4 py-3 rounded-xl border border-navy-200 text-sm focus:ring-2 focus:ring-mpl-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Contact (Phone / Email)</label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Phone or email (optional)"
                    className="w-full px-4 py-3 rounded-xl border border-navy-200 text-sm focus:ring-2 focus:ring-mpl-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl border border-navy-200 text-sm focus:ring-2 focus:ring-mpl-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="Healing">Healing & Health</option>
                  <option value="Family">Family & Relationships</option>
                  <option value="Financial">Financial & Job Need</option>
                  <option value="Guidance">Guidance & Direction</option>
                  <option value="Spiritual">Spiritual Growth</option>
                  <option value="Other">Other Request</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Prayer Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your prayer request in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-navy-200 text-sm focus:ring-2 focus:ring-mpl-500 focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>

              {/* Private Toggle */}
              <div className="p-4 rounded-xl bg-navy-50/70 border border-navy-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isPrivate ? (
                    <Lock className="w-5 h-5 text-crimson-600 flex-shrink-0" />
                  ) : (
                    <Globe className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-navy-900">
                      {isPrivate ? 'Keep Confidential & Private' : 'Public Prayer Wall Eligible'}
                    </p>
                    <p className="text-[11px] text-navy-600">
                      {isPrivate
                        ? 'Only MPL admin leadership can view this request.'
                        : 'May be displayed on the prayer wall for believers to stand in prayer.'}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-5 h-5 text-mpl-600 rounded border-navy-300 focus:ring-mpl-500 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center px-6 py-3.5 rounded-full text-base font-bold text-white bg-gradient-to-r from-mpl-500 to-mpl-600 hover:from-mpl-600 hover:to-mpl-700 shadow-md hover:shadow-lg transition-all"
              >
                {submitting ? 'Submitting Request...' : 'Send Prayer Request'}
                <Send className="w-4 h-4 ml-2" />
              </button>

            </form>
          )}
        </div>

        {/* Public Prayer Wall Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-navy-100 shadow-glass">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="w-5 h-5 text-mpl-600" />
              <h2 className="font-display text-xl font-bold text-navy-900">Public Prayer Wall</h2>
            </div>
            <p className="text-xs text-navy-600 mb-4">
              Join us in praying for these requests submitted by brothers and sisters.
            </p>

            {loadingWall ? (
              <p className="text-xs text-navy-600 animate-pulse py-8 text-center">Loading prayer wall...</p>
            ) : publicRequests.length === 0 ? (
              <p className="text-xs text-navy-600 py-8 text-center">No public requests listed currently.</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {publicRequests.map((pr) => (
                  <div key={pr.id} className="p-4 rounded-2xl bg-navy-50/60 border border-navy-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-900">{pr.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-mpl-100 text-mpl-700">
                        {pr.category}
                      </span>
                    </div>
                    <p className="text-xs text-navy-700 line-clamp-3 italic">&ldquo;{pr.message}&rdquo;</p>
                    <div className="flex items-center justify-between text-[10px] text-navy-500 pt-1">
                      <span>{new Date(pr.createdAt).toLocaleDateString()}</span>
                      <span className="text-emerald-600 font-semibold flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Prayed For
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
