export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  publicId?: string;
  caption?: string;
  order: number;
  createdAt: string;
}

export interface GalleryEvent {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  images: GalleryImage[];
}

export interface PrayerRequest {
  id: string;
  name: string;
  contact: string; // phone or email
  category: 'Healing' | 'Family' | 'Financial' | 'Guidance' | 'Spiritual' | 'Other';
  message: string;
  isPrivate: boolean;
  status: 'new' | 'prayed' | 'archived';
  createdAt: string;
}

export interface AboutPageData {
  title: string;
  subtitle: string;
  mission: string;
  vision: string;
  story: string;
  pillars: { title: string; description: string }[];
  images: string[];
  updatedAt: string;
}

export interface ServiceTime {
  day: string;
  time: string;
  title: string;
  description?: string;
}

export interface SocialLink {
  platform: 'Instagram' | 'YouTube' | 'Facebook' | 'Email' | 'Other';
  label: string;
  url: string;
}

export interface ContactInfoData {
  serviceTimes: ServiceTime[];
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  socialLinks: SocialLink[];
  updatedAt: string;
}

export interface SiteSettings {
  youtubeChannelId: string;
  youtubeCustomUrl?: string;
  notificationEmail: string;
  updatedAt: string;
}

export interface LiveStatusCache {
  isLive: boolean;
  videoId?: string;
  title?: string;
  thumbnailUrl?: string;
  checkedAt: number; // timestamp
}
