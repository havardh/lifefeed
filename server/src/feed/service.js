import db from "../db";
import * as Tag from "../tag/service";


export async function all() {
  try {
    const res = await db.query("select id, type, content from items order by published_at desc");

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

export async function query(tags) {
  try {
    if (!Array.isArray(tags)) {
      tags = [tags];
    }

    console.log(tags);

    const res = await db.query(`
      select items.id, items.type, items.content
      from items
      join items_tags on items.id = items_tags.item_id
      join tags on items_tags.tag_id = tags.id
      where tags.name = any ($1)
      order by items.published_at desc
    `, [tags]);

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

export async function create(file, {user, tags}) {
  console.log("item", file, tags, user);
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
      console.log(tag);
      await Tag.link({
        tagId: tag.id,
        itemId: item.id
      });
    }

    console.log("created", tags.length)
    return item;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export function update() {

}
