import { useEffect, useState } from 'react';
import { seoConfig } from 'src/config';
// import { createComment } from 'src/functions/createComment';
import styles from './FormComment.module.css';
interface IFormComment {
  _id: string;
  pseudo: string;
  comment: string;
}

interface FormComment {
  postId: string;
  postTitle: string;
}

export default function FormComment({ postId, postTitle }: FormComment) {
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

  function cleanForm() {
    const cleanFormState = {
      ...formState,
      pseudo: '',
      comment: '',
    };
    setFormState(cleanFormState);
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    setIsLoading(true);
    fetch(`${seoConfig.baseURL}/api/createComment`, {
      method: 'POST',
      body: JSON.stringify({ ...formState, postTitle }),
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    })
      .then((response) => {
        if (response.status !== 200) {
          setIsSuccess(false);
          setErrorsForm([...errorsForm, 'Une erreur inconnue est survenue']);
        } else {
          setErrorsForm([]);
          cleanForm();
          setIsSuccess(true);
          return response.json();
        }
      })
      .then((result) => {
        if (result) {
          console.log(result);
          setIsSuccess(true);
        }
      })
      .catch((err) => {
        console.error('👨‍🚒 err', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  if (isSuccess) {
    sessionStorage.setItem('dateComment', `${Date.now()}`);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
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

        {isSuccess && (
          <p className={styles.success}>
            Votre message a été envoyé avec succès. Merci !
          </p>
        )}

        {isLoading ? (
          <div className={styles.loader} />
        ) : (
          <input type="submit" value="Envoyer" />
        )}
      </form>
    </>
  );
}
