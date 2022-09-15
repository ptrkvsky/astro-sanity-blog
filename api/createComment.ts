import sanityClient from '@sanity/client';

export const config = {
  runtime: 'experimental-edge',
};

const sanityConfig = {
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_READ_TOKEN,
  apiVersion: '2021-03-25',
  useCdn: true,
};

export const client = sanityClient(sanityConfig);

export async function createComment({ _id, comment, pseudo }: any) {
  try {
    const newComment = {
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id,
      },
      pseudo,
      content: comment,
      isActive: false,
    };
    const commentCreated = await client.create(newComment);

    return new Response(JSON.stringify(commentCreated), {
      status: 200,
    });
  } catch (err) {
    console.error('👩‍🚒', err);
    return new Response(JSON.stringify(err), {
      status: 500,
    });
  }
}
