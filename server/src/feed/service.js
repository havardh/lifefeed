import db from "../db";
import * as Tag from "../tag/service";


export async function all() {
  try {
    const res = await db.query(`
      select items.id, items.type, items.content, users.email
      from items
      join users on items.users_id = users.id
      order by published_at desc`);

    return res.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function findById(id) {
  try {
    const res = await db.query(`
      select items.id, items.type, items.content, users.email
      from items
      join users on items.users_id = users.id
      where items.id = $1
      `, [id]);

    if (res.rows.length) {
      return res.rows[0];
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function query(tags) {
  try {
    if (!Array.isArray(tags)) {
      tags = [tags];
    }

    const res = await db.query(`
      select items.id, items.type, items.content, users.email
      from items

      join users on items.users_id = users.id

      join (
         select item_id
         from items_tags
         join tags on tags.id = items_tags.tag_id
         where tags.name = any ($1)
         group by items_tags.item_id
         having count(1) = $2
      ) tag_join on items.id = tag_join.item_id

      order by items.published_at desc
      `, [tags, tags.length]);

    return res.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function create(file, {user, tags}) {
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

    for (let tag of tags) {
      await Tag.link({
        tagId: tag.id,
        itemId: item.id
      });
    }

    return item;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export function update() {

}
