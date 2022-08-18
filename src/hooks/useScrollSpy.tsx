import type { RefLi } from '@features/blog/components/TableOfContent/context';
import { useEffect, useState, useRef } from 'react';

export default function useScrollSpy(
  refs: RefLi[],
  options: IntersectionObserverInit
) {
  const [activeSlug, setActiveSlug] = useState('');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current?.disconnect();
    const observerInstance = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          setActiveSlug(entry.target.id);
        }
      });
    }, options);
    observer.current = observerInstance;
    refs.forEach((ref) => {
      if (ref && ref.refElement.current) {
        console.log(ref.refElement.current);
        observer.current?.observe(ref.refElement.current);
      }
    });
    return () => observer.current?.disconnect();
  }, [refs, options]);

  return activeSlug;
}
