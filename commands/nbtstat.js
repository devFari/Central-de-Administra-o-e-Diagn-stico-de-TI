const BaseCommand = require('./baseCommand');

class NbtstatCommand extends BaseCommand {
    constructor() {
        super('CONSULTA');
    }

    buildCommand(ipPc) {
        return {
            comando: 'nbtstat',
            args: ['-A', ipPc]
        };
    }
}

module.exports = NbtstatCommand;