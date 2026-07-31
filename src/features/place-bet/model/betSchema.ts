import { z } from 'zod';

export const createBetSchema = (minPrice: number = 1) =>
  z.object({
    price: z
      .number({ invalid_type_error: 'Введите числовое значение цены' })
      .min(minPrice, `Цена не может быть меньше минимальной суммы (${minPrice.toLocaleString('ru-RU')} ₽)`),
  });

export type BetFormData = {
  price: number;
};