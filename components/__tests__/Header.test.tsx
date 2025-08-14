import React from 'react';
import { render, screen, within } from '@testing-library/react';

// Mock next/link to render a proper anchor element for reliable role-based queries.
jest.mock('next/link', () => {
  return ({ href, children, ...props }: any) => (
    <a href={typeof href === 'string' ? href : (href?.pathname ?? '#')} {...props}>{children}</a>
  );
});

// Attempt to import Header from either the mistakenly named test file or the expected component path.
// We try multiple paths to handle the provided context where components/Header.test.tsx contains the component code.
let Header: React.ComponentType;

beforeAll(() => {
  try {
    // If the repo has a proper component file
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Header = require('../Header').default;
  } catch (_e1) {
    try {
      // If the snippet's component is (incorrectly) in components/Header.test.tsx
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      Header = require('../Header.test').default;
    } catch (_e2) {
      throw new Error(
        "Unable to locate Header component. Expected one of: components/Header.tsx, components/Header.test.tsx exporting default Header()"
      );
    }
  }
});

describe('Header component', () => {
  it('renders the banner container with branding', () => {
    render(<Header />);
    // ARIA role banner is mapped from <header>
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    // Brand name text
    expect(screen.getByText('Agentic E‑commerce AI')).toBeInTheDocument();

    // Brand logo block (tailwind class)
    // We assert existence of an element with the distinctive class to avoid over-coupling to the entire class list
    const logo = header.querySelector('.bg-brand-teal-500');
    expect(logo).toBeTruthy();
  });

  it('contains a navigation with the expected links and hrefs', () => {
    render(<Header />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    // Verify individual links by accessible name and href
    const analyticsLink = within(nav).getByRole('link', { name: 'Analytics' });
    expect(analyticsLink).toHaveAttribute('href', '#analytics');

    const suggestionsLink = within(nav).getByRole('link', { name: 'Product AI' });
    expect(suggestionsLink).toHaveAttribute('href', '#suggestions');

    const campaignsLink = within(nav).getByRole('link', { name: 'Campaigns' });
    expect(campaignsLink).toHaveAttribute('href', '#campaigns');

    const forecastLink = within(nav).getByRole('link', { name: 'Forecasts' });
    expect(forecastLink).toHaveAttribute('href', '#forecast');

    // Sanity check: exactly 4 nav links
    const allLinks = within(nav).getAllByRole('link');
    expect(allLinks).toHaveLength(4);
  });

  it('exposes stable structure: header > container > nav (snapshot smoke)', () => {
    const { container } = render(<Header />);
    // Snapshot only the header subtree to minimize noise
    const header = container.querySelector('header');
    expect(header).toMatchSnapshot();
  });

  it('does not render extraneous links or interactive elements', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation');

    // Only the four known links
    expect(within(nav).getAllByRole('link').length).toBe(4);

    // No buttons expected
    expect(screen.queryByRole('button')).toBeNull();
  });
});