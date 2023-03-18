export type EntityConstructor<T = unknown> = Function & {
  of: (data: Partial<T>) => T;
  types: Record<string, T>;
};

export type Entity<T = unknown> = {
  of: (data: Partial<T>) => T;
} & {
  new (...args: any[]): {};
};

export type ParseMeta = {
  key: string;
  owner: string;
};

export type T = {
  value: string;
  isOptional: boolean;
  isNullable: boolean;
  entities?: Record<string, Function | EntityConstructor<T>>;
  optional: () => T;
  nullable: () => T;
  mapper?: (value: any) => any;
};

export type TRecord = T & { _proto_: "record" };
export type TArray = T & { _proto_: "array" };
export type TUnion = T & { _proto_: "union" };
export type TCustom = T & { _proto_: "custom" };
export type TAny = T & { _proto_: "any" };
