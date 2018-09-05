var express = require("express");
var cookieParser = require('cookie-parser')
var app = express();
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var PORT = 8080;
app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  let templateVars = {username: req.cookies["username"]};
  res.send("Hello!");
  res.render("/", templateVars);
});

app.get("/urls.json", (req, res) => {
  let templateVars = {username: req.cookies["username"]};
  res.json(urlDatabase);
  res.render("/urls.json", templateVars);
});

app.get("/hello", (req, res) => {
  let templateVars = {username: req.cookies["username"]};
  res.send("<html><body>Hello <b>World</b></body></html>\n");
  res.render("/hello", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});

app.post("/urls/new", (req, res) => {
  res.redirect("/urls/new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.long_url;
  res.redirect("/urls");
});

//login form
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

//logout to clear cookies
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  let templateVars = {username: req.cookies["username"]};
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL, templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
  res.render("/urls/:id", templateVars);
});

function generateRandomString() {
  var randomStr = "";
  var alphaNum ="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

 for(var i = 0; i < 6; i++){
   randomStr += alphaNum.charAt(Math.floor(Math.random() * alphaNum.length));
 }
 return randomStr
 console.log(randomStr)
}
generateRandomString()

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});