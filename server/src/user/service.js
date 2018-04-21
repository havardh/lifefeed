import db from "../db";

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

export async function findByEmail(query) {

  try {
    const res = await db.query(
      "select * from users where email = $1",
      [query]
    );

    if (res.rows[0]) {
      return res.rows[0];
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}
