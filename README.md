# promob_auto_generator

Gerador **externo** de projetos de móveis planejados (cozinha linear, nesta primeira versão), com saída em arquivos que o **Promob** importa por menus oficiais.

> **Estado honesto (2026-10-17):** os arquivos são gerados e validados por bibliotecas independentes, mas **ainda não foram abertos no Promob**. O desenvolvimento ocorreu em um container Linux, sem Promob.
>
> Os módulos chegam ao Promob como **geometria 3D** (item de decoração ou objeto 3D vinculado). **Não** são módulos de biblioteca editáveis.
>
> Veja [`docs/INVESTIGACAO.md`](docs/INVESTIGACAO.md) e [`docs/VALIDACAO_NO_PROMOB.md`](docs/VALIDACAO_NO_PROMOB.md).

## Fluxo

```
JSON (especificação)  ->  validação  ->  layout/geometria (peças)  ->  exportadores
                                                                       ├─ *_sketchup.rb  -> SketchUp -> .skp -> Promob "Importar Projeto"  (paredes nativas)
                                                                       ├─ *.obj / *.3ds / *.dxf      -> Promob "Importar - Arquivo 3D"
                                                                       ├─ modulos/*.obj|.3ds         -> um módulo por arquivo, origem 0,0,0
                                                                       ├─ *.dae                       -> SketchUp/CAD
                                                                       ├─ *.pmob (EXPERIMENTAL)       -> formato de conteúdo Promob, sem importação documentada
                                                                       └─ lista de corte CSV, vista frontal SVG, IR JSON, manifest.json
```

## Instalação (Windows)

1. Instale o Python 3.10 ou superior (python.org), marcando a opção "Add to PATH".
2. Não há dependências para executar, só a biblioteca padrão. Para rodar os testes:
   ```bat
   py -3 -m pip install -r requirements-dev.txt
   ```

## Uso

```bat
run.bat                                   :: gera os exemplos de samples\
run.bat samples\cozinha_linear_completa.json
run.bat meu_projeto.json --formats obj,skp-script
```

Ou, em qualquer sistema:

```bash
PYTHONPATH=src python -m promob_gen samples/poc_cozinha_01.json --out output
```

- Cada execução cria `output/<projeto>/<data_hora>/` e **nunca sobrescreve** execuções anteriores.
- O log fica em `logs/`.
- Em caso de erro de validação, o programa lista todos os problemas e termina com código 1.

### Entrada (JSON do gerador, não é formato do Promob)

```json
{
  "project_name": "POC_Cozinha_01",
  "units": "mm",
  "room": { "type": "linear_kitchen", "wall_length": 3200, "ceiling_height": 2700,
            "openings": [{ "type": "window", "x": 1300, "width": 1200, "height": 1000, "sill": 1100 }] },
  "cabinet_modules": [
    { "type": "base_cabinet",   "width": 600, "depth": 560, "height": 720 },
    { "type": "drawer_cabinet", "width": 600, "depth": 560, "height": 720, "drawers": 3 }
  ]
}
```

**Tipos de módulo:**

- `base_cabinet`
- `drawer_cabinet`
- `sink_cabinet`
- `wall_cabinet`: aéreo. É posicionado automaticamente desviando de torres e janelas.
- `tall_cabinet`
- `filler`

**Móveis de quarto:**

- `wardrobe`: guarda-roupa com divisórias, maleiro, cabideiro e gavetas internas.
- `nightstand`: criado-mudo.
- `dresser`: cômoda.
- `desk`: escrivaninha.
- `wall_panel`: cabeceira ou painel de TV.
- `bed`: cama. É referência de layout e fica fora da lista de corte.

**Ambientes:**

- `linear_kitchen`: uma parede.
- `rectangular_room`: `width` × `length`, com 4 paredes. A é o fundo, B a direita, C a frente e D a esquerda, vistas de dentro.
  - Portas, janelas e móveis recebem `"wall": "A".."D"` e, opcionalmente, `"x"` (posição ao longo da parede).
  - Exemplo completo com produtos reais e links: `samples/quarto_casal_real.json`.

**Opcionais:**

- Por módulo: `doors`, `drawers`, `shelves`, `elevation`, `label`, `wall`, `x`, `plinth`, `wall_offset`, `front_material`, `carcass_material`, `source`.
- No nível do projeto: `materials`, `plinth_height`, `wall_cabinet_elevation`, `countertop`, `gap`.

