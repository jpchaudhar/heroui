/**
 * Tests for generateForecast in lib/forecast.ts
 * Framework: Jest
 */
import { generateForecast } from './forecast';

describe('generateForecast (Jest variant)', () => {
  it('returns an array of correct length and indexes for a positive horizon', () => {
    const history = [10, 12, 14];
    const horizon = 5;
    const result = generateForecast(history, horizon);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(horizon);

    const lastIndex = history.length;
    result.forEach((pt, i) => {
      expect(pt.index).toBe(lastIndex + (i + 1));
      expect(pt.value).toBeGreaterThanOrEqual(0);
    });
  });

  it('handles an empty history gracefully (edge case)', () => {
    const history: number[] = [];
    const horizon = 3;
    const result = generateForecast(history, horizon);
    expect(result).toHaveLength(horizon);
    for (const pt of result) {
      expect(pt.value).toBe(0);
    }
    expect(result[0].index).toBe(1);
    expect(result[1].index).toBe(2);
    expect(result[2].index).toBe(3);
  });

  it('forecasts an increasing trend for a linear increasing series', () => {
    const history = [2, 4, 6, 8, 10];
    const res = generateForecast(history, 3);
    expect(res).toHaveLength(3);
    expect(res[0].value).toBeGreaterThan(0);
    expect(res[1].value).toBeGreaterThan(res[0].value);
    expect(res[2].value).toBeGreaterThan(res[1].value);
  });

  it('floors negative forecasts at zero for decreasing series', () => {
    const history = [8, 6, 4, 2, 0];
    const res = generateForecast(history, 4);
    for (const pt of res) {
      expect(pt.value).toBeGreaterThanOrEqual(0);
    }
  });

  it('handles zeros in history without NaN seasonality', () => {
    const history = [0, 0, 10, 0, 0, 0];
    const res = generateForecast(history, 2);
    expect(res).toHaveLength(2);
    res.forEach((pt) => {
      expect(Number.isFinite(pt.value)).toBe(true);
      expect(pt.value).toBeGreaterThanOrEqual(0);
    });
  });

  it('window behavior: small and larger histories', () => {
    let history = [1, 2, 3, 4, 5];
    let res = generateForecast(history, 1);
    expect(res[0].value).toBeGreaterThan(0);

    history = Array.from({ length: 12 }, (_, i) => i + 1);
    res = generateForecast(history, 1);
    expect(res[0].value).toBeGreaterThan(0);
  });

  it('constant series produces roughly constant forecasts', () => {
    const history = [5, 5, 5, 5, 5, 5];
    const res3 = generateForecast(history, 3);
    expect(res3).toHaveLength(3);
    res3.forEach((pt) => {
      expect(pt.value).toBeGreaterThan(4.5);
      expect(pt.value).toBeLessThan(5.5);
    });
  });

  it('random noise produces finite non-negative values', () => {
    const history = Array.from({ length: 50 }, () => Math.random() * 100);
    const res = generateForecast(history, 10);
    expect(res).toHaveLength(10);
    res.forEach((pt) => {
      expect(Number.isFinite(pt.value)).toBe(true);
      expect(pt.value).toBeGreaterThanOrEqual(0);
    });
  });

  it('horizon zero -> empty forecast', () => {
    const history = [1, 2, 3];
    const res = generateForecast(history, 0);
    expect(res).toEqual([]);
  });

  it('indexes start at lastIndex + 1', () => {
    const history = [1, 2, 3, 4];
    const horizon = 4;
    const res = generateForecast(history, horizon);
    const lastIndex = history.length;
    for (let i = 0; i < horizon; i++) {
      expect(res[i].index).toBe(lastIndex + (i + 1));
    }
  });

  it('handles negative history values with non-negative forecasts', () => {
    const history = [-5, -10, -3, 0, 2];
    const res = generateForecast(history, 3);
    res.forEach((pt) => {
      expect(pt.value).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(pt.value)).toBe(true);
    });
  });
});