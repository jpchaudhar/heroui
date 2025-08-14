/**
 * Tests for app/page.tsx
 *
 * Framework and libraries:
 * - React Testing Library for rendering and queries
 * - Jest or Vitest as the test runner (compatible patterns)
 *
 * We mock child components (Header, KpiCard, SalesForecastChart) and data/forecast modules
 * to ensure deterministic outputs and to validate that correct props are passed.
 */

import React from 'react'
import { render, screen, within } from '@testing-library/react'
// Prefer RTL's user-event if available for interactions; fallback to fireEvent if not present.
import userEvent from '@testing-library/user-event'

// Helper to support both Jest and Vitest mocking APIs
const mocker: any = (global as any).vi ?? (global as any).jest

// Mock data and compute functions from sampleData
mocker.mock('@/lib/sampleData', () => {
  const monthlyMetrics = [
    { month: 'Jan', unitsSold: 100, revenue: 10000, orders: 120, sessions: 4800, inventoryOnHand: 500 },
    { month: 'Feb', unitsSold: 150, revenue: 15000, orders: 140, sessions: 5200, inventoryOnHand: 480 },
    { month: 'Mar', unitsSold: 200, revenue: 20000, orders: 160, sessions: 5600, inventoryOnHand: 460 },
  ]

  // computeKpis returns deterministic values for the test
  function computeKpis(_mm: typeof monthlyMetrics) {
    return {
      revenue: 20000, // pick latest or aggregated for testing
      revenueGrowthPct: 12.3,
      orders: 160,
      conversionRate: 3.21,
      inventoryOnHand: 460,
      inventoryTurnover: 1.75,
    }
  }

  return { monthlyMetrics, computeKpis }
})

// Mock forecast function
mocker.mock('@/lib/forecast', () => {
  function generateForecast(sales: number[], periods: number) {
    // produce simple predictable sequence based on last sale
    const last = sales[sales.length - 1] ?? 0
    return Array.from({ length: periods }, (_, i) => ({
      value: last + (i + 1) * 10,
      lower: last + (i + 1) * 5,
      upper: last + (i + 1) * 15,
    }))
  }
  return { generateForecast }
})

// Mock child components to simple presentational stubs that expose their props in the DOM for assertion
mocker.mock('@/components/Header', () => ({
  __esModule: true,
  default: function Header() {
    return <header data-testid="header">Header</header>
  },
}))

mocker.mock('@/components/KpiCard', () => ({
  __esModule: true,
  default: function KpiCard(props: { label: string; value: string; delta?: string }) {
    return (
      <div data-testid="kpi-card">
        <div data-testid="kpi-label">{props.label}</div>
        <div data-testid="kpi-value">{props.value}</div>
        {props.delta ? <div data-testid="kpi-delta">{props.delta}</div> : null}
      </div>
    )
  },
}))

mocker.mock('@/components/charts/SalesForecastChart', () => ({
  __esModule: true,
  default: function SalesForecastChart(props: {
    labels: string[]
    sales: number[]
    forecastLabels: string[]
    forecast: number[]
  }) {
    // Render data attributes for assertion
    return (
      <div
        data-testid="sales-forecast-chart"
        data-labels={JSON.stringify(props.labels)}
        data-sales={JSON.stringify(props.sales)}
        data-forecast-labels={JSON.stringify(props.forecastLabels)}
        data-forecast={JSON.stringify(props.forecast)}
      />
    )
  },
}))

// Import the Page after mocks are set up
import Page from './page'

