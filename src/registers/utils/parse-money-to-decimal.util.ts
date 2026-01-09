/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Decimal } from '@prisma/client/runtime/wasm-compiler-edge';

const moneyKeys = [
  'valor_inicial',
  'valor_especie',
  'valor_cartao',
  'valor_pix',
  'valor_despesas',
] as const;

type MoneyKey = (typeof moneyKeys)[number];

type MoneyValue = string | number | Decimal;

type WithMoneyFields<T> = T & Record<MoneyKey, MoneyValue>;

/**
 * Converte Decimal|string|number para number
 */
export function parseMoney<T extends object>(
  input: WithMoneyFields<T> | WithMoneyFields<T>[],
) {
  const convertOne = (r: WithMoneyFields<T>): T & Record<MoneyKey, number> => {
    const result: any = { ...r };

    for (const key of moneyKeys) {
      const value = r[key];

      if (value instanceof Decimal) {
        result[key] = value.toNumber();
      } else if (typeof value === 'string') {
        result[key] = Number(value);
      } else {
        result[key] = value;
      }
    }

    return result;
  };

  return Array.isArray(input) ? input.map(convertOne) : convertOne(input);
}
