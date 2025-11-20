export const ifWindow = <T>(dflt: T, fn: (w: Window) => T) =>
  typeof window === "undefined" ? dflt : fn(window);
