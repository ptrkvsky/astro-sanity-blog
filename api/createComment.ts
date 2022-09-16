import type { VercelRequest, VercelResponse } from '@vercel/node';
import sanityClient from '@sanity/client';

const sanityConfig = {
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_READ_TOKEN,
  apiVersion: '2021-03-25',
  useCdn: true,
};

export const client = sanityClient(sanityConfig);

export default async function createComment(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const { _id, comment, pseudo } = request.body;
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

    return response.status(200).json(commentCreated);
  } catch (err) {
    console.error('👩‍🚒', err);
    return response.status(500).json(err);
  }
}
