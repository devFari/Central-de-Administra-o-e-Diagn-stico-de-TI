const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Whitelist de comandos permitidos (Segurança estrita)
const Ping = require('../commands/ping');
const Tracert = require('../commands/tracert');
const Mstsc = require('../commands/mstsc');
const Nbtstat = require('../commands/nbtstat');
const Netview = require('../commands/netview');
const Sc = require('../commands/sc');
const Tasklist = require('../commands/tasklist');
const Taskkill = require('../commands/taskkill');
const Systeminfo = require('../commands/systeminfo');
const Shutdown = require('../commands/shutdown');

const commandMap = {
    'ping': new Ping(),
    'tracert': new Tracert(),
    'mstsc': new Mstsc(),
    'nbtstat': new Nbtstat(),
    'net view': new Netview(),
    'sc': new Sc(),
    'tasklist': new Tasklist(),
    'taskkill': new Taskkill(),
    'systeminfo': new Systeminfo(),
    'shutdown': new Shutdown()
};

function verificarAuth(req, res, next) {
    if (req.session && req.session.autenticado) {
        return next();
    }
    res.status(401).json({ erro: 'Não autorizado.' });
}

router.post('/executar', verificarAuth, async (req, res) => {
    const { computadorNome, comandoNome, parametroExtra } = req.body;

    if (!comandoNome || !commandMap[comandoNome]) {
        return res.status(400).json({ sucesso: false, erro: 'Comando inválido ou não permitido.' });
    }

    // Valida se o computador existe no JSON oficial para evitar injeção ou alvos arbitrários
    try {
        const filePath = path.join(__dirname, '../config/computadores.json');
        const computadores = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const pcInfo = computadores.find(p => p.nome === computadorNome);

        if (!pcInfo) {
            return res.status(404).json({ sucesso: false, erro: 'Computador não encontrado no cadastro oficial.' });
        }

        const cmdHandler = commandMap[comandoNome];
        
        // Se for nbtstat, usamos o IP, senão usamos o Nome
        const target = (comandoNome === 'nbtstat') ? pcInfo.ip : pcInfo.nome;

        const resultado = await cmdHandler.executar(target, parametroExtra);
        res.json({ sucesso: true, ...resultado });

    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.mensagem || 'Erro interno ao processar comando.', detalhes: error });
    }
});

module.exports = router;