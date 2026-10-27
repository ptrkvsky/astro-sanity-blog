import type { FAQItem } from './../interfaces/FAQItem';
import type {
  Graph,
  WebPage,
  CreativeWorkSeries,
  BreadcrumbList,
} from 'schema-dts';
import getGraphPlace from './getGraphPlace';
import getGraphWebsite from './getGraphWebsite';
import { getFaq } from './getFaq';
import { getWebPage, type ParamsGetWebPage } from './getWebPage';
import { getBreadcrumb } from './getBreadcrumb';

import type { BreadcrumbGraphItem } from '@interfaces/BreadcrumbGraphItem';

export function getGraphHome() {
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

  const paramsGetBreadcrumb: BreadcrumbGraphItem[] = [
    {
      label: 'Johan Petrikovsky développeur React freelance',
      slug: '/',
    },
    {
      label: '🚀',
      slug: '/',
    },
    {
      label: 'Développeur React freelance à Toulouse',
      slug: '/',
    },
  ];

  const breadcrumbList: BreadcrumbList = getBreadcrumb(paramsGetBreadcrumb);
  const paramsGetWebPage: ParamsGetWebPage = {
    url: '/',
    name: 'Johan Petrikovsky développeur frontend spécialisé en React  (Nexjs, Gatsby, GraphQL...)',
    description:
      "Développeur React depuis 3ans j'aide les entreprises dans le développement de site internet et d'application web performantes",
    datePublishedISO,
    dateModifiedISO,
    breadcrumbId: '#breadcrumb',
  };

  const webpage: WebPage = getWebPage(paramsGetWebPage);
  const faqItems: FAQItem[] = [
    {
      question: "Qu'est-ce qu'un développeur React freelance à Toulouse ?",
      answer:
        'Un développeur React conçoit et crée des applications basées sur JavaScript pour les environnements web ou mobiles. Il se spécialise généralement dans le développement frontal. React est une bibliothèque JavaScript open-source. Elle est parfois désignée sous le nom de React.',
    },
    {
      question: 'Comment devenir développeur React Freelance ?',
      answer:
        "Choisissez votre objectif. La bibliothèque React est une librairie pour le développement d'applications frontend. Acquérir les compétences essentielles. Bien que les emplois dans le domaine du développement logiciel connaissent une croissance supérieure à la moyenne, il est essentiel de disposer d'un ensemble de compétences compétitives pour React. ",
    },
    {
      question: 'Combien gagne un développeur React freelance ?',
      answer:
        "Selon le site internet Malt spécialisé dans le recrutement de développeur React freelance, un développeur avec 0 à 2ans d'expérience à un tarif jour moyen de 292€. Avec 2 à 7 ans d'expérience 424€ en moyenne et enfin un développeur React freelance avec plus de 7ans d'expérience peut espérer gagner 590€ par jour en moyenne.",
    },
  ];

  const FAQPage = getFaq(faqItems);

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
}
