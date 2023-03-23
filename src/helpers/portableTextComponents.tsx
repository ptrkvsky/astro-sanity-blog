import { client } from '@lib/sanityClient';
import { slugify } from '@lib/slugify';
import type { PortableTextHtmlComponents } from '@portabletext/to-html';
import hljs from 'highlight.js';
//@ts-ignore
import imageUrlBuilder from '@sanity/image-url';
import getPost from '@features/blog/functions/getPost';

const builder = imageUrlBuilder(client);

function getSanityImageURL(source: any) {
  return builder.image(source);
}

export const portableTextComponents: Partial<PortableTextHtmlComponents> = {
  types: {
    mainImage: ({ value }) => {
      return `
        <picture>
          <source
            srcset="${getSanityImageURL(value.asset).format('webp').url()}"
            type="image/webp"
          />
          <img
            class="responsive__img"
            src="${getSanityImageURL(value.asset).url()}"
            alt="${value.alt}"
          />
        </picture>
      `;
    },
    code: (elem) => {
      const code = hljs.highlight(elem.value.code, {
        language: elem.value.language,
      }).value;
      return `<pre class="language-${elem.value.language}"><code>${code}</code></pre>`;
    },
    //ts-ignore
    youtube: (elem) => {
      return `<div>
      <iframe
      width="100%"
      height="500"
      src="https://www.youtube.com/embed/${elem.value.idYoutube}&autoplay=1"
      srcdoc="<style>*{padding:0;margin:0;ov560erflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/${elem.value.idYoutube}?autoplay=1><img src=https://img.youtube.com/vi/${elem.value.idYoutube}/hqdefault.jpg alt='Video The Dark Knight Rises: What Went Wrong? – Wisecrack Edition'><span>▶</span></a>"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
      </div>`;
    },
  },
  marks: {
    //@ts-ignore
    internalLink: async (prop) => {
      const post = await getPost(prop.value.reference._ref);
      return `<a href="${post[0].slug.current}" class="internalLink">${prop.children}</a>`;
    },
    link: ({ text, value }: any) => {
      return `<a href="${value.href}">${text}</a>`;
    },
  },

  block: {
    h2: ({ value }: any) => {
      return `<h2 id="${slugify(value.children[0].text)}">${
        value.children[0].text
      }</h2>`;
    },
    h3: ({ value }: any) => {
      return `<h2 id="${slugify(value.children[0].text)}">${
        value.children[0].text
      }</h2>`;
    },
    h4: ({ value }: any) => {
      return `<h2 id="${slugify(value.children[0].text)}">${
        value.children[0].text
      }</h2>`;
    },
    h5: ({ value }: any) => {
      return `<h2 id="${slugify(value.children[0].text)}">${
        value.children[0].text
      }</h2>`;
    },
    h6: ({ value }: any) => {
      return `<h2 id="${slugify(value.children[0].text)}">${
        value.children[0].text
      }</h2>`;
    },
    code: ({ value }: any) => {
      return `<code>${value.children[0].text}</code>`;
    },
  },
};
