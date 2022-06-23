const form = document.querySelector('form');
const titleError = document.querySelector('.title.error');
const contentsError = document.querySelector('.contents.error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  titleError.textContent = '';
  contentsError.textContent = '';

  const postId = window.location.pathname.split('/')[2];

  const body = {};
  const title = form.title.value;
  if (title.length !== 0) body.title = title;
  const contents = form.contents.value;
  if (contents.length !== 0) body.contents = contents;

  try {
    const res = await fetch(`/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (data.errors) {
      titleError.textContent = data.errors.title;
      contentsError.textContent = data.errors.contents;
    } else if (data.otherErrors) {
      switch (res.status) {
        case 401:
          location.assign(`/unauthorized?message=${data.message}`);
          break;
        case 404:
          location.assign(`/bad-request?message=${data.message}`);
          break;
        default:
          location.assign('/server-error');
      }
    } else {
      location.assign(`/posts/${data.post._id}/${data.post.slug}`);
    }
  } catch (err) {
    location.assign('/server-error');
  }
});