import type { MarkdownHeading } from 'astro';
import type { FC } from 'react';

interface PropsTableOfContentItem {
  heading: MarkdownHeading;
}

const TableOfContentItem: FC<PropsTableOfContentItem> = ({
  heading,
}: PropsTableOfContentItem) => {
  return (
    <li
      id={`li-${heading.slug}`}
      className={`mb-0 text-sm depth px-2 py-1 m-0 border-l-4 border-purple-100`}
      key={heading.slug}
    >
      <a className={`depth-${heading.depth}`} href={`#${heading.slug}`}>
        {heading.text}
      </a>
    </li>
  );
};

export default TableOfContentItem;
