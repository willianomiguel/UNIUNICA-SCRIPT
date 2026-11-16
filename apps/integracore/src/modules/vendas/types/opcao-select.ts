export type OpcaoSelect<TValor extends string> = {
  value: TValor;
  label: string;
  color:
    | 'green'
    | 'yellow'
    | 'orange'
    | 'red'
    | 'purple'
    | 'gray'
    | 'blue'
    | 'sky'
    | 'turquoise'
    | 'pink';
  position: number;
};
