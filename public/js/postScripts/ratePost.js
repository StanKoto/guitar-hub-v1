const ratingForm = document.querySelector('form');

if (ratingForm) {
  ratingError = document.querySelector('.rating.error');
  const postId = window.location.pathname.split('/')[2];

  ratingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    ratingError.textContent = '';

    const rating = ratingForm.rating.value;

    try {
      const res = await fetch(`/ratings/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating })
      });

      const data = await res.json();

      if (data.errors) {
        if (data.errors.ownPost) alert(data.errors.ownPost)
        ratingError.textContent = data.errors.rating;
      } else {
        location.reload();
      }
    } catch (err) {
      location.assign('/server-error');
    }
  })
};