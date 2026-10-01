
# 🛠️ Central de Administração e Diagnóstico de TI

Aplicação web local desenvolvida para facilitar o suporte, a administração e o diagnóstico de computadores Windows dentro de uma rede corporativa, centralizando operações comuns de TI em uma interface limpa, moderna e segura.

> **Acesso restrito:** a lista de computadores e qualquer comando só ficam disponíveis após autenticação com senha validada no backend.

---

## 🚀 Tecnologias Utilizadas

* **Backend:** Node.js, Express.js, Express-Session
* **Frontend:** HTML5, CSS3, JavaScript puro (Vanilla JS)
* **Armazenamento:** Arquivo JSON (`config/computadores.json`)
* **Segurança:** Autenticação por sessão volátil e hash SHA-256

---

## 📁 Estrutura do Projeto

```markdown
central-ti/
│
├── package.json
├── server.js
│
├── config/
│   └── computadores.json
│
├── commands/
│   ├── baseCommand.js
│   ├── ping.js
│   ├── tracert.js
│   ├── mstsc.js
│   ├── nbtstat.js
│   ├── netview.js
│   ├── sc.js
│   ├── tasklist.js
│   ├── taskkill.js
│   └── systeminfo.js
│
├── routes/
│   ├── auth.js
│   ├── computers.js
│   └── commands.js
│
├── public/
│   ├── index.html
│   ├── login.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── login.js
│       └── app.js
│
└── iniciar.bat
```

---

## ⚙️ Pré-requisitos

### Máquina que executará o servidor
* **Windows** (para execução correta dos comandos de rede e diagnóstico)
* **Node.js** versão 18 ou superior
* Permissões administrativas na máquina servidora
* Terminal (Prompt de Comando ou PowerShell)

### Rede e computadores-alvo
* O servidor e todos os computadores-alvo devem estar **na mesma rede local (LAN)** ou no mesmo domínio.
* A resolução de nomes deve funcionar (DNS ou NetBIOS). Por isso, o arquivo JSON pode incluir o campo `ip`.
* Firewall do Windows nos computadores-alvo deve permitir as portas e protocolos necessários para cada comando (ICMP, RDP, SMB, RPC, WMI, etc.).
* Para comandos que exigem autenticação remota, a conta utilizada pelo servidor precisa ter privilégios administrativos nos computadores-alvo.

### Navegador
* Navegador moderno (Chrome, Edge, Firefox) no cliente que acessará a interface.

### Autenticação
* **Senha de acesso para visualizar a lista de computadores e executar comandos.**
* Senha padrão definida no backend: `DevFari`
* A senha é validada no servidor e armazenada como hash SHA-256. **Nunca é exposta no JavaScript do frontend.**
* Recomenda-se alterar a senha antes de usar em produção.

---

## 📥 Instalação e Configuração

1. Clone ou baixe o repositório para a máquina de administração de TI.
2. Abra o terminal na pasta raiz do projeto (`central-ti`).
3. Instale as dependências:
```bash
npm install
```
4. Edite o arquivo `config/computadores.json` e cadastre os computadores da rede:

```json
[
    {
        "nome": "PC-RECEPCAO-01",
        "departamento": "Recepção",
        "user": "João",
        "localizacao": "Térreo",
        "ip": "172.16.251.210"
    },
    {
        "nome": "PC-RM-03",
        "departamento": "Radiologia",
        "user": "Maria",
        "localizacao": "1º Andar",
        "ip": "172.16.251.211"
    }
]
```

> O campo `ip` é opcional, mas necessário para comandos como `nbtstat -A`. Se não for informado, o sistema tentará resolver o nome.

---

## 🖥️ Como Executar

### Opção 1: Inicialização Automática (Recomendada)
1. Dê dois cliques no arquivo **`iniciar.bat`** na raiz do projeto.
2. O script inicia o servidor Node.js e abre automaticamente o navegador no endereço da aplicação.
3. Crie um atalho do `iniciar.bat` na Área de Trabalho para acesso rápido.

### Opção 2: Inicialização Manual
1. Na pasta do projeto, execute:
```bash
node server.js
```
2. Abra o navegador e acesse: `http://localhost:3000`

---

## 🔒 Autenticação e Controle de Acesso

* A tela inicial exibe apenas o formulário de login.
* **A lista de computadores só é carregada após o login bem-sucedido.**
* A sessão é volátil: expira ao fechar o navegador ou ao atualizar a página (`F5`).
* O backend mantém uma whitelist de comandos permitidos. O frontend não pode enviar comandos arbitrários.
* Senha padrão: `tarado da reuniao` (altere no backend antes de usar em produção).

---

## 💻 Comandos Suportados

A aplicação possui arquitetura modular em whitelist. Cada comando tem seu próprio arquivo em `commands/`.

| Comando | Descrição | Requisitos no alvo |
|---------|-----------|-------------------|
| **Ping** | Testa conectividade básica | ICMP liberado, host acessível |
| **Tracert** | Rastreia rota dos pacotes | ICMP/UDP liberado |
| **MSTSC** | Abre Área de Trabalho Remota | RDP habilitado, porta 3389 |
| **NBTSTAT** | Consulta NetBIOS via IP | NetBIOS over TCP/IP ativo, IP cadastrado |
| **NET VIEW** | Lista recursos compartilhados | Compartilhamento de arquivos e impressoras ativo, SMB |
| **SC** | Consulta serviços do Windows | RPC, permissões administrativas |
| **TASKLIST** | Lista processos remotos | RPC, Registro Remoto, permissões administrativas |
| **TASKKILL** | Encerra processos remotos | RPC, permissões administrativas (exige confirmação) |
| **SHUTDOWN** | Desliga ou reinicia o computador remotamente | RPC, privilégios administrativos (exige confirmação estrita) |
| **SYSTEMINFO** | Exibe informações do sistema | WMI/RPC, permissões administrativas |

> Operações de **consulta** executam após seleção. Operações de **ação** (ex.: `taskkill`, `sc start/stop`) exigem confirmação explícita.

---

## 🧭 Fluxo de Uso

```text
Iniciar aplicação
       ↓
Abrir navegador
       ↓
Tela de autenticação (senha)
       ↓
Lista de computadores (após login)
       ↓
Filtrar por departamento / localização
       ↓
Selecionar computador
       ↓
Escolher comando
       ↓
Confirmar operação (quando aplicável)
       ↓
Node.js executa comando
       ↓
Capturar resultado
       ↓
Exibir resultado na interface
```

---

## 🛡️ Segurança

* Senha validada exclusivamente no backend.
* Sessão com `express-session`.
* Hash SHA-256 para armazenamento da senha.
* Whitelist de comandos permitidos.
* Validação do nome do computador antes de montar o comando.
* Nenhuma credencial administrativa é exposta no frontend.
* Operações que alteram estado exigem confirmação adicional.

---

## 🚨 Tratamento de Erros

A aplicação trata e exibe mensagens compreensíveis para:

* Computador desligado ou inacessível
* Nome de computador inexistente
* Timeout de rede
* Falha de autenticação
* Permissão insuficiente
* Serviço não disponível
* Processo inexistente
* Comando inválido
* Erro de execução do processo
* Falha na comunicação frontend/backend

> Stack traces do Node.js não são exibidos ao usuário final.

---

## 📈 Roadmap

- [x] Cadastro de computadores pela interface
- [x] Suporte a encerramento remoto
- [ ] Status online/offline
- [ ] Histórico de comandos
- [ ] Logs de auditoria
- [ ] Dashboard e monitoramento
- [ ] Inventário de hardware e software

---

## 👨‍💻 Autor

**by DevFari**
