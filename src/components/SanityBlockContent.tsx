// import react from '@astrojs/react';
import { PortableText } from '@portabletext/react';

const SanityBlockContent = ({ blocks }: any) => {
  return <PortableText value={blocks} />;
};

export default SanityBlockContent;
