# Entregas: projetos .promob gerados

Arquivos prontos para importar no Promob (Todeschini Concept): **Arquivo > Importar Projeto**.
Como cada um tem um ProjectId novo, a importação cria um projeto separado e não sobrescreve nada.

| Arquivo | O que é |
|---|---|
| `SUITE_CASAL.promob` | Suíte casal 3,60 x 4,00 m (pé-direito 2,60 m) com janela 1,52 x 1,20 m e porta 0,96 m |
| `NOVO_DORMITORIO.promob` | Primeira versão do dormitório, gerada da mesma forma |
| `imagens/SUITE_CASAL_*.png` | Prévia 3D montada a partir do arquivo (**não** é render do Promob) |
| `imagens/planta_*.png` | Planta lida do próprio .promob |

## Móveis da SUITE_CASAL

Todos são itens do catálogo Todeschini, copiados completos dos projetos de origem:

- **Guarda-roupa:** 6 armários `tod_dor_bui_arm_1p` de 573 x 2540 x 530 mm, na parede esquerda (3,44 m no total).
- **Criados-mudos:** 2 gavetões suspensos `tod_coz_bui_inf_gav_1_gavetao` de 736 x 390 x 608 mm, na parede da cama.
- **Cômoda:** gaveteiro de 600 x 721 x 662 mm, com um aéreo de 1 porta acima, na parede oposta à janela.
- **Cama:** sobra um vão de 1,63 m entre os criados, onde cabe uma queen. A cama **não** está no arquivo porque não existe nos projetos de origem; insira uma do Decore Promob nesse vão.

As medidas do ambiente são de exemplo. Para gerar de novo com as medidas reais, edite a receita: em `"pasta"`, coloque a pasta onde estão os seus COZINHA/SALA/LAVANDERIA.promob e, em `ambiente_mm`, as medidas. Depois rode:

```
python tools/promob_novo.py samples/promob/receita_suite_casal.json SAIDA.promob
```

## Dados pessoais e licença

Os arquivos daqui passaram por `tools/promob_limpar.py`. Isso significa que:

- os dados do cliente estão vazios (o nome aparece como "Cliente Teste");
- o nº de série e o código de produto foram removidos do histórico;
- os renders e logos do projeto de origem foram trocados.

A parte do projeto (`document0.ambient3d`) é idêntica à gerada.

## O que testar no Promob

1. O arquivo abre sem erro?
2. Os móveis aparecem no lugar e com as medidas certas?
3. As paredes, a janela e a porta estão certas?
4. O orçamento e a lista de corte mostram os itens?

Se der erro, mande print da mensagem.
