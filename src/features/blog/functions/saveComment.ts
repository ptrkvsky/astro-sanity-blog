interface CommentDocument {
  _type: 'comment';
  post: { _type: 'reference'; _ref: string };
  pseudo: string;
  content: string;
  isActive: false;
}

interface Dependencies {
  save: (comment: CommentDocument) => Promise<{ _id: string }>;
  notify: (postTitle: string) => Promise<unknown>;
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });

export async function saveComment(
  request: Request,
  { save, notify }: Dependencies,
) {
  const contentType = request.headers
    .get('content-type')
    ?.split(';')[0]
    .trim()
    .toLowerCase();
  if (contentType !== 'application/json') {
    return json({ error: 'Format JSON requis.' }, 415);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON invalide.' }, 400);
  }
  if (!body || typeof body !== 'object') {
    return json({ error: 'Commentaire invalide.' }, 400);
  }
  const { _id, pseudo, comment, postTitle } = body as Record<string, unknown>;
  if (
    typeof _id !== 'string' ||
    !/^[a-zA-Z0-9_][a-zA-Z0-9_.-]{0,127}$/.test(_id) ||
    _id.startsWith('drafts.') ||
    typeof pseudo !== 'string' ||
    !pseudo.trim() ||
    pseudo.trim().length > 100 ||
    typeof comment !== 'string' ||
    !comment.trim() ||
    comment.trim().length > 10000 ||
    typeof postTitle !== 'string' ||
    !postTitle.trim()
  ) {
    return json({ error: 'Commentaire invalide.' }, 400);
  }

  let created: { _id: string };
  try {
    created = await save({
      _type: 'comment',
      post: { _type: 'reference', _ref: _id },
      pseudo: pseudo.trim(),
      content: comment.trim(),
      isActive: false,
    });
  } catch {
    console.error('Impossible d’enregistrer le commentaire dans Sanity.');
    return json({ error: 'Enregistrement impossible.' }, 500);
  }

  // La notification ne doit jamais faire échouer un commentaire déjà enregistré.
  try {
    await notify(postTitle.trim());
  } catch {
    console.error(
      'Commentaire enregistré, mais notification e-mail indisponible.',
    );
  }
  return json({ _id: created._id }, 200);
}
