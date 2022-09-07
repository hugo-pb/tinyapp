const express = require("express");
var cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080
const morgan = require("morgan");
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.set("view engine", "ejs");
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// random string generator
const generateRandomString = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = 6; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];

  return result;
};
//GET REQUESTS
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls", (req, res) => {
  const templateData = {
    user: req.cookies.username,
    urls: urlDatabase
  };
  res.render("urls_index", templateData);
});
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: req.cookies.username,
    id: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    user: req.cookies.username,
    id: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];

  res.redirect(longURL);
});
//POST REQUEST
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
app.post("/login", (req, res) => {
  const user = req.body.username;
  res.cookie("username", user);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
