import express from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import async from "async";
import uuidv4 from "uuid/v4";

import {rotate} from "../image";
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

feed.put("/image", upload.array('files[]'), async (req, res) => {
  const user = res.locals.user;

  const {metadata} = req.body;
  const create = (file) => Item.create(file, {
    user,
    tags: tagsFor(metadata, file)
  });

  const rotateContent = async (file) => {
    await rotate(file.content);
    return file;
  };

  try {
    const allItems = await Promise.all(req.files.map(create));
    const items = await Promise.all(allItems.map(rotateContent));

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

feed.get("/images", (req, res) => {
  if (req.query.tags) {
    Item.query(req.query.tags)
      .then(items => {
        res.json({items});
        res.end();
      }).catch(err => {
        res.json({err});
        res.end();
      });
  } else {
    Item.all()
      .then(items => {
        res.json({items});
        res.end();
      }).catch(err => {
        res.json({err});
        res.end();
      });
  }
});

feed.use("/image", express.static("./files"));

feed.post("/video", (req, res)  => {

});

feed.post("/text", (req, res) => {

});

export default feed;
