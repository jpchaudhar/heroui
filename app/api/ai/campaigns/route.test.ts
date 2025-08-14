import type { NextRequest } from 'next/server';

// We mock next/server to avoid depending on Next.js runtime Response.
// Our mock NextResponse.json returns a simple structure { data, init } to assert payloads and status.
const nextResponseJsonMock = jest.fn((data: any, init?: ResponseInit) => ({ data, init }));
jest.mock('next/server', () => {
  return {
    __esModule: true,
    NextResponse: {
      json: nextResponseJsonMock,
    },
  };
});

// Mock OpenAI SDK constructor and its methods
const mockCreate = jest.fn();
const OpenAIMock = jest.fn().mockImplementation((_opts: any) => ({
  chat: {
    completions: {
      create: mockCreate,
    },
  },
}));
jest.mock('openai', () => ({
  __esModule: true,
  default: OpenAIMock,
}));

// Import after mocks so that the route picks up the mocked modules
import { POST } from './route';

describe('app/api/ai/campaigns/route POST', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.OPENAI_API_KEY;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  function makeReq(body: any, options?: { throwOnJson?: boolean }): NextRequest {
    // We only need an object with a json() method at runtime; cast to NextRequest for TS.
    return {
      json: options?.throwOnJson
        ? (async () => {
            throw new Error('bad json');
          })
        : (async () => body),
    } as unknown as NextRequest;
  }

  test('returns demo concept when OPENAI_API_KEY is missing, using defaults on empty body', async () => {
    const req = makeReq(undefined); // json() resolves to undefined
    const res: any = await POST(req);

    // Verify NextResponse.json was called with the expected demo payload
    expect(nextResponseJsonMock).toHaveBeenCalledTimes(1);
    const [payload, init] = nextResponseJsonMock.mock.calls[0];

    expect(init).toBeUndefined();
    expect(payload).toEqual({
      concept: {
        name: 'Stay Cool in Teal',
        audience: 'returning customers',
        message: 'Hydrate smarter. Save more with our teal essentials bundle.',
        channels: ['Paid Social', 'Email', 'Onsite Banner'],
        creative: ['UGC Reels before/after', 'Carousel benefits', 'Teal-to-blue gradient hero'],
        budget: { paid_social: 55, search: 20, email: 10, creators: 15 },
        metrics: { ctr: '+18%', aov: '+7%', cac: '-10%' },
      },
      source: 'demo',
    });

    // OpenAI should not be constructed or called
    expect(OpenAIMock).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test('returns demo concept when OPENAI_API_KEY is missing, using provided body overrides', async () => {
    const req = makeReq({
      audience: 'new moms',
      offer: 'BOGO',
      brand: 'aqua brand',
    });
    const res: any = await POST(req);

    expect(nextResponseJsonMock).toHaveBeenCalledTimes(1);
    const [payload] = nextResponseJsonMock.mock.calls[0];

    expect(payload).toEqual(
      expect.objectContaining({
        concept: expect.objectContaining({
          audience: 'new moms',
        }),
        source: 'demo',
      })
    );
  });

  test('gracefully handles req.json() failure and still returns demo with defaults', async () => {
    const req = makeReq(null, { throwOnJson: true });
    const res: any = await POST(req);

    expect(nextResponseJsonMock).toHaveBeenCalledTimes(1);
    const [payload] = nextResponseJsonMock.mock.calls[0];

    expect(payload).toEqual(
      expect.objectContaining({
        concept: expect.objectContaining({
          audience: 'returning customers',
        }),
        source: 'demo',
      })
    );
  });

  test('with OPENAI_API_KEY, calls OpenAI and returns raw text from completion', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: 'Great campaign idea' } }],
    });

    const req = makeReq({
      audience: 'gamers',
      offer: '15% off',
      brand: 'neon water',
    });

    const res: any = await POST(req);

    // Ensure OpenAI constructed with apiKey
    expect(OpenAIMock).toHaveBeenCalledTimes(1);
    expect(OpenAIMock).toHaveBeenCalledWith({ apiKey: 'sk-test' });

    // Ensure correct parameters to chat.completions.create
    expect(mockCreate).toHaveBeenCalledTimes(1);
    const createArgs = mockCreate.mock.calls[0][0];
    expect(createArgs).toEqual(
      expect.objectContaining({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 400,
      })
    );
    expect(createArgs.messages).toHaveLength(2);
    expect(createArgs.messages[0]).toEqual(
      expect.objectContaining({ role: 'system' })
    );
    // Verify user message content composition
    expect(createArgs.messages[1]).toEqual({
      role: 'user',
      content: expect.stringContaining('Audience: gamers'),
    });
    expect(createArgs.messages[1].content).toContain('Offer: 15% off');
    expect(createArgs.messages[1].content).toContain('Brand: neon water');

    // Verify NextResponse.json payload for OpenAI path
    expect(nextResponseJsonMock).toHaveBeenCalledTimes(1);
    const [payload, init] = nextResponseJsonMock.mock.calls[0];
    expect(init).toBeUndefined();
    expect(payload).toEqual({
      raw: 'Great campaign idea',
      source: 'openai',
    });
  });

  test('with OPENAI_API_KEY but empty/undefined completion content, returns empty raw string', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    mockCreate.mockResolvedValueOnce({
      choices: [{}], // no message content
    });

    const req = makeReq({ audience: 'students', offer: 'free bottle', brand: 'cool water' });
    const res: any = await POST(req);

    expect(nextResponseJsonMock).toHaveBeenCalledTimes(1);
    const [payload] = nextResponseJsonMock.mock.calls[0];
    expect(payload).toEqual({ raw: '', source: 'openai' });
  });

  test('returns 500 error response when OpenAI call throws', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    mockCreate.mockRejectedValueOnce(new Error('network down'));

    const req = makeReq({ audience: 'athletes' });

    const res: any = await POST(req);

    // Should return error JSON with status 500
    expect(nextResponseJsonMock).toHaveBeenCalledTimes(1);
    const [payload, init] = nextResponseJsonMock.mock.calls[0];
    expect(payload).toEqual({ error: 'Failed to generate campaign' });
    expect(init).toEqual({ status: 500 });
  });
});