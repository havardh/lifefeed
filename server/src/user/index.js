import express from "express";
import path from "path";
import passwordless from "passwordless";
const user = express.Router();

user.get("/landing", function (req, res) {
  res.sendFile(path.resolve(__dirname, "views/landing.html"));
});

user.get("/login", function (req, res) {
  res.sendFile(path.resolve(__dirname, "views/login.html"));
});

user.post("/login",
  passwordless.requestToken(
    function(user, delivery, callback) {
      callback(null, user);
    }
  ),
  function(req, res) {
    res.sendFile(path.resolve(__dirname, "views/token-sent.html"));
  }
);

user.get("/auth",
  passwordless.acceptToken(),
  function(req, res) {
    res.redirect("/")
  }
);

user.get("/logout",
  passwordless.logout(),
  function(req, res) {
    res.redirect("/")
  }
);

user.get("/signup", function (req, res) {
  res.sendFile(path.resolve(__dirname, "views/signup.html"));
});

user.post("/signup", (req, res) => res.end());

export default user;
