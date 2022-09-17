export function getLeadingZero(number: number) {
  let numberWithLeadingZerto = `${number}`;
  if (number < 10) {
    numberWithLeadingZerto = `0${number}`;
  }
  return numberWithLeadingZerto;
}

export function getFrenchDate(dateString: string) {
  const day = new Date(dateString).getDay();
  const dayWithLeadingZerto = getLeadingZero(day);

  const month = new Date(dateString).getMonth();
  const monthWithLeadingZerto = getLeadingZero(month);

  const year = new Date(dateString).getFullYear();
  const frenchDate = `${dayWithLeadingZerto}/${monthWithLeadingZerto}/${year}`;

  return frenchDate;
}
