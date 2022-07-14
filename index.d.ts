declare global {
  namespace jest {
    interface Matchers<R> {
      toContainObject(): any;
    }
  }
}
