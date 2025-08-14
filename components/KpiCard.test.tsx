/**
 * Tests for KpiCard component
 *
 * Testing library/framework: These tests assume the repository uses a Jest or Vitest
 * environment with @testing-library/react. They follow Testing Library best practices:
 * - render via render()
 * - query via screen.getByRole/getByText
 * - avoid testing implementation details
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
// If the project uses Vitest, this import is harmless; with Jest it's not needed but safe.
// import { describe, it, expect } from 'vitest';
import KpiCard from './KpiCard';

describe('KpiCard', () => {
  it('renders label and value (happy path)', () => {
    render(<KpiCard label="Revenue" value="$1,234" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1,234')).toBeInTheDocument();
  });

  it('renders delta when provided', () => {
    render(<KpiCard label="Users" value="100" delta="+10% WoW" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('+10% WoW')).toBeInTheDocument();
  });

  it('does not render delta element when delta is undefined', () => {
    render(<KpiCard label="Sessions" value="42" />);
    // The delta text shouldn't exist
    const deltaText = screen.queryByText(/\+|-%|%|WoW|MoM|QoQ/i);
    // queryByText returns null if not found
    expect(deltaText).toBeNull();
    // But the required label and value should exist
    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('supports empty string as value (edge case)', () => {
    render(<KpiCard label="Empty Value" value="" />);
    expect(screen.getByText('Empty Value')).toBeInTheDocument();
    // Value is an empty string; ensure the node still exists. Using getByText won't find empty text,
    // so we assert using role and structure: the second div inside .kpi should be present.
    const kpiRoot = document.querySelector('.kpi');
    expect(kpiRoot).not.toBeNull();
    const valueNode = kpiRoot?.querySelector('.text-2xl.font-semibold');
    expect(valueNode).not.toBeNull();
    expect(valueNode?.textContent).toBe('');
  });

  it('renders delta when provided as empty string (edge case: truthiness check)', () => {
    // Given delta?: string; and usage {delta ? (...) : null}, empty string is falsy, so delta should not render
    render(<KpiCard label="Edge" value="123" delta="" />);
    // label and value present
    expect(screen.getByText('Edge')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    // delta should not render due to falsy empty string
    const deltaNode = document.querySelector('.text-xs.text-brand-teal-400');
    expect(deltaNode).toBeNull();
  });

  it('applies expected class names for visual hierarchy (styling hooks)', () =>
  {
    render(<KpiCard label="Styling" value="999" delta="+1%" />);
    const root = document.querySelector('.kpi');
    expect(root).not.toBeNull();

    const labelNode = document.querySelector('.text-sm.text-\\[color:var\\(--muted\\)\\]');
    const valueNode = document.querySelector('.text-2xl.font-semibold');
    const deltaNode = document.querySelector('.text-xs.text-brand-teal-400');

    expect(labelNode).not.toBeNull();
    expect(valueNode).not.toBeNull();
    expect(deltaNode).not.toBeNull();
    // Validate text content
    expect(labelNode?.textContent).toBe('Styling');
    expect(valueNode?.textContent).toBe('999');
    expect(deltaNode?.textContent).toBe('+1%');
  });

  it('handles long text content gracefully (layout stress test)', () => {
    const longLabel = 'Total Revenue from International Expansion across Multiple Regions FY2024';
    const longValue = '$123,456,789.00 (Provisional Estimate)';
    const longDelta = '+1234.56% Week-over-Week due to one-off event';
    render(<KpiCard label={longLabel} value={longValue} delta={longDelta} />);

    expect(screen.getByText(longLabel)).toBeInTheDocument();
    expect(screen.getByText(longValue)).toBeInTheDocument();
    expect(screen.getByText(longDelta)).toBeInTheDocument();
  });

  it('renders without crashing with unusual unicode text', () => {
    render(<KpiCard label="用户" value="€1 234,56" delta="±0.0%" />);
    expect(screen.getByText('用户')).toBeInTheDocument();
    expect(screen.getByText('€1 234,56')).toBeInTheDocument();
    expect(screen.getByText('±0.0%')).toBeInTheDocument();
  });
});