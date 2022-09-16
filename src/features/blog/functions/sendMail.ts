//@ts-ignore
import Sib from 'sib-api-v3-sdk';

export default async function sendMail() {
  const sibClient = Sib.ApiClient.instance;
  const apiKey = sibClient.authentications['api-key'];
  apiKey.apiKey = process.env.SENDIN_BLUE;

  const tranEmailApi = new Sib.TransactionalEmailsApi();

  const sender = {
    email: 'johan.petrikovskyn@gmail.com',
    name: 'Johan',
  };

  const receivers = [
    {
      email: 'johan.petrikovsky@gmail.com',
    },
  ];

  const test = await tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: 'Subscribe to Cules Coding to become a developer',
      textContent: `
        Cules Coding will teach you how to become {{params.role}} a developer.
        `,
      htmlContent: `
        <h1>Cules Coding</h1>
        <a href="https://cules-coding.vercel.app/">Visit</a>
                `,
      params: {
        role: 'Frontend',
      },
    })
    .then((result: any) => {
      console.log('〽️', result);
    })
    .catch((error: any) => {
      console.log('🔥', error);
    });

  console.log('test -->', test);
}
