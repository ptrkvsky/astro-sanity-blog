import { slugify } from '../../../lib/slugify';

export function prepareArticleBlocks(blocks: any[] = []) {
  const used = new Set([
    'contenu',
    'haut',
    'table-of-content',
    'commentaires',
    'article-title',
  ]);
  return blocks.map((block) => {
    if (block.style === 'bullet')
      return {
        ...block,
        style: 'normal',
        listItem: block.listItem || 'bullet',
        level: block.level || 1,
      };
    if (!/^h[1-6]$/.test(block.style || '')) return block;
    const text = (block.children || [])
      .map((child: any) => child.text || '')
      .join('');
    const base = slugify(text) || 'section';
    let id = base;
    let suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    return {
      ...block,
      style: block.style === 'h1' ? 'h2' : block.style,
      blogHeadingId: id,
    };
  });
}

export function articleHeadings(blocks: any[] = []) {
  return prepareArticleBlocks(blocks)
    .filter((block) => /^h[2-6]$/.test(block.style || ''))
    .map((block) => ({
      hn: block.style,
      id: block.blogHeadingId,
      text: (block.children || [])
        .map((child: any) => child.text || '')
        .join(''),
    }));
}

export function sortPosts<T extends { _createdAt?: string; title?: string }>(
  posts: T[],
) {
  const time = (value?: string) =>
    value && Number.isFinite(Date.parse(value)) ? Date.parse(value) : 0;
  return [...posts].sort(
    (a, b) =>
      time(b._createdAt) - time(a._createdAt) ||
      (a.title || '').localeCompare(b.title || '', 'fr'),
  );
}

export function formatArticleDate(value?: string) {
  return value && Number.isFinite(Date.parse(value))
    ? new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Europe/Paris',
      }).format(new Date(value))
    : '';
}
