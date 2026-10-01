const BaseCommand = require('./baseCommand');

class PingCommand extends BaseCommand {
    constructor() {
        super('CONSULTA');
    }

    buildCommand(nomePc) {
        return {
            comando: 'ping',
            args: ['-n', '10', nomePc]
        };
    }
}

module.exports = PingCommand;