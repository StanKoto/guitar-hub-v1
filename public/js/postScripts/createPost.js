const form = document.querySelector('form');
const titleError = document.querySelector('.title.error');
const contentsError = document.querySelector('.contents.error');
const imageError = document.querySelector('.image.error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  titleError.textContent = '';
  contentsError.textContent = '';
  imageError.textContent = '';

  const title = form.title.value;
  const contents = form.contents.value;
  const images = document.getElementById('images');

  const formData = new FormData();
  formData.append('title', title);
  formData.append('contents', contents);
  for (const image of images.files) {
    formData.append('images', image);
  }

  try {
    const res = await fetch('/posts', {
      method: 'POST',
      body: formData
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
      location.assign('/posts');
    }
  } catch (err) {
    location.assign('/server-error');
  }
});