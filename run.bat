@echo off
REM Gera os arquivos para o Promob a partir de um JSON de especificacao.
REM Uso: run.bat [arquivo.json ...] [--formats obj,3ds,dxf,dae,skp-script,pmob]
REM Sem argumentos: gera os exemplos da pasta samples.
setlocal
cd /d "%~dp0"
set PYTHONPATH=%~dp0src
set PY=
where py >nul 2>nul && set PY=py -3
if not defined PY where python >nul 2>nul && set PY=python
if not defined PY (
  echo [ERRO] Python 3.10+ nao encontrado. Instale em https://www.python.org/downloads/ e marque "Add to PATH".
  exit /b 2
)
if "%~1"=="" (
  %PY% -m promob_gen samples\poc_cozinha_01.json samples\cozinha_linear_completa.json
) else (
  %PY% -m promob_gen %*
)
set RC=%ERRORLEVEL%
if not "%RC%"=="0" echo [ERRO] Falha na geracao (codigo %RC%). Veja a pasta logs.
if "%RC%"=="0" echo Arquivos gerados na pasta output. Leia IMPORTAR_NO_PROMOB.txt dentro da pasta gerada.
exit /b %RC%
