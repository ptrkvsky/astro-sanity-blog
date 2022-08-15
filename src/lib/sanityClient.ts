import sanityClient from '@sanity/client';

const config = {
  projectId: '25wov4e3',
  dataset: 'production',
  token:
    'skq1IjIjGdgJHLkjIcPGoM9jmfmDnr54nfIxN33z3mPZuyWwkLVtGy2PfOa6X0gMBbXgDUpijbk8ptLtlRSu2lxIxNENRLNFeLfQoUzK2vvlKfq5TYV846bTPKyYRjPUa4XJBK6O5SqHgsnrRFF2OhBGK9NgMQLZSQKLgowoNQl4a2CumTZz',
  apiVersion: '2021-03-25',
  useCdn: true,
};

export const client = sanityClient(config);
