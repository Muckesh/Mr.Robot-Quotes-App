const API_URL = 'https://mr-robot-quotes.herokuapp.com/quotes-api/api/';

export const getQuotes = async () => {
  const quotes = await fetch(API_URL).then((response) => response.json());
  return quotes;
};