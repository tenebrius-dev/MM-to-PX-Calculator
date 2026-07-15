import { describe, it, expect } from 'vitest';
import { 
  parseInput, 
  formatOutput, 
  mmToPx, 
  calculateGross, 
  calculateNet, 
  calculateSafeArea 
} from './calculator';

describe('Calculator Utilities', () => {
  describe('parseInput', () => {
    it('parses dot decimals', () => {
      expect(parseInput('25.4')).toBe(25.4);
    });
    it('parses comma decimals', () => {
      expect(parseInput('25,4')).toBe(25.4);
    });
    it('returns null for invalid or empty input', () => {
      expect(parseInput('')).toBeNull();
      expect(parseInput('  ')).toBeNull();
      expect(parseInput('abc')).toBeNull();
    });
    it('returns null for negative numbers', () => {
      expect(parseInput('-10')).toBeNull();
    });
  });

  describe('formatOutput', () => {
    it('formats exactly 1 decimal place with Russian comma', () => {
      expect(formatOutput(2527.559)).toBe('2527,6');
      expect(formatOutput(100)).toBe('100,0');
      expect(formatOutput(0)).toBe('0,0');
    });
  });

  describe('mmToPx', () => {
    it('converts correctly', () => {
      expect(mmToPx(25.4, 300)).toBe(300);
      expect(mmToPx(210, 300)).toBeCloseTo(2480.31, 2);
    });
  });

  describe('calculateNet (A4 Net)', () => {
    it('calculates A4 net dimensions at 300 PPI', () => {
      const net = calculateNet(210, 297, 300);
      expect(formatOutput(net.widthPx)).toBe('2480,3');
      expect(formatOutput(net.heightPx)).toBe('3507,9');
    });
    
    it('calculates A4 net dimensions at 96 PPI', () => {
      const net = calculateNet(210, 297, 96);
      expect(formatOutput(net.widthPx)).toBe('793,7');
      expect(formatOutput(net.heightPx)).toBe('1122,5');
    });

    it('calculates Landscape A4', () => {
      const net = calculateNet(297, 210, 300);
      expect(formatOutput(net.widthPx)).toBe('3507,9');
      expect(formatOutput(net.heightPx)).toBe('2480,3');
    });
  });

  describe('calculateGross (A4 Gross)', () => {
    it('calculates A4 gross dimensions with 2mm bleed at 300 PPI', () => {
      const gross = calculateGross(210, 297, 2, 300);
      expect(formatOutput(gross.widthPx)).toBe('2527,6');
      expect(formatOutput(gross.heightPx)).toBe('3555,1');
    });
  });

  describe('calculateSafeArea', () => {
    it('calculates safe area', () => {
      const safe = calculateSafeArea(210, 297, 5);
      expect(safe.safeWidthMm).toBe(200);
      expect(safe.safeHeightMm).toBe(287);
    });
  });
});
