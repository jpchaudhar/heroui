import React from 'react';
import { render, screen } from '@testing-library/react';

/**
 * Testing library and framework:
 * - Framework: Jest
 * - UI Testing Library: @testing-library/react
 * - Matchers: @testing-library/jest-dom
 *
 * These tests validate the public interfaces exported from app/layout.tsx:
 * - The `metadata` named export (shape + critical fields).
 * - The default export `RootLayout` component structure and behavior.
 *
 * We focus on the diff-provided source which includes:
 *   export const metadata: Metadata = {
 *     title: 'Agentic E‑commerce AI',
 *     description: 'AI-powered insights and automation for e-commerce sellers',
 *   };
 *
 *   export default function RootLayout({ children }: { children: React.ReactNode }) {
 *     return (
 *       <html lang="en">
 *         <body className="min-h-screen">
 *           {children}
 *         </body>
 *       </html>
 *     );
 *   }
 *
 * Notes:
 * - We avoid Next.js runtime features and treat RootLayout as a pure component for rendering checks.
 * - We gracefully handle unexpected inputs for children (null/undefined).
 * - CSS imports are ignored by the test environment; we only assert on className presence.
 */

// Import the module under test. We keep a relative import to the source file.
// If your repository places this code in a different file (e.g., app/layout.tsx), adjust the path accordingly.
import RootLayout, { metadata } from './layout';

describe('app/layout.tsx metadata export', () => {
  it('exposes required metadata fields with correct values (happy path)', () => {
    expect(metadata).toBeDefined();
    expect(typeof metadata).toBe('object');

    // Validate critical fields from the diff
    expect(metadata.title).toBe('Agentic E‑commerce AI');
    expect(metadata.description).toBe('AI-powered insights and automation for e-commerce sellers');

    // Ensure no accidental mutation in tests
    expect(Object.isFrozen ? Object.isFrozen(metadata) : true).toBeTruthy();
  });

  it('contains only expected primitive values for known keys', () => {
    // Basic sanity checks to avoid unexpected types that could break Next metadata handling
    expect(typeof metadata.title).toBe('string');
    expect(typeof metadata.description).toBe('string');
  });
});

describe('app/layout.tsx RootLayout component', () => {
  it('renders html element with lang="en" and wraps provided children (happy path)', () => {
    render(
      <RootLayout>
        <div data-testid="child">Hello child</div>
      </RootLayout>
    );

    const html = document.querySelector('html');
    expect(html).toBeInTheDocument();
    expect(html).toHaveAttribute('lang', 'en');

    const body = document.querySelector('body');
    expect(body).toBeInTheDocument();
    expect(body).toHaveClass('min-h-screen');

    const child = screen.getByTestId('child');
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent('Hello child');
  });

  it('renders correctly with string child', () => {
    render(<RootLayout>{'plain text child'}</RootLayout>);

    const body = document.querySelector('body');
    expect(body).toHaveTextContent('plain text child');
  });

  it('handles null children gracefully (edge case)', () => {
    // @ts-expect-error testing runtime behavior when children are null
    render(<RootLayout>{null}</RootLayout>);

    const body = document.querySelector('body');
    // Should render body even if no children
    expect(body).toBeInTheDocument();
    // Should not throw, body text content empty
    expect(body?.textContent).toBe('');
  });

  it('handles undefined children gracefully (edge case)', () => {
    // @ts-expect-error testing runtime behavior when children are undefined
    render(<RootLayout>{undefined}</RootLayout>);

    const body = document.querySelector('body');
    expect(body).toBeInTheDocument();
    expect(body?.textContent).toBe('');
  });

  it('supports multiple children nodes', () => {
    render(
      <RootLayout>
        <span data-testid="a">A</span>
        <span data-testid="b">B</span>
        <>C</>
      </RootLayout>
    );

    expect(screen.getByTestId('a')).toHaveTextContent('A');
    expect(screen.getByTestId('b')).toHaveTextContent('B');

    const body = document.querySelector('body');
    expect(body).toHaveTextContent('ABC');
  });

  it('does not strip provided attributes on body or html', () => {
    // While the component sets fixed attributes, ensure they persist as defined.
    render(<RootLayout><div /></RootLayout>);

    const html = document.querySelector('html');
    expect(html).toHaveAttribute('lang', 'en');

    const body = document.querySelector('body');
    expect(body).toHaveClass('min-h-screen');
  });
});