describe('Page (app/page.tsx)', () => {
  test('renders the header and main sections with expected headings', () => {
    render(<Page />)

    // Header stub is present
    expect(screen.getByTestId('header')).toBeInTheDocument()

    // Section headings
    expect(screen.getByRole('heading', { name: 'Sales forecast' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI product optimization' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Automated campaign ideas' })).toBeInTheDocument()
  })

  test('renders KPI cards with computed values and deltas formatted', () => {
    render(<Page />)

    // Collect all kpi cards and check labels/values
    const kpiCards = screen.getAllByTestId('kpi-card')
    expect(kpiCards.length).toBe(4)

    // Monthly revenue card
    {
      const card = kpiCards[0]
      const utils = within(card)
      expect(utils.getByTestId('kpi-label')).toHaveTextContent('Monthly revenue')
      // Intl formatted as currency without decimals due to maximumFractionDigits:0
      expect(utils.getByTestId('kpi-value').textContent).toMatch(/^\$\d{1,3}(,\d{3})*$/)
      // delta "12.3% last 90d" from mocked computeKpis
      expect(utils.getByTestId('kpi-delta')).toHaveTextContent('% last 90d')
    }

    // Orders
    {
      const card = kpiCards[1]
      const utils = within(card)
      expect(utils.getByTestId('kpi-label')).toHaveTextContent('Orders')
      // Should be a localized number string (e.g., "160")
      expect(utils.getByTestId('kpi-value').textContent).toMatch(/^\d{1,3}(,\d{3})*$/)
    }

    // Conversion rate
    {
      const card = kpiCards[2]
      const utils = within(card)
      expect(utils.getByTestId('kpi-label')).toHaveTextContent('Conversion rate')
      expect(utils.getByTestId('kpi-value')).toHaveTextContent('%')
    }

    // Inventory on hand with turnover delta
    {
      const card = kpiCards[3]
      const utils = within(card)
      expect(utils.getByTestId('kpi-label')).toHaveTextContent('Inventory on hand')
      expect(utils.getByTestId('kpi-value').textContent).toMatch(/^\d{1,3}(,\d{3})*$/)
      expect(utils.getByTestId('kpi-delta')).toHaveTextContent('Turnover')
      expect(utils.getByTestId('kpi-delta')).toHaveTextContent('x')
    }
  })

  test('passes correct labels, sales, and forecast props to SalesForecastChart', () => {
    render(<Page />)

    const chart = screen.getByTestId('sales-forecast-chart')
    const labels: string[] = JSON.parse(chart.getAttribute('data-labels') || '[]')
    const sales: number[] = JSON.parse(chart.getAttribute('data-sales') || '[]')
    const forecastLabels: string[] = JSON.parse(chart.getAttribute('data-forecast-labels') || '[]')
    const forecast: number[] = JSON.parse(chart.getAttribute('data-forecast') || '[]')

    // From our mocked monthlyMetrics (Jan, Feb, Mar)
    expect(labels).toEqual(['Jan', 'Feb', 'Mar'])
    expect(sales).toEqual([100, 150, 200])

    // We mocked generateForecast to add +10, +20, ..., over 6 months from last=200; then Page rounds values
    expect(forecastLabels).toEqual(['+1m', '+2m', '+3m', '+4m', '+5m', '+6m'])
    expect(forecast).toEqual([210, 220, 230, 240, 250, 260])
  })

  test('optimize and campaigns action buttons are present and clickable', async () => {
    const user = userEvent.setup()
    render(<Page />)

    const optimizeBtn = screen.getByRole('button', { name: /Regenerate/i })
    expect(optimizeBtn).toBeInTheDocument()
    await user.click(optimizeBtn)
    // No handler on the button, but ensure it remains in DOM
    expect(optimizeBtn).toBeEnabled()

    const campaignsBtn = screen.getByRole('button', { name: /Generate/i })
    expect(campaignsBtn).toBeInTheDocument()
    await user.click(campaignsBtn)
    expect(campaignsBtn).toBeEnabled()
  })

  test('renders static suggestion content blocks for AI product optimization', () => {
    render(<Page />)
    expect(screen.getByText('Listing Enhancement')).toBeInTheDocument()
    expect(screen.getByText('Pricing Strategy')).toBeInTheDocument()
    expect(screen.getByText('Inventory Optimization')).toBeInTheDocument()
    // Sanity check a piece of the suggestion text content exists
    expect(
      screen.getByText(/Improve primary image by adding lifestyle context/i)
    ).toBeInTheDocument()
  })

  test('renders fields for Automated campaign ideas with placeholders', () => {
    render(<Page />)
    expect(
      screen.getByPlaceholderText('e.g. Returning customers, hydrated lifestyle')
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('e.g. Bundle: Bottle + Filter 10% off')
    ).toBeInTheDocument()
    // Generated concept content present
    expect(
      screen.getByText(/Omnichannel launch: "Stay Cool in Teal"/i)
    ).toBeInTheDocument()
  })
})