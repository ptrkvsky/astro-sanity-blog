import type { MarkdownHeading } from 'astro';
import type { FC } from 'react';
import useScrollSpy from 'src/hooks/useScrollSpy';

interface Props {
  headings: MarkdownHeading[];
}

export default function TableOfContent({ headings }: Props) {
  const ids = headings.map((heading) => heading.slug);
  const activeSlug = useScrollSpy(ids, { rootMargin: '0% 0% -25% 0%' });

  return (
    <>
      <p className=" post___table-of-content___heading">Table des matières</p>
      <ul>
        {headings.map((heading) => (
          <TableOfContentItem
            key={heading.slug}
            heading={heading}
            isActive={activeSlug === heading.slug}
          />
        ))}
      </ul>
    </>
  );
}

interface PropsTableOfContentItem {
  heading: MarkdownHeading;
  isActive: boolean;
}
const TableOfContentItem: FC<PropsTableOfContentItem> = ({
  heading,
  isActive,
}: PropsTableOfContentItem) => (
  <li
    className={`mb-0 text-sm depth depth-${heading.depth} ${
      isActive ? 'active' : ''
    }`}
    key={heading.slug}
  >
    <a href={`#${heading.slug}`}>{heading.text}</a>
  </li>
);
