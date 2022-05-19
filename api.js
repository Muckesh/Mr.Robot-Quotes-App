const API_URL = '#########################################';

export const getQuotes = async () => {
  const quotes = await fetch(API_URL).then((response) => response.json());
  return quotes;
};
