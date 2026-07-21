---
title: Article template
date: 2026-07-21
description: >-
  Copy this file, rename it, and write. The file name becomes the URL:
  src/content/articles/my-article.md → /articles/my-article/
category: misc
draft: true
---

<!--
  This file has `draft: true`, so it is excluded from the build and never
  appears on the site or in the RSS feed. It exists as a starting point.

  Frontmatter reference:
    title        required
    date         required, YYYY-MM-DD
    description  required — shown on the article card and used as the meta
                 description, so write it for a stranger
    category     one of: aar, ai, tips, misc
    game         optional game id (a file name in src/data/games/), which adds
                 a link from the article back to that companion
    cover        optional image file name, relative to this file
    draft        true hides it everywhere; remove or set false to publish

  Images: put them in src/assets/articles/<slug>/ and reference them
  relatively, e.g. ![Turn 12, the bridge](../../assets/articles/my-article/turn-12.png)
  Astro optimizes anything referenced this way.
-->

Write the article here. Headings start at `##` — the title above becomes the
page's `<h1>`.
