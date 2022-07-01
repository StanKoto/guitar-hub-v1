import { emptyErrors, makeRequest } from '../modules/helpers.js';

const ratingForm = document.querySelector('form');

if (ratingForm) {
  const ratingError = { element: document.querySelector('.rating.error'), errorType: 'rating' };
  
  const postId = window.location.pathname.split('/')[2];
  const postSlug = window.location.pathname.split('/')[3];

  ratingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    emptyErrors([ ratingError ]);

    const rating = ratingForm.rating.value;

    const url = `/ratings/${postId}`;
    const method = 'POST';
    const redirectUrl = `/posts/${postId}/${postSlug}`;
    const body = JSON.stringify({ rating });

    await makeRequest(url, method, redirectUrl, body, [ ratingError ]);
  })
};