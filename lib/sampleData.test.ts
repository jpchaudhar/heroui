/**
 * Test Suite: KPIs computation and sample dataset validation
 *
 * Testing framework note:
 * - This suite uses Jest-style APIs (describe/test/it/expect) without importing framework-specific globals.
 * - It should run under Jest (ts-jest) or Vitest (with globals) without extra dependencies.
 * - If your runner requires explicit imports (e.g., Vitest without globals), you may `import { describe, it, test, expect, beforeAll } from "vitest";`
 *   at the top of this file; for Jest you can import from "@jest/globals" if needed.
 *
 * Scope:
 * - Primary focus is on computeKpis and the sample monthlyMetrics data in lib/sampleData.ts.
 * - Covers happy paths, edge cases (division by zero handling), and failure conditions (empty input).
 */

let computeKpis: any;
let sampleMonthlyMetrics: any[];

beforeAll(async () => {
  // Dynamic import to avoid duplicating top-level imports if we are appending to an existing file.
  const mod: any = await import("./sampleData");
  computeKpis = mod.computeKpis;
  sampleMonthlyMetrics = mod.monthlyMetrics;
});

function mm(
  month: string,
  unitsSold: number,
  revenue: number,
  visitors: number,
  orders: number,
  inventoryOnHand: number,
  adSpend: number
) {
  return { month, unitsSold, revenue, visitors, orders, inventoryOnHand, adSpend };
}

describe("computeKpis()", () => {
  test("computes expected KPIs for the provided sample dataset (happy path)", () => {
    const r = computeKpis(sampleMonthlyMetrics);

    // Latest record in sample data (as of the provided source)
    // month: '2025-06', unitsSold: 1420, revenue: 42600, visitors: 65500, orders: 1350, inventoryOnHand: 2600
    expect(r).toHaveProperty("revenue", 42600);
    expect(r).toHaveProperty("orders", 1350);
    expect(r).toHaveProperty("inventoryOnHand", 2600);

    // conversionRate = (orders / visitors) * 100
    // 1350 / 65500 * 100 = 2.0610687022900763...
    expect(r.conversionRate).toBeCloseTo(2.0610687023, 6);

    // revenue growth pct:
    // last 3 revenues: 37800 + 40200 + 42600 = 120600
    // prev 3 revenues: 32400 + 33600 + 36000 = 102000
    // ((120600 - 102000) / 102000) * 100 = 18.23529411764706...
    expect(r.revenueGrowthPct).toBeCloseTo(18.2352941176, 6);

    // inventoryTurnover = unitsSold / max(inventoryOnHand, 1) (since unitsSold > 0)
    // 1420 / 2600 = 0.5461538461538461...
    expect(r.inventoryTurnover).toBeCloseTo(0.5461538461, 6);
  });

  test("yields 0% conversionRate when latest visitors is zero (edge case)", () => {
    const data = [mm("2025-07", 10, 1000, 0, 10, 5, 200)];
    const r = computeKpis(data);
    expect(r.conversionRate).toBe(0);
    // With no previous 3-month window, growth should be 0
    expect(r.revenueGrowthPct).toBe(0);
    // Inventory turnover should still compute normally
    expect(r.inventoryTurnover).toBeCloseTo(2, 6); // 10 / 5
  });

  test("uses divisor of 1 when inventoryOnHand is zero and unitsSold > 0 (avoids division by zero)", () => {
    const data = [mm("2025-07", 7, 700, 100, 7, 0, 50)];
    const r = computeKpis(data);
    expect(r.inventoryTurnover).toBeCloseTo(7, 6); // 7 / max(0,1) = 7
  });

  test("returns 0 inventoryTurnover when unitsSold is zero (edge case)", () => {
    const data = [mm("2025-07", 0, 500, 100, 0, 0, 50)];
    const r = computeKpis(data);
    expect(r.inventoryTurnover).toBe(0);
    // Conversion is also 0 given orders 0, visitors > 0
    expect(r.conversionRate).toBe(0);
  });

  test("sets revenueGrowthPct to 0 when fewer than 6 months are present (no previous 3-month window)", () => {
    const data = [
      mm("2024-01", 1, 100, 100, 10, 10, 1),
      mm("2024-02", 1, 200, 100, 10, 10, 1),
      mm("2024-03", 1, 300, 100, 10, 10, 1),
    ];
    const r = computeKpis(data);
    expect(r.revenue).toBe(300);
    expect(r.revenueGrowthPct).toBe(0);
  });

  test("computes revenueGrowthPct correctly when a previous 3-month window exists", () => {
    // prev3 revenues: 75 + 75 + 75 = 225
    // last3 revenues: 100 + 100 + 100 = 300
    // growth = (300-225)/225*100 = 33.33333333333333
    const data = [
      mm("2025-01", 1, 75, 100, 10, 10, 1),
      mm("2025-02", 1, 75, 100, 10, 10, 1),
      mm("2025-03", 1, 75, 100, 10, 10, 1),
      mm("2025-04", 1, 100, 100, 10, 10, 1),
      mm("2025-05", 1, 100, 100, 10, 10, 1),
      mm("2025-06", 1, 100, 100, 10, 10, 1),
    ];
    const r = computeKpis(data);
    expect(r.revenueGrowthPct).toBeCloseTo(33.3333333333, 6);
  });

  test("throws a helpful error when called with an empty array (failure case)", () => {
    // At runtime, accessing latest from empty array will cause a TypeError; assert a throw occurs.
    expect(() => computeKpis([] as any)).toThrow();
  });
});

describe("monthlyMetrics dataset (sanity checks)", () => {
  test("contains 12 months and is strictly increasing by YYYY-MM", () => {
    expect(Array.isArray(sampleMonthlyMetrics)).toBe(true);
    const months = sampleMonthlyMetrics.map((m: any) => m.month);
    expect(months.length).toBe(12);

    // Uniqueness
    expect(new Set(months).size).toBe(months.length);

    // Validate formatting and increasing order
    const yyyyMm = /^\d{4}-\d{2}$/;
    months.forEach((m: string) => expect(yyyyMm.test(m)).toBe(true));
    for (let i = 1; i < months.length; i++) {
      expect(months[i] > months[i - 1]).toBe(true);
    }
  });

  test("each record has non-negative numeric fields with expected keys", () => {
    const numericKeys = ["unitsSold", "revenue", "visitors", "orders", "inventoryOnHand", "adSpend"];
    for (const rec of sampleMonthlyMetrics) {
      expect(typeof rec.month).toBe("string");
      for (const k of numericKeys) {
        expect(Object.prototype.hasOwnProperty.call(rec, k)).toBe(true);
        expect(typeof rec[k]).toBe("number");
        // Ensure values are finite and non-negative
        expect(Number.isFinite(rec[k])).toBe(true);
        expect(rec[k]).toBeGreaterThanOrEqual(0);
      }
    }
  });
});