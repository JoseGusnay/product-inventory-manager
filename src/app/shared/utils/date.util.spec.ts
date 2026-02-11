import { DateUtils } from './date.util';

describe('DateUtils', () => {
  describe('calculateOneYearLater', () => {
    it('should return empty string for empty input', () => {
      expect(DateUtils.calculateOneYearLater('')).toBe('');
    });

    it('should return date exactly one year later', () => {
      const input = '2023-01-01';
      const expected = '2024-01-01'; // Exact 1 year
      expect(DateUtils.calculateOneYearLater(input)).toBe(expected);
    });

    it('should handle leap years correctly', () => {
      const inputLeapDay = '2024-02-29';
      const expected = '2025-03-01';
      expect(DateUtils.calculateOneYearLater(inputLeapDay)).toBe(expected);
    });
  });
});
