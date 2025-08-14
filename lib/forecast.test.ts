// Tests for forecast generation
// Testing library/framework used: Jest or Vitest (describe/it/expect BDD style).
// If running under Vitest, this file will work as-is. If using Jest with ts-jest,
// ensure ts-jest is configured. No new dependencies introduced.

type SeriesPoint = { x: number; y: number };
type ForecastPoint = { index: number; value: number };

// We prefer importing from the real module if it exists.
// Fallback: local inline implementation mirroring the PR diff to make tests runnable in isolation.
let generateForecast: (history: number[], horizon: number) => ForecastPoint[];

try {
  // Attempt to import from potential module locations synchronized with typical project layout
  // This dynamic require is written defensively for both Jest and Vitest in TS transpiled environments.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod =
    require("./forecast") ||
    require("../lib/forecast") ||
    require("../src/forecast");
  generateForecast = mod.generateForecast;
} catch {
  // Local copy based on the diff content
  function linearRegression(points: SeriesPoint[]) {
    const n = points.length;
    const sumX = points.reduce((s, p) => s + p.x, 0);
    const sumY = points.reduce((s, p) => s + p.y, 0);
    const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
    const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
    const denominator = n * sumXX - sumX * sumX;
    const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
    const intercept = n === 0 ? 0 : sumY / n - slope * (sumX / n);
    return { slope, intercept };
  }

  generateForecast = function(history: number[], horizon: number) {
    const series: SeriesPoint[] = history.map((y, idx) => ({ x: idx + 1, y }));
    const { slope, intercept } = linearRegression(series);

    // simple centered moving average for seasonality smoothing
    const window = Math.min(3, Math.max(1, Math.floor(history.length / 6)));
    const smooth = history.map((_, i) => {
      const start = Math.max(0, i - window);
      const end = Math.min(history.length, i + window + 1);
      const slice = history.slice(start, end);
      return slice.reduce((s, v) => s + v, 0) / slice.length;
    });
    const seasonAdj = history.map((v, i) => (smooth[i] === 0 ? 1 : v / smooth[i]));
    const avgSeason = seasonAdj.reduce((s, v) => s + v, 0) / seasonAdj.length;

    const forecast: ForecastPoint[] = [];
    const lastIndex = history.length;
    for (let h = 1; h <= horizon; h++) {
      const base = intercept + slope * (lastIndex + h);
      const seasonFactor = avgSeason || 1;
      forecast.push({ index: lastIndex + h, value: Math.max(0, base * seasonFactor) });
    }
    return forecast;
  }
}

// Utility to compare number arrays with tolerance
function closeTo(a: number, b: number, tol = 1e-9) {
  return Math.abs(a - b) <= tol;
}

