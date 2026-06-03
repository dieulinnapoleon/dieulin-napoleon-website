// ===========================================
// DATABASE TYPES (mirrors Firestore collections)
// ===========================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: ContentBlock[];
  tags: string[];
  published: boolean;
  featured: boolean;
  read_time: string;
  original_lang?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentBlock {
  type: 'p' | 'h' | 'h3' | 'note' | 'quote' | 'list';
  text: string;
  items?: string[];
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  problem: string;
  solution: string;
  role: string;
  status: string;
  tech: string[];
  impact: string;
  url?: string;
  image_url?: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  for_whom: string;
  deliverables: string;
  outcomes: string;
  icon: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CVEducation {
  id: string;
  degree: string;
  institution: string;
  year: string;
  details: string;
  sort_order: number;
}

export interface CVExperience {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  sub_items?: CVSubItem[];
  sort_order: number;
}

export interface CVSubItem {
  university: string;
  courses: string;
}

export interface CVData {
  summary: string;
  education: CVEducation[];
  experience: CVExperience[];
  skills: string[];
  languages: string[];
  certifications: string[];
  awards: string[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  organization?: string;
  reason: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  sort_order: number;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: 'award' | 'press' | 'speaking' | 'platform';
  url?: string;
  date?: string;
  sort_order: number;
}

// ===========================================
// I18N TYPES
// ===========================================

export type Locale = 'en' | 'fr' | 'ht' | 'es';

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
}

export const LOCALES: LocaleConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen', flag: '🇭🇹' },
];

// ===========================================
// UI TYPES
// ===========================================

export interface NavLink {
  label: string;
  href: string;
}

export interface PageMeta {
  title: string;
  description: string;
  ogImage?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  organization: string;
  quote: string;
  sort_order: number;
  published: boolean;
}

export interface Book {
  id: string;
  title: string;
  theme: string;
  status: string;
  description: string;
  topics: string[];
  sort_order: number;
  published: boolean;
}
