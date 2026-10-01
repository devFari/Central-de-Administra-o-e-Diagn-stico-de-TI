function interpretarResultadoParaLeigos(comando, bruto, sucesso) {
    if (!sucesso) {
        return `⚠️ <strong>O comando não pôde ser concluído.</strong> O computador alvo pode estar desligado, inacessível na rede ou sem permissão suficiente.`;
    }

    if (comando === 'ping') {
        if (bruto.includes('Reply from') || bruto.includes('Resposta de')) {
            return `✅ <strong>Conexão Estabelecida com Sucesso!</strong> O computador está ligado, respondeu aos chamados da rede e a comunicação está perfeita.`;
        } else {
            return `❌ <strong>Sem Resposta.</strong> O computador não respondeu ao teste de rede. Ele pode estar desligado ou desconectado do cabo/Wi-Fi.`;
        }
    }

    if (comando === 'shutdown') {
        return `🔄 <strong>Comando de Reinicialização Enviado!</strong> O computador remoto foi instruído a reiniciar imediatamente.`;
    }

    if (comando === 'mstsc') {
        return `🖥️ <strong>Janela de Acesso Remoto Acionada.</strong> O aplicativo de Área de Trabalho Remota foi aberto no seu computador direcionado ao alvo.`;
    }

    if (comando === 'tracert') {
        return `🛤️ <strong>Rastreamento Concluído.</strong> O caminho que os dados percorreram até o computador foi mapeado com sucesso nos detalhes técnicos abaixo.`;
    }

    if (comando === 'nbtstat') {
        return `📡 <strong>Consulta NetBIOS Realizada.</strong> As informações de identificação de rede e nome do computador foram obtidas com sucesso.`;
    }

    if (comando === 'net view') {
        return `📂 <strong>Pastas Compartilhadas Listadas.</strong> Os recursos e arquivos compartilhados disponíveis neste computador foram encontrados.`;
    }

    if (comando === 'tasklist') {
        return `📊 <strong>Lista de Programas Ativos Obtida.</strong> Todos os aplicativos e processos rodando no momento no computador foram listados abaixo.`;
    }

    if (comando === 'systeminfo') {
        return `💻 <strong>Informações do Computador Obtidas.</strong> Dados detalhados sobre o sistema operacional, memória RAM e hardware foram carregados com sucesso.`;
    }

    if (comando === 'sc') {
        return `⚙️ <strong>Serviços do Windows Consultados.</strong> O estado dos serviços executados em segundo plano neste computador foi verificado.`;
    }

    return `✨ <strong>Operação executada com sucesso</strong> pelo sistema. Veja os detalhes técnicos completos abaixo.`;
}