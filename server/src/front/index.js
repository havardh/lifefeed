import express from "express";
import path from "path";

const front = express.Router();


front.get("/", (req, res) => {
  if (!req.user) {
    return res.redirect("/user/landing");
  }

  res.sendFile(path.join(__dirname, "public/index.html"));
});

front.use("/", express.static(path.join(__dirname, "public")));

export default front;
