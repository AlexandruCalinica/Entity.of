import { createProducer, FieldOptions } from "./core";
import { t, TFunction } from "./typer";
import { parse } from "./parser";
import { T } from "./types";
import { Log } from "./logger";

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

export function type(type: (t: TFunction) => T) {
  return function (target: any, key: string) {
    const owner = target.constructor;

    if (!owner.types) {
      owner.types = {};
    }

    const { optional: _, nullable: __, ...typeProps } = type(t);
    owner.types[key] = typeProps;
  };
}

export function entity() {
  return function <C extends { new (...args: any[]): {} }>(constr: C) {
    function of(values: C): C {
      for (const key in values) {
        if (!(constr as any).types[key]) {
          Log.unknown({
            entityName: constr.name,
            property: key,
            received: values[key],
          });

          delete values[key];
          continue;
        }

        const type = (constr as any).types[key];
        let next = parse(type, values[key], { key, owner: constr.name });

        if (!next && (!type.isOptional || !type.isNullable)) {
          delete values[key];
          continue;
        } else {
          values[key] = next;
        }
      }

      return Object.assign(new constr(), values);
    }

    Object.assign(constr, { of });

    return constr;
  };
}

entity.of = function <T>(): (data: Partial<T>) => T {
  return function (data) {
    return data as T;
  };
};
