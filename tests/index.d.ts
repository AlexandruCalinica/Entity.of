export {};
declare global {
  namespace jest {
    interface Matchers<R> {
      toContainObject(object: Record<string, any>): R;
    }
  }
}
