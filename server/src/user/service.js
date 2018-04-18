const users = [
  {id: 1, email: "siraag@gmail.com"},
  {id: 2, email: "havardwhoiby@gmail.com"}
];

export function findById(query) {
  return new Promise((resolve, reject) => {
    const user = users.filter(({id}) => id === query)[0];

    if (user) {
      resolve(user);
    } else {
      reject();
    }
  });
}

export function findByEmail(query) {
  return new Promise((resolve, reject) => {
    const user = users.filter(({email}) => email === query)[0];

    if (user) {
      resolve(user);
    } else {
      reject();
    }
  });
}
