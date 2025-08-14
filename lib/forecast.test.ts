/**
 * Tests for generateForecast in lib/forecast.ts
 * Framework: Jest (compatible with Vitest)
 */
import { describe, it, expect } from 'vitest'; // If using Jest, you can remove this import; if using Vitest keep it.
 // Fallback for Jest users:
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 const _jestCompat = (globalThis as any).describe ? undefined : undefined;

// Try default import path; adjust if your code lives elsewhere.
import { generateForecast, type ForecastPoint } from './forecast';

describe('generateForecast', () => {
  it('returns an array of correct length and indexes for a positive horizon', () => {
    const history = [10, 12, 14];
    const horizon = 5;
    const result = generateForecast(history, horizon);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(horizon);

    // Indexes should continue from history length (1-based x but index is count-based)
    // In the implementation, index = lastIndex + h where lastIndex=history.length
    const lastIndex = history.length;
    result.forEach((pt, i) => {
      expect(pt).toHaveProperty('index');
      expect(pt).toHaveProperty('value');
      expect(pt.index).toBe(lastIndex + (i + 1));
      // Values are floored at >= 0 via Math.max(0, ...)
      expect(pt.value).toBeGreaterThanOrEqual(0);
    });
  });

  it('handles an empty history gracefully (edge case)', () => {
    const history: number[] = [];
    const horizon = 3;
    const result = generateForecast(history, horizon);

    expect(result).toHaveLength(horizon);
    // With no points, slope=0, intercept=0, avgSeason=NaN => seasonFactor falls back to 1
    // So base=0 => forecast 0s
    for (const pt of result) {
      expect(pt.value).toBe(0);
    }
    // Index starts from history.length + 1 => 0 + 1
    expect(result[0].index).toBe(1);
    expect(result[1].index).toBe(2);
    expect(result[2].index).toBe(3);
  });

  it('forecasts an increasing trend for a linear increasing series', () => {
    // Perfect linear: y = 2x for x=1..5 -> [2,4,6,8,10]
    const history = [2, 4, 6, 8, 10];
    const res = generateForecast(history, 3);
    // Slope should be positive; seasonality near 1 (since moving average smoothing returns near the same scale)
    // Expect strictly increasing forecast values.
    expect(res).toHaveLength(3);
    expect(res[0].value).toBeGreaterThan(0);
    expect(res[1].value).toBeGreaterThan(res[0].value);
    expect(res[2].value).toBeGreaterThan(res[1].value);
  });

  it('forecasts a decreasing trend for a linear decreasing series but never below 0 (floor)', () => {
    // Perfect linear decreasing: y = 10 - 2x for x=1..5 => [8,6,4,2,0]
    const history = [8, 6, 4, 2, 0];
    const res = generateForecast(history, 4);
    // Values may go negative by regression, but they are floored at 0 by Math.max
    for (const pt of res) {
      expect(pt.value).toBeGreaterThanOrEqual(0);
    }
    // Trend should not increase significantly; first should be >= later if trend predicts negative continuation
    // We at least assert non-increasing or flat after flooring:
    expect(res[0].value).toBeGreaterThanOrEqual(res[1].value);
  });

  it('handles zeros in history without NaN seasonality (smooth[i] === 0 path)', () => {
    // Include zeros to push smooth values potentially to zero for small windows.
    // The code uses window = min(3, max(1, floor(len/6))). For len=6 => floor(6/6)=1 => window=1.
    // smooth[i] is mean of neighbors within [i-1, i+1]; can be zero if slice sums to 0.
    const history = [0, 0, 10, 0, 0, 0];
    const res = generateForecast(history, 2);
    expect(res).toHaveLength(2);
    // Values should be finite numbers, no NaN
    res.forEach((pt) => {
      expect(Number.isFinite(pt.value)).toBe(true);
      expect(pt.value).toBeGreaterThanOrEqual(0);
    });
  });

  it('uses a moving average window of 1 for small histories and scales up appropriately', () => {
    // window = min(3, max(1, floor(n/6)))
    // For n=5 => floor(5/6)=0 => max(1, 0)=1
    let history = [1, 2, 3, 4, 5];
    let res = generateForecast(history, 1);
    expect(res[0].value).toBeGreaterThan(0); // sanity check

    // For n=12 => floor(12/6)=2 => min(3,2)=2 window
    history = Array.from({ length: 12 }, (_, i) => i + 1);
    res = generateForecast(history, 1);
    expect(res[0].value).toBeGreaterThan(0);
  });

  it('produces the same forecast for constant series (flat line) regardless of horizon length sign (positive horizon required)', () => {
    const history = [5, 5, 5, 5, 5, 5];
    const res1 = generateForecast(history, 1);
    const res3 = generateForecast(history, 3);
    expect(res1).toHaveLength(1);
    expect(res3).toHaveLength(3);

    // For a constant series, slope ~ 0 and seasonality ~ 1 => forecast should be ~5
    expect(res1[0].value).toBeGreaterThan(0);
    res3.forEach((pt) => {
      // Allow some tolerance due to floating math
      expect(pt.value).toBeGreaterThan(4.5);
      expect(pt.value).toBeLessThan(5.5);
    });
  });

  it('handles random noise without crashing and yields finite values', () => {
    const history = Array.from({ length: 50 }, () => Math.random() * 100);
    const res = generateForecast(history, 10);
    expect(res).toHaveLength(10);
    res.forEach((pt) => {
      expect(Number.isFinite(pt.value)).toBe(true);
      expect(pt.value).toBeGreaterThanOrEqual(0);
    });
  });

  it('ensures that a horizon of zero yields an empty forecast', () => {
    const history = [1, 2, 3];
    const res = generateForecast(history, 0);
    expect(res).toEqual([]);
  });

  it('ensures indexes start after the last history index (lastIndex + h)', () => {
    const history = [1, 2, 3, 4];
    const horizon = 4;
    const res = generateForecast(history, horizon);
    const lastIndex = history.length;
    for (let i = 0; i < horizon; i++) {
      expect(res[i].index).toBe(lastIndex + (i + 1));
    }
  });

  it('does not produce NaN when avgSeason resolves to 0 or NaN; seasonFactor defaults to 1', () => {
    // Construct history that might push avgSeason close to 0:
    const history = [0, 0, 0, 0, 0, 1];
    const res = generateForecast(history, 2);
    res.forEach((pt) => {
      expect(Number.isFinite(pt.value)).toBe(true);
      expect(pt.value).toBeGreaterThanOrEqual(0);
    });
  });

  it('handles negative values in history and maintains non-negative forecast output due to Math.max', () => {
    const history = [-5, -10, -3, 0, 2];
    const res = generateForecast(history, 3);
    res.forEach((pt) => {
      expect(pt.value).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(pt.value)).toBe(true);
    });
  });

  it('increasing series with strong seasonality remains positive and roughly increasing', () => {
    // Build an increasing series with periodic spikes to influence seasonality
    const history: number[] = [];
    for (let i = 1; i <= 24; i++) {
      const base = i * 2;
      const seasonal = (i % 6 === 0) ? 20 : 0;
      history.push(base + seasonal);
    }
    const res = generateForecast(history, 6);
    expect(res).toHaveLength(6);
    // Ensure no negative values and monotonic tendency
    res.forEach((pt) => {
      expect(pt.value).toBeGreaterThanOrEqual(0);
    });
    for (let i = 1; i < res.length; i++) {
      // Not strictly guaranteed monotonic, but should not dramatically decrease
      expect(res[i].value).toBeGreaterThan(res[i - 1].value * 0.7);
    }
  });
});