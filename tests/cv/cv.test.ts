import {
  achievements,
  award,
  cvSeo,
  education,
  experiences,
  headline,
  selectedProjects,
  skillGroups,
  summary,
} from '../../src/features/cv/data/cv';
import { publishable } from '../../src/features/cv/data/publishable';

const publishedText = () =>
  JSON.stringify([
    headline,
    summary,
    cvSeo,
    publishable(experiences),
    publishable(achievements),
    publishable(selectedProjects),
    skillGroups.flatMap((g) => publishable(g.skills)),
    publishable([award]),
    publishable(education),
  ]);

describe('publishable', () => {
  it('écarte les entrées à confirmer', () => {
    const kept = publishable(experiences).map((e) => e.employer);
    expect(kept).not.toContain('ADS');
    expect(kept).toContain('SAFTI');
  });
});

describe('distinction CSS Design Awards', () => {
  it('porte le libellé exact', () => {
    expect(award.name).toBe('Special Kudos — CSS Design Awards, 2024');
    expect(award.url).toBe(
      'https://www.cssdesignawards.com/sites/draw-me-a-sheep/45991/',
    );
  });

  it('ne revendique ni Website of the Day ni prix individuel', () => {
    expect(publishedText()).not.toMatch(
      /website of the (day|month|year)|WOTD|WOTM|WOTY|lauréat/i,
    );
  });
});

describe('contenu publié', () => {
  it('évite les formules génériques', () => {
    expect(publishedText()).not.toMatch(/passionné|dynamique|nouveaux défis/i);
  });

  it('ne revendique pas de lien hiérarchique', () => {
    expect(publishedText()).not.toMatch(/manager|management|N\+1/i);
  });

  it('a une description SEO de 120 à 155 caractères', () => {
    expect(cvSeo.description.length).toBeGreaterThanOrEqual(120);
    expect(cvSeo.description.length).toBeLessThanOrEqual(155);
  });
});
