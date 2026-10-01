let computadoresGlobais = [];
let computadorSelecionadoAtual = null;

// Se a página foi recarregada (F5), invalidamos a sessão por segurança
if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    navigator.sendBeacon('/api/auth/logout');
    window.location.href = '/login.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    // Verifica autenticação antes de carregar
    const authCheck = await fetch('/api/auth/check');
    const authData = await authCheck.json();
    const resultModal = document.getElementById('resultModal');
    const btnFecharRes = document.getElementById('btnFecharResModal');

    if (!authData.autenticado) {
        window.location.href = '/login.html';
        return;
    }

    await carregarComputadores();

    document.getElementById('btnLogout').addEventListener('click', async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login.html';
    });

    document.getElementById('filtroDepto').addEventListener('change', filtrarEColocarNaTela);
    document.getElementById('filtroLocal').addEventListener('change', filtrarEColocarNaTela);

    document.getElementById('btnCancelarModal').addEventListener('click', fecharModal);
    document.getElementById('btnContinuarModal').addEventListener('click', executarComandoSelecionado);
    
    // Mostra/oculta input extra dependendo do comando escolhido
    document.getElementById('selectComando').addEventListener('change', (e) => {
        const cmd = e.target.value;
        const extraGroup = document.getElementById('extraParamGroup');
        const extraLabel = document.getElementById('extraParamLabel');
        const extraInput = document.getElementById('extraParamInput');

        if (cmd === 'taskkill') {
            extraGroup.style.display = 'block';
            extraLabel.textContent = 'Nome do processo (ex: notepad.exe):';
            extraInput.value = '';
        } else if (cmd === 'sc') {
            extraGroup.style.display = 'block';
            extraLabel.textContent = 'Ação do serviço (ex: query):';
            extraInput.value = 'query';
        } else {
            extraGroup.style.display = 'none';
            extraInput.value = '';
        }
    }); // <--- A chaveta do 'change' fechava tarde demais. Agora está correta aqui!

    // --- LÓGICA UNIVERSAL PARA FECHAR O POP-UP DE RESULTADO ---
    function fecharModalResultado() {
        if (resultModal) {
            resultModal.style.display = 'none';
        }
    }

    // 1. Fechar ao clicar no botão FECHAR
    if (btnFecharRes) {
        btnFecharRes.addEventListener('click', fecharModalResultado);
    }

    // 2. Fechar ao clicar no fundo escuro (overlay) fora da caixa do modal
    if (resultModal) {
        resultModal.addEventListener('click', (e) => {
            if (e.target === resultModal) {
                fecharModalResultado();
            }
        });
    }

    // 3. Fechar ao pressionar a tecla ESC do teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharModalResultado();
        }
    });
});

async function carregarComputadores() {
    try {
        const res = await fetch('/api/computers');
        if (!res.ok) throw new Error('Não autorizado');
        computadoresGlobais = await res.json();
        
        popularFiltrosDinamicos(computadoresGlobais);
        renderizarCards(computadoresGlobais);
    } catch (err) {
        window.location.href = '/login.html';
    }
}

function popularFiltrosDinamicos(computadores) {
    const deptos = [...new Set(computadores.map(c => c.departamento))];
    const locais = [...new Set(computadores.map(c => c.localizacao))];

    const selectDepto = document.getElementById('filtroDepto');
    const selectLocal = document.getElementById('filtroLocal');

    deptos.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        selectDepto.appendChild(opt);
    });

    locais.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l;
        opt.textContent = l;
        selectLocal.appendChild(opt);
    });
}

function filtrarEColocarNaTela() {
    const deptoFiltro = document.getElementById('filtroDepto').value;
    const localFiltro = document.getElementById('filtroLocal').value;

    const filtrados = computadoresGlobais.filter(c => {
        const matchDepto = !deptoFiltro || c.departamento === deptoFiltro;
        const matchLocal = !localFiltro || c.localizacao === localFiltro;
        return matchDepto && matchLocal;
    });

    renderizarCards(filtrados);
}

function renderizarCards(computadores) {
    const grid = document.getElementById('computersGrid');
    grid.innerHTML = '';

    if (computadores.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-muted);">Nenhum computador encontrado.</p>';
        return;
    }

    computadores.forEach(pc => {
        const card = document.createElement('div');
        card.className = 'computer-card';
        card.innerHTML = `
            <div>
                <h3>${pc.nome}</h3>
                <div class="computer-info">Departamento: <span>${pc.departamento}</span></div>
                <div class="computer-info">Usuário: <span>${pc.user}</span></div>
                <div class="computer-info">Localização: <span>${pc.localizacao}</span></div>
            </div>
            <button class="btn" onclick="abrirModalComandos('${pc.nome}')">SELECIONAR</button>
        `;
        grid.appendChild(card);
    });
}

