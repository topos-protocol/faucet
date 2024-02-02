// vi-dom adds custom vi matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/vi-dom
import '@testing-library/jest-dom'
import { vi } from 'vitest'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

const mockResponse = vi.fn()
Object.defineProperty(window, 'location', {
  value: {
    ...window.location,
    hash: {
      endsWith: mockResponse,
      includes: mockResponse,
    },
    assign: mockResponse,
    navigate: mockResponse,
    replace: mockResponse,
  },
  writable: true,
})

Object.defineProperty(window, 'navigation', {
  value: {
    navigate: mockResponse,
  },
  writable: true,
})
