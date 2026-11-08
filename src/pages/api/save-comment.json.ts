export const prerender = false;

import type { APIRoute } from 'astro';
import { createClient } from '@sanity/client';
import sendMail from '@features/blog/functions/sendMail';
import { saveComment } from '@features/blog/functions/saveComment';

export const POST: APIRoute = ({ request }) =>
  saveComment(request, {
    save: async (comment) => {
      const token = import.meta.env.SANITY_MANAGE_TOKEN;
      if (!token) throw new Error('SANITY_MANAGE_TOKEN manquant.');
      const client = createClient({
        projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
        dataset: import.meta.env.PUBLIC_SANITY_DATASET,
        token,
        apiVersion: '2021-03-25',
        useCdn: false,
      });
      return client.create(comment);
    },
    notify: async (postTitle) => {
      if (import.meta.env.SENDIN_BLUE) await sendMail(postTitle);
    },
  });
