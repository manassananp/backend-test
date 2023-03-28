const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const session = require("express-session");
app.use(
  session({ secret: "session test", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy((username, password, done) => {
    if (username == "admin" && password == "1234") {
      user = {
        _id: 1,
        fname: "Anakin ",
        lname: "Skywalker",
      };
      console.log("Correct Password.");
      return done(null, user);
    } else {
      console.log("Incorrect password.");
      return done(null, false, { message: "Incorrect password." });
    }
  })
);

passport.serializeUser((user, done) => {
  console.log("SerializeUser");
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("DeserializeUser");
  done(null, user);
});

app.get("/", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
  })
);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}

app.get("/home", isLoggedIn, (req, res) => {
  res.render("home", req.user);
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
