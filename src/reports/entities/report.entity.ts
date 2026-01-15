import { tbrelatorio } from '@prisma/client';
import { Register } from 'src/registers/entities/register.entity';
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
    })
  | (tbrelatorio & {
      values: {
        valor_inicial: number;
        valor_especie: number;
        valor_cartao: number;
        valor_pix: number;
        valor_despesas: number;
      };
      registers: Register[];
    });
