const BaseCommand = require('./baseCommand');

class ScCommand extends BaseCommand {
    constructor() {
        super('CONSULTA'); // Inicialmente consulta. Poderá virar ACAO ao iniciar/parar serviços.
    }

    buildCommand(nomePc, acaoServico = 'query') {
        // Exemplo: sc \\PC query
        return {
            comando: 'sc',
            args: [`\\\\${nomePc}`, acaoServico]
        };
    }
}

module.exports = ScCommand;