window.abrirModalComandos = function(nomePc) {
    computadorSelecionadoAtual = computadoresGlobais.find(c => c.nome === nomePc);
    if (!computadorSelecionadoAtual) return;

    document.getElementById('modalPcTitle').textContent = `Computador: ${computadorSelecionadoAtual.nome}`;
    document.getElementById('commandModal').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('commandModal').style.display = 'none';
    computadorSelecionadoAtual = null;
}

async function executarComandoSelecionado() {
    const comandoNome = document.getElementById('selectComando').value;
    const paramExtra = document.getElementById('extraParamInput').value;
    const pcNome = computadorSelecionadoAtual.nome;

    if (comandoNome === 'shutdown' || comandoNome === 'taskkill') {
        const acaoTexto = comandoNome === 'shutdown' ? 'reiniciar' : 'encerrar processo';
        const confirmacao = confirm(`⚠️ ATENÇÃO!\n\nTem certeza absoluta que deseja executar a operação de [ ${acaoTexto.toUpperCase()} ] no computador ${pcNome}?`);
        if (!confirmacao) return;
    }

    fecharModal();

    // Abre o pop-up de resultado em estado de carregamento
    const resModal = document.getElementById('resultModal');
    const resTitle = document.getElementById('resModalTitle');
    const resBadge = document.getElementById('resStatusBadge');
    const resSummary = document.getElementById('resSummary');
    const resRawOutput = document.getElementById('resRawOutput');

    resModal.style.display = 'flex';
    resTitle.innerHTML = `<span>Computador: ${pcNome} (${comandoNome.toUpperCase()})</span>`;
    resBadge.textContent = 'Executando...';
    resBadge.className = '';
    resBadge.style.background = '#eab308'; // Amarelo de carregamento
    resSummary.innerHTML = `⏳ O comando está a ser executado no computador remoto. Por favor, aguarde alguns segundos...`;
    resRawOutput.textContent = 'A comunicando com a rede corporativa...';

    try {
        const res = await fetch('/api/commands/executar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                computadorNome: pcNome,
                comandoNome: comandoNome,
                parametroExtra: paramExtra
            })
        });

        const data = await res.json();

        if (data.sucesso) {
            resBadge.textContent = 'Concluído';
            resBadge.className = 'badge-sucesso';
            resSummary.innerHTML = interpretarResultadoParaLeigos(comandoNome, data.resultado, true);
            resRawOutput.textContent = data.resultado;
        } else {
            resBadge.textContent = 'Erro';
            resBadge.className = 'badge-erro';
            resSummary.innerHTML = interpretarResultadoParaLeigos(comandoNome, data.erro, false);
            resRawOutput.textContent = data.erro || 'Ocorreu um erro desconhecido na execução.';
        }
    } catch (err) {
        resBadge.textContent = 'Falha';
        resBadge.className = 'badge-erro';
        resSummary.innerHTML = `❌ **Erro de Comunicação.** Não foi possível conectar ao servidor backend da Central de TI.`;
        resRawOutput.textContent = 'Falha crítica na requisição HTTP.';
    }
}

// --- LÓGICA DO MODAL ADICIONAR COMPUTADOR ---
    const modalAdd = document.getElementById('modalAddComputador');
    const btnAbrirAdd = document.getElementById('btnAbrirModalAdd');
    const btnCancelarAdd = document.getElementById('btnCancelarAdd');
    const btnSalvarAdd = document.getElementById('btnSalvarAdd');
    const addMsgError = document.getElementById('addMsgError');

    if (btnAbrirAdd && modalAdd) {
        btnAbrirAdd.addEventListener('click', () => {
            document.getElementById('formAddComputador').reset();
            addMsgError.textContent = '';
            modalAdd.style.display = 'flex';
        });
    }

    if (btnCancelarAdd && modalAdd) {
        btnCancelarAdd.addEventListener('click', () => {
            modalAdd.style.display = 'none';
        });
    }

    if (btnSalvarAdd) {
        btnSalvarAdd.addEventListener('click', async () => {
            const nome = document.getElementById('addNome').value.trim();
            const ip = document.getElementById('addIp').value.trim();
            const departamento = document.getElementById('addDepto').value.trim();
            const usuario = document.getElementById('addUser').value.trim();
            const localizacao = document.getElementById('addLocal').value.trim();

            if (!nome || !departamento || !usuario || !localizacao) {
                addMsgError.textContent = 'Por favor, preencha os campos obrigatórios.';
                return;
            }

            try {
                const response = await fetch('/api/computers/adicionar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, ip, departamento, usuario, localizacao })
                });

                const data = await response.json();

                if (data.sucesso) {
                    modalAdd.style.display = 'none';
                    await carregarComputadores();
                } else {
                    addMsgError.textContent = data.mensagem || 'Erro ao salvar.';
                }
            } catch (err) {
                addMsgError.textContent = 'Erro de comunicação com o servidor.';
            }
        });
    }