import { Fragment } from 'preact';
import { useEffect, useState } from 'preact/hooks';

interface IFormComment {
  _id: string;
  pseudo: string;
  comment: string;
}

interface FormComment {
  postId: string;
}

function FormComment({ postId }: FormComment) {
  const initForm: IFormComment = {
    _id: postId,
    pseudo: '',
    comment: '',
  };
  const [formState, setFormState] = useState<IFormComment>(initForm);

  useEffect(() => {
    // Init form
    if (formState) {
      setFormState({ ...formState, _id: postId });
    }
  }, []);

  function handleChangePseudo() {
    setFormState({ ...formState, pseudo: postId });
  }

  return (
    <Fragment>
      <form>
        <input type="hidden" id="pseudo" value={formState._id} />
        <label htmlFor="pseudo">
          Pseudo{' '}
          <input
            type="text"
            onChange={handleChangePseudo}
            id="pseudo"
            value={formState.pseudo}
          />
        </label>
        <label htmlFor="comment">
          Commentaire{' '}
          <input type="text" id="comment" value={formState.comment} />
        </label>
      </form>
    </Fragment>
  );
}

export default FormComment;
