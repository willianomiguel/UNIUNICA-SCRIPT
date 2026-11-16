import { type ReactNode } from 'react';

import { Titulo } from 'src/modules/shared/components/titulo';

// Cabeçalho padrão dos painéis, no estilo caderno: título grande em serifa,
// a descrição do período embaixo e as ações à direita.
export const CabecalhoPainel = ({
  titulo,
  descricao,
  acoes,
}: {
  titulo: ReactNode;
  descricao: ReactNode;
  acoes?: ReactNode;
}) => <Titulo nivel="pagina" titulo={titulo} descricao={descricao} acoes={acoes} />;
