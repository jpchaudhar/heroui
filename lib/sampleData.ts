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