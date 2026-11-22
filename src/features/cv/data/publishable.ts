import type { Sourced } from './types';

export const isPublishable = (entry: Sourced) => entry.status !== 'to-confirm';

export const publishable = <T extends Sourced>(entries: readonly T[]): T[] =>
  entries.filter(isPublishable);
