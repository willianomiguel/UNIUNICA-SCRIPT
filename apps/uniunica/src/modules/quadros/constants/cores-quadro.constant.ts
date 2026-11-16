import { type CorQuadro } from 'src/modules/quadros/types/cor-quadro';

export const CORES_QUADRO: { valor: CorQuadro; rotulo: string }[] = [
  { valor: 'gray', rotulo: 'Cinza' },
  { valor: 'blue', rotulo: 'Azul' },
  { valor: 'turquoise', rotulo: 'Turquesa' },
  { valor: 'green', rotulo: 'Verde' },
  { valor: 'yellow', rotulo: 'Amarelo' },
  { valor: 'orange', rotulo: 'Laranja' },
  { valor: 'red', rotulo: 'Vermelho' },
  { valor: 'pink', rotulo: 'Rosa' },
  { valor: 'purple', rotulo: 'Roxo' },
];

export const COR_PADRAO_QUADRO: CorQuadro = 'blue';
