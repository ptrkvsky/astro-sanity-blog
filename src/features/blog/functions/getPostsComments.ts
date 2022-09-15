import { client } from '@lib/sanityClient';

export default async function getPostComments(refPost: string) {
  const query = `*[_type == "comment" && isActive == true && references($refPost)]`;
  const params = {
    refPost,
  };

  try {
    const result = await client.fetch(query, params);
    return result;
  } catch (error: any) {
    console.dir(error, { depth: null });
    // console.error('👨‍🚒 error', error.body.error);
    return {
      error: error.res,
    };
  }
}
