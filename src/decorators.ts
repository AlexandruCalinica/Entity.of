import { createProducer } from "./core";

export function Of(type?: () => any) {
  return function (target: any, key: string) {
    const owner = target.constructor;

    if (!owner.fields) {
      owner.fields = [];
    }

    owner.fields.push({ key, type });
  };
}

export function Producer(target: any, key: string) {
  const initial = target[key];

  target[key] = createProducer(target, key, initial);
}

export function Entity<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    // solve constructor type -> inside createProducer;
    static of: (data: Partial<T>) => T = createProducer(
      constructor as any,
      "of"
    );
  };
}

Entity.of = function <T>(): (data: Partial<T>) => T {
  return function (data) {
    return data as T;
  };
};
