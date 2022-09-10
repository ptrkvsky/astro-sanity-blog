export interface Frontmatter {
  category: string;
  date: string; // '31 October 2021'
  dateModified: string; // '31 October 2021'
  datePublished: string;
  description: string;
  image: string;
  isHome: boolean;
  keywords: string[];
  layout: string;
  metaDescription: string;
  metaTitle: string;
  minutesRead: number;
  rawText: string;
  slug: string;
  title: string;
  hasFooterLink?: boolean;
}
