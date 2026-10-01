@echo off
TITLE Central de TI - Inicializacao
color 0A
cls

echo ========================================================
echo       Iniciando a Central de Administracao de TI...
echo ========================================================
echo.

:: Vai para o diretorio onde o .bat esta localizado
cd /d "%~dp0"

:: Inicia o servidor Node.js em segundo plano ou na mesma janela (mantendo aberto)
echo [1/3] Iniciando o servidor Node.js...
start /B node server.js

:: Aguarda 2 segundos para garantir que o Express subiu corretamente
echo [2/3] Aguardando o servico iniciar...
timeout /t 2 /nobreak > nul

:: Abre o navegador padrao no endereco local da aplicacao
echo [3/3] Abrindo o navegador...
start http://localhost:3000

echo.
echo ========================================================
echo   Aplicacao iniciada com sucesso! 
echo   Mantenha esta janela aberta enquanto utilizar a ferramenta.
echo ========================================================
echo.
pause