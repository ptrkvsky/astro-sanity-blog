import sanityClient from '@sanity/client';

const config = {
  projectId:
    import.meta?.env?.PUBLIC_SANITY_PROJECT_ID ||
    process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset:
    import.meta?.env?.PUBLIC_SANITY_DATASET ||
    process.env.PUBLIC_SANITY_DATASET,
  token: import.meta.env.SANITY_READ_TOKEN || process.env.SANITY_READ_TOKEN,
  apiVersion: '2021-03-25',
  useCdn: true,
};

export const client = sanityClient(config);

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
