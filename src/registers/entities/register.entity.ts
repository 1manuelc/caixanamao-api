import { tbentradadevalores } from '@prisma/client';
export type Register = Omit<
  tbentradadevalores,
  | 'valor_inicial'
  | 'valor_especie'
  | 'valor_cartao'
  | 'valor_pix'
  | 'valor_despesas'
> & {
  valor_inicial: number;
  valor_especie: number;
  valor_cartao: number;
  valor_pix: number;
  valor_despesas: number;
};
