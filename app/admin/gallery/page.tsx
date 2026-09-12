'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Trash2, ArrowUp, ArrowDown, Upload, Image as ImageIcon, CheckCircle2, FileImage } from 'lucide-react';
import { GalleryEvent } from '@/lib/models/schema';

export default function AdminGalleryPage() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // New Event Form
  const [newEventName, setNewEventName] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [creatingEvent, setCreatingEvent] = useState(false);

  // Add Image Form
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [addingImage, setAddingImage] = useState(false);

  const [message, setMessage] = useState('');

  const loadEvents = async () => {
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
        if (data.length > 0 && !selectedEventId) {
          setSelectedEventId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading gallery events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim()) return;
    setCreatingEvent(true);

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newEventName, description: newEventDesc })
      });

      if (res.ok) {
        const created = await res.json();
        setNewEventName('');
        setNewEventDesc('');
        setMessage('Event created successfully!');
        await loadEvents();
        setSelectedEventId(created.id);
      }
    } catch (err) {
      console.error('Error creating event:', err);
    } finally {
      setCreatingEvent(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image file under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !imageUrl.trim()) return;
    setAddingImage(true);

    try {
      const res = await fetch(`/api/gallery/${selectedEventId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl.trim(), caption: imageCaption.trim() })
      });

      if (res.ok) {
        setImageUrl('');
        setImageCaption('');
        setMessage('Photo uploaded to gallery album!');
        await loadEvents();
      }
    } catch (err) {
      console.error('Error adding image:', err);
    } finally {
      setAddingImage(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!selectedEventId || !confirm('Are you sure you want to remove this photo?')) return;
    try {
      const res = await fetch(`/api/gallery/${selectedEventId}?imageId=${imageId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMessage('Photo deleted');
        await loadEvents();
      }
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this entire event and all its photos?')) return;
    try {
      const res = await fetch(`/api/gallery/${eventId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Event deleted');
        if (selectedEventId === eventId) setSelectedEventId(null);
        await loadEvents();
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const handleReorder = async (direction: 'up' | 'down', index: number) => {
    const selectedEvent = events.find(e => e.id === selectedEventId);
    if (!selectedEvent) return;

    const newImages = [...selectedEvent.images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    const newIds = newImages.map(img => img.id);

    try {
      const res = await fetch(`/api/gallery/${selectedEventId}/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageIds: newIds })
      });

      if (res.ok) {
        await loadEvents();
      }
    } catch (err) {
      console.error('Error reordering images:', err);
    }
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-navy-200">
          <h1 className="font-display text-3xl font-extrabold text-navy-900">Gallery Manager</h1>
          <p className="text-xs text-navy-600 mt-1">Create photo albums, upload photos directly from your device, and reorder images within events.</p>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center justify-between">
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />{message}</span>
            <button onClick={() => setMessage('')} className="text-xs font-bold">Dismiss</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Create Event & Event Selection List */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Create Event Form */}
            <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs space-y-4">
              <h2 className="font-display font-bold text-navy-900 text-base flex items-center">
                <Plus className="w-4 h-4 mr-1 text-mpl-600" /> Create New Event
              </h2>
              <form onSubmit={handleCreateEvent} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Event Name *</label>
                  <input
                    type="text"
                    required
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    placeholder="e.g. Youth Camp 2026"
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Description (Optional)</label>
                  <textarea
                    rows={2}
                    value={newEventDesc}
                    onChange={(e) => setNewEventDesc(e.target.value)}
                    placeholder="Short description of the event..."
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={creatingEvent}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-mpl-500 hover:bg-mpl-600 transition-colors shadow-xs"
                >
                  {creatingEvent ? 'Creating...' : 'Create Event'}
                </button>
              </form>
            </div>

            {/* Events List */}
            <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs space-y-3">
              <h2 className="font-display font-bold text-navy-900 text-base">Photo Albums ({events.length})</h2>
              
              {loading ? (
                <p className="text-xs text-navy-500">Loading albums...</p>
              ) : events.length === 0 ? (
                <p className="text-xs text-navy-500">No events created yet.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEventId(evt.id)}
                      className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer flex items-center justify-between transition-all ${
                        selectedEventId === evt.id
                          ? 'bg-mpl-50 border-mpl-500 text-mpl-700 shadow-xs'
                          : 'bg-navy-50/50 border-navy-100 text-navy-800 hover:bg-navy-100'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <p className="truncate font-bold">{evt.name}</p>
                        <p className="text-[10px] text-navy-500">{evt.images.length} photos</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(evt.id);
                        }}
                        className="p-1 rounded text-red-500 hover:bg-red-100 transition-colors"
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Add Photos & Image List Reorder */}
          <div className="lg:col-span-8 space-y-6">
            
            {selectedEvent ? (
              <>
                {/* Event Header & Add Photo Form */}
                <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-navy-100">
                    <div>
                      <h2 className="font-display text-xl font-bold text-navy-900">{selectedEvent.name}</h2>
                      {selectedEvent.description && (
                        <p className="text-xs text-navy-600 mt-0.5">{selectedEvent.description}</p>
                      )}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-navy-100 text-navy-700">
                      {selectedEvent.images.length} Photos
                    </span>
                  </div>

                  <form onSubmit={handleAddImage} className="space-y-4">
                    <h3 className="text-xs font-bold text-navy-900 flex items-center">
                      <Upload className="w-3.5 h-3.5 mr-1 text-mpl-600" /> Upload or Add Photo to this Album
                    </h3>

                    {/* Direct File Picker Option */}
                    <div className="p-4 rounded-xl border border-dashed border-mpl-300 bg-mpl-50/50 space-y-2 text-center">
                      <FileImage className="w-6 h-6 text-mpl-600 mx-auto" />
                      <p className="text-xs font-bold text-navy-900">Upload Image File directly from Computer/Phone</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="text-xs text-navy-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-mpl-500 file:text-white hover:file:bg-mpl-600 cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-navy-700 mb-1">Image URL / Selected Image *</label>
                        <input
                          type="text"
                          required
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="Image URL or upload file above"
                          className="w-full px-3 py-2 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-navy-700 mb-1">Caption (Optional)</label>
                        <input
                          type="text"
                          value={imageCaption}
                          onChange={(e) => setImageCaption(e.target.value)}
                          placeholder="e.g. Worship & Fellowship Time"
                          className="w-full px-3 py-2 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-mpl-500 outline-none"
                        />
                      </div>
                    </div>

                    {imageUrl && (
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-navy-200">
                        <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={addingImage || !imageUrl}
                      className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-navy-900 hover:bg-navy-800 transition-colors disabled:opacity-50"
                    >
                      {addingImage ? 'Uploading Photo...' : 'Add Photo to Album'}
                    </button>
                  </form>
                </div>

                {/* Images Grid & Reorder */}
                <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs space-y-4">
                  <h3 className="font-display font-bold text-navy-900 text-sm">Photos in this Event (Drag / Reorder)</h3>
                  
                  {selectedEvent.images.length === 0 ? (
                    <p className="text-xs text-navy-500 py-8 text-center">No photos in this album yet. Use the form above to add photos.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedEvent.images.map((img, index) => (
                        <div key={img.id} className="p-3 rounded-xl border border-navy-200 bg-navy-50/50 flex items-center space-x-3">
                          <div className="relative w-16 h-16 bg-navy-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={img.url} alt={img.caption || 'Photo'} fill className="object-cover" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-navy-900 truncate">{img.caption || `Photo ${index + 1}`}</p>
                            <p className="text-[10px] text-navy-500">Order: #{index + 1}</p>
                          </div>

                          {/* Reorder Buttons & Delete */}
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleReorder('up', index)}
                              disabled={index === 0}
                              className="p-1 rounded bg-white border border-navy-200 text-navy-700 hover:bg-navy-100 disabled:opacity-30"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleReorder('down', index)}
                              disabled={index === selectedEvent.images.length - 1}
                              className="p-1 rounded bg-white border border-navy-200 text-navy-700 hover:bg-navy-100 disabled:opacity-30"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteImage(img.id)}
                              className="p-1 rounded bg-white border border-red-200 text-red-600 hover:bg-red-50"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-navy-100 text-center">
                <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-navy-600">Select an event album on the left to view and manage its photos.</p>
              </div>
            )}

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
