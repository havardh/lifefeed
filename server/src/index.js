import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import passwordless from "passwordless";
import PostgreStore from "passwordless-postgrestore";
const pgSession = require('connect-pg-simple')(session);
import email from "emailjs";

import front from "./front";
import user, {User} from "./user";
import feed from "./feed";
import tag from "./tag";

import details from "./details.json";

const app = express();

// Setup session
app.use(session({
  store: new pgSession({
    conString: "postgres://postgres:postgres@localhost/lifefeed"
  }),
  secret: "cats",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30*24*60*60*1000 }
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const smtpServer = email.server.connect(details);

// Setup Auth
passwordless.init(new PostgreStore("postgres://postgres:postgres@localhost/lifefeed"), {allowTokenReuse:true});
console.log("adding delivery")
passwordless.addDelivery((tokenToSend, uidToSend, recipient, callback) => {
  const host = process.env.NODE_ENV === "production" ? "lifefeed.havardh.xyz" : "localhost:3000";
  const url = `http://${host}/user/auth?token=${tokenToSend}&uid=${encodeURIComponent(uidToSend)}`;

  smtpServer.send({
    text: `Hei, du har trykket på login på lifefeed.havardh.xyz.

Følg denne lenken for å logge in: ${url}

- Håvard`,
    from: details.user,
    to: recipient,
    subject: 'Loginlenke til lifefeed.havardh.xyz'
  }, (err) => {
    if (err) {
      console.log(err);
    }
    callback(err);
  });

  console.log("You can now login at:");
  console.log("  " + url)
});
app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ successRedirect: "/"}));
app.use((req, res, next) => {
  if (req.user) {
    console.log(req.user)
    User.findByEmail(req.user)
      .then(user => res.locals.user = user)
      .catch(err => console.error(err))
      .finally(() => next());
  } else {
    console.log("Req without user at", req.route.path);
    next();
  }
})

// Setup router
const router = express.Router();
router.use("/", front);
router.use("/user", user);
router.use("/api", passwordless.restricted());
router.use("/api/feed", feed);
router.use("/api/tag", tag);
app.use(router);

app.listen(8080, () => {
  console.log("server listening on 8080")
});
