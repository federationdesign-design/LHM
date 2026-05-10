// app/data/blog.ts
// Blog article metadata + fs-using helpers.
// Pure data lives in articleData.ts so client components can import it
// without dragging in Node.js modules. This file is server-only.

import fs from 'fs';
import path from 'path';
import { articles, type BlogArticle } from './articleData';

export type { BlogArticle } from './articleData';
export { articles } from './articleData';

/**
 * Returns articles sorted by publishDate, newest first.
 * Used by the blog index page.
 */
export function getSortedArticles(): BlogArticle[] {
  return Object.values(articles).sort((a, b) =>
    b.publishDate.localeCompare(a.publishDate)
  );
}

/**
 * Reads the markdown body for a given article slug.
 * Body files live at app/data/articles/[slug].md
 * Returns empty string if the file doesn't exist (graceful degradation).
 */
export function getArticleBody(slug: string): string {
  try {
    const filePath = path.join(process.cwd(), 'app', 'data', 'articles', `${slug}.md`);
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}
