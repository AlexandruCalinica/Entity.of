import { T, TAny, TArray, TCustom, TRecord, TUnion, Entity } from "./types";

function optional(arg: T): T {
  return t({
    ...arg,
    value: arg.value + " | " + "undefined",
    isOptional: true,
  });
}

function nullable(arg: T): T {
  return t({
    ...arg,
    value: arg.value + " | " + "null",
    isNullable: true,
  });
}

function withBaseProps(
  arg: Pick<
    TRecord | TArray | TUnion | TCustom | TAny,
    "value" | "entities" | "mapper" | "_proto_"
  >
): T {
  const next = {
    ...arg,
    isNullable: false,
    isOptional: false,
    optional: () => optional({ ...next }),
    nullable: () => nullable({ ...next }),
  };

  return next;
}

function union(...args: (Entity | TRecord)[]): TUnion;
function union(...args: Entity[]): TUnion;
function union(
  ...args: (StringConstructor | NumberConstructor | BooleanConstructor)[]
): TUnion;
function union(...args: unknown[]): T {
  const next = {
    value: args
      .map((arg) => (typeof arg === "function" ? arg.name : (arg as T).value))
      .join(" | "),
    entities: (args as (Function | T)[]).reduce((acc, cur) => {
      if (typeof cur === "function") {
        return { ...acc, [cur.name]: cur };
      }

      return { ...acc, ...(cur as T).entities };
    }, {}),
    _proto_: "union" as const,
  };

  return withBaseProps(next);
}

function array(arg: Function): TArray;
function array(arg: T): TArray;
function array(arg: unknown): unknown {
  const next = {
    value: `Array<${typeof arg === "function" ? arg.name : (arg as T).value}>`,
    entities:
      typeof arg === "function"
        ? { [arg.name]: arg }
        : { ...(arg as T).entities },
    _proto_: "array" as const,
  };

  return withBaseProps(next);
}

function record(key: Function, value: Function): TRecord;
function record(key: Function, value: T): TRecord;
function record(key: Function, value: unknown): unknown {
  const next = {
    value: `Record<${key.name}, ${
      typeof value === "function" ? value.name : (value as T).value
    }>`,
    entities:
      typeof value === "function"
        ? { [value.name]: value }
        : { ...(value as T).entities },
    _proto_: "record" as const,
  };

  return withBaseProps(next);
}

function custom(callbackfn: (v: any) => any): T {
  return withBaseProps({
    value: "custom",
    mapper: callbackfn,
    _proto_: "custom" as const,
  });
}

function t(constr: Function): T;
function t(t: T): T;
function t(arg: unknown): unknown {
  if (typeof arg === "object") {
    const next = { ...arg } as T;
    const res = {
      ...next,
      optional: !next.isOptional ? () => optional(res) : () => res,
      nullable: !next.isNullable ? () => nullable(res) : () => res,
    } as T;

    return res;
  }

  if (typeof arg === "function") {
    const next = {
      value: arg.name,
      entities: { [arg.name]: arg },
      _proto_: "any" as const,
    };

    return withBaseProps(next);
  }
}

export type TFunction = typeof t;

t.union = union;
t.array = array;
t.record = record;
t.custom = custom;

export { t };
