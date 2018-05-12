import express from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import async from "async";
import uuidv4 from "uuid/v4";

import rotate from "../image/rotate";
import resize from "../image/resize";
import * as Item from "./service";

const feed = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './files/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, uuidv4() + path.extname(file.originalname).toLowerCase());
    });
  }
});

/*function fileFilter(req, file, cb) {

  if (file.mimetype)
  console.log(file);
  cb(null, true);
}*/

var upload = multer({
  storage,
  //fileFilter,
  limits: { fieldSize: 25 * 1024 * 1024 }
});

function tagsFor(metadata, file) {
  for (let data of JSON.parse(metadata)) {
    if (data.file.name === file.originalname && data.file.size === file.size) {
      return data.tags;
    }
  }
  return [];
}

feed.put("/image",
  upload.array('files[]'),
  rotate,
  resize,
  async (req, res) => {
  const user = res.locals.user;

  const {metadata} = req.body;
  const create = (file) => Item.create(file, {
    user,
    tags: tagsFor(metadata, file)
  });

  try {
    const items = await Promise.all(req.files.map(create));

    console.log("Created", items)
    res.json({items});
    res.end();
  } catch (err) {
    console.error(err)
    res.json({err});
    res.end();
  }
});

feed.post("/image", (req, res) => {
  Item.update(item)
    .then(item => {
      res.json({item});
      res.end();
    })
    .catch(err => {
      res.json({err});
      res.end();
    });
});

feed.get("/images", async (req, res) => {
  function toApi({id, type, content}) {
    return {
      id,
      type,
      src: "/api/feed/image/" + content.replace("files/", ""),
      sources: [512, 768, 1024, 1536, 2048]
        .map(size => ({
          width: `${size}w`,
          src: "/api/feed/image/" + content.replace("files/", `${size}/`)
        }))
    };
  }

  try {
    let items = await (req.query.tags ?
      Item.query(req.query.tags) :
      Item.all())

    res.json({items: items.map(toApi)});
    res.end();
  } catch (err) {
    res.json({err});
    res.end();
  }
});

feed.use("/image", express.static("./files"));

feed.post("/video", (req, res)  => {

});

feed.post("/text", (req, res) => {

});

export default feed;