**Convenções:**

- Eixos: X ao longo da parede, Y para dentro do ambiente (0 na face da parede), Z para cima.
- Unidade: mm.
- `height` é a altura da caixa. Os módulos de piso ficam sobre um rodapé de `plinth_height`, que por padrão é 100 mm.

## Como levar para o Promob

Cada pasta gerada traz um `IMPORTAR_NO_PROMOB.txt` com os comandos exatos.

1. **Projeto com paredes** (Novo Promob 5.60.39.0 ou superior):
   - No SketchUp, abra o Console Ruby e execute `load ".../X_sketchup.rb"`. O script gera `X.skp`.
   - No Promob, vá em **Arquivo > Importar Projeto** e escolha o `.skp`.
   - Relacione as etiquetas: Paredes, Piso e Itens de Decoracao.
2. **Geometria**: no Promob, use **Importar - Arquivo 3D** com `X_moveis.obj` (ou `.3ds`/`.dxf`, ou `modulos/*.obj`) e escolha **Vincular**.

## Testes

```bash
python -m pytest tests            # 24 testes
MOOBLENDER_PATH=/caminho/clone/mooblender python -m pytest tests   # inclui round-trip do .pmob
```

| O que é validado | Como |
|---|---|
| Regras de dimensão e cabimento | Mensagens de erro claras |
| Posições dos módulos | Inclui o desvio de torre e janela |
| Lista de corte | Peças com dimensões positivas |
| Limite de 25.000 faces | Contagem nos arquivos gerados |
| Não sobrescrita | Execuções repetidas geram pastas distintas |
| OBJ | `trimesh`: bounding box e origem 0,0,0 por módulo |
| DXF | `ezdxf`: AC1009, 3DFACE, sem polilinhas |
| DAE | `pycollada` |
| 3DS | Parser de chunks |
| PMob | Leitor independente do projeto mooblender |
| Script SketchUp | Executado em Ruby contra um *stub* da API (`tests/sketchup_stub.rb`). Prova que o Ruby roda e cria as tags e grupos esperados, **não** o comportamento do SketchUp real. |

## Ferramentas para a máquina com Promob

- `tools/inspecionar_promob.ps1`: inventário somente leitura, com versão, plugins, DLLs, associações de extensão e contagem de projetos.
- `tools/analisar_formato.py`: analisa uma **cópia** de um `.promob`, `.pcontent` ou `.xml` (ZIP, XML, binário, árvore PMob) para a engenharia reversa do formato nativo.
- `tools/render_projeto.py`: gera imagens de conferência (perspectiva, frontal, planta) de um JSON. Exemplo em `docs/evidencias/mvp/`.
- `tools/render_preview.py`: gera um PNG de conferência de um OBJ.

## Estrutura

```
src/promob_gen/      spec.py (entrada/validação) · model.py (layout + peças) · mesh.py · generator.py · __main__.py
src/promob_gen/adapters/  obj · tds (3DS) · dxf · dae · sketchup_rb · pmob (experimental) · reports
samples/  tests/  tools/  docs/  output/ (exemplos gerados)  logs/
```

## Limitações conhecidas

- **Validação no Promob:** nenhuma foi executada.
- **Módulos:** não são nativos nem de biblioteca, portanto não entram no orçamento por item nem na lista de corte do Promob. A lista de corte vem do CSV do gerador.
- **Arquivo .skp:** é gerado pelo SketchUp a partir do script. Escrever `.skp` diretamente exige o SketchUp C SDK (Windows/macOS).
- **Ambientes:** cozinha linear (1 parede) e ambiente retangular (4 paredes). Ainda não há cozinha em L/U automática, nem paredes não ortogonais.
- **Orientação de frente/fundo no Promob (eixo Y):** ainda não confirmada.
- **Arquivo `.pmob`:** os valores de VERSION são suposições, e não há menu documentado do Promob para importá-lo.

## Próximos passos

1. Executar `docs/VALIDACAO_NO_PROMOB.md` e registrar os resultados e as capturas.
2. Exportar 3 projetos `.promob` mínimos e analisá-los com `tools/analisar_formato.py`. É o caminho para módulos nativos.
3. Obter um XML real do 2020 Design (LeGetData) e testar o caminho "Importar Projeto via XML".
4. Ampliar o layout para cozinhas em L e U, dormitórios e closets. O `model.py` já separa as linhas de piso e de aéreos.
