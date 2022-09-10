import type { Heading } from './../interfaces/Heading';
import { slugify } from '@lib/slugify';
import type { BlockContent } from '@interfaces/SanitySchema';

/**
 * @desc typeguard id Heading
 */
function isHeading(item: Heading | undefined): item is Heading {
  return !!item;
}

/**
 * @desc Get block content and return an object with text, hn type, and the id used by the Table of content
 */
export function getHeadings(text: BlockContent) {
  const headings = text
    .map((textItem) => {
      if (
        textItem.style === 'h2' ||
        textItem.style === 'h3' ||
        textItem.style === 'h4' ||
        textItem.style === 'h5' ||
        textItem.style === 'h6'
      ) {
        const id = slugify(textItem.children[0].text);
        const heading: Heading = {
          text: textItem.children[0].text,
          hn: textItem.style,
          id,
        };
        return heading;
      }
    })
    .filter(isHeading);

  return headings;
}
