interface CommentPayload {
  _id: string;
  postTitle: string;
  pseudo: string;
  comment: string;
}
export async function submitComment(
  payload: CommentPayload,
  request: typeof fetch = fetch,
) {
  if (!payload.pseudo.trim() || !payload.comment.trim())
    throw new Error('Champs obligatoires');
  const response = await request('/api/save-comment.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Envoi impossible');
}
