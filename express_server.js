var express = require("express");
var app = express();
var cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

app.use(cookieSession({
  name: 'session',
  keys: ["wiwihf84rwf732yirugef"],
  maxAge: 24 * 60 * 60 * 1000
}))

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var PORT = 8080;
app.set("view engine", "ejs")



const urlDatabase = {
  "bV2xn2":{
    id: "userRandomID",
    longURL: "http://www.lighthouselabs.ca"
  },
  "9sm5xK":{
    id: "user2RandomID",
    longURL: "http://www.google.com"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "1010"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "2020"
  }
}



app.get("/", (req, res) => {
  let user = users[req.session.user_id];
  let templateVars = {user: user};
  res.render("home", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//render home page
app.get("/hello", (req, res) => {
  let user = users[req.session.user_id];
  let templateVars = {user: user};
  res.send("<html><body>Hello <b>World</b></body></html>\n");
  res.render("/hello", templateVars);
});

//renders index page
app.get("/urls", (req, res) => {
  let user = users[req.session.user_id];
  let templateVars = { urls: urlsForUser(req.session.user_id), user: user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if(req.session.user_id === undefined){
    res.redirect("/login")
  } else {
  let user = users[req.session.user_id];
  let templateVars = {user: user};
  res.render("urls_new", templateVars);
 }
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
  let user = users[req.session.user_id];
  let templateVars = {user: user};
  res.render("login", templateVars);
});



//post route for registration form
app.post("/register", (req, res) => {
 if( !req.body.email || !req.body.password){
  res.status(400);
  res.send("Please enter an email and password")
  return
 } else if(findEmail(req.body.email)){
   res.status(400)
   res.send("Already exists")
   return
 }
 const password = req.body.password;
 const hashedPassword = bcrypt.hashSync(password, 10);
 const userID = generateRandomString2();
 users[userID] = {id: userID, email: req.body.email , password: hashedPassword};
 req.session.user_id = userID;
 res.redirect("/urls")
})

//updates long url w new little random string
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {id: req.session.user_id, longURL: req.body.longURL};
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id].longURL = req.body.long_url;
  res.redirect("/urls");
});

//login form
app.post("/login", (req, res) => {
  if(!findEmail(req.body.email)){
    res.status(403);
    res.send("E-mail does not exist.");
  } else {
    let user = findUser(req.body.email)

    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user_id = (user.id);
      res.redirect("/");
    } else{
      res.status(403);
      res.send("Invalid e-mail or password.");
    }
  }
});

//logout to clear cookies
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});


app.post("/urls/:id/delete", (req, res) => {
  if(users[req.session.user_id].id !== check(req.session.user_id, urlsForUser(req.session.user_id))){
    res.redirect("/login");
  }
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  let longURL2 = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL2);
});

app.get("/urls/:id", (req, res) => {
  if(req.session.user_id === undefined){
    res.redirect("login");
  } else if (users[req.session.user_id].id !== check(req.session.user_id, urlsForUser(req.session.user_id))){
    res.redirect("login");
  }
  let user = users[req.session.user_id];
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: user};
  res.render("urls_show", templateVars);
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

function findUser(email){
 for (let user in users){
  if(users[user].email === email){
   return users[user];
  }
 }
 return false;
}


function check(userID, db){
  for (let id in db){
    if(userID === db[id].id){
      return db[id].id;
    }
  }
  return false
}

function urlsForUser(id){
 const specific = {};
 for(let spec in urlDatabase){
  if(urlDatabase[spec].id === id){
   specific[spec] = urlDatabase[spec]
  }
 }
 return specific
}


//if (findEmail("some@email.com")) { do something... }

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});