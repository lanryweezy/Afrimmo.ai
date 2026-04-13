// src/utils/helpers.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, isValidEmail, generateId } from './helpers';

describe('Helper Functions', () => {
  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      // Use regex to match currency symbols as they can vary by environment (e.g. "US$ " vs "$")
      const ngnResult = formatCurrency(1000000);
      expect(ngnResult).toMatch(/₦\s?1,000,000/);

      const usdResult = formatCurrency(500000, 'USD');
      expect(usdResult).toMatch(/\$500,000|US\$500,000/);
    });

    it('handles zero and negative values', () => {
      expect(formatCurrency(0)).toMatch(/₦\s?0/);
      expect(formatCurrency(-1000)).toMatch(/-₦\s?1,000/);
    });
  });

  describe('formatDate', () => {
    it('formats dates correctly', () => {
      const date = new Date('2023-05-15');
      expect(formatDate(date)).toContain('May');
      expect(formatDate(date)).toContain('15');
      expect(formatDate(date)).toContain('2023');
    });

    it('formats date strings', () => {
      expect(formatDate('2023-05-15')).toContain('May');
    });
  });

  describe('isValidEmail', () => {
    it('validates email correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('generateId', () => {
    it('generates IDs of correct length', () => {
      const id = generateId(10);
      expect(id.length).toBe(10);
    });

    it('generates different IDs each time', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });
});