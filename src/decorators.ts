import { createProducer, FieldOptions } from "./core";

export function Of(type?: () => any, options?: FieldOptions) {
  return function (target: any, key: string) {
    const owner = target.constructor;

    if (!owner.fields) {
      owner.fields = [];
    }

    owner.fields.push({ key, type, options });
  };
}

export function Producer(target: any, key: string) {
  const initial = target[key];

  target[key] = createProducer(target, key, initial);
}

export function Entity<T extends { new (...args: any[]): {} }>(constructor: T) {
  Object.assign(constructor, { of: createProducer(constructor as any, "of") });

  return constructor;
}

Entity.of = function <T>(): (data: Partial<T>) => T {
  return function (data) {
    return data as T;
  };
};
