export type MonthlyMetrics = {
  month: string; // YYYY-MM
  unitsSold: number;
  revenue: number; // USD
  visitors: number;
  orders: number;
  inventoryOnHand: number;
  adSpend: number; // USD
};

export const monthlyMetrics: MonthlyMetrics[] = [
  { month: '2024-07', unitsSold: 860, revenue: 25800, visitors: 48000, orders: 820, inventoryOnHand: 4200, adSpend: 5200 },
  { month: '2024-08', unitsSold: 910, revenue: 27300, visitors: 50500, orders: 865, inventoryOnHand: 4100, adSpend: 5400 },
  { month: '2024-09', unitsSold: 975, revenue: 29250, visitors: 53000, orders: 930, inventoryOnHand: 3950, adSpend: 5600 },
  { month: '2024-10', unitsSold: 1020, revenue: 30600, visitors: 54500, orders: 980, inventoryOnHand: 3800, adSpend: 5800 },
  { month: '2024-11', unitsSold: 1100, revenue: 33000, visitors: 60000, orders: 1060, inventoryOnHand: 3600, adSpend: 6200 },
  { month: '2024-12', unitsSold: 1400, revenue: 42000, visitors: 80000, orders: 1330, inventoryOnHand: 3400, adSpend: 9000 },
  { month: '2025-01', unitsSold: 1080, revenue: 32400, visitors: 56000, orders: 1040, inventoryOnHand: 3200, adSpend: 6000 },
  { month: '2025-02', unitsSold: 1120, revenue: 33600, visitors: 57000, orders: 1070, inventoryOnHand: 3150, adSpend: 6100 },
  { month: '2025-03', unitsSold: 1200, revenue: 36000, visitors: 59000, orders: 1140, inventoryOnHand: 3000, adSpend: 6400 },
  { month: '2025-04', unitsSold: 1260, revenue: 37800, visitors: 60500, orders: 1200, inventoryOnHand: 2900, adSpend: 6600 },
  { month: '2025-05', unitsSold: 1340, revenue: 40200, visitors: 63000, orders: 1270, inventoryOnHand: 2750, adSpend: 6900 },
  { month: '2025-06', unitsSold: 1420, revenue: 42600, visitors: 65500, orders: 1350, inventoryOnHand: 2600, adSpend: 7200 },
];

export function computeKpis(data: MonthlyMetrics[]) {
  const latest = data[data.length - 1];
  const revenueLast3 = data.slice(-3).reduce((s, d) => s + d.revenue, 0);
  const revenuePrev3 = data.slice(-6, -3).reduce((s, d) => s + d.revenue, 0);
  const revenueGrowthPct = revenuePrev3 === 0 ? 0 : ((revenueLast3 - revenuePrev3) / revenuePrev3) * 100;
  const orders = latest.orders;
  const conversionRate = latest.visitors === 0 ? 0 : (orders / latest.visitors) * 100;
  const inventoryTurnover = latest.unitsSold === 0 ? 0 : latest.unitsSold / Math.max(latest.inventoryOnHand, 1);
  return {
    revenue: latest.revenue,
    orders,
    conversionRate,
    inventoryOnHand: latest.inventoryOnHand,
    revenueGrowthPct,
    inventoryTurnover,
  };
}

// TESTS FOR computeKpis
// Note: Tests use a Jest/Vitest-style API (describe/test/expect).
// If the repository uses Jest, run via `jest` or `npm test`.
// If it uses Vitest, run via `vitest`. Both share the same global APIs used below.

describe('computeKpis with provided monthlyMetrics (happy path)', () => {
  test('returns KPIs based on the latest month', () => {
    const result = computeKpis(monthlyMetrics);
    const latest = monthlyMetrics[monthlyMetrics.length - 1];
    expect(result.revenue).toBe(latest.revenue);
    expect(result.orders).toBe(latest.orders);
    expect(result.inventoryOnHand).toBe(latest.inventoryOnHand);

    // Conversion rate = (orders / visitors) * 100
    const expectedConversion = latest.visitors === 0 ? 0 : (latest.orders / latest.visitors) * 100;
    expect(result.conversionRate).toBeCloseTo(expectedConversion, 10);

    // Inventory turnover = unitsSold / max(inventoryOnHand, 1) unless unitsSold=0 -> 0
    const expectedTurnover = latest.unitsSold === 0 ? 0 : latest.unitsSold / Math.max(latest.inventoryOnHand, 1);
    expect(result.inventoryTurnover).toBeCloseTo(expectedTurnover, 10);

    // Revenue growth pct compares last 3 vs previous 3
    const recent = monthlyMetrics.slice(-3).reduce((s, d) => s + d.revenue, 0);
    const prior = monthlyMetrics.slice(-6, -3).reduce((s, d) => s + d.revenue, 0);
    const expectedGrowth = prior === 0 ? 0 : ((recent - prior) / prior) * 100;
    expect(result.revenueGrowthPct).toBeCloseTo(expectedGrowth, 10);
  });

  test('does not mutate the input array or objects', () => {
    const clone = monthlyMetrics.map((m) => ({ ...m }));
    computeKpis(clone);
    expect(clone).toEqual(monthlyMetrics);
  });
});

