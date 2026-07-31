import { describe, it, expect } from 'vitest';
import { createBetSchema } from './betSchema';

describe('betSchema validation', () => {
  const schema = createBetSchema(10000);

  it('should accept prices above or equal to minPrice', () => {
    const result = schema.safeParse({ price: 15000 });
    expect(result.success).toBe(true);
  });

  it('should reject prices below minPrice', () => {
    const result = schema.safeParse({ price: 5000 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Цена не может быть меньше минимальной суммы');
    }
  });

  it('should reject zero or negative price', () => {
    const result = schema.safeParse({ price: -500 });
    expect(result.success).toBe(false);
  });
});