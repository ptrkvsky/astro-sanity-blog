import { client } from '@lib/sanityClient';

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
