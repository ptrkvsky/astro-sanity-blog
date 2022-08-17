import { useEffect, useState, useRef } from 'react';

export default function useScrollSpy(
  slugs: string[],
  options: IntersectionObserverInit
) {
  const [activeSlug, setActiveSlug] = useState('');
  const observer = useRef<any>();

  console.log('this log into the console');
  useEffect(() => {
    console.log('this console log is not showing up');
    const elements = slugs.map((slug) => document.getElementById(`#${slug}`));
    console.log(elements, slugs);
    observer.current?.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          setActiveSlug(entry.target.id);
        }
      });
    }, options);
    elements.forEach((el) => {
      if (el) {
        observer.current?.observe(el);
      }
    });
    return () => observer.current?.disconnect();
  }, [slugs, options]);

  return activeSlug;
}
