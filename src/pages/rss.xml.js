import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { features } from '../config';

export async function GET(context) {
  if (!features.blog) return new Response('Not found', { status: 404 });
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return rss({
    title: "Sergi's Blog",
    description: 'Thoughts on software, design, and life.',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.id}/`,
      })),
    customData: `<language>en-us</language>`,
  });
}
