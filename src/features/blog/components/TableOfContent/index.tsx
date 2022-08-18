import type { MarkdownHeading } from 'astro';
import { FC, useContext } from 'react';
import useScrollSpy from 'src/hooks/useScrollSpy';
import TableOfContentItem from '../TableOfContentItem';
import { TableOfContentProvider, TocContext } from './context';
import styles from './styles.css';

interface Props {
  headings: MarkdownHeading[];
}

const BaseTableOfContent: FC<Props> = ({ headings }: Props) => {
  const { refs } = useContext(TocContext);
  const activeSlug = useScrollSpy(refs, { rootMargin: '0% 0% -25% 0%' });

  console.log(activeSlug, headings);
  return (
    <>
      <p className={styles.heading}>Sommaire</p>
      <ul>
        {headings.map((heading) => (
          <TableOfContentItem
            key={heading.slug}
            heading={heading}
            isActive={`li-${heading.slug}` === activeSlug}
          />
        ))}
      </ul>
    </>
  );
};

export default function TableOfContent({ headings }: Props) {
  return (
    <TableOfContentProvider>
      <BaseTableOfContent headings={headings} />
    </TableOfContentProvider>
  );
}
