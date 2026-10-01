const BaseCommand = require('./baseCommand');

class NetviewCommand extends BaseCommand {
    constructor() {
        super('CONSULTA');
    }

    buildCommand(nomePc) {
        return {
            comando: 'net',
            args: ['view', `\\\\${nomePc}`]
        };
    }
}

module.exports = NetviewCommand;