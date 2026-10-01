const BaseCommand = require('./baseCommand');

class SysteminfoCommand extends BaseCommand {
    constructor() {
        super('CONSULTA');
    }

    buildCommand(nomePc) {
        return {
            comando: 'systeminfo',
            args: ['/s', nomePc]
        };
    }
}

module.exports = SysteminfoCommand;