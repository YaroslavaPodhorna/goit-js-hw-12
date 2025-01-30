import { fetchImages } from './js/pixabay-api';
import { renderGallery } from './js/render-functions';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios';

// DOM елементи
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.createElement('button');

loadMoreBtn.textContent = 'Load More';
loadMoreBtn.classList.add('load-more-btn', 'is-hidden');
gallery.insertAdjacentElement('afterend', loadMoreBtn);

let lightbox = new SimpleLightbox('.gallery a');
let query = '';
let page = 1;
let totalHits = 0;
let loadedImages = 0;
const perPage = 15;

// Очистка галереї
function clearGallery() {
  gallery.innerHTML = '';
  loadedImages = 0;
}

// Показати/сховати кнопку "Load More"
function toggleLoadMoreBtn(show) {
  loadMoreBtn.classList.toggle('is-hidden', !show);
}

// Показати/сховати лоадер
function toggleLoader(show) {
  loader.style.display = show ? 'block' : 'none';
}

// Сабміт форми
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  query = e.target.elements.searchQuery.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Enter a search term!',
      position: 'topRight',
      timeout: 3000,
    });
    return;
  }

  page = 1;
  clearGallery();
  toggleLoadMoreBtn(false);
  toggleLoader(true); // Показати лоадер

  try {
    const { hits, totalHits: newTotalHits } = await fetchImages(query, page, perPage);
    totalHits = newTotalHits;
    toggleLoader(false); // Приховати лоадер після завантаження

    if (totalHits === 0) {
      iziToast.info({
        title: 'Info',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        timeout: 3000,
        class: 'custom-toast',
      });
      return;
    }

    gallery.insertAdjacentHTML('beforeend', renderGallery(hits));
    lightbox.refresh();

    loadedImages = hits.length;

    iziToast.success({
      title: 'Success',
      message: `Found ${newTotalHits} images!`,
      position: 'topRight',
      timeout: 3000,
    });

    toggleLoadMoreBtn(loadedImages < totalHits);
  } catch (error) {
    toggleLoader(false); // Приховати лоадер у разі помилки
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong!',
      position: 'topRight',
      timeout: 3000,
    });
  }
});

// Клік на кнопку "Load More"
loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  toggleLoader(true); // Показати лоадер

  try {
    const { hits } = await fetchImages(query, page, perPage);
    toggleLoader(false); // Приховати лоадер після завантаження
    gallery.insertAdjacentHTML('beforeend', renderGallery(hits));
    lightbox.refresh();

    loadedImages += hits.length;

    // Плавне прокручування
    const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (loadedImages >= totalHits) {
      toggleLoadMoreBtn(false);
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        timeout: 3000,
      });
    }
  } catch (error) {
    toggleLoader(false); // Приховати лоадер у разі помилки
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images!',
      position: 'topRight',
      timeout: 3000,
    });
  }
});
