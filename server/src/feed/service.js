import db from "../db";

export async function all() {
  try {
    const res = await db.query("select id, type, content from items");

    return res.rows.map(({id, type, content}) => ({
      id,
      type,
      src: "/api/feed/image/" + content.replace("files/", "")
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export function query() {

}

export async function create(file, user) {

  const item = {
    id: file.filename.split('.')[0],
    type: "image",
    extension: file.filename.split('.')[1],
    content: file.path,
    size: file.size,
    mimeType: file.mimetype,
    encoding: file.encoding,
    originalName: file.orginalname,
    users_id: user.id
  }

  const fields = ['id', 'type', 'extension', 'content', 'size', 'mimeType', 'encoding', 'originalName', 'users_id'];

  try {
    await db.query(`
      insert into items (
        ${fields.join(", ")}
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, fields.map(field => item[field]));
    return item;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export function update() {

}
