/**
 * Tests for app/api/ai/suggestions/route.ts
 *
 * Testing library/framework: Jest (expect/describe/it from @jest/globals).
 * If your project uses Vitest, replace:
 *  - import { describe, it, expect, beforeEach, afterEach, vi, jest } accordingly
 *  - global jest.* with vi.*
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'

// IMPORTANT: mock openai BEFORE importing the module under test to ensure it's mocked within it.
const createMock = jest.fn();
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      chat: {
        completions: { create: createMock },
      },
    })),
  };
});

// Now import the handler under test
import type { NextRequest } from 'next/server'
import { POST } from './route'

/**
 * Helper: build a Request compatible with NextRequest usage in handler.
 * The handler only calls req.json(), so a standard Request is sufficient.
 */
function makeJsonRequest(
  url: string,
  body: unknown,
  init?: RequestInit
): NextRequest {
  const finalInit: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
    ...init,
  };
  // Cast as NextRequest to satisfy TS; runtime behavior uses standard Request API
  return new Request(url, finalInit) as unknown as NextRequest;
}

describe('POST /api/ai/suggestions', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    // Copy env so we can restore later
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns demo suggestions when OPENAI_API_KEY is missing', async () => {
    delete process.env.OPENAI_OPENAI_API_KEY; // ensure no accidental env
    delete process.env.OPENAI_API_KEY;

    const req = makeJsonRequest('http://localhost/api/ai/suggestions', {
      product: 'Stainless Steel Bottle',
      goals: 'increase AOV',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toHaveProperty('suggestions');
    expect(Array.isArray(json.suggestions)).toBe(true);
    expect(json.suggestions.length).toBe(3);
    expect(json.source).toBe('demo');

    // Ensure OpenAI was not called in demo mode
    expect(createMock).not.toHaveBeenCalled();
  });

  it('invokes OpenAI and returns parsed suggestions when API key is present', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    // Configure OpenAI mock response — include bullets, extra whitespace, and more than 3 lines
    createMock.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: `
- Listing: Use teal CTA button; add "BPA-free" and "24oz" in title.
- Pricing: Run weekend 10% promo; highlight compare-at price; watch CVR.
- Inventory: Forecast 30-day coverage; bundle with slow SKUs; low-stock alerts.
- Extra: This fourth item should be sliced off.
            `,
          },
        },
      ],
    });

    const req = makeJsonRequest('http://localhost/api/ai/suggestions', {
      product: 'Insulated Bottle 24oz',
      goals: 'increase conversion rate',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.source).toBe('openai');
    expect(Array.isArray(json.suggestions)).toBe(true);
    expect(json.suggestions.length).toBe(3);
    // Ensure bullet prefixes are removed and trimming applied
    expect(json.suggestions[0]).toMatch(/^Listing:/);
    expect(json.suggestions[1]).toMatch(/^Pricing:/);
    expect(json.suggestions[2]).toMatch(/^(Inventory|Ops):/);
  });

  it('handles OpenAI returning empty/undefined content gracefully (empty suggestions array)', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    // Return undefined content to exercise default-to-empty string behavior
    createMock.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: undefined,
          },
        },
      ],
    });

    const req = makeJsonRequest('http://localhost/api/ai/suggestions', {
      product: 'Any',
      goals: 'Any',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.source).toBe('openai');
    expect(Array.isArray(json.suggestions)).toBe(true);
    expect(json.suggestions.length).toBe(0);
  });

  it('parses inputs to OpenAI using defaults if body is invalid JSON', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    // The handler uses req.json().catch(() => ({})), so invalid JSON should not crash
    createMock.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: `Listing: A\nPricing: B\nOps: C`,
          },
        },
      ],
    });

    // Provide invalid JSON with content-type application/json to trigger .json() failure
    const badRequest = new Request('http://localhost/api/ai/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ invalid json',
    }) as unknown as NextRequest;

    const res = await POST(badRequest);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.source).toBe('openai');
    expect(json.suggestions).toEqual(['Listing: A', 'Pricing: B', 'Ops: C']);

    // Also verify OpenAI was called with expected arguments (model, messages, etc.)
    expect(createMock).toHaveBeenCalledTimes(1);
    const args = createMock.mock.calls[0][0];
    expect(args.model).toBe('gpt-4o-mini');
    expect(Array.isArray(args.messages)).toBe(true);
    // Messages should contain system and user roles
    const roles = args.messages.map((m: any) => m.role);
    expect(roles).toContain('system');
    expect(roles).toContain('user');
    // Temperature and max_tokens as configured
    expect(args.temperature).toBeCloseTo(0.3);
    expect(args.max_tokens).toBe(300);
  });

  it('returns 500 when OpenAI throws an error', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    createMock.mockRejectedValueOnce(new Error('OpenAI API failure'));

    const req = makeJsonRequest('http://localhost/api/ai/suggestions', {
      product: 'X',
      goals: 'Y',
    });

    const res = await POST(req);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json).toEqual({ error: 'Failed to generate suggestions' });
  });

  it('removes bullet markers and trims lines correctly (mixed markers and spacing)', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    createMock.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: `
*  Listing: Add lifestyle image; teal accent.
 - Pricing: Try 5% off with coupon.
-  Ops: Enable low-stock alerts.

            `,
          },
        },
      ],
    });

    const req = makeJsonRequest('http://localhost/api/ai/suggestions', {
      product: 'Teal Bottle',
      goals: 'Improve CTR',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.source).toBe('openai');

    // Ensure bullet prefixes and extra spaces are removed
    expect(json.suggestions).toEqual([
      'Listing: Add lifestyle image; teal accent.',
      'Pricing: Try 5% off with coupon.',
      'Ops: Enable low-stock alerts.',
    ]);
  });
});