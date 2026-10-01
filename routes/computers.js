const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Middleware simples de proteção de rota
function verificarAuth(req, res, next) {
    if (req.session && req.session.autenticado) {
        return next();
    }
    res.status(401).json({ erro: 'Não autorizado.' });
}

router.get('/', verificarAuth, (req, res) => {
    try {
        const filePath = path.join(__dirname, '../config/computadores.json');
        const data = fs.readFileSync(filePath, 'utf8');
        const computadores = JSON.parse(data);
        res.json(computadores);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao carregar lista de computadores.' });
    }
});

// Rota para adicionar um novo computador ao JSON
router.post('/adicionar', (express.json()), (req, res) => {
    const { nome, ip, departamento, usuario, localizacao } = req.body;

    if (!nome || !departamento || !usuario || !localizacao) {
        return res.status(400).json({ sucesso: false, mensagem: 'Preencha os campos obrigatórios.' });
    }

    const filePath = path.join(__dirname, '../config/computadores.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ sucesso: false, mensagem: 'Erro ao ler a base de dados.' });
        }

        try {
            const computadores = JSON.parse(data);

            const existe = computadores.some(c => c.nome.toUpperCase() === nome.toUpperCase());
            if (existe) {
                return res.status(400).json({ sucesso: false, mensagem: 'Já existe um computador com este nome.' });
            }

            const novoPc = {
                nome: nome.trim().toUpperCase(),
                ip: ip ? ip.trim() : '',
                departamento: departamento.trim(),
                usuario: usuario.trim(),
                localizacao: localizacao.trim()
            };

            computadores.push(novoPc);

            fs.writeFile(filePath, JSON.stringify(computadores, null, 4), 'utf8', (err) => {
                if (err) {
                    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao salvar o ficheiro.' });
                }
                res.json({ sucesso: true, mensagem: 'Computador adicionado com sucesso!' });
            });

        } catch (parseErr) {
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao processar o JSON.' });
        }
    });
});


module.exports = router;