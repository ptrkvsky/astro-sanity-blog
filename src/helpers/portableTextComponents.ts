import { Image } from '@astrojs/image/components';
import { client } from '@lib/sanityClient';
import { slugify } from '@lib/slugify';
import type { PortableTextHtmlComponents } from '@portabletext/to-html';
//@ts-ignore
import imageUrlBuilder from '@sanity/image-url';

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
  },
};
