import { useEffect, useRef, useState } from 'react';
import { submitComment } from './submitComment';

interface Props {
  postId: string;
  postTitle: string;
}
export default function FormComment({ postId, postTitle }: Props) {
  const [pseudo, setPseudo] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const [ready, setReady] = useState(false);
  const sending = useRef(false);
  useEffect(() => {
    setReady(true);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setStatus('sending');
    try {
      await submitComment({
        _id: postId,
        postTitle,
        pseudo: pseudo.trim(),
        comment: comment.trim(),
      });
      setStatus('success');
      setPseudo('');
      setComment('');
    } catch {
      setStatus('error');
    } finally {
      sending.current = false;
    }
  }
  return (
    <div className="blog-comment-form">
      <h2>Laisser un commentaire</h2>
      <p>Les commentaires sont relus avant publication.</p>
      <form onSubmit={handleSubmit} aria-busy={status === 'sending'}>
        <label htmlFor="comment-pseudo">
          Pseudo
          <input
            id="comment-pseudo"
            name="pseudo"
            required
            maxLength={100}
            autoComplete="nickname"
            value={pseudo}
            onChange={(event) => setPseudo(event.currentTarget.value)}
          />
        </label>
        <label htmlFor="comment-text">
          Commentaire
          <textarea
            id="comment-text"
            name="comment"
            required
            rows={6}
            maxLength={10000}
            value={comment}
            onChange={(event) => setComment(event.currentTarget.value)}
          />
        </label>
        <p className="blog-form-status" role="status" aria-live="polite">
          {status === 'sending'
            ? 'Envoi en cours…'
            : status === 'success'
              ? 'Votre commentaire a été envoyé. Il sera visible après validation.'
              : ''}
        </p>
        {status === 'error' && (
          <p role="alert">
            L’envoi a échoué. Votre texte est conservé ; vous pouvez réessayer.
          </p>
        )}
        <button
          className="btn"
          type="submit"
          disabled={!ready || status === 'sending'}
        >
          Envoyer le commentaire
        </button>
      </form>
    </div>
  );
}
