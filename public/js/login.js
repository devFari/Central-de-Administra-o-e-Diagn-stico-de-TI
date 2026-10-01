document.addEventListener('DOMContentLoaded', async () => {
    // Força o logout preventivo ao abrir a tela de login para garantir que não há sessão ativa órfã
    await fetch('/api/auth/logout', { method: 'POST' });
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const senha = document.getElementById('senha').value;
    const errorMsg = document.getElementById('errorMsg');

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senha })
        });

        const data = await response.json();

        if (data.sucesso) {
            window.location.href = '/index.html';
        } else {
            errorMsg.textContent = data.mensagem || 'Senha incorreta.';
        }
    } catch (err) {
        errorMsg.textContent = 'Erro de comunicação com o servidor.';
    }
});