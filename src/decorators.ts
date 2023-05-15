import { t, TFunction } from "./typer";
import { parse } from "./parser";
import { T } from "./types";
import { Log } from "./logger";

export function Of(type: (t: TFunction) => T) {
  return function (target: any, key: string) {
    const owner = target.constructor;

    if (!owner.types) {
      owner.types = {};
    }

    const { optional: _, nullable: __, ...typeProps } = type(t);
    owner.types[key] = typeProps;
  };
}

export interface Entity<T> {
  of(data: Partial<T>): T;
}
export function Entity() {
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

Entity.of = function <T>(): (data: Partial<T>) => T {
  return function (data) {
    return data as T;
  };
};
