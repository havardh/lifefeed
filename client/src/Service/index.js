function redirectOn401(result) {
  if (result.status === 401) {
    console.log("wat");
    return result.json().then(({errorRedirect}) => {
        document.location.href = errorRedirect;
      })
      .catch(e => {
        document.location.href = "/user/auth-error";
      });
  }
  return result;
}

export function put({url, body, headers}) {
  return fetch(url, {
    credentials: "same-origin",
    method: "PUT",
    headers,
    body
  }).then(redirectOn401);
}

export function del({url, body, headers}) {
  return fetch(url, {
    credentials: "same-origin",
    method: "DELETE",
    headers,
  }).then(redirectOn401);
}

export function get(url) {
  return fetch(url, {
    credentials: "same-origin"
  }).then(redirectOn401);
}
