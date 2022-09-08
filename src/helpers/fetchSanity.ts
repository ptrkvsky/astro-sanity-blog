import { config } from 'src/config';

function fetchSanity<ReturnType>(
  query: string,
  variables: Record<any, string> | undefined = undefined
) {
  return fetch(config.sanityGraphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.SANITY_READ_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((r) => r.json())
    .then((result) => {
      return result.data as ReturnType;
    })
    .catch((error: unknown) => {
      console.error('👨‍🚒', error);
    });
}

export default fetchSanity;
