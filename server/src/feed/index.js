import express from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
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

var upload = multer({
  storage,
  limits: { fieldSize: 25 * 1024 * 1024 }
});

const store = [];

feed.get("/", (req, res) => {
  res.json(store);
  res.end();
});

feed.post("/image", upload.array('files[]'), (req, res) => {
  res.json(req.files);
  res.end();
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
