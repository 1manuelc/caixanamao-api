import { tbrelatorio } from '@prisma/client';
export type Report =
  | tbrelatorio
  | (tbrelatorio & {
      values: {
        valor_inicial: number;
        valor_especie: number;
        valor_cartao: number;
        valor_pix: number;
        valor_despesas: number;
      };
    });
