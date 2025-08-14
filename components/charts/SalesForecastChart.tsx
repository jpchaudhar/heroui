'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type SalesForecastChartProps = {
  labels: string[];
  sales: number[];
  forecastLabels: string[];
  forecast: number[];
};

export default function SalesForecastChart({ labels, sales, forecastLabels, forecast }: SalesForecastChartProps) {
  const data = {
    labels: [...labels, ...forecastLabels],
    datasets: [
      {
        type: 'bar' as const,
        label: 'Actual Units Sold',
        data: [...sales, ...Array(forecast.length).fill(null)],
        backgroundColor: 'rgba(20, 184, 166, 0.25)',
        borderColor: 'rgba(20, 184, 166, 0.6)',
        borderWidth: 1,
      },
      {
        type: 'line' as const,
        label: 'Forecast',
        data: [...Array(sales.length).fill(null), ...forecast],
        borderColor: 'rgba(34, 211, 199, 1)',
        backgroundColor: 'rgba(34, 211, 199, 0.2)',
        pointRadius: 2,
        tension: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e2e8f0',
        },
      },
      title: {
        display: false,
        text: 'Sales Forecast',
        color: '#e2e8f0',
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
    },
  };

  return (
    <div className="h-80">
      <Line data={data} options={options} />
    </div>
  );
}