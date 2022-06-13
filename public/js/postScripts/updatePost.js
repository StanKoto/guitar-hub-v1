const form = document.querySelector('form');
const titleError = document.querySelector('.title.error');
const contentsError = document.querySelector('.contents.error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  titleError.textContent = '';
  contentsError.textContent = '';

  const postId = window.location.pathname.split('/')[2];
  const title = form.title.value;
  const contents = form.contents.value;

  try {
    const res = await fetch(`/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, contents })
    });

    const data = await res.json();

    if (data.errors) {
      titleError.textContent = data.errors.title;
      contentsError.textContent = data.errors.contents;
    } else {
      location.assign(`/posts/${data.post._id}/${data.post.slug}`);
    }
  } catch (err) {
    location.assign('/server-error');
  }
});