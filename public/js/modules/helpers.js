const emptyErrors = (customErrors) => {
  for (const error of customErrors) {
    error.element.textContent = '';
  }
};

const makeRequest = async (url, method, redirectUrl, body, customErrors) => {
  try {
    const params = {method};
    if (body && !(body instanceof FormData)) params.headers = { 'Content-Type': 'application/json' }
    if (method !== 'DELETE') params.body = body;

    const res = await fetch(url, params);
    const data = await res.json();

    if (data.errors) {
      if (data.errors.ownPost) alert(data.errors.ownPost)
      for (const error of customErrors) {
        error.element.textContent = data.errors[error.errorType];
      }
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
      if (data.selfUpdate && data.user.role === 'user') return location.assign('/auth/update')
      if (redirectUrl === 'post') redirectUrl = `/posts/${data.post._id}/${data.post.slug}`
      if (redirectUrl === 'user') redirectUrl = `/users/${data.user._id}/${data.user.slug}`
      location.assign(redirectUrl);
    }
  } catch (err) {
    location.assign('/server-error');
  }
};

export { emptyErrors, makeRequest };