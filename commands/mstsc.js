const BaseCommand = require('./baseCommand');

class MstscCommand extends BaseCommand {
    constructor() {
        super('ACAO'); // Pode ser considerado ação por abrir interface remota
    }

    buildCommand(nomePc) {
        return {
            comando: 'mstsc',
            args: [`/v:${nomePc}`]
        };
    }
}

module.exports = MstscCommand;