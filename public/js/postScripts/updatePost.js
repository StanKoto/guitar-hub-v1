import { emptyErrors, makeRequest } from '../modules/helpers.js';

const contentForm = document.getElementById('contents-form');
const imageForm = document.getElementById('image-form');

const titleError = { element: document.querySelector('.title.error'), errorType: 'title' };
const contentsError = { element: document.querySelector('.contents.error'), errorType: 'contents' };
const imageError = { element: document.querySelector('.image.error'), errorType: 'images' };

const customContentErrors = [ titleError, contentsError ];

const imgRedirectUrl = location.pathname;

contentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  emptyErrors(customContentErrors);

  const title = contentForm.title.value;
  const contents = contentForm.contents.value;

  const url = location.pathname;
  const method = 'PUT';
  const redirectUrl = 'post';
  const body = JSON.stringify({ title, contents });

  await makeRequest(url, method, redirectUrl, body, customContentErrors);
});

imageForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  emptyErrors([ imageError ]);

  const formData = new FormData();
  const images = document.getElementById('images');
  for (const image of images.files) {
    formData.append('images', image);
  }

  const url = `${location.pathname}/images`;
  const method = 'POST';

  await makeRequest(url, method, imgRedirectUrl, formData, [ imageError ]);
});

document.querySelectorAll('.delete.image').forEach(item => {
  item.addEventListener('click', async (e) => {
    e.preventDefault();

    const url = `${location.pathname}/images/${item.id}`;
    const method = 'DELETE';

    await makeRequest(url, method, imgRedirectUrl);
  });
});