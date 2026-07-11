import { getAdminDb } from './firebase-admin';
import {
  FALLBACK_POSTS, FALLBACK_PROJECTS, FALLBACK_SERVICES, FALLBACK_TESTIMONIALS, FALLBACK_BOOKS, FALLBACK_EVENTS,
  FALLBACK_CV, FALLBACK_MEDIA, FALLBACK_SOCIAL,
} from './fallback-data';
import { fallbackQuotes, haiti2077Pillars, haiti2077Departments, haiti2077Timeline, pillarDetails, departmentDetails } from './fallback-data';
import type {
  BlogPost, Project, Service, CVData, CVEducation, CVExperience,
  ContactSubmission, SocialLink, MediaItem, Testimonial, Book, SpeakingEvent,
} from '@/types';

// Helper: Firestore doc → typed object with id
function docToObj<T>(doc: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot): T {
  return { id: doc.id, ...doc.data() } as T;
}

// Diagnostic logger (visible in Vercel server logs)
function logRead(collection: string, count: number, source: 'firestore' | 'fallback') {
  console.log(`[Data] ${collection}: ${count} docs (${source})`);
}

// ===========================================
// BLOG POSTS
// ===========================================

export async function getBlogPosts(published = true): Promise<BlogPost[]> {
  try {
    const db = getAdminDb();
    let query: FirebaseFirestore.Query = db.collection('blogPosts').orderBy('created_at', 'desc');
    if (published) query = query.where('published', '==', true);
    const snap = await query.get();
    if (snap.empty) { logRead('blogPosts', 0, 'fallback'); return FALLBACK_POSTS; }
    logRead('blogPosts', snap.size, 'firestore');
    return snap.docs.map((doc) => docToObj<BlogPost>(doc));
  } catch {
    logRead('blogPosts', FALLBACK_POSTS.length, 'fallback');
    return FALLBACK_POSTS;
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('blogPosts').where('slug', '==', slug).limit(1).get();
    if (!snap.empty) return docToObj<BlogPost>(snap.docs[0]);
  } catch { /* fallback below */ }
  return FALLBACK_POSTS.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection('blogPosts')
      .where('published', '==', true)
      .where('featured', '==', true)
      .orderBy('created_at', 'desc')
      .limit(3)
      .get();
    if (!snap.empty) return snap.docs.map((doc) => docToObj<BlogPost>(doc));
  } catch { /* fallback below */ }
  return FALLBACK_POSTS.filter((p) => p.featured).slice(0, 3);
}

// ===========================================
// PROJECTS
// ===========================================

export async function getProjects(published = true): Promise<Project[]> {
  try {
    const db = getAdminDb();
    let query: FirebaseFirestore.Query = db.collection('projects').orderBy('sort_order', 'asc');
    if (published) query = query.where('published', '==', true);
    const snap = await query.get();
    if (snap.empty) { logRead('projects', 0, 'fallback'); return FALLBACK_PROJECTS; }
    logRead('projects', snap.size, 'firestore');
    return snap.docs.map((doc) => docToObj<Project>(doc));
  } catch {
    logRead('projects', FALLBACK_PROJECTS.length, 'fallback');
    return FALLBACK_PROJECTS;
  }
}

export async function getProject(slug: string): Promise<Project | null> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('projects').where('slug', '==', slug).limit(1).get();
    if (!snap.empty) return docToObj<Project>(snap.docs[0]);
  } catch { /* fallback below */ }
  return FALLBACK_PROJECTS.find((p) => p.slug === slug) ?? null;
}

// ===========================================
// SERVICES
// ===========================================

export async function getServices(published = true): Promise<Service[]> {
  try {
    const db = getAdminDb();
    let query: FirebaseFirestore.Query = db.collection('services').orderBy('sort_order', 'asc');
    if (published) query = query.where('published', '==', true);
    const snap = await query.get();
    if (snap.empty) { logRead('services', 0, 'fallback'); return FALLBACK_SERVICES; }
    logRead('services', snap.size, 'firestore');
    return snap.docs.map((doc) => docToObj<Service>(doc));
  } catch {
    logRead('services', FALLBACK_SERVICES.length, 'fallback');
    return FALLBACK_SERVICES;
  }
}

