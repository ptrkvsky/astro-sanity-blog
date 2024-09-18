import { useEffect, useState } from 'react';
import { seoConfig } from 'src/config';
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

export default function FormComment({
  postId,
  postTitle,
}: Readonly<FormComment>) {
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

  function handleChangePseudo(e: React.ChangeEvent<HTMLInputElement>) {
    setFormState({ ...formState, pseudo: e.currentTarget.value });
  }

  function handleChangeComment(e: React.ChangeEvent<HTMLTextAreaElement>) {
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    fetch(`${seoConfig.baseURL}/api/save-comment.json`, {
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
    <section className="px-0 sm:pr-16">
      <h2 className="font-semibold text-indigo-600 mt-10 mb-4 text-2xl lg:text-3xl">
        Laisser un commentaire
      </h2>
      <form onSubmit={handleSubmit}>
        {errorsForm.map((errorForm) => (
          <p key={errorForm}>{errorForm}</p>
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
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleChangeComment(e)
            }
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
    </section>
  );
}
