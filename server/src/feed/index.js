import express from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import async from "async";
import uuidv4 from "uuid/v4";

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

feed.put("/image", upload.array('files[]'), (req, res) => {
  const user = res.locals.user;
  const create = (file) => Item.create(file, user);

  Promise.all(req.files.map(create))
    .then(items => {
      res.json({items});
      res.end();
    })
    .catch(err => {
      res.json({err});
      res.end();
    });
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
  Item.all()
    .then(items => {
      res.json({items});
      res.end();
    }).catch(err => {
      res.json({err});
      res.end();
    });
});

feed.use("/image", express.static("./files"));

feed.post("/video", (req, res)  => {

});

feed.post("/text", (req, res) => {

});

export default feed;
