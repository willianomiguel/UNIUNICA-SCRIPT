// O que um evento do GitHub pede para fazer com a tarefa.
// EM_ANDAMENTO: PR aberto ou commits em branch; CONCLUIDA: PR mergeado.
export type AcaoGithub = 'EM_ANDAMENTO' | 'CONCLUIDA' | 'NENHUMA';
