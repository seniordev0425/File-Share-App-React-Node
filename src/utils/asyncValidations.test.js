import mockAxios from 'axios'

import {
  asyncValidate,
} from './asyncValidations'


describe('asyncValidate', () => {
  beforeEach(() => {
    mockAxios.get.mockClear()
  })

  it('should pass validation when axios returns { result: true }', async () => {
    mockAxios.get.mockImplementation(() => Promise.resolve({
      data: { result: true }
    }))

    const result = await asyncValidate('test value', '/api/current/dummy-route')

    expect(result).toBe(true)
  })

  it('should not pass validation when axios returns { result: false }', async () => {
    mockAxios.get.mockImplementation(() => Promise.resolve({
      data: { result: false }
    }))

    const result = await asyncValidate('test value', '/api/current/dummy-route')

    expect(result).toBe(false)
  })

  it('should not pass validation when axios request fails', async () => {
    mockAxios.get.mockImplementation(() => Promise.reject(new Error('Unexpected error')))

    const result = await asyncValidate('test value', '/api/current/dummy-route')

    expect(result).toBe(false)
  })
})
