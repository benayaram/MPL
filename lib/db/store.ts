import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { getMongoDb } from './mongodb';
import {
  AdminUser,
  GalleryEvent,
  PrayerRequest,
  AboutPageData,
  ContactInfoData,
  SiteSettings,
  LiveStatusCache,
} from '../models/schema';

// Initial Seed Content with Real Ministry Data
const defaultAbout: AboutPageData = {
  title: 'Welcome to MPL Ministries',
  subtitle: 'A vibrant fellowship connecting youth, rooted in prayer and driven by God\'s love.',
  mission: 'To spread the Gospel of Jesus Christ, nurture spiritual growth, and build a community of believers who are equipped to serve God and impact their world with His love.',
  vision: 'Spiritual development of the young generation • Personal evangelism • Social-spiritual services • To be blessed and share God\'s love through actions. Motto: Spread love and blessings, inspiring others through faith and service.',
  story: `MPL Team was born through the simple faith of one college student. During her college days, she set aside her Friday lunch hours to fast and pray. Soon, a friend joined her, and together they began sharing their testimony with classmates. What started with two members quickly grew into a fellowship — with students from different sections coming together to worship God.\n\nAfter college, though members were scattered, the grace of God brought them back together through technology. Today, MPL Team is a vibrant fellowship, connecting youth from different places, encouraging them to grow personally and spiritually.\n\nFrom the very beginning, this ministry was rooted in prayer, and by God’s grace, it continues to stand firm in prayer — impacting lives, strengthening faith, and building a Christ-centered community for the next generation.`,
  pillars: [
    { title: 'Youth Spiritual Development', description: 'Empowering the next generation through prayer, word, and fellowship.' },
    { title: 'Personal Evangelism', description: 'Sharing personal testimonies and God’s grace with classmates, friends, and communities.' },
    { title: 'Social-Spiritual Services', description: 'Putting faith into action by serving society and spreading love.' },
    { title: 'Prayer Fellowship', description: 'Rooted in dedicated fasting and prayer that unites believers across locations.' }
  ],
  images: [
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80'
  ],
  updatedAt: new Date().toISOString()
};

const defaultContact: ContactInfoData = {
  serviceTimes: [
    { day: 'Every Day Night', time: '10:00 PM - 11:00 PM', title: 'Daily Worship', description: 'Night prayer & worship' },
    { day: 'Every Morning', time: '05:00 AM - 6:00 AM', title: 'Daily Worship', description: 'Morning worship' },
    { day: 'Every first friday', time: '10:00 PM - 04:00 PM', title: 'Whole Night Prayer', description: 'All night fasting & prayer' }
  ],
  address: 'MPL Ministries Global Youth Fellowship',
  phone: '+91 98765 43210',
  email: 'ministriesmpl7@gmail.com',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.601570775836!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c906460e%3A0x2649a1d13a69623e!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  socialLinks: [
    { platform: 'Instagram', label: 'MPL Ministries Instagram', url: 'https://www.instagram.com/mpl__ministries?stkn=MWt5ajIxZjhxaG5qNQ%3D%3D&utm_source=qr' },
    { platform: 'Instagram', label: 'MPL Warriors Instagram', url: 'https://www.instagram.com/mplwarriors?stkn=Y3F5aWVyMzhra3Nj&utm_source=qr' },
    { platform: 'YouTube', label: 'MPL Ministries YouTube', url: 'http://www.youtube.com/@mplministries' },
    { platform: 'Email', label: 'Official Email', url: 'mailto:ministriesmpl7@gmail.com' }
  ],
  updatedAt: new Date().toISOString()
};

const defaultSettings: SiteSettings = {
  youtubeChannelId: '@mplministries',
  notificationEmail: 'ministriesmpl7@gmail.com',
  updatedAt: new Date().toISOString()
};

