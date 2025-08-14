/**
 * Tests for SalesForecastChart
 *
 * Testing library and framework: Jest + React Testing Library
 * - We mock 'chart.js' and 'react-chartjs-2' to avoid heavy rendering and canvas requirements.
 * - We assert that the Line component is rendered with the correct data and options computed
 *   by SalesForecastChart, covering various scenarios including empty inputs and mismatched lengths.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock chart.js to provide a register function and required tokens
jest.mock('chart.js', () => {
  class MockChart {}
  // attach a static register spy to ensure the component can call Chart.register(...)
  // Using any to avoid TS type issues in the test environment
  (MockChart as any).register = jest.fn();

  return {
    Chart: MockChart,
    CategoryScale: {},
    LinearScale: {},
    PointElement: {},
    LineElement: {},
    BarElement: {},
    Title: {},
    Tooltip: {},
    Legend: {},
  };
});

// Provide a shallow mock for react-chartjs-2 Line component that captures props
jest.mock('react-chartjs-2', () => {
  const React = require('react');
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Line: ({ data, options }: any) => {
      return React.createElement('div', {
        'data-testid': 'line-chart',
        'data-props': JSON.stringify({ data, options }),
      });
    },
    // Provide a Bar export to satisfy imports if needed by other modules
    Bar: () => React.createElement('div', { 'data-testid': 'bar-chart' }),
  };
});

// Import after mocks so module initialization (Chart.register) uses the mocked chart.js
import SalesForecastChart from './SalesForecastChart';

// Helper to extract the props we serialized into the mocked Line component
function getRenderedProps() {
  const el = screen.getByTestId('line-chart');
  const raw = el.getAttribute('data-props');
  expect(raw).toBeTruthy();
  return JSON.parse(raw as string);
}

describe('SalesForecastChart', () => {
  test('renders a Line chart with concatenated labels and two datasets', () => {
    const labels = ['Jan', 'Feb', 'Mar'];
    const sales = [10, 20, 30];
    const forecastLabels = ['Apr', 'May'];
    const forecast = [40, 50];

    render(
      <SalesForecastChart
        labels={labels}
        sales={sales}
        forecastLabels={forecastLabels}
        forecast={forecast}
      />
    );

    // Verify that our mocked Line has been rendered
    const chart = screen.getByTestId('line-chart');
    expect(chart).toBeInTheDocument();

    const { data, options } = getRenderedProps();

    // Labels are concatenated
    expect(data.labels).toEqual([...labels, ...forecastLabels]);

    // We expect two datasets: Actual (bar) and Forecast (line)
    expect(Array.isArray(data.datasets)).toBe(true);
    expect(data.datasets).toHaveLength(2);

    // Dataset 0: Actual Units Sold (bar) with trailing nulls equal to forecast length
    const actual = data.datasets[0];
    expect(actual.label).toBe('Actual Units Sold');
    expect(actual.type).toBe('bar');
    expect(actual.data).toEqual([...sales, ...Array(forecast.length).fill(null)]);
    expect(actual.backgroundColor).toBe('rgba(20, 184, 166, 0.25)');
    expect(actual.borderColor).toBe('rgba(20, 184, 166, 0.6)');
    expect(actual.borderWidth).toBe(1);

    // Dataset 1: Forecast (line) with leading nulls for historical sales
    const forecastDs = data.datasets[1];
    expect(forecastDs.label).toBe('Forecast');
    expect(forecastDs.type).toBe('line');
    expect(forecastDs.data).toEqual([...Array(sales.length).fill(null), ...forecast]);
    expect(forecastDs.borderColor).toBe('rgba(34, 211, 199, 1)');
    expect(forecastDs.backgroundColor).toBe('rgba(34, 211, 199, 0.2)');
    expect(forecastDs.pointRadius).toBe(2);
    expect(forecastDs.tension).toBe(0.35);

    // Verify a few key options to ensure configuration is wired
    expect(options.responsive).toBe(true);
    expect(options.maintainAspectRatio).toBe(false);
    expect(options.plugins.legend.labels.color).toBe('#e2e8f0');
    expect(options.plugins.title.display).toBe(false);
    expect(options.plugins.tooltip.mode).toBe('index');
    expect(options.plugins.tooltip.intersect).toBe(false);
    expect(options.scales.x.ticks.color).toBe('#94a3b8');
    expect(options.scales.y.grid.color).toBe('rgba(255,255,255,0.06)');
  });

  test('handles empty inputs gracefully', () => {
    const labels: string[] = [];
    const sales: number[] = [];
    const forecastLabels: string[] = [];
    const forecast: number[] = [];

    render(
      <SalesForecastChart
        labels={labels}
        sales={sales}
        forecastLabels={forecastLabels}
        forecast={forecast}
      />
    );

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    const { data } = getRenderedProps();

    expect(data.labels).toEqual([]);
    // Both datasets should have empty data arrays
    expect(data.datasets[0].data).toEqual([]);
    expect(data.datasets[1].data).toEqual([]);
  });

  test('supports mismatched lengths between labels and sales arrays without throwing', () => {
    // Deliberately mismatched: more labels than sales
    const labels = ['Jan', 'Feb', 'Mar', 'Apr'];
    const sales = [5, 10];
    const forecastLabels = ['May'];
    const forecast = [20, 25, 30];

    render(
      <SalesForecastChart
        labels={labels}
        sales={sales}
        forecastLabels={forecastLabels}
        forecast={forecast}
      />
    );

    const { data } = getRenderedProps();

    // Labels always concatenate label arrays
    expect(data.labels).toEqual([...labels, ...forecastLabels]);

    // Dataset lengths are determined by sales/forecast sizes as per implementation
    expect(data.datasets[0].data).toEqual([...sales, ...Array(forecast.length).fill(null)]);
    expect(data.datasets[1].data).toEqual([...Array(sales.length).fill(null), ...forecast]);
    // Ensure no runtime errors and output is consistent
    expect(data.datasets[0].data.length).toBe(sales.length + forecast.length);
    expect(data.datasets[1].data.length).toBe(sales.length + forecast.length);
  });

  test('registers required Chart.js components on import', async () => {
    // Access the mocked Chart to verify register calls
    const chartJs = require('chart.js');
    // Chart.register should have been called once during module evaluation
    expect(chartJs.Chart.register).toHaveBeenCalledTimes(1);
    const firstCallArgs = chartJs.Chart.register.mock.calls[0];

    // Expect a non-empty list of plugins/scales registered
    expect(Array.isArray(firstCallArgs)).toBe(true);
    // It should include the tokens seen in the component module
    // We check that at least CategoryScale and Legend are passed
    const flattened = firstCallArgs.flat ? firstCallArgs.flat() : ([] as any[]).concat(...firstCallArgs);
    expect(flattened).toEqual(
      expect.arrayContaining([
        chartJs.CategoryScale,
        chartJs.LinearScale,
        chartJs.PointElement,
        chartJs.LineElement,
        chartJs.BarElement,
        chartJs.Title,
        chartJs.Tooltip,
        chartJs.Legend,
      ])
    );
  });
});