import Header from '@/components/Header';
import KpiCard from '@/components/KpiCard';
import SalesForecastChart from '@/components/charts/SalesForecastChart';
import { monthlyMetrics, computeKpis } from '@/lib/sampleData';
import { generateForecast } from '@/lib/forecast';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export default function Page() {
  const kpis = computeKpis(monthlyMetrics);
  const labels = monthlyMetrics.map((m) => m.month);
  const sales = monthlyMetrics.map((m) => m.unitsSold);
  const fc = generateForecast(sales, 6);
  const forecastLabels = fc.map((p, i) => `+${i + 1}m`);
  const forecast = fc.map((p) => Math.round(p.value));

  return (
    <div>
      <Header />
      <main className="container-page py-8 space-y-8">
        <section id="analytics" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Monthly revenue" value={formatCurrency(kpis.revenue)} delta={`${kpis.revenueGrowthPct.toFixed(1)}% last 90d`} />
          <KpiCard label="Orders" value={kpis.orders.toLocaleString()} />
          <KpiCard label="Conversion rate" value={`${kpis.conversionRate.toFixed(2)}%`} />
          <KpiCard label="Inventory on hand" value={kpis.inventoryOnHand.toLocaleString()} delta={`Turnover ${kpis.inventoryTurnover.toFixed(2)}x`} />
        </section>

        <section id="forecast" className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Sales forecast</h2>
          </div>
          <div className="card-body">
            <SalesForecastChart labels={labels} sales={sales} forecastLabels={forecastLabels} forecast={forecast} />
          </div>
        </section>

        <section id="suggestions" className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">AI product optimization</h2>
            <button className="btn-primary" data-action="optimize">Regenerate</button>
          </div>
          <div className="card-body grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[rgba(255,255,255,0.03)] rounded-lg p-4 border border-[rgba(255,255,255,0.06)]">
              <div className="text-sm text-[color:var(--muted)]">Listing Enhancement</div>
              <div className="mt-2 text-sm">Improve primary image by adding lifestyle context and consistent teal accent. A/B test updated title containing core keywords: "teal insulated bottle 24oz, leakproof, BPA-free".</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.03)] rounded-lg p-4 border border-[rgba(255,255,255,0.06)]">
              <div className="text-sm text-[color:var(--muted)]">Pricing Strategy</div>
              <div className="mt-2 text-sm">Run a timeboxed 5% markdown tied to an automated coupon during off-peak hours to smooth demand and reduce stockouts risk next month.</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.03)] rounded-lg p-4 border border-[rgba(255,255,255,0.06)]">
              <div className="text-sm text-[color:var(--muted)]">Inventory Optimization</div>
              <div className="mt-2 text-sm">Reorder 1,200 units to maintain 30-day coverage based on forecast and current lead times; consolidate slow SKUs into bundles.</div>
            </div>
          </div>
        </section>

        <section id="campaigns" className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Automated campaign ideas</h2>
            <button className="btn-primary" data-action="campaigns">Generate</button>
          </div>
          <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-[color:var(--muted)]">Audience</div>
              <input className="input w-full mt-2" placeholder="e.g. Returning customers, hydrated lifestyle" />
            </div>
            <div>
              <div className="text-sm text-[color:var(--muted)]">Primary offer</div>
              <input className="input w-full mt-2" placeholder="e.g. Bundle: Bottle + Filter 10% off" />
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-[color:var(--muted)]">Generated concept</div>
              <div className="mt-2 p-4 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] text-sm">
                Omnichannel launch: "Stay Cool in Teal". UGC short-form, Carousel before/after, onsite banner with teal-to-blue gradient. KPIs: CTR +18%, AOV +7%.
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}