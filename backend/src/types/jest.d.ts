/// <reference types="jest" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeDefined(): R;
      toBe(expected: any): R;
      toContain(expected: any): R;
    }
  }
}

export {};
