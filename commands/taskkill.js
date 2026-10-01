const BaseCommand = require('./baseCommand');

class TaskkillCommand extends BaseCommand {
    constructor() {
        super('ACAO'); // Modifica o estado do computador remoto (encerra processo)
    }

    buildCommand(nomePc, processo) {
        // Exemplo: taskkill /s PC-RM-03 /im notepad.exe /f
        return {
            comando: 'taskkill',
            args: ['/s', nomePc, '/im', processo, '/f']
        };
    }
}

module.exports = TaskkillCommand;