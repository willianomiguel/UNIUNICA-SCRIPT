# Investigação: como levar projetos gerados externamente para o Promob

Data: 2026-10-17.

## 0. Limitação do ambiente de desenvolvimento

O trabalho foi feito em um **container Linux na nuvem** (Ubuntu 24.04, Python 3.13, Ruby). Não há:

- Windows, Wine nem Promob Studio instalado;
- arquivos `.promob`, `.pcontent` ou `.skp` do usuário (`/mnt/user-data/uploads` estava vazio);
- acesso remoto ao computador do usuário.

Consequências:

- As etapas 3 (inspecionar o Promob instalado) e 8 (validar dentro do Promob) **não foram executadas**.
- Para elas foram criadas ferramentas que rodam na máquina Windows:
  - `tools/inspecionar_promob.ps1`;
  - `tools/analisar_formato.py`;
  - `docs/VALIDACAO_NO_PROMOB.md`.
- Nenhum teste "dentro do Promob" é dado como aprovado neste documento.

## 1. Fontes oficiais consultadas (suporte.promob.com)

Os textos foram obtidos pela API pública da central de ajuda (`/api/v2/help_center/...`).

| Artigo | Conteúdo relevante |
|---|---|
| [31120951144465](https://suporte.promob.com/hc/articles/31120951144465) – Importar/Exportar Arquivo 3D | Ver a lista logo abaixo da tabela. |
| [31121702310417](https://suporte.promob.com/hc/pt-br/articles/31121702310417) – Importar e Exportar Projetos | `.promob` é exportado e importado por Arquivo > Importar Projeto (a partir do Promob 5.60.39.0 e do Connect 2.2.27.0). **Importar .skp como projeto**, só no "Novo Promob": a conversão é feita na nuvem e você relaciona as etiquetas às camadas Paredes/Piso/Teto/Geometrias/Itens de Decoração. |
| [31112413549073](https://suporte.promob.com/hc/pt-br/articles/31112413549073) – Configurar o .skp para importação | **Paredes:** retangulares, com topo nivelado. **Piso:** um único objeto, sem degraus. **Itens de decoração:** grupos ou componentes, sem faces soltas. Evitar aninhar em paredes. Origem em [0,0,0]. |
| [36814568300689](https://suporte.promob.com/hc/pt-br/articles/36814568300689) – Construção de paredes no SKP (beta) | Uma parede é um retângulo independente. Não criar no chão e "puxar". Aberturas por perfuração. |
| [36813691121553](https://suporte.promob.com/hc/pt-br/articles/36813691121553) – Conversão SKP | Medidas tiradas do bounding box. Arredondamento por polegadas (ex.: 1198 → 1200 mm). |
| [31121852993809](https://suporte.promob.com/hc/en-us/articles/31121852993809) – Builder ERP XML | O XML é de **saída** (ERP). Não há importação de volta. |
| [31120103038097](https://suporte.promob.com/hc/en-us/articles/31120103038097) – Plugins | Plugins oficiais ativados em Ferramentas > Plugins. **Não há SDK público.** |
| [31123530786833](https://suporte.promob.com/hc/en-us/articles/31123530786833) – Closet Editor (Catalog) | O Construtor de Armários é configurado no Promob Catalog, com o plugin Build Closet (Premium/Studio). |
| [31116745911953](https://suporte.promob.com/hc/articles/31116745911953) – Importar projeto 2020Design | A única importação de projeto via XML documentada é a do 2020Design (`Legetdata.exe`). |

Regras do artigo 31120951144465 (Importar/Exportar Arquivo 3D):

- **Importar:**
  - Botão "Importar – Arquivo 3D", nos formatos **DXF, 3DS, SKP e OBJ**.
  - Unidades em **mm**, com origem 0,0,0 no ponto mais à esquerda, traseiro e inferior.
  - Limite de **25.000 faces**.
  - SKP salvo na versão 16 ou anterior.
  - 3DS: as layers são ignoradas.
  - DXF: polilinhas não são lidas.
  - "Vincular" ou "Referenciar".
- **Exportar:** DXF R11/12.

Não foi encontrada documentação pública:

- do formato interno do `.promob`;
- de importação de `.pmob`/`.pcontent` avulsos;
- de uma API, SDK ou linha de comando para criar projetos.

O "Only API Integration" não apareceu em nenhuma fonte oficial encontrada.

## 2. Repositórios analisados

Os quatro foram clonados e o código foi lido.

| Repositório | Licença | Último commit | Formatos | Aproveitamento |
|---|---|---|---|---|
| dantedex/mooblender | GPL-3.0+ | 2026-07-22 | **Lê** `.pmob` e `.pcontent`, que são o formato de conteúdo Promob, documentado por engenharia reversa. Não escreve. | A **especificação** do PMob (docs/formats/pmob.md) serviu de base para um *writer* próprio, escrito do zero (`adapters/pmob.py`). O leitor deles é usado **só nos testes**, como validador independente, e não é redistribuído. |
| torusservices/morti-app | MIT | 2026-06-14 | `.morti` (Yjs), GLB | Modelo paramétrico de painéis (`compileAssembly`) e lista de corte. Serviu de referência conceitual: decomposição do móvel em peças com papel, espessura e posição. |
| TangSY/aedifex | MIT | 2026-10-13 | GLB/OBJ/IFC/STL | Paredes e ambientes genéricos, sem marcenaria. Não aproveitado. |
| LuisEnVilla/furniture-designer-cursor | MIT | 2026-03-27 | nenhum (só configuração MCP) | Não aproveitado. O código real fica em `furniture-designer-mcp`, que não foi analisado. |

Outros repositórios confirmados, nenhum com leitor ou escritor de Promob:

- lairdubois/opencutlist (SketchUp);
- RajwanYair/WoodworkingShop;
- uberbruns/headspace (OpenSCAD);
- schummbo/SKPToCutlist.

**Não existe** leitor ou escritor público do projeto `.promob`.

## 3. Classificação dos caminhos (A–F)

| Caminho | Funciona no Promob? | Módulos editáveis/biblioteca? | Paredes/portas/janelas | O que fica manual | Situação |
|---|---|---|---|---|---|
| **A. API/SDK oficial** | Nenhuma API pública para criar projetos | – | – | – | **Inviável** sem acordo com a Promob/Cyncly |
| **B. Projeto nativo `.promob`** | Sim, é o formato nativo | Sim | Sim | – | **Bloqueado:** formato não documentado e sem amostras para engenharia reversa. Próximo passo: analisar amostras com `tools/analisar_formato.py`. |
| **C. SKP → Importar Projeto (Novo Promob ≥ 5.60.39)** | Documentado oficialmente | **Não:** os móveis entram como Itens de Decoração | **Sim:** paredes nativas, aberturas por perfuração, piso | Rodar o script no SketchUp e relacionar as camadas na tela de importação | **Implementado** (`*_sketchup.rb`). Validação no Promob pendente. |
| **D. OBJ/3DS/DXF/SKP → Importar Arquivo 3D** | Documentado oficialmente | **Não:** geometria vinculada | Paredes viram geometria, não paredes do Promob | Importar e posicionar cada arquivo | **Implementado** (OBJ, 3DS, DXF, por projeto e por módulo). Validação no Promob pendente. |
| **E. Templates nativos** | Depende de B | Sim | Sim | – | Bloqueado pelo mesmo motivo de B |
| **G. XML "2020Design" → Arquivo > Importar Projeto** (achado durante a pesquisa) | Documentado oficialmente (artigos 31116745911953 / 31116804632977): o Promob converte em projeto o XML que o `LeGetData.exe` do 2020 Design gera | **Desconhecido.** É importação de **projeto**, não de geometria; o mapeamento de itens 2020 → biblioteca Promob não é documentado | Desconhecido | Precisa de um XML real gerado pelo LeGetData (2020 Design instalado) para emular o esquema | **Pista mais promissora para itens não-geométricos.** Não implementado: sem amostra do XML de saída, só o XML de *entrada* (`ArquivoEntrada.xml`, configuração dos campos exportados: Catalog/Item/ItemInfo/PositionInfo/CatalogVar/UserVar/ShapeVar, unidades mm) |
| **F. Plugin próprio / automação de UI** | Plugin: sem SDK. Automação de UI (pywinauto/AutoHotkey) é possível. | Sim, se automatizar a inserção de itens da biblioteca | Sim | Frágil, depende da versão e da licença | Não implementado. Alternativa de última instância. |

Também foi gerado um `.pmob` **experimental**:

- Ele é estruturalmente válido segundo o leitor do mooblender.
- **Não existe menu documentado** do Promob que importe `.pmob` avulso.
- Por isso, não é tratado como formato compatível.

## 4. Conclusão técnica

- **Ambiente com paredes:** o melhor caminho documentado é o **C**. Ele gera um projeto do Promob com paredes nativas.
- **Módulos:** nos caminhos C e D, eles chegam como **geometria 3D** (item de decoração ou objeto 3D vinculado). **Não preservam** vínculo com biblioteca, orçamento nem lista de corte do Promob.
- **Módulos nativos editáveis:** exigem o caminho B/E (engenharia reversa do `.promob` a partir de amostras legítimas), o G (emular o XML do 2020 Design, se o Promob mapear os itens para a biblioteca) ou o F (automação da interface).
