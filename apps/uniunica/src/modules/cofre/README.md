# Módulo Cofre de acessos

Guarda acessos sensíveis (máquinas virtuais, servidores) com duas barreiras:

1. **Quem vê a área** — função (papel) do Twenty. A função padrão "Member" não lê o objeto `cofre`, então o
   item "Cofre de acessos" some do menu e a API responde 403. Quem pode entrar recebe a função
   **"Membro com cofre"** (igual à Member, mais o cofre). Admin vê tudo.
2. **Quem lê as senhas** — criptografia no navegador. Cada cofre tem uma **senha do cofre** que nunca sai da
   aba: o servidor, o banco, a IA do Twenty, as ferramentas de IA do app e a chave de API Admin (MCP) só
   enxergam o bloco cifrado.

## Como usar

- **Liberar uma pessoa**: Configurações → Membros → escolha o membro → função "Membro com cofre".
  Para tirar o acesso, volte a pessoa para "Member". (No Twenty cada membro tem uma função só.)
- **Criar um cofre**: Cofre de acessos → Novo registro (ex.: "Máquinas virtuais") → abrir → definir a senha do cofre.
  O **nome** do cofre fica em claro: não coloque dado sensível nele.
- **Usar**: abrir com a senha; Novo acesso (nome, endereço, usuário, senha, observações); copiar endereço,
  usuário e senha pelos botões; editar, apagar, buscar. Trava sozinho após 5 min parado e ao sair da página.
- **Trocar a senha do cofre**: botão "Trocar senha" (pede a atual; regrava tudo com sal novo).
  Tirou alguém do cofre que sabia a senha? Troque a senha também.
- **Perdeu a senha do cofre**: não há recuperação. Os acessos daquele cofre estão perdidos.

## Instalação nova

Depois do `apply`, tire o cofre da função padrão (idempotente, pede chave Admin pelo stdin):

```bash
SERVER_URL="$SERVER_URL" node scripts/travar-cofre.mjs < ~/.uniunica-api-key
```

Sem isso, todo membro comum enxerga a área (as senhas continuam cifradas, mas a lista de cofres aparece).

## Detalhes técnicos

- Objeto `cofre`: `nome` (texto) e `conteudoCifrado` (texto JSON: `v`, `kdf`, `iteracoes`, `sal`, `cifra`, `nonce`, `dados`).
  Dentro do bloco: `{ versao: 1, itens: [{ id, nome, endereco, usuario, senha, observacoes, atualizadoEm }] }`.
- Cripto: PBKDF2-SHA256 600 mil rodadas → chave de 32 bytes; XChaCha20-Poly1305 com nonce aleatório de 24 bytes
  por gravação; dado associado `uniunica-cofre:<id do registro>` (bloco copiado para outro cofre não abre).
  Bibliotecas `@noble/ciphers` e `@noble/hashes` (JS puro): o worker do front component roda em origem opaca e
  não tem `crypto.subtle`. Abrir leva ~3 s.
- Gravação confere `updatedAt` antes do PATCH; se outra pessoa salvou antes, recarrega e pede para refazer.
- Página do registro só tem a aba Cofre (sem Campos nem Linha do tempo).
- Não negue o objeto no `default-role.ts`: o Twenty copia esse papel para o papel do app que limita os front
  components, e a tela pararia de abrir.
- Menu: posição 90 (faixa 90–99), item tipo OBJECT de propósito (PAGE_LAYOUT aparece para todo mundo).
