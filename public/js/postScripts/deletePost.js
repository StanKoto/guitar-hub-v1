import { makeRequest } from '../modules/helpers.js'; 

const deleteButton = document.getElementById('delete-post');
if (deleteButton) {
  deleteButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const postId = window.location.pathname.split('/')[2];

    const url = location.pathname;
    const method = 'DELETE';
    const redirectUrl = '/posts';
    
    await makeRequest(url, method, redirectUrl);
  });
}