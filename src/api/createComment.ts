import { client } from '@lib/sanityClient';
import type { APIContext } from 'astro';

export async function createComment({ _id, comment, pseudo }: any) {
  console.log(_id, comment, pseudo);
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
export async function get({ request }: APIContext) {
  return new Response(JSON.stringify({ tooo: 'ttt' }), {
    status: 500,
  });
  // return new Response(JSON.stringify({ test: 'test' }), {
  //   status: 500,
  // });
}
