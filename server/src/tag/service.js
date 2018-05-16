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

export async function findByItemId(id) {
  try {
    const res = await db.query(`
      select tags.* from tags
      join items_tags on tags.id = items_tags.tag_id
      where items_tags.item_id = $1
    `, [id]);

    return res.rows;
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

export async function popular() {
  try {
    const res = await db.query(`
      select tags.* from tags
      join items_tags on tags.id = items_tags.tag_id
      group by tags.id
      order by count(items_tags.item_id) desc
    `)

    console.log(res.rows);
    return res.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function link({tagId, itemId}) {
  try {
    const res = await db.query(
      "insert into items_tags (tag_id, item_id) values ($1, $2)",
      [tagId, itemId]
    );
    return res.rowCount;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function unlink({tagId, itemId}) {
  try {
    const res = await db.query(
      "delete from items_tags where tag_id = $1 and item_id = $2",
      [tagId, itemId]
    );

    return res.rowCount;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
