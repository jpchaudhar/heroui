import type { NextApiRequest, NextApiResponse } from 'next'
import handler from '../../../pages/api/health'

/**
 * Test Framework: Jest (typical for Next.js projects via next/jest).
 * If this repository uses Vitest or another runner, the test syntax is compatible with minor adjustments.
 */

function createMockResponse() {
  const res: Partial<NextApiResponse> & {
    status: jest.Mock
    json: jest.Mock
    _statusCode?: number
    _jsonBody?: any
  } = {
    status: jest.fn().mockImplementation(function (this: any, code: number) {
      res._statusCode = code
      return res as NextApiResponse
    }),
    json: jest.fn().mockImplementation(function (this: any, body: any) {
      res._jsonBody = body
      return res as NextApiResponse
    }),
  }
  return res as NextApiResponse & { _statusCode?: number; _jsonBody?: any }
}

describe('pages/api/health handler', () => {
  test('returns 200 with { status: "ok" } for GET requests (happy path)', () => {
    const req = { method: 'GET' } as unknown as NextApiRequest
    const res = createMockResponse()

    const ret = handler(req, res)

    expect(ret).toBeUndefined()
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' })
    expect(res._statusCode).toBe(200)
    expect(res._jsonBody).toEqual({ status: 'ok' })
  })

  test('works for POST requests as well (method-agnostic behavior)', () => {
    const req = { method: 'POST' } as unknown as NextApiRequest
    const res = createMockResponse()

    handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' })
  })

  test('works for uncommon methods like HEAD/OPTIONS (edge cases)', () => {
    const methods = ['HEAD', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'] as const

    for (const method of methods) {
      const req = { method } as unknown as NextApiRequest
      const res = createMockResponse()

      handler(req, res)

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledTimes(1)
      // Ensure no extra properties are added to the payload
      expect(res._jsonBody).toEqual({ status: 'ok' })
      expect(Object.keys(res._jsonBody!)).toEqual(['status'])
    }
  })

  test('does not mutate the request object (stability check)', () => {
    const reqOriginal = { method: 'GET', headers: { 'x-test': '1' } }
    const req = { ...reqOriginal } as unknown as NextApiRequest
    const res = createMockResponse()

    handler(req, res)

    expect(req).toEqual(reqOriginal)
  })
})