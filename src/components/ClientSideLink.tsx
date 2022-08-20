import { useEffect, useState } from 'react';

interface Props {
  href: string;
  label: string;
  defaultHref?: string;
}

const ClientSideLink = ({ href, label, defaultHref = '#' }: Props) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);
  }, []);

  const finalHref = isRendered ? href : defaultHref;

  return <a href={finalHref}>{label}</a>;
};

export default ClientSideLink;
