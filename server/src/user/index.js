import express from "express";
import path from "path";
import passwordless from "passwordless";
import * as User from "./service";
const user = express.Router();

user.get("/landing", function (req, res) {
  res.sendFile(path.resolve(__dirname, "views/landing.html"));
});

user.get("/login", function (req, res) {
  res.sendFile(path.resolve(__dirname, "views/login.html"));
});

user.post("/login",
  passwordless.requestToken(
    function(email, delivery, callback) {
      User.findByEmail(email)
        .then(user => callback(null, user.email))
        .catch(() => callback(null, null));
    },
    { failureRedirect: '/user/denied' }
  ),
  function(req, res) {
    res.sendFile(path.resolve(__dirname, "views/token-sent.html"));
  }
);

user.get("/denied", function (req, res) {
  res.sendFile(path.resolve(__dirname, "views/denied.html"));
});

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
export { User };
