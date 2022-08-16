import type { MarkdownHeading } from 'astro';

interface Props {
  headings: MarkdownHeading[];
}

const TableOfContentItem = ({ heading }: { heading: MarkdownHeading }) => (
  <li
    className={`mb-0 text-sm depth depth-${heading.depth}`}
    key={heading.slug}
  >
    <a href={`#${heading.slug}`}>{heading.text}</a>
  </li>
);

const TableOfContent = ({ headings }: Props) => {
  return (
    <>
      <p>Table des matières</p>
      <ul>
        {headings.map((heading) => (
          <TableOfContentItem key={heading.slug} heading={heading} />
        ))}
      </ul>
    </>
  );
};

export default TableOfContent;
