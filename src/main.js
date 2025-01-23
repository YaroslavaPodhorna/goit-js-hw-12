import { fetchImages } from './js/pixabay-api';
import { renderGallery } from './js/render-functions';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios';


// DOM element 
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');




let lightbox = new SimpleLightbox('.gallery a');
let query = '';
let page = 1;

// clear
function clearGallery() {
  gallery.innerHTML = '';
}

// Loader
function toggleLoader(show) {
  loader.style.display = show ? 'block' : 'none';
}

// Submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  query = e.target.elements.searchQuery.value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Enter a search term!',
      position: "topRight",
        timeout: 3000,
    });
    return;
  }

  page = 1;
  clearGallery();
  toggleLoader(true);

  try {
    const { hits, totalHits } = await fetchImages(query, page);
    toggleLoader(false);

    if (hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message: 'Sorry, there are no images matching your search query. Please try again!',
         position: "topRight",
        timeout: 3000,
        class: 'custom-toast',
    
      });
      return;
    }

    gallery.insertAdjacentHTML('beforeend', renderGallery(hits));
    lightbox.refresh();
    iziToast.success({
      title: 'Success',
      message: `Found ${totalHits} images!`,
      position: "topRight",
        timeout: 3000,
    });
  } catch (error) {
    toggleLoader(false);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong!',
      position: "topRight",
      timeout: 3000,
    });
  }
});