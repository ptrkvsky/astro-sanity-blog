import type { HeadingsTOC } from '@interfaces/HeadingsTOC';

interface Props {
  headings: HeadingsTOC[];
}

const TableOfContentItem = ({ heading }: { heading: HeadingsTOC }) => (
  <li
    className={`mb-0 text-sm depth depth-${heading.depth}`}
    key={heading.slug}
  >
    <a href={`#${heading.slug}`}>{heading.text}</a>
  </li>
);

const TableOfContent = ({ headings }: Props) => {
  return (
    <div className="table-of-content fixed top-0 right-0">
      <p>Table des matières</p>
      <ul>
        {headings.map((heading) => (
          <TableOfContentItem heading={heading} />
        ))}
      </ul>
    </div>
  );
};

export default TableOfContent;
