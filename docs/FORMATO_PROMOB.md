# Formato `.promob`: engenharia reversa a partir de projetos reais

**Amostras:** 3 projetos reais do usuário (cozinha, lavanderia e sala).

| Item | Valor |
|---|---|
| Promob | Studio 5.60.45.3 / 5.60.47.2 |
| Biblioteca | **Todeschini Concept** (SYSTEMID 2099) |
| Plugins | Connect 4.0.0, Builder 1.60.42.4, Builder Budget 1.60.42.0, 3DE Render 2.1.2, New Revest 1.8.6, New Auditor 1.2.27 |

Os arquivos originais **não** estão no repositório (contêm dados do cliente). Foram analisados só em cópias.

## 1. O formato é aberto: ZIP + XML

O `.promob` é um **ZIP** comum (deflate) com XML em UTF-8 (com BOM) e imagens.

```
projeto.promob
 ├─ promob.info                    sistema, biblioteca, versão e histórico de gravações
 │                                 (contém nº de série e código de produto: não publicar)
 ├─ invoker.xml                    <INVOKER PROGRAM="Connect"> … METADATA ProjectId
 ├─ sugestao.jpg                   miniatura
 └─ solucao/
     ├─ solucao.container          documentos e contêineres + PROJECTGUID + CustomerNumber
     ├─ document2/*.dataclient     dados do cliente (pessoais)
     ├─ materials/materials.material   materiais do projeto (+ MyTextures/*.png|jpg)
     └─ container1/
         ├─ container1.container   lista de documentos: sugestao (ambiente), impressao, imagem (renders), listagem
         ├─ document0/document0.ambient3d   ◄── O AMBIENTE 3D (1,8 a 8 MB de XML)
         └─ documentN/             renders (.image + .jpg), pranchas (.print), listagem (.listing)
```

## 2. `document0.ambient3d`: árvore de entidades

```
<AMBIENT3D NAME="Cozinha" …>
  <ASSOCIATIONMANAGER LASTINDEX="36277"/>       ← contador global de UNIQUEID
  <AMBIENTPROPERTIES><LIMITEMINIMO …/><LIMITEMAXIMO …/></AMBIENTPROPERTIES>
  <ENTITYCOUNT>1400</ENTITYCOUNT>
  <LAYERS>…</LAYERS>  <VIEWPOINTCOLLECTION>…</VIEWPOINTCOLLECTION>  <CONFIGRENDER/>
  <INFORMACOES ID="PISOTETO" TYPE="PisoTeto">   ← raiz
    <INFORMACOESCOLECAO>
      <INFORMACOES ID="PAREDE" TYPE="WALL">     ← paredes (polilinha + espessura + altura)
        <INFORMACOESCOLECAO>
          <INFORMACOES ID="tod_coz_bui_sup_arm_2p" TYPE="MODULO"> … </INFORMACOES>   ← módulos presos à parede
      <INFORMACOES ID="tod_coz_infAlt720_prof540_canto_veneza_…" TYPE="MODULO"> …  ← módulos soltos no piso
      <INFORMACOES TYPE="GEOMETRY|onlinemodule|GROUPENTITY|Teto"> …
  <MODELMANAGER><MODELS><MODEL IDMODEL="…" IDMODELTYPE="…"/>…   ← acabamentos escolhidos
```

### 2.1 Módulo da biblioteca (`TYPE="MODULO"`)

| Elemento | Significado | Exemplo (balcão 2 portas) |
|---|---|---|
| `@ID` | **código do item no catálogo** | `tod_coz_bui_inf_bal_bal_2p` |
| `ASSOCIATIONREGISTRY @UNIQUEID @GUID` | identidade única no projeto | `32775`, uuid |
| `POSICAOINSERCAO/PONTOBASE @X @Y @Z` | posição (mm, coordenadas do ambiente) | `1988.831, 2212.969, 200` |
| `POSICAOINSERCAO/ROTATION` | rotação em graus (eixo Z) | `90` |
| `INSERTDIMENSION @WIDTH @HEIGHT @DEPTH` | medidas atuais | `836 × 680 × 640` |
| `INSERTDIMENSION/MIN`, `/MAX` | **limites editáveis do catálogo** | L 600–1200, A 357–900, P 265–850 |
| `LIMITS` | caixa local (X = largura, −Y = profundidade, Z = altura) | |
| `LAYER @DESCRIPTION` | camada | `Cozinhas Builder` |
| `ATTRIBUTES/ATTRIBUTE @ID @VALUE` | atributos do item | `BIBLIOTECA_NOME`, `PUXADOR`, `SIDE`, `MODULETYPE` … |
| `METADATAS/METADATA[@ID=AGGREGATESINFO]` | cache dos agregados do Builder (`AGGREGATEKEY` + hash) | |
| `INFORMACOESCOLECAO` | **agregados**: caixa, portas, prateleiras, ferragens, rodapé (cada um é outra entidade `MODULO`) | 24 filhos |
| `BUDGETINFORMATION` | informações de orçamento | |

