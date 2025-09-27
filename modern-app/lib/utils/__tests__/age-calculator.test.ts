import { describe, it, expect } from 'vitest';
import { calculateAge, formatAge } from '../age-calculator';

describe('age-calculator', () => {
  describe('calculateAge', () => {
    it('calculates years for patients over 1 year old', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 5);
      const result = calculateAge(birthDate);
      expect(result).toEqual({ value: 5, unit: 'years' });
    });

    it('calculates months for patients under 1 year', () => {
      const birthDate = new Date();
      birthDate.setMonth(birthDate.getMonth() - 6);
      const result = calculateAge(birthDate);
      expect(result).toEqual({ value: 6, unit: 'months' });
    });

    it('calculates days for patients under 1 month', () => {
      const birthDate = new Date();
      birthDate.setDate(birthDate.getDate() - 15);
      const result = calculateAge(birthDate);
      expect(result).toEqual({ value: 15, unit: 'days' });
    });

    it('returns 1 day for newborns', () => {
      const birthDate = new Date();
      const result = calculateAge(birthDate);
      expect(result).toEqual({ value: 1, unit: 'days' });
    });

    it('handles complex date calculations correctly', () => {
      const today = new Date(2025, 8, 15); // September 15, 2025
      const birthDate = new Date(2023, 5, 20); // June 20, 2023
      const result = calculateAge(birthDate);
      expect(result).toEqual({ value: 2, unit: 'years' });
    });

    it('throws error for future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      expect(() => calculateAge(futureDate)).toThrow('Birth date cannot be in the future');
    });

    it('throws error for invalid dates', () => {
      expect(() => calculateAge(new Date('invalid'))).toThrow('Invalid birth date');
    });
  });

  describe('formatAge', () => {
    it('formats years correctly', () => {
      expect(formatAge({ value: 5, unit: 'years' })).toBe('5 year old');
    });

    it('formats months correctly', () => {
      expect(formatAge({ value: 6, unit: 'months' })).toBe('6 month old');
    });

    it('formats days correctly', () => {
      expect(formatAge({ value: 15, unit: 'days' })).toBe('15 day old');
    });
  });
});