// ===========================================
// CV DATA
// ===========================================

export async function getCVData(): Promise<CVData> {
  try {
    const db = getAdminDb();
    const [educSnap, expSnap, metaSnap] = await Promise.all([
      db.collection('cvSections').doc('education').collection('items').orderBy('sort_order').get(),
      db.collection('cvSections').doc('experience').collection('items').orderBy('sort_order').get(),
      db.collection('cvSections').doc('meta').get(),
    ]);

    const meta = metaSnap.exists ? metaSnap.data()! : {};
    const education = educSnap.docs.map((doc) => docToObj<CVEducation>(doc));
    const experience = expSnap.docs.map((doc) => docToObj<CVExperience>(doc));

    // If Firestore is connected but empty (before seeding), use fallback
    if (education.length === 0 && experience.length === 0) {
      logRead('cvSections', 0, 'fallback');
      return FALLBACK_CV;
    }

    logRead('cvSections', education.length + experience.length, 'firestore');

    return {
      summary: (meta.summary as string) ?? FALLBACK_CV.summary,
      education,
      experience,
      skills: (meta.skills as string[]) ?? FALLBACK_CV.skills,
      languages: (meta.languages as string[]) ?? FALLBACK_CV.languages,
      certifications: (meta.certifications as string[]) ?? FALLBACK_CV.certifications,
      awards: (meta.awards as string[]) ?? FALLBACK_CV.awards,
    };
  } catch {
    logRead('cvSections', 0, 'fallback');
    return FALLBACK_CV;
  }
}

// ===========================================
// CONTACT SUBMISSIONS
// ===========================================

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('contactMessages').orderBy('created_at', 'desc').get();
    return snap.docs.map((doc) => docToObj<ContactSubmission>(doc));
  } catch {
    return [];
  }
}

// ===========================================
// SOCIAL LINKS
// ===========================================

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('socialLinks').orderBy('sort_order').get();
    if (snap.empty) return FALLBACK_SOCIAL;
    return snap.docs.map((doc) => docToObj<SocialLink>(doc));
  } catch {
    return FALLBACK_SOCIAL;
  }
}

// ===========================================
// SITE SETTINGS
// ===========================================

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('siteSettings').get();
    if (snap.empty) return {};
    return snap.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data().value ?? '';
      return acc;
    }, {} as Record<string, string>);
  } catch {
    return {};
  }
}

// ===========================================
// MEDIA ITEMS
// ===========================================

export async function getMediaItems(): Promise<MediaItem[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('mediaItems').orderBy('sort_order').get();
    if (snap.empty) return FALLBACK_MEDIA;
    return snap.docs.map((doc) => docToObj<MediaItem>(doc));
  } catch {
    return FALLBACK_MEDIA;
  }
}

// ===========================================
// TESTIMONIALS
// ===========================================

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('testimonials').where('published', '==', true).orderBy('sort_order').get();
    if (snap.empty) { logRead('testimonials', 0, 'fallback'); return FALLBACK_TESTIMONIALS; }
    logRead('testimonials', snap.size, 'firestore');
    return snap.docs.map((doc) => docToObj<Testimonial>(doc));
  } catch {
    logRead('testimonials', FALLBACK_TESTIMONIALS.length, 'fallback');
    return FALLBACK_TESTIMONIALS;
  }
}

// ===========================================
// BOOKS
// ===========================================

export async function getBooks(): Promise<Book[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('books').where('published', '==', true).orderBy('sort_order').get();
    if (snap.empty) { logRead('books', 0, 'fallback'); return FALLBACK_BOOKS; }
    logRead('books', snap.size, 'firestore');
    return snap.docs.map((doc) => docToObj<Book>(doc));
  } catch {
    logRead('books', FALLBACK_BOOKS.length, 'fallback');
    return FALLBACK_BOOKS;
  }
}

