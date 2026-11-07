/// <reference types="jest" />
import {
  articleHeadings,
  prepareArticleBlocks,
  sortPosts,
  formatArticleDate,
} from '../../src/features/blog/functions/articleContent';
import { submitComment } from '../../src/features/blog/components/FormComment/submitComment';
import { toHTML } from '@portabletext/to-html';
import getPostsByCategory from '../../src/helpers/getPostsByCategory';
import { getPostsUrlParams } from '../../src/features/blog/functions/getPostsUrlParams';
import {
  createPortableTextComponents,
  safeURL,
} from '../../src/helpers/portableTextComponents';
jest.mock('../../src/lib/sanityClient', () => ({
  client: {
    config: () => ({ projectId: 'example', dataset: 'production' }),
    fetch: jest
      .fn()
      .mockResolvedValue([{ _id: 'post-1', slug: 'article-cible' }]),
  },
}));
const block = (style: string, ...texts: string[]) => ({
  _type: 'block',
  _key: String(Math.random()),
  style,
  markDefs: [],
  children: texts.map((text, index) => ({
    _type: 'span',
    _key: `${index}`,
    marks: [],
    text,
  })),
});

test('titres fragmentés, doublons, suffixes et h1 : ancres identiques au rendu', async () => {
  const blocks = [
    block('h2', 'Déjà ', 'vu'),
    block('h3', 'Déjà vu'),
    block('h4', 'Déjà vu-2'),
    block('h1', 'Conclusion'),
  ];
  const headings = articleHeadings(blocks);
  expect(headings.map((h) => h.id)).toEqual([
    'deja-vu',
    'deja-vu-2',
    'deja-vu-2-2',
    'conclusion',
  ]);
  const html = toHTML(prepareArticleBlocks(blocks), {
    components: await createPortableTextComponents(blocks),
  });
  expect(html).toContain('<h2 id="deja-vu">Déjà vu</h2>');
  expect(html).toContain('<h3 id="deja-vu-2">');
  expect(html).toContain('<h4 id="deja-vu-2-2">');
  expect(html).not.toContain('<h1');
});

test('code sans langage, textes échappés, listes historiques et vidéo invalide', async () => {
  const blocks = [
    { _type: 'code', code: '<script>test</script>', language: 'inconnu' },
    block('bullet', 'Une liste'),
    { _type: 'youtube', idYoutube: '\" onload=\"bad' },
  ];
  const html = toHTML(prepareArticleBlocks(blocks), {
    components: await createPortableTextComponents(blocks),
  });
  expect(html).toContain('&lt;script&gt;test&lt;/script&gt;');
  expect(html).toContain('<ul>');
  expect(html).not.toContain('onload=');
});

test('liens internes résolus et protocoles interdits neutralisés', async () => {
  const blocks = [
    {
      ...block('normal', 'Lire'),
      markDefs: [
        { _type: 'internalLink', _key: 'lien', reference: { _ref: 'post-1' } },
      ],
      children: [{ _type: 'span', text: 'Lire', marks: ['lien'] }],
    },
  ];
  const html = toHTML(blocks, {
    components: await createPortableTextComponents(blocks),
  });
  expect(html).toContain('href="/posts/article-cible"');
  expect(safeURL('javascript:alert(1)')).toBe('');
  expect(safeURL('//example.com')).toBe('');
});

test('tri stable sans date et format français correct', () => {
  const posts = [
    { title: 'Sans date' },
    { title: 'Nouveau', _createdAt: '2026-11-07' },
    { title: 'Ancien', _createdAt: '2023-01-12' },
  ];
  expect(sortPosts(posts).map((p) => p.title)).toEqual([
    'Nouveau',
    'Ancien',
    'Sans date',
  ]);
  expect(posts[0].title).toBe('Sans date');
  expect(formatArticleDate('2026-11-07')).toBe('7 novembre 2026');
  expect(formatArticleDate('invalide')).toBe('');
});

const payload = {
  _id: 'id',
  postTitle: 'Titre',
  pseudo: 'Alice',
  comment: 'Texte conservé',
};
test('soumission compatible avec l’API, sans dépendre de PUBLIC_URL', async () => {
  const request = jest.fn().mockResolvedValue({ ok: true });
  await submitComment(payload, request);
  expect(request).toHaveBeenCalledWith(
    '/api/save-comment.json',
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    }),
  );
});
test('échecs HTTP, réseau et champs blancs rejetés', async () => {
  await expect(
    submitComment(payload, jest.fn().mockResolvedValue({ ok: false })),
  ).rejects.toThrow();
  await expect(
    submitComment(payload, jest.fn().mockRejectedValue(new Error('network'))),
  ).rejects.toThrow();
  const request = jest.fn();
  await expect(
    submitComment({ ...payload, comment: ' ' }, request),
  ).rejects.toThrow();
  expect(request).not.toHaveBeenCalled();
});

test('listes et articles liés tolèrent une catégorie absente', () => {
  const posts = [
    {
      _id: 'a',
      title: 'Sans catégorie',
      slug: { current: 'sans-categorie' },
      categories: [],
    },
    {
      _id: 'b',
      title: 'Avec catégorie',
      slug: { current: 'avec-categorie' },
      categories: [{ title: 'React', slug: { current: 'react' } }],
    },
  ] as any;
  expect(
    getPostsByCategory(posts).map((group) => group.category.title),
  ).toContain('Autres articles');
  const routes = getPostsUrlParams({ allPost: posts } as any);
  expect(routes).toHaveLength(2);
  expect(
    routes.find((route) => route.params.slug === 'sans-categorie')?.props
      .relatedPosts,
  ).toEqual([]);
});

test('images dimensionnées et alt échappé, sans script injecté', async () => {
  const blocks = [
    {
      _type: 'mainImage',
      asset: {
        _ref: 'image-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-800x600-webp',
      },
      alt: '\"><script>injection</script>',
    },
  ];
  const html = toHTML(blocks, {
    components: await createPortableTextComponents(blocks),
  });
  expect(html).toContain('width="800" height="600"');
  expect(html).toContain('srcset=');
  expect(html).not.toContain('<script>');
});
