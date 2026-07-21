import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
  const articles = (await getCollection('articles', ({ data }) => !data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({ title: SITE_TITLE, description: SITE_DESCRIPTION, site: context.site, items: articles.map((article) => ({ title: article.data.title, description: article.data.description, pubDate: article.data.date, link: `/articles/${article.id}/` })) });
}