### 2.2 Parede (`TYPE="WALL"`)

- **Traçado:** `GEOMETRY/SHAPE/POINT2DGP @X @Y @E`, uma polilinha em planta. `E` é a espessura (150 mm).
- **Altura:** `INSERTDIMENSION @HEIGHT` (2600).
- **Faces:** `REGIONS` lista as faces já calculadas, com material por face.
- **Alinhamento:** `SHAPE @ALIGNMENT` (`Esquerda`).

### 2.3 Referências

- `UNIQUEID` é único por entidade (1399 na cozinha, sem repetição).
- As entidades se referenciam por `OBJECTASSOCIATION @UNIQUEID`, nas relações `SerializacaoEntidade` e `ParentEntidade`.
- Novos IDs devem vir de `ASSOCIATIONMANAGER @LASTINDEX`, que é incrementado a cada uso.

## 3. Conteúdo das amostras

Levantamento feito com `tools/promob_inspecionar.py`:

| Projeto | Entidades | Códigos de catálogo distintos | Paredes |
|---|---|---|---|
| Cozinha | 1400 | 168 | 1 polilinha (5 pontos), h 2600 |
| Lavanderia | 604 | 88 | 2 |
| Sala | 2776 | (ver JSON) | 1 polilinha (19 pontos) |

Exemplos de código de catálogo:

| Código | Item |
|---|---|
| `tod_coz_bui_inf_bal_bal_2p` | balcão de 2 portas |
| `tod_coz_bui_inf_gav_2_gaveta_ok_2` | gaveteiro |
| `tod_coz_bui_sup_arm_2p` | aéreo de 2 portas |
| `tod_coz_bui_sup_arm_art` | aéreo articulado |
| `tod_dor_bui_arm_1p` | armário de 1 porta (dormitório) |
| `tod_com_wal_sys_mod_for_wall_pai_18_bp_V/H` | painéis do wall system |

## 4. Consequência para o objetivo

**Caminho B/E (projeto nativo a partir de modelo):** é **viável no nível do arquivo**. O XML é legível e editável e guarda o código do item do catálogo, as medidas e os limites.

Ainda falta validar **no Promob**:

1. Se ele aceita um `.promob` regravado (E0).
2. Se ele reconstrói os agregados de um módulo alterado (E1) ou inserido só com código, posição e medidas (E5).
3. Se o orçamento e a lista de corte continuam funcionando.

## 5. Experimentos gerados (`tools/promob_editar.py`)

Todos partem da cozinha real e recebem **novo PROJECTGUID/ProjectId**, para importar como projeto novo sem sobrescrever o original. O nome do ambiente vira `TESTE Ex …`.

| Arquivo | O que muda | O que prova se abrir certo |
|---|---|---|
| `TESTE_E0_IDENTICO` | nada (só regravado) | o Promob aceita arquivos gerados pelo nosso código |
| `TESTE_E1_LARGURA` | balcão 2p: largura 836 → 900 | edição de medidas; se as portas e a caixa acompanham, os agregados são recalculados |
| `TESTE_E2_MOVER` | aéreo 1p: +100 mm em Z | edição de posição |
| `TESTE_E3_DUPLICAR` | balcão 2p duplicado, +1500 mm em X | inserir módulo completo novo |
| `TESTE_E4_REMOVER` | aéreo articulado removido | remoção |
| `TESTE_E5_MINIMO` | balcão 2p novo **sem agregados** | **o Promob monta o módulo a partir do catálogo**: é a chave para gerar projetos do zero |

**Como testar:**

1. No Promob, vá em **Arquivo > Importar Projeto** e escolha o arquivo `TESTE_…promob`.
2. Escolha um cliente de teste e abra o projeto.
3. Verifique, em cada teste:
   - se o arquivo abre sem erro;
   - se o módulo alterado aparece certo;
   - se as cotas estão corretas;
   - se o orçamento e a lista de corte mostram os itens.
