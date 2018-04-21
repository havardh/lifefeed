import express from "express";
const tag = express.Router();
import Tag from "./service";

tag.put("/create", (req, res) => {
  Tag.create(req.body.name)
    .then(tag => {
      res.json({tag});
      res.end();
    })
    .catch(err => {
      res.json({err});
      res.end();
    });
});

tag.get("/all", (req, res) => {
  Tag.all()
    .then(tags => {
      res.json({tags});
      res.end();
    })
    .catch(err => {
      res.json({err});
      res.end();
    });
});

tag.post("/link", () => {
  const {tagId, itemId} = req.body;
    Tag.link(tagId, itemId)
      .then(tag => {
        res.json({tag});
        res.end();
      })
      .catch(err => {
        res.json({err});
        res.end();
      });
});
