const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// Senha em texto plano solicitada, armazenada como hash SHA-256 no código
// Hash correspondente a "tarado da reuniao"
const SENHA_HASH_MESTRE = crypto.createHash('sha256').update('DevFari').digest('hex');

router.post('/login', (req, res) => {
    const { senha } = req.body;
    
    if (!senha) {
        return res.status(400).json({ sucesso: false, mensagem: 'Senha não informada.' });
    }

    // Calcula o hash da senha enviada pelo usuário
    const senhaHashEnviada = crypto.createHash('sha256').update(senha).digest('hex');

    if (senhaHashEnviada === SENHA_HASH_MESTRE) {
        req.session.autenticado = true;
        return res.json({ sucesso: true, mensagem: 'Autenticado com sucesso!' });
    }
    
    res.status(401).json({ sucesso: false, mensagem: 'Senha incorreta.' });
});

router.get('/check', (req, res) => {
    if (req.session && req.session.autenticado) {
        return res.json({ autenticado: true });
    }
    res.json({ autenticado: false });
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ sucesso: true });
});

module.exports = router;