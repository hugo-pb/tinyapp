const express = require("express");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
  idExist,
  isUrlOwner,
} = require("./helpers");

const app = express();
const PORT = 8080; // default port 8080

// Middleware //
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cookieSession({
    name: "session",
    keys: ["user_id"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
app.set("view engine", "ejs");

// data base //
const urlDatabase = {
  b2xVn2: {
    id: "b2xVn2",
    longURL: "http://www.lighthouselabs.ca",
    userID: "aJ48lW",
  },
  "9sm5xK": {
    id: "9sm5xK",
    longURL: "http://www.google.com",
    userID: "aJ48lW",
  },
};

const users = {
  /// these users wont work! please register woth new user
  aJ48lW: {
    id: "aJ48lW",
    email: "h@gmail.com",
    password: "123",
  },
};

// GET REQUESTS //

app.get("/", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/pleaseLogin");
  }
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/pleaseLogin");
  }
  const user = req.session.user_id;
  const urls = urlsForUser(user, urlDatabase);
  const templateData = {
    user,
    urls,
    email: users[user].email,
  };
  res.render("urls_index", templateData);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  const user = req.session.user_id;
  const templateVars = {
    user,
    id: req.params.id,
    email: users[user].email,
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  const user = req.session.user_id;
  const templateVars = {
    user,
    id: req.params.id,
    data: urlDatabase[req.params.id],
    email: users[user].email,
  };
  if (!idExist(templateVars.id, urlDatabase)) {
    return res.redirect("/*");
  }
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  const arr = urlsForUser(req.session.user_id, urlDatabase);
  if (!isUrlOwner(arr, templateVars.id)) {
    return res.redirect("/401");
  }
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  /// add edge case it long url doesnt exist
  try {
    const longURL = urlDatabase[req.params.id].longURL;
    res.redirect(longURL);
  } catch {
    return res.redirect("/404");
  }
});

app.get("/register", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls");
  }

  res.render("register", { user: null });
});

app.get("/login", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls");
  }
  res.render("login", { user: null });
});

app.get("/401", (req, res) => {
  if (!req.session.user_id) {
    return res.render("401", { user: null });
  }
  const user = req.session.user_id;
  const templateVars = {
    user,
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    email: users[user].email,
  };
  res.status(401);
  res.render("401", templateVars);
});

app.get("/pleaseLogin", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls");
  }
  res.render("pleaseLogin", { user: null });
});

app.get("/*", (req, res) => {
  if (!req.session.user_id) {
    return res.render("404", { user: null });
  }
  const user = req.session.user_id;
  const templateVars = {
    user,
    id: req.params.id,
  };
  res.status(404);
  res.render("404", templateVars);
});

// POST REQUEST //

app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  const user = req.session.user_id;
  const id = generateRandomString();
  const newUrl = { id, longURL: req.body.longURL, userID: user };

  urlDatabase[id] = newUrl;
  res.redirect(`/urls/${id}`);
});

app.post("/urls/:id/delete", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/401");
  }
  const id = req.params.id;
  const arr = urlsForUser(req.session.user_id, urlDatabase);
  if (!isUrlOwner(arr, id)) {
    return res.redirect("/401");
  }
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.post("/urls/show/:id", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/401");
  }
  const newUrl = req.body.newurl;
  const id = req.params.id;
  const arr = urlsForUser(req.session.user_id, urlDatabase);
  if (!isUrlOwner(arr, id)) {
    return res.redirect("/401");
  }
  urlDatabase[id].longURL = newUrl;
  res.redirect(`/urls/${id}`);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const id = getUserByEmail(email, users);
  if (
    !getUserByEmail(email, users) ||
    !bcrypt.compareSync(password, users[id].password)
  ) {
    res.status(400);
    return res.send("ERROR 400 ...Oops! Email or pasword are incorrect.");
  }
  req.session.user_id = id;

  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newuser = {
    id,
    email: req.body.email,
    password: hashedPassword,
  };
  if (getUserByEmail(req.body.email, users)) {
    res.status(400);
    return res.send(
      "ERROR 400 ...Oops! it looks like that email is already in use."
    );
  }
  users[id] = newuser;
  req.session.user_id = newuser.id;
  res.redirect("/urls");
});

// APP.LISTEN //

app.listen(PORT, () => {
  console.log(`Tynny app listening on port ${PORT}!`);
});