// ===========================================
// SPEAKING & EVENTS
// ===========================================

export async function getEvents(): Promise<SpeakingEvent[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('events').where('published', '==', true).orderBy('sort_order').get();
    if (snap.empty) { logRead('events', 0, 'fallback'); return FALLBACK_EVENTS; }
    logRead('events', snap.size, 'firestore');
    return snap.docs.map((doc) => docToObj<SpeakingEvent>(doc));
  } catch {
    logRead('events', FALLBACK_EVENTS.length, 'fallback');
    return FALLBACK_EVENTS;
  }
}


// ===== QUOTES =====
export async function getQuotes(): Promise<any[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('quotes').orderBy('sortOrder', 'asc').get();
    if (snap.empty) return fallbackQuotes;
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch {
    return fallbackQuotes;
  }
}

export async function getPublishedQuotes(): Promise<any[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('quotes').where('published', '==', true).orderBy('sortOrder', 'asc').get();
    if (snap.empty) return fallbackQuotes.filter(q => q.published);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch {
    return fallbackQuotes.filter(q => q.published);
  }
}

export async function getQuoteBySlug(slug: string): Promise<any | null> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('quotes').where('slug', '==', slug).where('published', '==', true).limit(1).get();
    if (snap.empty) return fallbackQuotes.find(q => q.slug === slug) || null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch {
    return fallbackQuotes.find(q => q.slug === slug) || null;
  }
}

export async function getDailyQuote(): Promise<any> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const db = getAdminDb();
    // Check for scheduled quote
    const scheduled = await db.collection('quotes').where('scheduledDate', '==', today).where('published', '==', true).limit(1).get();
    if (!scheduled.empty) return { id: scheduled.docs[0].id, ...scheduled.docs[0].data() };
    // Deterministic daily rotation
    const all = await getPublishedQuotes();
    if (all.length === 0) return fallbackQuotes[0];
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return all[dayOfYear % all.length];
  } catch {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return fallbackQuotes[dayOfYear % fallbackQuotes.length];
  }
}


// ===== HAITI 2077 =====
export function getPillars() { return haiti2077Pillars; }
export function getDepartments() { return haiti2077Departments; }
export function getTimeline() { return haiti2077Timeline; }

export async function getApprovedProposals(): Promise<any[]> {
  try {
    const db = getAdminDb();
    let snap;
    try {
      snap = await db.collection('haiti2077Proposals').where('status', '==', 'approved').orderBy('created_at', 'desc').get();
    } catch {
      // Fallback if composite index not ready
      snap = await db.collection('haiti2077Proposals').where('status', '==', 'approved').get();
    }
    const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return docs.sort((a: any, b: any) => (b.created_at || '').localeCompare(a.created_at || ''));
  } catch { return []; }
}

export async function getProposalById(id: string): Promise<any | null> {
  try {
    const db = getAdminDb();
    const doc = await db.collection('haiti2077Proposals').doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data();
    if (data?.status !== 'approved' && data?.status !== 'incorporated') return null;
    return { id: doc.id, ...data };
  } catch { return null; }
}

export async function getFeaturedProposals(): Promise<any[]> {
  try {
    const db = getAdminDb();
    let snap;
    try {
      snap = await db.collection('haiti2077Proposals').where('status', '==', 'approved').where('featured', '==', true).orderBy('created_at', 'desc').limit(6).get();
    } catch {
      // Fallback if composite index not ready
      const all = await db.collection('haiti2077Proposals').where('status', '==', 'approved').get();
      const featured = all.docs.filter(doc => doc.data().featured === true).map(doc => ({ id: doc.id, ...doc.data() }));
      return featured.sort((a: any, b: any) => (b.created_at || '').localeCompare(a.created_at || '')).slice(0, 6);
    }
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch { return []; }
}

export function getPillarDetails(slug: string) { return pillarDetails[slug] || null; }

export function getDepartmentDetails(slug: string) { return departmentDetails[slug] || null; }
