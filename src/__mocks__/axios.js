export default {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: { result: true } })),
  put: jest.fn(() => Promise.resolve({ data: { result: true } })),
  delete: jest.fn(() => Promise.resolve({ data: { result: true } })),
  CancelToken: {
    source: () => ({
      token: 'token123',
      cancel: jest.fn(),
    }),
  },
}
