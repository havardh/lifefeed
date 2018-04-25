import Cookie from "js-cookie";

function deleteCookie(name) {
  Cookie.set("connect.sid", "test");
  console.log("set", Cookie.get());
  //document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path?';
}

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
    body
  }).then(redirectOn401);
}

export function get(url) {
  return fetch(url, {
    credentials: "same-origin"
  }).then(redirectOn401);
}
