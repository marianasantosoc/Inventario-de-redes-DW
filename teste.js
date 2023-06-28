const express = require('express');
const http = require('http');
const path = require('path');
const bcrypt = require('bcrypt');
const { login, logout } = require("./controller/AuthLogin.js")
var session = require('express-session')


const SGBD = require("./config/sgbd.js")
const Users = new SGBD("./dbs/users.json") // ñ mudar esse caminho
// Pra usar uma função só usar, Users.<funcao>, todas as funções disponiveis no arquivo "sgbd.js"

var body_parser = require("body-parser")
const app = express();
const server = http.createServer(app);

app.use( body_parser.json() );       // to support JSON-encoded bodies
app.use(body_parser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(session({ secret: 'keyboard cat' }))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));

app.get('/login', (req, res) => {
  res.render('login', {
    logged: req.session.data ? true : false,
    account: req.session.data
  })
})

app.get("/register", (req, res) => {
  res.render("register", {
    logged: req.session.data ? true : false,
    account: req.session.data
  })
})

app.post("/register", async (req, res) => {
  if(Users.procurar({ email: req.body.email }).length > 0) return res.send("Email já cadastrado.")
    if(Users.procurar({ username: req.body.username }).length > 0) return res.send("nome de usúario já cadastrado.")
  else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const data = Users.criar({
      password: hashedPassword,
      email: req.body.email,
      postados: [],
      username: req.body.username,
    })
    res.send("Conta criada! seus dados: " + JSON.stringify(data))
  }
})

app.post("/login", (req, res) => { 
  login(req, res)
})

app.get('/register', (req, res) => {
  res.render('register', {
    logged: req.session.data ? true : false,
    account: req.session.data
  })
})

app.get('/autores', (req, res) => {
  res.render('autores', {
    logged: req.session.data ? true : false,
    account: req.session.data
  })
})

app.get("/logout", (req, res) => {
  logout(req, res)
})

app.get('/', (req, res) => {
  if(req.query.busca == null){
    res.render('home', {
      logged: req.session.data ? true : false,
      account: req.session.data
    })
  }else{
    res.render('busca',{
      logged: req.session.data ? true : false,
      account: req.session.data
    })
  }
})

server.listen(3000, ()=> {
  
})
