import { client } from '@lib/sanityClient';
import type { PortableTextHtmlComponents } from '@portabletext/to-html';
import hljs from 'highlight.js';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);
export const escapeHTML = (value: unknown) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ]!,
  );
export function safeURL(value: unknown) {
  const url = String(value || '').trim();
  return /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(url) ? url : '';
}

// Internal references are resolved once per article, before the synchronous HTML renderer.
export async function createPortableTextComponents(
  blocks: any[],
): Promise<Partial<PortableTextHtmlComponents>> {
  const refs = [
    ...new Set(
      blocks
        .flatMap((block) =>
          (block.markDefs || [])
            .filter((mark: any) => mark._type === 'internalLink')
            .map((mark: any) => mark.reference?._ref),
        )
        .filter(Boolean),
    ),
  ];
  const links = new Map<string, string>();
  if (refs.length) {
    const posts = await client.fetch<{ _id: string; slug: string }[]>(
      '*[_type == "post" && _id in $refs]{_id,"slug":slug.current}',
      { refs },
    );
    for (const post of posts)
      if (post.slug) links.set(post._id, `/posts/${post.slug}`);
  }
  const heading =
    (tag: string) =>
    ({ value, children }: any) =>
      `<${tag} id="${escapeHTML(value.blogHeadingId)}">${children}</${tag}>`;
  return {
    block: {
      ...Object.fromEntries(
        ['h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => [tag, heading(tag)]),
      ),
      code: ({ children }: any) => `<p><code>${children}</code></p>`,
    },
    types: {
      mainImage: ({ value }: any) => {
        const ref = value.asset?._ref || value.asset?._id || '';
        const dimensions = ref.match(/-(\d+)x(\d+)-/);
        const width =
          value.asset?.metadata?.dimensions?.width || Number(dimensions?.[1]);
        const height =
          value.asset?.metadata?.dimensions?.height || Number(dimensions?.[2]);
        if (!value.asset) return '<p>Image indisponible.</p>';
        const image = builder.image(value.asset).auto('format').fit('max');
        const sizes = [390, 640, 960, 1440].filter((w) => !width || w <= width);
        if (width && !sizes.includes(width) && width < 1440) sizes.push(width);
        const srcset = sizes
          .map((w) => `${escapeHTML(image.width(w).url())} ${w}w`)
          .join(', ');
        return `<figure><img src="${escapeHTML(image.width(Math.min(width || 960, 960)).url())}" srcset="${srcset}" sizes="(max-width: 64rem) calc(100vw - 2rem), 44rem" ${width && height ? `width="${width}" height="${height}"` : ''} alt="${escapeHTML(value.alt || '')}" loading="lazy" decoding="async">${value.caption ? `<figcaption>${escapeHTML(value.caption)}</figcaption>` : ''}</figure>`;
      },
      code: ({ value }: any) => {
        const language =
          typeof value.language === 'string' ? value.language : '';
        const code =
          language && hljs.getLanguage(language)
            ? hljs.highlight(value.code || '', { language }).value
            : escapeHTML(value.code);
        return `<div class="code-block"><p class="code-language">${escapeHTML(language || 'Code')}</p><pre tabindex="0" aria-label="Extrait de code"><code class="hljs">${code}</code></pre></div>`;
      },
      youtube: ({ value }: any) => {
        const id = String(value.idYoutube || '');
        if (!/^[\w-]{11}$/.test(id)) return '<p>Vidéo indisponible.</p>';
        return `<figure class="video-link"><a data-video="${id}" href="https://www.youtube.com/watch?v=${id}"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" width="480" height="360" loading="lazy" alt=""><span>Regarder la vidéo sur YouTube ↗</span></a></figure>`;
      },
    },
    marks: {
      internalLink: ({ value, children }: any) => {
        const href = links.get(value.reference?._ref);
        return href
          ? `<a href="${escapeHTML(href)}">${children}</a>`
          : children;
      },
      link: ({ value, children }: any) => {
        const href = safeURL(value.href);
        return href
          ? `<a href="${escapeHTML(href)}">${children}</a>`
          : children;
      },
    },
    unknownType: ({ value }: any) => {
      console.warn(`Blog : bloc non pris en charge : ${value._type}`);
      return '<p class="content-notice">Ce contenu ne peut pas être affiché dans ce format.</p>';
    },
  };
}
