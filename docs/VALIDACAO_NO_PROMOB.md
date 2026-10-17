# Roteiro de validação no Promob Studio

Este roteiro deve ser executado na máquina Windows onde o Promob está instalado. Os resultados reais devem ser registrados na tabela da seção 5, com capturas de tela salvas em `docs/evidencias/`.

> **Situação em 2026-10-17:** **nenhum** dos testes abaixo foi executado. O desenvolvimento ocorreu em um container Linux, sem Promob.

## 0. Inspeção do ambiente

```powershell
powershell -ExecutionPolicy Bypass -File tools\inspecionar_promob.ps1
```

O script gera `logs\ambiente_promob.json`, com:

- versão e build;
- plugins;
- DLLs de importação;
- associações de extensão;
- quantidade de projetos.

O script é somente leitura.

## 1. Gerar os arquivos

```bat
run.bat
```

Os arquivos são gerados em `output\<Projeto>\<data_hora>\`. Leia o `IMPORTAR_NO_PROMOB.txt` de cada pasta.

## 2. Teste C: SKP como projeto (Novo Promob 5.60.39.0 ou superior)

1. Abra o SketchUp (2017 ou superior) e vá em Janela > Console Ruby. Execute:
   ```ruby
   load "C:/.../output/POC_Cozinha_01/<data>/POC_Cozinha_01_sketchup.rb"
   ```
   - Esperado: a mensagem `PromobGen: salvo em ...POC_Cozinha_01.skp`.
2. No Promob, vá em Arquivo > Importar Projeto > Caminho, filtre por `*.skp` e clique em Avançar. Depois escolha o cliente.
3. Relacione as camadas:
   - **Paredes** ← "Paredes"
   - **Piso** ← "Piso"
   - **Itens de Decoração** ← "Itens de Decoracao"
4. Aguarde a notificação e abra o projeto.

## 3. Teste D: Importar Arquivo 3D (em um projeto aberto)

1. Use o botão "Importar - Arquivo 3D" e selecione `POC_Cozinha_01_moveis.obj`. Escolha **Vincular**.
2. Repita com `POC_Cozinha_01.3ds` e com `POC_Cozinha_01.dxf`.
3. Importe também `modulos\M01_base_cabinet.obj`, que tem a origem no próprio módulo.

## 4. O que verificar em cada teste

- O arquivo é aceito, sem mensagem de erro.
- O ambiente aparece. No teste C, as paredes devem ser paredes do Promob.
- As dimensões batem com o JSON (largura, profundidade e altura de cada módulo), conferidas com a cota do Promob.
- As posições batem com `manifest.json` → `modules[].position`. As frentes devem ficar voltadas para o ambiente, não para a parede.
- Os objetos podem ser selecionados, movidos e redimensionados.
- Os vínculos com a biblioteca não devem existir neste caminho: os itens são geometria.
- Salvar, fechar e reabrir mantém o projeto.
- Os itens importados aparecem ou não no orçamento e na listagem. Registre o comportamento.

Se as frentes ficarem invertidas, ajuste o eixo Y. Registre o ocorrido e gere novamente com outra orientação; o próximo passo é criar a opção `--flip-y`.

## 5. Registro de resultados (preencher)

| Data | Versão Promob | Teste | Arquivo | Aceito? | Dimensões OK? | Posições OK? | Editável? | Salva/reabre? | Observações / captura |
|---|---|---|---|---|---|---|---|---|---|
| | | C | POC_Cozinha_01.skp | | | | | | |
| | | D | POC_Cozinha_01_moveis.obj | | | | | | |
| | | D | POC_Cozinha_01.3ds | | | | | | |
| | | D | POC_Cozinha_01.dxf | | | | | | |
| | | D | modulos/M01_base_cabinet.obj | | | | | | |

## 6. Para o caminho nativo (B/E): amostras necessárias

Crie no Promob, sem dados de clientes:

1. Um projeto com uma parede e um módulo de armário.
2. O mesmo projeto com a largura do módulo alterada (ex.: 600 → 800).
3. Um projeto com 2 ou 3 módulos.

Exporte cada um pela Tela Inicial (botão Exportar → `.promob`) e analise **cópias**:

```bat
py -3 tools\analisar_formato.py "C:\caminho\Projeto_1modulo.promob"
```

Compare os relatórios em `logs\formatos\` para identificar onde ficam a largura, a posição e o ID do item de biblioteca.
