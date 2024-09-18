//@ts-ignore
import Sib from 'sib-api-v3-sdk';

export default async function sendMail(postTitle: string) {
  try {
    const sibClient = Sib.ApiClient.instance;
    const apiKey = sibClient.authentications['api-key'];
    apiKey.apiKey = import.meta.env.SENDIN_BLUE;

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: 'johan@developpeur-web.tech',
      name: 'Johan',
    };

    const receivers = [
      {
        email: 'johan@developpeur-web.tech',
      },
    ];

    const result = await tranEmailApi.sendTransacEmail({
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
    });

    console.log('✅ Email sent successfully:', result);
    return result;
  } catch (error: any) {
    console.error('🔥 Error sending email:', error.text);
    throw error; // Re-throw the error if you want calling code to handle it
  }
}
