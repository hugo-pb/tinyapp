const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8080; // default port 8080

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.set("view engine", "ejs");

// data base //
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

// random string generator //
const generateRandomString = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = 6; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];

  return result;
};

// find user by email //
const findUserByEmail = (email) => {
  for (id in users) {
    if (users[id].email === email) {
      return id;
    }
  }
  return false;
};

// GET REQUESTS //

app.get("/", (req, res) => {
  //redirect to /urls
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const templateData = {
    user: req.cookies.userId,
    urls: urlDatabase,
    users,
  };
  res.render("urls_index", templateData);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: req.cookies.userId,
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    users,
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    user: req.cookies.userId,
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    users,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: req.cookies.userId,
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    users,
  };
  res.render("register", templateVars);
});
app.get("/login", (req, res) => {
  const templateVars = {
    user: null,
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    users,
  };
  res.render("login", templateVars);
});

// POST REQUEST //

app.post("/urls", (req, res) => {
  let id = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`);
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.post("/urls/show/:id/update", (req, res) => {
  const newUrl = req.body.newurl;
  const id = req.params.id;
  urlDatabase[id] = newUrl;
  res.redirect(`/urls/${id}`);
});
// destructuring
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const id = findUserByEmail(email);
  if (!findUserByEmail(email) || users[id].password !== password) {
    res.status(400);
    return res.send("ERROR 400 ...Oops! Email or pasword are incorrect.");
  }

  res.cookie("userId", id);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("userId");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const newuser = {
    id,
    email: req.body.email,
    password: req.body.password,
  };
  if (findUserByEmail(req.body.email)) {
    res.status(400);
    return res.send(
      "ERROR 400 ...Oops! it looks like that email is already in use."
    );
  }
  users[id] = newuser;
  res.cookie("userId", newuser.id);
  res.redirect("/urls");
});

// APP.LISTEN //

app.listen(PORT, () => {
  console.log(`Tynny app listening on port ${PORT}!`);
});
