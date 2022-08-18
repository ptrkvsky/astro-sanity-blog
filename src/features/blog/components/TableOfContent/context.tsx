import { createContext, useState } from 'react';
import type { FC } from 'react';

export interface RefLi {
  slug: string;
  refElement: React.RefObject<HTMLLIElement>;
}

interface TocContextInterface {
  refs: RefLi[];
  setRefs: React.Dispatch<React.SetStateAction<any[]>>;
}

export const TocContext = createContext<TocContextInterface>({
  refs: [],
  setRefs: () => {},
});

interface PropsProvider {
  children: React.ReactNode;
}

export const TableOfContentProvider: FC<PropsProvider> = ({
  children,
}: PropsProvider) => {
  const [refs, setRefs] = useState<any[]>([]);
  return (
    <TocContext.Provider value={{ refs, setRefs }}>
      {children}
    </TocContext.Provider>
  );
};