describe('computeKpis edge cases for data length and zero guards', () => {
  test('with fewer than 3 months: revenuePrev3=0 => revenueGrowthPct=0', () => {
    const data = [
      { month: '2025-05', unitsSold: 10, revenue: 100, visitors: 100, orders: 10, inventoryOnHand: 5, adSpend: 1 },
      { month: '2025-06', unitsSold: 20, revenue: 200, visitors: 200, orders: 20, inventoryOnHand: 10, adSpend: 2 },
    ];
    const result = computeKpis(data as any);
    expect(result.revenue).toBe(200);
    expect(result.orders).toBe(20);
    expect(result.conversionRate).toBeCloseTo((20 / 200) * 100, 10); // clarity check
    // last3 = 100 + 200 = 300, prev3 = 0 -> growth 0 by guard
    expect(result.revenueGrowthPct).toBe(0);
  });

  test('with between 3 and 5 months: prev3 slice produces empty or partial -> guard applies when sum=0', () => {
    const data = [
      { month: '2025-02', unitsSold: 5, revenue: 50, visitors: 50, orders: 5, inventoryOnHand: 5, adSpend: 0 },
      { month: '2025-03', unitsSold: 6, revenue: 60, visitors: 60, orders: 6, inventoryOnHand: 6, adSpend: 0 },
      { month: '2025-04', unitsSold: 7, revenue: 70, visitors: 70, orders: 7, inventoryOnHand: 7, adSpend: 0 },
      { month: '2025-05', unitsSold: 8, revenue: 80, visitors: 80, orders: 8, inventoryOnHand: 8, adSpend: 0 },
      { month: '2025-06', unitsSold: 9, revenue: 90, visitors: 90, orders: 9, inventoryOnHand: 9, adSpend: 0 },
    ];
    const result = computeKpis(data as any);
    const recent = 70 + 80 + 90; // last 3 months
    const prior = 0; // slice(-6,-3) is empty
    expect(result.revenueGrowthPct).toBe(0);
    expect(result.revenue).toBe(90);
    expect(result.orders).toBe(9);
    expect(result.inventoryOnHand).toBe(9);
    expect(result.conversionRate).toBeCloseTo((9 / 90) * 100, 10);
    const expectedTurnover = 9 / Math.max(9, 1);
    expect(result.inventoryTurnover).toBeCloseTo(expectedTurnover, 10);
  });

  test('with exactly 6 months: growth compares months 4-6 vs 1-3', () => {
    const data = [
      { month: '2025-01', unitsSold: 1, revenue: 100, visitors: 100, orders: 10, inventoryOnHand: 10, adSpend: 0 },
      { month: '2025-02', unitsSold: 2, revenue: 200, visitors: 200, orders: 20, inventoryOnHand: 10, adSpend: 0 },
      { month: '2025-03', unitsSold: 3, revenue: 300, visitors: 300, orders: 30, inventoryOnHand: 10, adSpend: 0 },
      { month: '2025-04', unitsSold: 4, revenue: 400, visitors: 400, orders: 40, inventoryOnHand: 10, adSpend: 0 },
      { month: '2025-05', unitsSold: 5, revenue: 500, visitors: 500, orders: 50, inventoryOnHand: 10, adSpend: 0 },
      { month: '2025-06', unitsSold: 6, revenue: 600, visitors: 600, orders: 60, inventoryOnHand: 10, adSpend: 0 },
    ] as any;
    const result = computeKpis(data);
    const prior = 100 + 200 + 300;    // 600
    const recent = 400 + 500 + 600;   // 1500
    const expectedGrowth = ((recent - prior) / prior) * 100; // (900/600)*100 = 150%
    expect(result.revenueGrowthPct).toBeCloseTo(expectedGrowth, 10);
    expect(result.revenue).toBe(600);
    expect(result.orders).toBe(60);
    expect(result.inventoryOnHand).toBe(10);
    expect(result.conversionRate).toBeCloseTo((60 / 600) * 100, 10);
    expect(result.inventoryTurnover).toBeCloseTo(6 / 10, 10);
  });

  test('conversionRate guard: latest.visitors === 0 -> 0', () => {
    const data = [
      { month: '2025-04', unitsSold: 1, revenue: 10, visitors: 10, orders: 1, inventoryOnHand: 10, adSpend: 0 },
      { month: '2025-05', unitsSold: 2, revenue: 20, visitors: 20, orders: 2, inventoryOnHand: 10, adSpend: 0 },
      { month: '2025-06', unitsSold: 3, revenue: 30, visitors: 0,  orders: 3, inventoryOnHand: 10, adSpend: 0 },
    ] as any;
    const result = computeKpis(data);
    expect(result.conversionRate).toBe(0);
  });

  test('inventoryTurnover guard: latest.unitsSold === 0 -> 0 (even if inventoryOnHand is 0)', () => {
    const data = [
      { month: '2025-04', unitsSold: 10, revenue: 100, visitors: 100, orders: 10, inventoryOnHand: 10, adSpend: 0 },
      { month: '2025-05', unitsSold: 5,  revenue: 100, visitors: 100, orders: 10, inventoryOnHand: 10, adSpend: 0 },
      { month: '2025-06', unitsSold: 0,  revenue: 100, visitors: 100, orders: 10, inventoryOnHand: 0,  adSpend: 0 },
    ] as any;
    const result = computeKpis(data);
    expect(result.inventoryTurnover).toBe(0);
  });

  test('inventoryOnHand zero: denominator max(inventoryOnHand,1) -> turnover equals unitsSold', () => {
    const data = [
      { month: '2025-04', unitsSold: 1, revenue: 10, visitors: 10, orders: 1, inventoryOnHand: 10, adSpend: 0 },
      { month: '2025-05', unitsSold: 2, revenue: 20, visitors: 20, orders: 2, inventoryOnHand: 10, adSpend: 0 },
      { month: '2025-06', unitsSold: 7, revenue: 30, visitors: 30, orders: 3, inventoryOnHand: 0,  adSpend: 0 },
    ] as any;
    const result = computeKpis(data);
    expect(result.inventoryTurnover).toBeCloseTo(7 / 1, 10);
  });

  test('inventoryOnHand < 1 but non-zero (e.g., 0.5): denominator uses the actual value since it is > 0', () => {
    const data = [
      { month: '2025-04', unitsSold: 1, revenue: 10, visitors: 10, orders: 1, inventoryOnHand: 10,  adSpend: 0 },
      { month: '2025-05', unitsSold: 2, revenue: 20, visitors: 20, orders: 2, inventoryOnHand: 10,  adSpend: 0 },
      { month: '2025-06', unitsSold: 7, revenue: 30, visitors: 30, orders: 3, inventoryOnHand: 0.5, adSpend: 0 },
    ] as any;
    const result = computeKpis(data);
    expect(result.inventoryTurnover).toBeCloseTo(7 / 0.5, 10);
  });
});

