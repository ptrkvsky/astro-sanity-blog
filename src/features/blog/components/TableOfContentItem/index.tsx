import type { MarkdownHeading } from 'astro';
import { type FC, useRef, useContext, useEffect } from 'react';
import { TocContext } from '../TableOfContent/context';

interface PropsTableOfContentItem {
  heading: MarkdownHeading;
  isActive: boolean;
}

const TableOfContentItem: FC<PropsTableOfContentItem> = ({
  heading,
  isActive,
}: PropsTableOfContentItem) => {
  const refLi = useRef<HTMLLIElement>(null);
  const { refs, setRefs } = useContext(TocContext);

  useEffect(() => {
    setRefs([...refs, { slug: heading.slug, refElement: refLi }]);
  }, []);

  return (
    <li
      ref={refLi}
      id={`li-${heading.slug}`}
      className={`mb-0 text-sm depth depth-${heading.depth} ${
        isActive ? 'text-indigo-800' : ''
      }`}
      key={heading.slug}
    >
      <a href={`#${heading.slug}`}>{heading.text}</a>
    </li>
  );
};

export default TableOfContentItem;
