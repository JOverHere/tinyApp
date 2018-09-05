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

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

app.get("/", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let templateVars = {user: user};
  res.render("home", templateVars);
});

app.get("/urls.json", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let templateVars = {user: user};
  res.json(urlDatabase);
  res.render("/urls.json", templateVars);
});

//render home page
app.get("/hello", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let templateVars = {user: user};
  res.send("<html><body>Hello <b>World</b></body></html>\n");
  res.render("/hello", templateVars);
});

//renders index page
app.get("/urls", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let templateVars = { urls: urlDatabase, user: user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let templateVars = {user: user};
  res.render("urls_new", templateVars);
});

app.post("/urls/new", (req, res) => {
  res.redirect("/urls/new");
});

//renders registration form
app.get("/register", (req, res) => {
res.render("registration");
});

//get login page
app.get("/login", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let templateVars = {user: user};
  res.render("login", templateVars);
});


//post route for registration form
app.post("/register", (req, res) => {
 if( !req.body.email || !req.body.password){
  res.status(400);
  res.send("OOPS your bad... turn around buddy.. try again")
  return
 } else if(findEmail(req.body.email)){
   res.status(400)
   res.send("Already exists")
   return
 }
 const userID = generateRandomString2();
 users[userID] = {id: userID, email: req.body.email , password: req.body.password};
 res.cookie("user_id", userID);
 res.redirect("/urls")
})

//updates long url w new little random string
app.post("/urls", (req, res) => {
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
  if(!findEmail(req.body.email)){
  res.status(403);
  res.send("OOPS your bad... turn around buddy.. try again")
  return
 } else if(!findPassword(req.body.password)){
   res.status(403)
   res.send("Already exists")
   return
 }
  //let user = users[req.cookies["user_id"]];
  res.cookie("user_id", getID(req.body.email));
  res.redirect("/");
});

//logout to clear cookies
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});


app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let templateVars = {user: user};
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL, templateVars);
});

app.get("/urls/:id", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], user: user };
  res.render("urls_show", templateVars);
  res.render("/urls/:id", templateVars);
});

function generateRandomString2() {
  var randomStr = "";
  var alphaNum ="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

 for(var i = 0; i < 3; i++){
   randomStr += alphaNum.charAt(Math.floor(Math.random() * alphaNum.length));
 }
 return randomStr
 console.log(randomStr)
}
generateRandomString2()


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


function findEmail(email) {
 for(var userID in users){
   if(users[userID].email === email){
    return true;
   }
 }
 return false
};

function findPassword(password) {
 for(var pass in users){
   if(users[pass].password === password){
    return true;
   }
 }
 return false
};

function getID(email) {
 for(var id in users){
   if(users[id].email === email){
    return id
   }
 }
 return false
};

//if (findEmail("some@email.com")) { do something... }

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});