import type { MarkdownHeading } from 'astro';
import type { FC } from 'react';
import TableOfContentItem from '../TableOfContentItem';
import './table-of-content.module.css';

interface Props {
  headings: MarkdownHeading[];
}

const TableOfContent: FC<Props> = ({ headings }: Props) => {
  return (
    <div className="toc">
      <p className="mt-4 mb-3 text-purple-900 font-semibold text-xl md:text-3xl">
        Sommaire
      </p>
      <nav id="table-of-content">
        <ul>
          {headings.map((heading) => (
            <TableOfContentItem key={heading.slug} heading={heading} />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TableOfContent;
