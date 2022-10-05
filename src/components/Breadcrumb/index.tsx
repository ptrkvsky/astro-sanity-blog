// ---
// import type { BreadcrumbItem } from '@interfaces/BreadcrumbItem';

// interface AstroProps {
//   breadcrumbItems: BreadcrumbItem[];
// }

// const { breadcrumbItems } = Astro.props as AstroProps;
// ---

import type { BreadcrumbItem } from '@interfaces/BreadcrumbItem';
import './style.scss';

interface Props {
  breadcrumbItems: BreadcrumbItem[];
}

export default function Breadcrumb({ breadcrumbItems }: Props) {
  return (
    <nav id="breadcrumb" className="breadcrumb conteneur mt-6 mb-4">
      <ul className="flex gap-1">
        {breadcrumbItems.map(({ name, path }, index) => (
          <li className="flex gap-1 text-gray-500 text-sm">
            <a className="" href={path}>
              {name}
            </a>
            <svg
              className="separator relative top-1"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </li>
        ))}
      </ul>
    </nav>
  );
}
