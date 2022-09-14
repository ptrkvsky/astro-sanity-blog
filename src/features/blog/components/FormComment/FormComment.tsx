import { useEffect, useState } from 'react';
import './FormComment.module.css';
interface IFormComment {
  _id: string;
  pseudo: string;
  comment: string;
}

interface FormComment {
  postId: string;
}

export default function FormComment({ postId }: FormComment) {
  const initForm: IFormComment = {
    _id: postId,
    pseudo: '',
    comment: '',
  };
  const [formState, setFormState] = useState<IFormComment>(initForm);
  const [errorsForm, setErrorsForm] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Init form
    if (formState) {
      setFormState({ ...formState, _id: postId });
    }
  }, []);

  function handleChangePseudo(e: any) {
    setFormState({ ...formState, pseudo: e.currentTarget.value });
  }

  function handleChangeComment(e: any) {
    setFormState({ ...formState, comment: e.currentTarget.value });
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    setIsLoading(true);
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify({ ...formState }),
    })
      .then((response) => {
        if (response.status !== 200) {
          setIsSuccess(false);
          setErrorsForm([...errorsForm, 'Une erreur inconnue est survenue']);
        } else {
          setErrorsForm([]);
          setIsSuccess(true);
          return response.json();
        }
      })
      .then((result) => {
        if (result) {
          setIsSuccess(true);
        }
        console.log(result);
      })
      .catch((err) => {
        console.log('err', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {isSuccess && <p>Votre message a été envoyé avec succès. Merci !</p>}
        {errorsForm.map((errorForm) => (
          <p>{errorForm}</p>
        ))}
        <label htmlFor="pseudo">
          Pseudo
          <input
            required
            type="text"
            onChange={handleChangePseudo}
            id="pseudo"
            value={formState.pseudo}
          />
        </label>
        <label htmlFor="comment">
          Commentaire{' '}
          <textarea
            required
            id="comment"
            onChange={handleChangeComment}
            value={formState.comment}
          />
        </label>
        {isLoading ? (
          <div class="loader"></div>
        ) : (
          <input type="submit" value="Envoyer" />
        )}
      </form>
    </>
  );
}
