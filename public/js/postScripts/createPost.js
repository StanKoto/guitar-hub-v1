import { emptyErrors, makeRequest } from '../modules/helpers.js';

const form = document.querySelector('form');

const titleError = { element: document.querySelector('.title.error'), errorType: 'title' };
const contentsError = { element: document.querySelector('.contents.error'), errorType: 'contents' };
const imageError = { element: document.querySelector('.image.error'), errorType: 'images' };

const customErrors = [ titleError, contentsError, imageError ];

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  emptyErrors(customErrors);

  const title = form.title.value;
  const contents = form.contents.value;
  const images = document.getElementById('images');

  const formData = new FormData();
  formData.append('title', title);
  formData.append('contents', contents);
  for (const image of images.files) {
    formData.append('images', image);
  }

  const url = '/posts';
  const method = 'POST';
  const redirectUrl = '/posts';

  await makeRequest(url, method, redirectUrl, formData, customErrors);
});