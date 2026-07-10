import { getBlogPosts, getProjects, getEvents, getBooks, getPillars, getDepartments } from '@/lib/data';

const BASE = 'https://dieulinnapoleon.com';

export default async function sitemap() {
  const [posts, projects, events] = await Promise.all([
    getBlogPosts(),
    getProjects(),
    getEvents(),
  ]);

  const staticPages = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: BASE + '/about', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: BASE + '/cv', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: BASE + '/projects', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: BASE + '/insights', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: BASE + '/services', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: BASE + '/books', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: BASE + '/speaking', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: BASE + '/contact', lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.6 },
    { url: BASE + '/media', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: BASE + '/quotes', lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
    { url: BASE + '/haiti-2077', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: BASE + '/haiti-2077/contribute', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: BASE + '/haiti-2077/proposals', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
  ];

  const blogPages = posts.map((post) => ({
    url: BASE + '/insights/' + post.slug,
    lastModified: new Date(post.updated_at || post.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const projectPages = projects.map((p) => ({
    url: BASE + '/projects/' + p.slug,
    lastModified: new Date(p.updated_at || p.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const eventPages = events.map((e) => ({
    url: BASE + '/speaking/' + e.id,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const pillarPages = getPillars().map((p) => ({
    url: BASE + '/haiti-2077/pillars/' + p.slug,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const deptPages = getDepartments().map((d) => ({
    url: BASE + '/haiti-2077/departments/' + d.slug,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages, ...projectPages, ...eventPages, ...pillarPages, ...deptPages];
}
