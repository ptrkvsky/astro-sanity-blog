export const prerender = false;

import { APIRoute } from 'astro';
import { createClient } from '@sanity/client';
import sendMail from '@features/blog/functions/sendMail';

const sanityConfig = {
  projectId: 'nrxsmjzk',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  token: import.meta.env.SANITY_READ_TOKEN,
  apiVersion: '2021-03-25',
  useCdn: true,
};

export const sanityClient = createClient(sanityConfig);

export const POST: APIRoute = async ({ request }) => {
  if (
    request.headers.get('Content-Type') === 'application/json; charset=UTF-8'
  ) {
    try {
      const body = await request.json();
      const { _id, comment, pseudo, postTitle } = body;

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

      await sendMail(postTitle);
      const commentCreated = await sanityClient.create(newComment);
      return new Response(JSON.stringify(commentCreated), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('👩‍🚒', err);
      return new Response(JSON.stringify(err), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  return new Response(null, { status: 400 });
};
