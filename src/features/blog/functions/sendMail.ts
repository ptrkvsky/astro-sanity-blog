//@ts-ignore
import Sib from 'sib-api-v3-sdk';

export default async function sendMail(postTitle: string) {
  const sibClient = Sib.ApiClient.instance;
  const apiKey = sibClient.authentications['api-key'];
  apiKey.apiKey = process.env.SENDIN_BLUE;

  const tranEmailApi = new Sib.TransactionalEmailsApi();

  const sender = {
    email: 'johan@developpeur-web.tech',
    name: 'Johan',
  };

  const receivers = [
    {
      email: 'johan.petrikovsky@gmail.com',
    },
  ];

  await tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: 'Nouveau commentaire sur le post {{params.title}} ',
      textContent: `
        Un nouveau commentaire a été laissé sur le site.
        `,
      htmlContent: `
        <h1>Nouveau commentaire</h1>
        <a href="https://developpeur-web.sanity.studio/">Voir le commentaire</a>`,

      params: {
        title: postTitle,
      },
    })
    .then((result: any) => {
      console.log('✅', 'comment succeed');
    })
    .catch((error: any) => {
      console.log('🔥', error);
    });
}
