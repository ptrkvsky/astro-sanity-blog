import type { Place } from 'schema-dts';
import { seoConfig } from 'src/config';

const getGraphPlace = () => {
  const place: Place = {
    '@type': 'Place',
    '@id': `${seoConfig.baseURL}/#place`,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '43.58336473672046',
      longitude: '1.464493430681529',
    },
    hasMap:
      'https://www.google.com/maps/search/?api=1&amp;query=43.58336473672046,1.464493430681529',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '51 avenue de Lespinet',
      addressLocality: 'Toulouse',
      addressRegion: 'Haute-Garonne',
      postalCode: '31400',
      addressCountry: 'France',
    },
  };
  return place;
};

export default getGraphPlace;
