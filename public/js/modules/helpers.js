const emptyErrors = (customErrors) => {
  for (const error of customErrors) {
    error.element.textContent = '';
  }
};

const makeRequest = async (url, method, redirectUrl, body, customErrors, message) => {
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
      if (message) alert(message)
      location.assign(redirectUrl);
    }
  } catch (err) {
    location.assign('/server-error');
  }
};

const adjustUrl = (paramName, paramValue) => {
  const urlPath = location.pathname;
  const urlQuery = location.search;
  if (urlQuery.length !== 0) { 
    const searchParams = new URLSearchParams(urlQuery);
    if (searchParams.has(paramName)) {
      if (paramName === 'sort' || paramName === 'select') {
        const splitValue = paramValue.split('-');
        const checkValue = splitValue.length === 1 ? splitValue[0] : splitValue[1];
        const keyValuePairs = urlQuery.split('&');
        for (let i = 0; i < keyValuePairs.length; i++) {
          const pair = keyValuePairs[i].split('=');
          if (pair[0].includes(paramName)) {
            if (!pair[1].includes(checkValue)) {
              keyValuePairs[i] += `,${paramValue}`;
            } else {
              const splitValue = pair[1].split(',');
              for (let j = 0; j < splitValue.length; j++) {
                if (splitValue[j].includes(checkValue)) splitValue.splice(j, 1, paramValue)
              }
              keyValuePairs.splice(i, 1, `${pair[0]}=${splitValue.join(',')}`);
            }            
          }
        }
        return `${urlPath}${keyValuePairs.join('&')}`;
      } else {
        searchParams.set(paramName, paramValue);
        return `${urlPath}?${searchParams.toString()}`;
      }
    } else { 
      return `${urlPath}${urlQuery}&${paramName}=${paramValue}`;
    }
  } else {
    return `${urlPath}?${paramName}=${paramValue}`;
  }
};

const setupSorting = (elementId, sortingField) => {
  document.getElementById(elementId).addEventListener('click', (e) => {
    e.preventDefault();

    const url = adjustUrl('sort', sortingField);
    location.assign(url);
  });
};

export { emptyErrors, makeRequest, adjustUrl, setupSorting };