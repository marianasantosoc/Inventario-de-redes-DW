const express = require('express');
const http = require('http');
const path = require('path');
var body_parser = require("body-parser")
const { PrismaClient } = require('@prisma/client');
const session = require('express-session');

const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();

app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));
app.use(session({
    secret: 'chave-secreta', // Chave secreta para assinar o cookie da sessão
    resave: false, // Define se a sessão deve ser regravada no servidor, mesmo que não tenha sido modificada
    saveUninitialized: false // Define se uma sessão nova, mas não modificada, deve ser salva no servidor
}));

// *************************************** Rotas *********************************
const verificarAutenticacao = (req, res, next) => {
    if (req.session.name == undefined) {
        res.redirect('/')
    }
    next();

};

app.get('/', async (req, res) => { //retorna html de login
    res.render('login')
})

app.get('/cadastro', (req, res) => { //retorna html de cadastro
    res.render('cadastro')
})

app.post('/novo_cadastro', (req, res) => { //cria um novo usuário
    const nome = req.body.userName;
    const mail = req.body.email;
    const empres = req.body.empresa;
    const pass = req.body.pwd;
    async function CriarUsuario() {
        try {
            const usuario = await prisma.User.create({
                data: {
                    name: nome,
                    email: mail,
                    empresa: empres,
                    root: mail,
                    password: pass
                },
            });
            const ver = await prisma.User.findMany();
            console.log('Usuários:', ver);
            res.redirect('/')
        } catch (error) {
            console.error('Erro ao adicionar usuário:', error);
        }
    }
    CriarUsuario();
})

app.post('/validacao', async (req, res) => { //validação de usuário para redirecionar para o home
    const mail = req.body.email;
    const pass = req.body.pwd;
    try {
        const user = await prisma.User.findUnique({
            where: {
                email: mail
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'Dado não encontrado' });
        }
        if (user.password !== pass) {
            return res.status(404).json({ error: 'Dado não encontrado' });
        }
        req.session.name = user.name
        // req.session.email = user.email
        req.session.root = user.root
        req.session.empresa = user.empresa

        res.redirect('/home');
    } catch (error) {
        console.error('Erro ao procurar dados:');
        // res.redirect('/')

    }
})

app.get('/home', verificarAutenticacao, async (req, res) => { //retorna html de cadastro
    const dados = await prisma.Host.findMany({
        where: {
            user_root: req.session.root
        }
    });
    const usuario = {
        nome: req.session.name,
        empresa: req.session.empresa
    }
    // console.log(dados, usuario)
    res.render('home', { dados, usuario })
})

app.post('/maquinas_up', async (req, res) => {
    const dados = await prisma.Host.findMany({
        where: {
            user_root: req.session.root,
            status: 'down'
        }
    });
    const usuario = {
        nome: req.session.name,
        empresa: req.session.empresa
    }
    // console.log(dados, usuario)
    res.render('home', { dados, usuario })
})

app.post('/maquinas_down', async (req, res) => {
    const dados = await prisma.Host.findMany({
        where: {
            user_root: req.session.root,
            status: 'up'
        }
    });
    const usuario = {
        nome: req.session.name,
        empresa: req.session.empresa
    }
    // console.log(dados, usuario)
    res.render('home', { dados, usuario })
})

app.post('/add_maq', (req, res) => { //adiciona máquina ao inventário
    const nome = req.body.maquina;
    const end = req.body.ip;
    const st = req.body.estado;
    const superuser = req.session.root;
    async function add_hosts() {
        try {
            const hosts = await prisma.Host.create({
                data: {
                    name: nome,
                    ip: end,
                    status: st,
                    user_root: superuser
                }
            });
            const ver = await prisma.Host.findMany();
            console.log('Máquinas:', ver);
            res.redirect('/home')
        } catch (error) {
            console.error('Erro ao adicionar o host:', error);
        } finally {
            await prisma.$disconnect();
        }
    }
    add_hosts();

});

app.post('/rm_maq', async (req, res) => { //remove máquina do inevntário
    const id = req.body.id
    try {
        await prisma.Host.delete({
            where: { id: parseInt(id) }
        });

        res.redirect('back')
    } catch (error) {
        console.error(error);
        // res.status(500).json({ error: 'Erro ao remover dados' });
    }
})

app.get('/config', verificarAutenticacao, async (req, res) => { //retorna html de config
    const usuario = req.session.name;

    users = await prisma.User.findMany({
        where: {
            root: req.session.root,
            NOT: {
                name: req.session.name
            }
        }
    });
    // console.log(users)
    res.render('config', { usuario, users })
})

app.post('/add_user_inventory', async (req, res) => { //add um user ao inventario atual
    const nome = req.body.newuser;
    const mail = req.body.newemail;
    const superuser = req.session.root;
    const empres = req.session.empresa;
    const pass = req.body.senha;
    async function CriarUsuario() {
        try {
            const usuario = await prisma.User.create({
                data: {
                    name: nome,
                    email: mail,
                    empresa: empres,
                    root: superuser,
                    password: pass
                },
            });
            const ver = await prisma.User.findMany();
            console.log('Usuários', ver);
        } catch (error) {
            console.error('Erro ao adicionar usuário:', error);
        } finally {
            await prisma.$disconnect();
        }
    }
    CriarUsuario();
});

app.post('/rm_user_inventory', async (req, res) => { //remove máquina do inevntário
    const id = req.body.id
    try {
        await prisma.User.delete({
            where: { id: parseInt(id) }
        });

        res.redirect('back')
    } catch (error) {
        console.error(error);
        // res.status(500).json({ error: 'Erro ao remover dados' });
    }
})

// *******************************************************************************************************

// ****************************************** Execução do app ********************************************
server.listen(3000, () => {
    console.log("Execução do app no http://localhost:3000")
})
// *******************************************************************************************************