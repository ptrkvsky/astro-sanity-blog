declare module '*.mdx' {
  const attributes: {
    title: string;
    description: string;
    rawText: string;
    datePublished: string;
    dateModified: string;
    urlImage: string;
  };
  export { attributes };
}
