const express = require('express');
const http = require('http');
const path = require('path');

var body_parser = require("body-parser")
const app = express();
const server = http.createServer(app);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(body_parser.json());       // to support JSON-encoded bodies
app.use(body_parser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));

// *************************************** Rotas que só retornam um html *********************************
app.get('/', (req, res) => {
    res.render('login')
})

app.get('/cadastro', (req, res) => {
    res.render('cadastro')
})

app.get('/config', (req, res) => {
    res.render('config')
})
// *******************************************************************************************************

// *************************************** Rotas de vallidação *******************************************
app.get('/home', (req, res) => { //validação de usuário para redirecionar para o home
    res.render('home')
})

app.post('/login', (req, res) => { //criação/verificação se o usuário foi criado
    const nome = req.body.userName;
    const mail = req.body.email;
    const empres = req.body.empresa;
    const pass = req.body.pwd;
    async function adicionarUsuario() {
        try {
            const usuario = await prisma.User.create({
                data: {
                    name: nome,
                    email: mail,
                    empresa: empres,
                    password: pass
                },
            });
            const ver = await prisma.User.findMany();
            console.log('Usuário adicionado:', ver);
            res.render('login')
        } catch (error) {
            console.error('Erro ao adicionar usuário:', error);
        } finally {
            await prisma.$disconnect();
        }
    }
    adicionarUsuario();
})
// *******************************************************************************************************

// ****************************************** Execução do app ********************************************
server.listen(3000, () => {
    console.log("Execução do app no http://localhost:3000")
})
// *******************************************************************************************************
