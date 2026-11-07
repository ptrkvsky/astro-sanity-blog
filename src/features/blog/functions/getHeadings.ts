import type { BlockContent } from '@interfaces/SanitySchema';
import { articleHeadings } from './articleContent';
export function getHeadings(blocks: BlockContent) {
  return articleHeadings(blocks || []);
}
