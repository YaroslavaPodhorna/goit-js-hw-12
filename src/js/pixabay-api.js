import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '48208907-81157ac097d3685843fe42362';

/**
 * Функція для виконання запитів до Pixabay API
 * @param {string} query - Пошуковий запит
 * @param {number} page - Номер сторінки
 * @param {number} perPage - Кількість зображень на сторінку
 * @returns {Promise} - Результати пошуку
 */
export async function fetchImages(query, page = 1, perPage = 15) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  
  const { data } = await axios.get(url);
  
  if (data.hits.length === 0) {
    throw new Error('No images found');
  }
  
  return data;
}