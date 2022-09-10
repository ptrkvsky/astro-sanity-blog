import type { FAQItem } from '@interfaces/FAQItem';
import type { FAQPage } from 'schema-dts';

export function getFaq(faqItems: FAQItem[]) {
  const mainEntity = faqItems.map((faqItem) => {
    const item = {
      '@type': 'Question',
      name: faqItem.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faqItem.answer,
      },
    };
    return item;
  });

  const faq: FAQPage = {
    '@type': 'FAQPage',
    mainEntity: mainEntity as any,
  };
  return faq;
}

// [
//   {
//     '@type': 'Question',
//     name: "Qu'est-ce qu'un développeur React freelance à Toulouse ?",
//     acceptedAnswer: {
//       '@type': 'Answer',
//       text: 'Un développeur React conçoit et crée des applications basées sur JavaScript pour les environnements web ou mobiles. Il se spécialise généralement dans le développement frontal. React est une bibliothèque JavaScript open-source. Elle est parfois désignée sous le nom de React.',
//     },
//   },
//   {
//     '@type': 'Question',
//     name: 'Comment devenir développeur React Freelance ?',
//     acceptedAnswer: {
//       '@type': 'Answer',
//       text: "Choisissez votre objectif. La bibliothèque React est une librairie pour le développement d'applications frontend. Acquérir les compétences essentielles. Bien que les emplois dans le domaine du développement logiciel connaissent une croissance supérieure à la moyenne, il est essentiel de disposer d'un ensemble de compétences compétitives pour React. ",
//     },
//   },
//   {
//     '@type': 'Question',
//     name: 'Combien gagne un développeur React freelance ?',
//     acceptedAnswer: {
//       '@type': 'Answer',
//       text: "Selon le site internet Malt spécialisé dans le recrutement de développeur React freelance, un développeur avec 0 à 2ans d'expérience à un tarif jour moyen de 292€. Avec 2 à 7 ans d'expérience 424€ en moyenne et enfin un développeur React freelance avec plus de 7ans d'expérience peut espérer gagner 590€ par jour en moyenne.",
//     },
//   },
// ],
