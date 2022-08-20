import type {
  Graph,
  WebPage,
  FAQPage,
  CreativeWorkSeries,
  BreadcrumbList,
} from 'schema-dts';
import config from 'src/config';
import getGraphPlace from './getGraphPlace';
import getGraphWebsite from './getGraphWebsite';

const getGraphHome = () => {
  const website = getGraphWebsite();

  const datePublishedISO = new Date('01 September 2022').toISOString();
  const dateModifiedISO = new Date('01 September 2022').toISOString();
  const place = getGraphPlace();

  const creativeWorkSeries: CreativeWorkSeries = {
    '@type': 'CreativeWorkSeries',
    name: 'Développeur React Freelance',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.6',
      ratingCount: '31',
    },
  };

  const breadcrumbList: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Johan Petrikovsky développeur React freelance',
        item: config.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '🚀',
        item: config.url,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Développeur React freelance à Toulouse',
        item: config.url,
      },
    ],
  };

  const webpage: WebPage = {
    '@type': 'WebPage',
    '@id': `${config.url}/`,
    url: `${config.url}/posts/`,
    name: 'Johan Petrikovsky développeur frontend spécialisé en React  (Nexjs, Gatsby, GraphQL...)',
    isPartOf: {
      '@id': `${config.url}/#website`,
    },
    datePublished: datePublishedISO,
    dateModified: dateModifiedISO,
    description:
      "Développeur React depuis 3ans j'aide les entreprises dans le développement de site internet et d'application web performantes",
    breadcrumb: {
      '@id': `${config.url}/posts/#breadcrumb`,
    },
    inLanguage: 'fr-FR',
    potentialAction: [
      {
        '@type': 'ReadAction',
        target: [`${config.url}/posts/`],
      },
    ],
  };

  const FAQPage: FAQPage = {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: "Qu'est-ce qu'un développeur React freelance à Toulouse ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Un développeur React conçoit et crée des applications basées sur JavaScript pour les environnements web ou mobiles. Il se spécialise généralement dans le développement frontal. React est une bibliothèque JavaScript open-source. Elle est parfois désignée sous le nom de React.',
        },
      },
      {
        '@type': 'Question',
        name: 'Comment devenir développeur React Freelance ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Choisissez votre objectif. La bibliothèque React est une librairie pour le développement d'applications frontend. Acquérir les compétences essentielles. Bien que les emplois dans le domaine du développement logiciel connaissent une croissance supérieure à la moyenne, il est essentiel de disposer d'un ensemble de compétences compétitives pour React. ",
        },
      },
      {
        '@type': 'Question',
        name: 'Combien gagne un développeur React freelance ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Selon le site internet Malt spécialisé dans le recrutement de développeur React freelance, un développeur avec 0 à 2ans d'expérience à un tarif jour moyen de 292€. Avec 2 à 7 ans d'expérience 424€ en moyenne et enfin un développeur React freelance avec plus de 7ans d'expérience peut espérer gagner 590€ par jour en moyenne.",
        },
      },
    ],
  };

  const schema: Graph = {
    '@context': 'https://schema.org',
    '@graph': [
      website,
      webpage,
      FAQPage,
      creativeWorkSeries,
      breadcrumbList,
      place,
    ],
  };

  return schema;
};

export default getGraphHome;
