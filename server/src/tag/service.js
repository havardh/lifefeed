import db from "../db";

export async function create(name) {
  try {
    const res = await db.query("insert into tags (name) values ($1)", [name]);
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function all() {
  try {
    const res = await db.query("select * from tags");
    return res.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function link(tagId, itemId) {
  try {
    const res = await db.query(
      "insert into items_tags (tag_id, item_id) values ($1)",
      [tagId, itemId]
    );
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
}
