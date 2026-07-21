import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
  const articles = await getCollection('articles', ({ data }) => !data.draft);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: articles
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map((article) => ({
        title: article.data.title,
        description: article.data.description,
        pubDate: article.data.date,
        link: `/articles/${article.id}/`,
      })),
  });
}
