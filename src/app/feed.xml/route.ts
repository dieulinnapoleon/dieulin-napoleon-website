import { getBlogPosts } from '@/lib/data';

export async function GET() {
  const posts = await getBlogPosts();
  const BASE = 'https://dieulinnapoleon.com';

  const items = posts.map((post) =>
    '<item>' +
    '<title>' + post.title.replace(/&/g, '&amp;') + '</title>' +
    '<link>' + BASE + '/insights/' + post.slug + '</link>' +
    '<description>' + (post.excerpt || '').replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</description>' +
    '<pubDate>' + new Date(post.created_at).toUTCString() + '</pubDate>' +
    '<guid>' + BASE + '/insights/' + post.slug + '</guid>' +
    '<category>' + (post.category || 'General') + '</category>' +
    '</item>'
  ).join('\n');

  const feed = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    '<channel>\n' +
    '<title>Dieulin Napoleon — Insights</title>\n' +
    '<link>' + BASE + '/insights</link>\n' +
    '<description>Perspectives on finance, entrepreneurship, project management, sustainability, and development.</description>\n' +
    '<language>en</language>\n' +
    '<atom:link href="' + BASE + '/feed.xml" rel="self" type="application/rss+xml"/>\n' +
    items + '\n' +
    '</channel>\n</rss>';

  return new Response(feed, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