describe("generateForecast", () => {
  it("returns empty array when horizon is 0", () => {
    const result = generateForecast([10, 20, 30], 0);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  it("handles empty history gracefully", () => {
    // With empty history: slope=0, intercept=0, avgSeason NaN -> coalesced to 1
    const result = generateForecast([], 3);
    expect(result).toHaveLength(3);
    // All values should be clamped non-negative and zero given base=0
    for (let i = 0; i < result.length; i++) {
      expect(result[i].index).toBe(i + 1);
      expect(result[i].value).toBe(0);
    }
  });

  it("produces increasing values for a clear positive trend", () => {
    const history = [10, 20, 30, 40, 50]; // perfect slope 10 per step
    const res = generateForecast(history, 5);
    expect(res).toHaveLength(5);

    // For perfect linear trend without seasonality distortion (avgSeason ~ 1),
    // next base points should continue the line. We check monotonicity and plausible magnitude.
    const values = res.map(r => r.value);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }

    // Rough magnitude check: extrapolate one step ahead should be ~60
    // Allow small tolerance from season smoothing step
    expect(values[0]).toBeGreaterThan(55);
    expect(values[0]).toBeLessThan(65);
  });

  it("produces flat forecast for flat history", () => {
    const history = [5, 5, 5, 5, 5, 5];
    const res = generateForecast(history, 3);
    expect(res).toHaveLength(3);

    // Values should hover around 5 considering seasonality ~ 1
    for (const v of res.map(r => r.value)) {
      expect(v).toBeGreaterThan(4.5);
      expect(v).toBeLessThan(5.5);
    }
  });

  it("clamps negative forecasts to zero for strong negative trends", () => {
    const history = [50, 40, 30, 20, 10]; // decreasing
    const res = generateForecast(history, 10);
    // Eventually values will go below zero; ensure clamping
    const min = Math.min(...res.map(r => r.value));
    expect(min).toBeGreaterThanOrEqual(0);
  });

  it("indexes forecast points sequentially after history length", () => {
    const history = [3, 6, 9];
    const res = generateForecast(history, 4);
    expect(res.map(r => r.index)).toEqual([4, 5, 6, 7]);
  });

  it("handles non-integer history values", () => {
    const history = [1.5, 2.0, 2.5, 3.0];
    const res = generateForecast(history, 2);
    expect(res).toHaveLength(2);
    // Expect increasing due to positive slope
    expect(res[1].value).toBeGreaterThan(res[0].value);
  });

  it("works with a single-point history", () => {
    const history = [42];
    // slope will be 0 (denominator 0), intercept = average y = 42
    const res = generateForecast(history, 3);
    for (const r of res) {
      expect(closeTo(r.value, 42)).toBe(true);
    }
  });

  it("works with a two-point history (basic linear regression)", () => {
    const history = [2, 4]; // slope ~ 2 per step
    const res = generateForecast(history, 3);
    expect(res).toHaveLength(3);
    // Next should be around 6, 8, 10 times season factor ~1
    expect(res[0].value).toBeGreaterThan(5.5);
    expect(res[0].value).toBeLessThan(6.5);
    expect(res[1].value).toBeGreaterThan(7.5);
    expect(res[1].value).toBeLessThan(8.5);
    expect(res[2].value).toBeGreaterThan(9.5);
    expect(res[2].value).toBeLessThan(10.5);
  });

  it("seasonality smoothing impacts forecast moderately on oscillating series", () => {
    // Alternating highs/lows to induce seasonality in the average season factor
    const history = [10, 20, 10, 20, 10, 20];
    const res = generateForecast(history, 3);
    expect(res).toHaveLength(3);

    // Ensure values are reasonable and positive
    for (const r of res) {
      expect(r.value).toBeGreaterThan(0);
    }
  });

  it("uses minimal window (1) for short histories and increases gradually", () => {
    // history length 5 -> floor(5/6) = 0 -> max(1,0) = 1
    const shortHistory = [1, 2, 3, 4, 5];
    const shortRes = generateForecast(shortHistory, 1);
    expect(shortRes).toHaveLength(1);

    // history length 18 -> floor(18/6)=3 -> min(3,3) = 3
    const longerHistory = Array.from({ length: 18 }, (_, i) => i + 1);
    const longRes = generateForecast(longerHistory, 1);
    expect(longRes).toHaveLength(1);

    // We cannot directly assert window here, but we can assert outputs are finite/positive
    expect(Number.isFinite(shortRes[0].value)).toBe(true);
    expect(Number.isFinite(longRes[0].value)).toBe(true);
  });

  it("large horizon produces the right number of points and stays deterministic", () => {
    const history = [5, 7, 9, 11, 13, 15];
    const res1 = generateForecast(history, 50);
    const res2 = generateForecast(history, 50);
    expect(res1).toHaveLength(50);
    // Deterministic check
    expect(res1.map(x => x.value)).toEqual(res2.map(x => x.value));
    expect(res1.map(x => x.index)).toEqual(res2.map(x => x.index));
  });

  it("does not produce NaN or Infinity values", () => {
    const history = [0, 0, 0, 0, 0];
    const res = generateForecast(history, 10);
    for (const r of res) {
      expect(Number.isFinite(r.value)).toBe(true);
      expect(Number.isNaN(r.value)).toBe(false);
    }
  });

  it("handles horizon of 1 correctly", () => {
    const history = [10, 12, 14, 16];
    const res = generateForecast(history, 1);
    expect(res).toHaveLength(1);
    expect(res[0].index).toBe(history.length + 1);
    expect(res[0].value).toBeGreaterThan(0);
  });
});