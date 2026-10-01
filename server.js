const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const computerRoutes = require('./routes/computers');
const commandRoutes = require('./routes/commands');

const app = express();
const PORT = 3000;

// Configuração de Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'chave-secreta-central-ti-segura',
    resave: false,
    saveUninitialized: false,
    //cookie: { maxAge: 3600000 } // 1 hora de sessão
}));

// Arquivos estáticos do Frontend
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/computers', computerRoutes);
app.use('/api/commands', commandRoutes);

// Rota coringa para o frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});