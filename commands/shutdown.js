const BaseCommand = require('./baseCommand');

class ShutdownCommand extends BaseCommand {
    constructor() {
        super('ACAO'); // Operação crítica que altera o estado do computador
    }

    buildCommand(nomePc) {
        // /r = Reiniciar
        // /m \\NOME_DO_PC = Alvo remoto
        // /t 0 = Tempo de espera de 0 segundos (imediato)
        // /f = Forçar fechamento de aplicativos abertos
        return {
            comando: 'shutdown',
            args: ['/r', '/m', `\\\\${nomePc}`, '/t', '0', '/f']
        };
    }
}

module.exports = ShutdownCommand;