const defaultEvents: GalleryEvent[] = [
  {
    id: 'evt-1',
    name: 'MPL Youth Fellowship Gathering',
    description: 'A powerful evening of prayer, worship, and testimony with youth from different sections.',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    images: [
      { id: 'img-1', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80', caption: 'Youth Praise & Worship', order: 0, createdAt: new Date().toISOString() },
      { id: 'img-2', url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80', caption: 'Fasting & Prayer Time', order: 1, createdAt: new Date().toISOString() },
      { id: 'img-3', url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80', caption: 'Sharing Testimonies', order: 2, createdAt: new Date().toISOString() }
    ]
  },
  {
    id: 'evt-2',
    name: 'Friday Prayer & Fasting Outreach',
    description: 'Continuing the founding tradition of Friday prayer and sharing Christ’s love.',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    images: [
      { id: 'img-4', url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80', caption: 'Fellowship & Service', order: 0, createdAt: new Date().toISOString() },
      { id: 'img-5', url: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=800&q=80', caption: 'Group Prayer', order: 1, createdAt: new Date().toISOString() }
    ]
  }
];

const defaultPrayerRequests: PrayerRequest[] = [
  {
    id: 'pr-1',
    name: 'Sarah K.',
    contact: 'sarah@example.com',
    category: 'Healing',
    message: 'Please pray for my mother’s complete recovery and strength.',
    isPrivate: false,
    status: 'prayed',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'pr-2',
    name: 'David R.',
    contact: '+91 98765 00000',
    category: 'Guidance',
    message: 'Praying for divine wisdom and guidance for upcoming college exams and career choices.',
    isPrivate: false,
    status: 'prayed',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

interface StoreData {
  admin: AdminUser;
  about: AboutPageData;
  contact: ContactInfoData;
  settings: SiteSettings;
  events: GalleryEvent[];
  prayerRequests: PrayerRequest[];
  liveCache?: LiveStatusCache;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'mpl_store.json');

function ensureDataFile(): StoreData {
  if (!fs.existsSync(DATA_DIR)) {
    try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}
  }

  if (!fs.existsSync(FILE_PATH)) {
    const initialAdmin: AdminUser = {
      id: 'admin-1',
      username: process.env.ADMIN_INITIAL_USERNAME || 'admin',
      passwordHash: bcrypt.hashSync(process.env.ADMIN_INITIAL_PASSWORD || 'admin123', 10),
      updatedAt: new Date().toISOString()
    };

    const initialStore: StoreData = {
      admin: initialAdmin,
      about: defaultAbout,
      contact: defaultContact,
      settings: defaultSettings,
      events: defaultEvents,
      prayerRequests: defaultPrayerRequests
    };

    try { fs.writeFileSync(FILE_PATH, JSON.stringify(initialStore, null, 2), 'utf-8'); } catch {}
    return initialStore;
  }

  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    const initialAdmin: AdminUser = {
      id: 'admin-1',
      username: 'admin',
      passwordHash: bcrypt.hashSync('admin123', 10),
      updatedAt: new Date().toISOString()
    };
    const store: StoreData = {
      admin: initialAdmin,
      about: defaultAbout,
      contact: defaultContact,
      settings: defaultSettings,
      events: defaultEvents,
      prayerRequests: defaultPrayerRequests
    };
    try { fs.writeFileSync(FILE_PATH, JSON.stringify(store, null, 2), 'utf-8'); } catch {}
    return store;
  }
}

function saveStore(data: StoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Local store save warning (ephemeral serverless environment):', err);
  }
}

export const dbStore = {
  async getAdmin(): Promise<AdminUser> {
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection('admin').findOne({ _id: 'admin_user' as any });
      if (doc) return doc.data as AdminUser;
      const initialAdmin: AdminUser = {
        id: 'admin-1',
        username: process.env.ADMIN_INITIAL_USERNAME || 'admin',
        passwordHash: bcrypt.hashSync(process.env.ADMIN_INITIAL_PASSWORD || 'admin123', 10),
        updatedAt: new Date().toISOString()
      };
      await db.collection('admin').insertOne({ _id: 'admin_user' as any, data: initialAdmin });
      return initialAdmin;
    }
    const store = ensureDataFile();
    return store.admin;
  },

  async updateAdminPassword(newPasswordHash: string, newUsername?: string): Promise<AdminUser> {
    const db = await getMongoDb();
    if (db) {
      const admin = await this.getAdmin();
      admin.passwordHash = newPasswordHash;
      if (newUsername) admin.username = newUsername;
      admin.updatedAt = new Date().toISOString();
      await db.collection('admin').updateOne(
        { _id: 'admin_user' as any },
        { $set: { data: admin } },
        { upsert: true }
      );
      return admin;
    }
    const store = ensureDataFile();
    store.admin.passwordHash = newPasswordHash;
    if (newUsername) store.admin.username = newUsername;
    store.admin.updatedAt = new Date().toISOString();
    saveStore(store);
    return store.admin;
  },

  async getAbout(): Promise<AboutPageData> {
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection('about').findOne({ _id: 'about_page' as any });
      if (doc) return doc.data as AboutPageData;
      await db.collection('about').insertOne({ _id: 'about_page' as any, data: defaultAbout });
      return defaultAbout;
    }
    const store = ensureDataFile();
    return store.about || defaultAbout;
  },

  async updateAbout(data: Partial<AboutPageData>): Promise<AboutPageData> {
    const db = await getMongoDb();
    if (db) {
      const current = await this.getAbout();
      const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
      await db.collection('about').updateOne(
        { _id: 'about_page' as any },
        { $set: { data: updated } },
        { upsert: true }
      );
      return updated;
    }
    const store = ensureDataFile();
    store.about = { ...store.about, ...data, updatedAt: new Date().toISOString() };
    saveStore(store);
    return store.about;
  },

  async getContact(): Promise<ContactInfoData> {
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection('contact').findOne({ _id: 'contact_page' as any });
      if (doc) return doc.data as ContactInfoData;
      await db.collection('contact').insertOne({ _id: 'contact_page' as any, data: defaultContact });
      return defaultContact;
    }
    const store = ensureDataFile();
    return store.contact || defaultContact;
  },

  async updateContact(data: Partial<ContactInfoData>): Promise<ContactInfoData> {
    const db = await getMongoDb();
    if (db) {
      const current = await this.getContact();
      const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
      await db.collection('contact').updateOne(
        { _id: 'contact_page' as any },
        { $set: { data: updated } },
        { upsert: true }
      );
      return updated;
    }
    const store = ensureDataFile();
    store.contact = { ...store.contact, ...data, updatedAt: new Date().toISOString() };
    saveStore(store);
    return store.contact;
  },

  async getSettings(): Promise<SiteSettings> {
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection('settings').findOne({ _id: 'site_settings' as any });
      if (doc) return doc.data as SiteSettings;
      await db.collection('settings').insertOne({ _id: 'site_settings' as any, data: defaultSettings });
      return defaultSettings;
    }
    const store = ensureDataFile();
    return store.settings || defaultSettings;
  },

  async updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const db = await getMongoDb();
    if (db) {
      const current = await this.getSettings();
      const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
      await db.collection('settings').updateOne(
        { _id: 'site_settings' as any },
        { $set: { data: updated } },
        { upsert: true }
      );
      return updated;
    }
    const store = ensureDataFile();
    store.settings = { ...store.settings, ...data, updatedAt: new Date().toISOString() };
    saveStore(store);
    return store.settings;
  },

  async getEvents(): Promise<GalleryEvent[]> {
    const db = await getMongoDb();
    if (db) {
      const docs = await db.collection('events').find().sort({ createdAt: -1 }).toArray();
      if (docs.length > 0) return docs.map(d => d.data as GalleryEvent);
      // Seed default events into mongodb if empty
      for (const evt of defaultEvents) {
        await db.collection('events').insertOne({ _id: evt.id as any, data: evt, createdAt: evt.createdAt });
      }
      return defaultEvents;
    }
    const store = ensureDataFile();
    return store.events || [];
  },

  async getEventById(id: string): Promise<GalleryEvent | undefined> {
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection('events').findOne({ _id: id as any });
      if (doc) return doc.data as GalleryEvent;
      return undefined;
    }
    const store = ensureDataFile();
    return (store.events || []).find(e => e.id === id);
  },

  async createEvent(name: string, description?: string): Promise<GalleryEvent> {
    const newEvt: GalleryEvent = {
      id: 'evt-' + Date.now(),
      name,
      description,
      createdAt: new Date().toISOString(),
      images: []
    };
    const db = await getMongoDb();
    if (db) {
      await db.collection('events').insertOne({ _id: newEvt.id as any, data: newEvt, createdAt: newEvt.createdAt });
      return newEvt;
    }
    const store = ensureDataFile();
    store.events = [newEvt, ...(store.events || [])];
    saveStore(store);
    return newEvt;
  },

  async deleteEvent(id: string): Promise<boolean> {
    const db = await getMongoDb();
    if (db) {
      const res = await db.collection('events').deleteOne({ _id: id as any });
      return res.deletedCount > 0;
    }
    const store = ensureDataFile();
    const lenBefore = (store.events || []).length;
    store.events = (store.events || []).filter(e => e.id !== id);
    saveStore(store);
    return store.events.length < lenBefore;
  },

  async addImageToEvent(eventId: string, url: string, caption?: string, publicId?: string): Promise<GalleryEvent | undefined> {
    const event = await this.getEventById(eventId);
    if (!event) return undefined;

    const newImage = {
      id: 'img-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      url,
      publicId,
      caption,
      order: event.images.length,
      createdAt: new Date().toISOString()
    };
    event.images.push(newImage);

    const db = await getMongoDb();
    if (db) {
      await db.collection('events').updateOne({ _id: eventId as any }, { $set: { data: event } });
      return event;
    }
    const store = ensureDataFile();
    const storeEvt = (store.events || []).find(e => e.id === eventId);
    if (storeEvt) {
      storeEvt.images = event.images;
      saveStore(store);
    }
    return event;
  },

  async reorderEventImages(eventId: string, imageIds: string[]): Promise<GalleryEvent | undefined> {
    const event = await this.getEventById(eventId);
    if (!event) return undefined;

    const imageMap = new Map(event.images.map(img => [img.id, img]));
    const reordered: typeof event.images = [];

    imageIds.forEach((id, index) => {
      const img = imageMap.get(id);
      if (img) {
        img.order = index;
        reordered.push(img);
        imageMap.delete(id);
      }
    });

    imageMap.forEach((img) => {
      img.order = reordered.length;
      reordered.push(img);
    });

    event.images = reordered;

    const db = await getMongoDb();
    if (db) {
      await db.collection('events').updateOne({ _id: eventId as any }, { $set: { data: event } });
      return event;
    }
    const store = ensureDataFile();
    const storeEvt = (store.events || []).find(e => e.id === eventId);
    if (storeEvt) {
      storeEvt.images = event.images;
      saveStore(store);
    }
    return event;
  },

  async deleteImageFromEvent(eventId: string, imageId: string): Promise<GalleryEvent | undefined> {
    const event = await this.getEventById(eventId);
    if (!event) return undefined;

    event.images = event.images.filter(img => img.id !== imageId);
    event.images.forEach((img, index) => { img.order = index; });

    const db = await getMongoDb();
    if (db) {
      await db.collection('events').updateOne({ _id: eventId as any }, { $set: { data: event } });
      return event;
    }
    const store = ensureDataFile();
    const storeEvt = (store.events || []).find(e => e.id === eventId);
    if (storeEvt) {
      storeEvt.images = event.images;
      saveStore(store);
    }
    return event;
  },

  async getPrayerRequests(includePrivate = false): Promise<PrayerRequest[]> {
    const db = await getMongoDb();
    if (db) {
      const query = includePrivate ? {} : { 'data.isPrivate': false };
      const docs = await db.collection('prayer_requests').find(query).sort({ createdAt: -1 }).toArray();
      if (docs.length > 0) return docs.map(d => d.data as PrayerRequest);
      if (!includePrivate) return defaultPrayerRequests.filter(p => !p.isPrivate);
      return defaultPrayerRequests;
    }
    const store = ensureDataFile();
    const list = store.prayerRequests || [];
    if (includePrivate) return list;
    return list.filter(pr => !pr.isPrivate);
  },

  async createPrayerRequest(data: Omit<PrayerRequest, 'id' | 'createdAt' | 'status'>): Promise<PrayerRequest> {
    const newPr: PrayerRequest = {
      id: 'pr-' + Date.now(),
      ...data,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    const db = await getMongoDb();
    if (db) {
      await db.collection('prayer_requests').insertOne({ _id: newPr.id as any, data: newPr, createdAt: newPr.createdAt });
      return newPr;
    }
    const store = ensureDataFile();
    store.prayerRequests = [newPr, ...(store.prayerRequests || [])];
    saveStore(store);
    return newPr;
  },

  async updatePrayerRequestStatus(id: string, status: 'new' | 'prayed' | 'archived'): Promise<PrayerRequest | undefined> {
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection('prayer_requests').findOne({ _id: id as any });
      if (!doc) return undefined;
      const pr = doc.data as PrayerRequest;
      pr.status = status;
      await db.collection('prayer_requests').updateOne({ _id: id as any }, { $set: { data: pr } });
      return pr;
    }
    const store = ensureDataFile();
    const pr = (store.prayerRequests || []).find(p => p.id === id);
    if (!pr) return undefined;
    pr.status = status;
    saveStore(store);
    return pr;
  },

  async deletePrayerRequest(id: string): Promise<boolean> {
    const db = await getMongoDb();
    if (db) {
      const res = await db.collection('prayer_requests').deleteOne({ _id: id as any });
      return res.deletedCount > 0;
    }
    const store = ensureDataFile();
    const lenBefore = (store.prayerRequests || []).length;
    store.prayerRequests = (store.prayerRequests || []).filter(p => p.id !== id);
    saveStore(store);
    return store.prayerRequests.length < lenBefore;
  },

  async getLiveStatusCache(): Promise<LiveStatusCache | undefined> {
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection('live_cache').findOne({ _id: 'live_status' as any });
      if (doc) return doc.data as LiveStatusCache;
    }
    const store = ensureDataFile();
    return store.liveCache;
  },

  async setLiveStatusCache(cache: LiveStatusCache): Promise<void> {
    const db = await getMongoDb();
    if (db) {
      await db.collection('live_cache').updateOne(
        { _id: 'live_status' as any },
        { $set: { data: cache } },
        { upsert: true }
      );
      return;
    }
    const store = ensureDataFile();
    store.liveCache = cache;
    saveStore(store);
  }
};
