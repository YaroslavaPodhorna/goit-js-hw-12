

  export function renderGallery(images) {
    return images
      .map(
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
          <a class="gallery-item" href="${largeImageURL}" data-title="${tags}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
            <div class="info">
              <p><span>Likes</span><span>${likes}</span></p>
              <p><span>Views</span><span>${views}</span></p>
              <p><span>Comments</span><span>${comments}</span></p>
              <p><span>Downloads</span><span>${downloads}</span></p>
            </div>
          </a>`
      )
      .join('');
  }