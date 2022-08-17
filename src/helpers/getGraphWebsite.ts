import type { WebSite } from 'schema-dts';
import config from 'src/config';

const getGraphWebsite = () => {
  const website: WebSite = {
    '@type': 'WebSite',
    '@id': `${config.url}/#website`,
    url: `${config.url}/`,
    name: 'Développeur React Freelance',
    description:
      "Développeur React Freelance depuis 2019, j'aide les entreprises à obtenir leurs objectifs de croissance.",
    inLanguage: 'fr-FR',
  };

  return website;
};

export default getGraphWebsite;
