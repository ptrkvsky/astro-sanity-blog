import { remark } from 'remark';
import remarkToc from 'remark-toc';

export function remarkTableOfContent() {
  return async function (tree, { data }) {
    const getFile = async () => {
      const file = await remark().use(remarkToc).;
      return file;
    };
    const file = await getFile();

    console.log(String(file));
  };
}
