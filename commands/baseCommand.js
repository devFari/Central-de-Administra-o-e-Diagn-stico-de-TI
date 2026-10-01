const { execFile } = require('child_process');

class BaseCommand {
    constructor(tipo = 'CONSULTA') {
        this.tipo = tipo;
    }

    executar(target, paramExtra = null) {
        return new Promise((resolve, reject) => {
            const { comando, args } = this.buildCommand(target, paramExtra);

            execFile(comando, args, { windowsHide: true, timeout: 15000 }, (error, stdout, stderr) => {
                if (error) {
                    return reject({
                        status: 'Erro na execução',
                        mensagem: stderr || error.message,
                        detalhes: error.code
                    });
                }
                resolve({
                    status: 'Concluído',
                    resultado: stdout.trim() || 'Comando executado sem retorno textual.'
                });
            });
        });
    }

    buildCommand(target, paramExtra) {
        throw new Error('O método buildCommand deve ser implementado pelas subclasses.');
    }

    getTipo() {
        return this.tipo;
    }
}

module.exports = BaseCommand;