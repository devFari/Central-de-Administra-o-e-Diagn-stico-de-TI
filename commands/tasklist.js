const BaseCommand = require('./baseCommand');

class TasklistCommand extends BaseCommand {
    constructor() {
        super('CONSULTA');
    }

    buildCommand(nomePc) {
        return {
            comando: 'tasklist',
            args: ['/s', nomePc]
        };
    }
}

module.exports = TasklistCommand;