describe('computeKpis revenue growth scenarios', () => {
  test('revenuePrev3 > 0 and revenueLast3 < revenuePrev3 leads to negative growth', () => {
    const data = [
      { month: '2025-01', unitsSold: 1, revenue: 300, visitors: 10, orders: 1, inventoryOnHand: 1, adSpend: 0 },
      { month: '2025-02', unitsSold: 1, revenue: 200, visitors: 10, orders: 1, inventoryOnHand: 1, adSpend: 0 },
      { month: '2025-03', unitsSold: 1, revenue: 100, visitors: 10, orders: 1, inventoryOnHand: 1, adSpend: 0 },
      { month: '2025-04', unitsSold: 1, revenue: 90,  visitors: 10, orders: 1, inventoryOnHand: 1, adSpend: 0 },
      { month: '2025-05', unitsSold: 1, revenue: 80,  visitors: 10, orders: 1, inventoryOnHand: 1, adSpend: 0 },
      { month: '2025-06', unitsSold: 1, revenue: 70,  visitors: 10, orders: 1, inventoryOnHand: 1, adSpend: 0 },
    ] as any;
    const result = computeKpis(data);
    const prior = 300 + 200 + 100; // 600
    const recent = 90 + 80 + 70;   // 240
    const expectedGrowth = ((recent - prior) / prior) * 100; // negative
    expect(result.revenueGrowthPct).toBeCloseTo(expectedGrowth, 10);
  });

  test('when prior sum is zero due to not enough history, growth is guarded to 0 even if recent > 0', () => {
    const data = [
      { month: '2025-04', unitsSold: 1, revenue: 0, visitors: 10, orders: 1, inventoryOnHand: 1, adSpend: 0 },
      { month: '2025-05', unitsSold: 1, revenue: 100, visitors: 10, orders: 1, inventoryOnHand: 1, adSpend: 0 },
      { month: '2025-06', unitsSold: 1, revenue: 200, visitors: 10, orders: 1, inventoryOnHand: 1, adSpend: 0 },
    ] as any;
    const result = computeKpis(data);
    expect(result.revenueGrowthPct).toBe(0);
  });
});