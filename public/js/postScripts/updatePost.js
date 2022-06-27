const contentsForm = document.getElementById('contents-form');
const imageForm = document.getElementById('image-form');
const titleError = document.querySelector('.title.error');
const contentsError = document.querySelector('.contents.error');
const imageError = document.querySelector('.image.error');
const postId = window.location.pathname.split('/')[2];

contentsForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  titleError.textContent = '';
  contentsError.textContent = '';

  const body = {};
  const title = contentsForm.title.value;
  if (title.length !== 0) body.title = title;
  const contents = contentsForm.contents.value;
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

imageForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  imageError.textContents = '';

  const formData = new FormData();
  const images = document.getElementById('images');
  for (const image of images.files) {
    formData.append('images', image);
  }

  try {
    const res = await fetch(`/posts/${postId}/images`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (data.errors) {
      imageError.textContent = data.errors.images;
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
      location.reload();
    }
  } catch (err) {
    location.assign('/server-error');
  }
});

document.querySelectorAll('.delete.image').forEach(item => {
  item.addEventListener('click', async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/posts/${postId}/images/${item.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (data.otherErrors) {
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
        location.reload();
      }
    } catch (err) {
      location.assign('/server-error');
    }
  });
});