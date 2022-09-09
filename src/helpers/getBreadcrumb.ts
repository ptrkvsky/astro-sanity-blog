import type { BreadcrumbGraphItem } from '@interfaces/BreadcrumbGraphItem';
import type { BreadcrumbList } from 'schema-dts';
import { seoConfig } from 'src/config';

export function getBreadcrumb(breadcrumbItems: BreadcrumbGraphItem[]) {
  const itemListElement = breadcrumbItems.map((breadCrumbItem, index) => ({
    '@type': 'ListItem',
    position: index,
    name: breadCrumbItem.label,
    item: `${seoConfig.baseURL}${breadCrumbItem.slug}`,
  })) as any;

  const breadcrumbList: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement,
  };
  return breadcrumbList;
}
