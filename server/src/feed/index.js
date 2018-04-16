import express from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import jpegAutorotate from "jpeg-autorotate";
import async from "async";

const feed = express();
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './files/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + path.extname(file.originalname).toLowerCase());
    });
  }
});
var upload = multer({ storage: storage });

const store = [];

feed.get("/", (req, res) => {
  res.json(store);
  res.end();
});

feed.post("/image", upload.array('images[]'), (req, res) => {

  async.forEachOf(req.files, (file, i, callback) => {
    jpegAutorotate.rotate(file.path, {quality: 100}, (err, buffer) => {
      if (err) {
        if (err.code === jo.errors.correct_orientation) {
          return callback();
        } else {
          console.error(err);
          return callback(err);
        }
      }

      fs.writeFile(file.path, buffer, err => {
        if (err) {
          console.error(err);
          return callback(e);
        }
        callback();
      });
    });
  }, err => {
    if (err) {
      console.error(err)
      res.json(err);
      res.end();
      return;
    }

    res.json({status: "ok"})
    res.end()
  });
});

feed.get("/images", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) {
      res.json({err});
      res.end();
      return;
    }

    const items = files.map(file => ({
      id: file,
      type: "image",
      src: "/api/feed/image/" + file
    }))

    res.json({items});
    res.end();
  });
});

feed.use("/image", express.static("./files"));

feed.post("/video", (req, res)  => {

});

feed.post("/text", (req, res) => {

});

export default feed;
