import type { VercelRequest, VercelResponse } from '@vercel/node';
import sanityClient from '@sanity/client';
import sendMail from '../src/features/blog/functions/sendMail';

const sanityConfig = {
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_READ_TOKEN,
  apiVersion: '2021-03-25',
  useCdn: true,
};

export const sanity = sanityClient(sanityConfig);

export default async function createComment(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const { _id, comment, pseudo, postTitle } = request.body;

    // Delete all
    // Without params
    sanity
      .delete({ query: '*[_type == "comment"]' })
      .then(() => {
        console.log('The document matching *[_type == "comment"] was deleted');
      })
      .then((test) => {
        console.log(test);
      })
      .catch((err) => {
        console.error('Delete failed: ', err.message);
      });

    sanity.getDocument(`${_id}`).then((post) => {
      console.log('post -->', post);
    });

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

    // await sendMail(postTitle);
    return response.status(200).json(newComment);
  } catch (err) {
    console.error('👩‍🚒', err);
    return response.status(500).json(err);
  }
}
