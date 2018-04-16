import express from "express";

import feed from "./feed";

const app = express();

app.get("/api", (req, res) => {
  console.log("request")
  res.send("hello")
})

app.use("/api/feed", feed);

app.listen(8080, () => {
  console.log("server listening on 8080")
});
