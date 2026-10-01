const BaseCommand = require('./baseCommand');

class TracertCommand extends BaseCommand {
    constructor() {
        super('CONSULTA');
    }

    buildCommand(nomePc) {
        return {
            comando: 'tracert',
            args: ['-h', '10', nomePc]
        };
    }
}

module.exports = TracertCommand;