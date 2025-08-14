export type SeriesPoint = { x: number; y: number };

export type ForecastPoint = { index: number; value: number };

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

export function generateForecast(history: number[], horizon: number) {
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