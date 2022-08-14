import pick from "lodash/pick";
import omit from "lodash/omit";
import forIn from "lodash/forIn";
import difference from "lodash/difference";

export type MixedCtr<T> =
  | Ctr<T>
  | StringConstructor
  | BooleanConstructor
  | NumberConstructor;

export type StoreOptions = {
  enableWarnings?: boolean;
};

export type FieldOptions = {
  nullable?: boolean;
  optional?: boolean;
};

export type FieldProps = {
  key: string;
  type: (() => MixedCtr<any>) | (() => MixedCtr<any>[]);
  options?: FieldOptions;
};

export type Ctr<T> = {
  new (...args: any[]): T;
  fields?: FieldProps[];
  of: (data: Partial<T>) => T;
};

const getDefaultStoreValues = (options?: StoreOptions) => ({
  unknown: {},
  mistyped: {},
  entities: {},
  meta: {
    enableWarnings: options?.enableWarnings ?? false,
  },
});

export function getStore(options?: StoreOptions) {
  const store = (globalThis as any).__ENTITY_OF__;

  function init() {
    if (!(globalThis as any).__ENTITY_OF__) {
      (globalThis as any).__ENTITY_OF__ = getDefaultStoreValues(options);
    }
  }

  function register(owner: string) {
    let store = {
      ...(globalThis as any).__ENTITY_OF__,
    };

    if (!store.unknown[owner]) {
      store = { ...store, unknown: { ...store.unknown, [owner]: {} } };
    }

    if (!store.mistyped[owner]) {
      store = { ...store, mistyped: { ...store.mistyped, [owner]: {} } };
    }

    if (!store.entities[owner]) {
      store = {
        ...store,
        entities: { ...store.entities, [owner]: {} },
      };
    }

    (globalThis as any).__ENTITY_OF__ = store;
  }

  function set<T>(
    type: "unknown" | "mistyped" | "entities",
    owner: string,
    key: string
  ) {
    return function (updater: (prev: T) => T, initial?: T) {
      let _s = (globalThis as any).__ENTITY_OF__;

      _s[type][owner][key] = updater(
        (_s[type][owner][key] as T) || (initial as T)
      );
    };
  }

  function setEntity(owner: string) {
    return function (updater: (prev: any) => any, initial?: any) {
      let _s = (globalThis as any).__ENTITY_OF__;

      _s.entities[owner] = updater(
        (_s.entities[owner] as any) || (initial as any)
      );
    };
  }

  function reset() {
    (globalThis as any).__ENTITY_OF__ = getDefaultStoreValues(options);
  }

  function destroy() {
    delete (globalThis as any).__ENTITY_OF__;
  }

  return {
    set,
    init,
    reset,
    store,
    destroy,
    register,
    setEntity,
  };
}

export function mapObjectToEntity<T>(data: Partial<T>, Entity: Ctr<T>) {
  const fields = Entity.fields || [];
  const keys = fields.map(({ key }) => key);

  return Object.assign(new Entity(), pick(data, keys));
}

export function trackUnknownProps(
  owner: string,
  inputKeys: string[],
  targetKeys: string[]
) {
  const keysDiff = difference(inputKeys, targetKeys);
  const { store, register, set } = getStore();
  const shouldWarn = store.meta.enableWarnings;

  if (keysDiff.length) {
    const key = JSON.stringify(keysDiff);
    const setUnknownCount = set<number>("unknown", owner, key);

    if (!store[owner]) {
      register(owner);
    }

    setUnknownCount((count) => {
      if (shouldWarn && count === 0) {
        console.warn(
          `${owner} was initialized with unknown properties: ${keysDiff}`
        );
      }

      return count + 1;
    }, 0);
  }
}

export function isProducerField(
  { key, type }: FieldProps,
  producerName: string
) {
  // Check first () => [Producer] types
  if (Array.isArray(type())) {
    if ((type() as any[])[0] === Object) {
      throw new Error(
        `${key} 'type' function should not return an array containing a primitive Object constructor`
      );
    }

    if ((type() as any[])[0] === Array) {
      throw new Error(
        `${key} 'type' function should not return an array containing a primitive Array constructor`
      );
    }

    return (type() as any[])[0].hasOwnProperty(producerName);
  }

  if (type() === Array) {
    throw new Error(
      `${key} 'type' function should not return a primitive Array constructor`
    );
  }

  if ((type() as unknown as ObjectConstructor) === Object) {
    throw new Error(
      `${key} 'type' function should not return a primitive Object constructor`
    );
  }

  if (type() === String || type() === Number || type() === Boolean) {
    return false;
  } else {
    if (!(type() as any).hasOwnProperty(producerName)) {
      throw new Error("error");
    }

    return true;
  }
}

export function getProducerFields(
  fields: FieldProps[],
  producerName: string
): FieldProps[] {
  return fields.filter((field) => isProducerField(field, producerName));
}

export function produceEntries(
  initialData: Record<string, any>,
  fieldsWithProducer: FieldProps[]
): Record<string, any> {
  const result = fieldsWithProducer.reduce((acc, { key, type, options }) => {
    if (options?.optional && typeof initialData[key] === "undefined") {
      return acc;
    }

    if (options?.nullable && initialData[key] === null) {
      return acc;
    }

    if (Array.isArray(type())) {
      return {
        ...acc,
        [key]: (initialData[key] || []).map((v: any) => {
          if (options?.nullable) return v;
          return (type() as Ctr<any>[])[0].of(v);
        }),
      };
    }

    return {
      ...acc,
      [key]: (type() as Ctr<any>).of(initialData[key]),
    };
  }, {});

  return result;
}

export function extractInputTypes(fields: (FieldProps & { value: any })[]) {
  return fields.reduce((acc, { key, options, value }) => {
    let out: Record<string, string> = { ...acc };

    if (typeof value === "undefined") {
      if (options?.optional) {
        return out;
      }
    }

    if (value === null) {
      out[key] = `Null`;
      return out;
    }

    if (Array.isArray(value) && value.some((v) => v === null)) {
      out[key] = `Array<Null>`;
      return out;
    }

    const typeName = Array.isArray(value)
      ? value.length > 0
        ? value[0]?.constructor?.name
        : "Empty"
      : value?.constructor?.name;

    if (Array.isArray(value)) {
      out[key] = `Array<${typeName}>`;
      return out;
    }

    out[key] = `Primitive<${typeName}>`;

    return out;
  }, {} as Record<string, string>);
}

export function extractTargetTypes(fields: (FieldProps & { value: any })[]) {
  return fields.reduce((acc, { key, type, options }) => {
    let out: Record<string, string> = { ...acc };

    const typeName = Array.isArray(type())
      ? (type() as MixedCtr<any>[])[0].name
      : (type() as MixedCtr<any>).name;

    if (options?.nullable) {
      if (Array.isArray(type())) {
        out[key] = `NullableArray<${typeName}>`;
        return out;
      }

      out[key] = `NullablePrimitive<${typeName}>`;
      return out;
    }

    if (Array.isArray(type())) {
      out[key] = `Array<${typeName}>`;
      return out;
    }

    out[key] = `Primitive<${typeName}>`;
    return out;
  }, {} as Record<string, string>);
}

export function getInputTypes(
  fields: (FieldProps & { value: any })[],
  keysWithProducer: string[]
) {
  const allInputTypes = extractInputTypes(fields);

  const primitiveInputTypes: Record<string, any> = omit(
    allInputTypes,
    keysWithProducer
  );

  return {
    allInputTypes,
    primitiveInputTypes,
  };
}

export function getTargetTypes(
  fields: (FieldProps & { value: any })[],
  keysWithProducer: string[]
) {
  const allTargetTypes = extractTargetTypes(fields);

  const primitiveTargetTypes: Record<string, any> = omit(
    allTargetTypes,
    keysWithProducer
  );

  return {
    allTargetTypes,
    primitiveTargetTypes,
  };
}

export function trackWrongValues(
  owner: string,
  fields: (FieldProps & { value: any })[],
  keysWithProducer: string[]
) {
  const { primitiveInputTypes } = getInputTypes(fields, keysWithProducer);
  const { allTargetTypes, primitiveTargetTypes } = getTargetTypes(
    fields,
    keysWithProducer
  );

  const { store, register, set, init } = getStore();
  const shouldWarn = store.meta.enableWarnings;
  init();

  if (!store?.mistyped[owner]) {
    register(owner);
  }

  forIn(primitiveInputTypes, (inputType, key) => {
    const targetType: string = primitiveTargetTypes[key];
    const setMistypedCount = set<number>("mistyped", owner, key);

    if (targetType.startsWith("NullableArray")) {
      if (
        inputType === "Null" ||
        inputType === "Array<Null>" ||
        inputType === "Array<Empty>"
      ) {
        return;
      }
      if (inputType.startsWith("Array") && targetType.includes(inputType)) {
        return;
      }
    }

    if (targetType.startsWith("NullablePrimitive")) {
      if (inputType === "Null" || inputType === "Array<Null>") {
        return;
      }

      if (targetType.includes(inputType)) {
        return;
      }
    }

    if (targetType.startsWith("Array") && inputType.includes("Empty")) {
      return;
    }

    if (targetType !== inputType) {
      setMistypedCount((count) => {
        if (shouldWarn && count === 0) {
          console.warn(
            `<${owner}.${key}: ${allTargetTypes[key]}> property received a mistyped value: ${inputType}`
          );
        }

        return count + 1;
      }, 0);

      return;
    }
  });
}

export function trackEntity(
  name: string,
  fields: (FieldProps & { value: any })[]
) {
  const { store, setEntity } = getStore();

  if (!store?.entities || !store.entities[name]) return;

  const { allTargetTypes } = getTargetTypes(fields, []);
  const prev = JSON.stringify(allTargetTypes);
  const next = JSON.stringify(store.entities[name]);

  if (prev === next) return;

  setEntity(name)(() => allTargetTypes);
}

export function createProducer<T extends Ctr<T>>(
  target: T,
  producerName: string,
  callBack?: any
) {
  return function (data: Record<string, any> = {}) {
    const owner = target.name;
    const fields = target.fields as FieldProps[];
    const targetKeys = fields.map(({ key }) => key);
    const inputKeys = Object.keys(data);

    const fieldsWithProducer = getProducerFields(fields, producerName);
    const keysWithProducer = fieldsWithProducer.map(({ key }) => key);

    const producedEntries = produceEntries(data, fieldsWithProducer);
    const producedData = { ...data, ...producedEntries } as Partial<T>;

    const result = callBack
      ? callBack(producedData)
      : mapObjectToEntity(producedData, target);

    const fieldsWithValues = fields.map((field) => ({
      ...field,
      value: result[field.key as keyof T],
    }));

    trackEntity(owner, fieldsWithValues);
    trackWrongValues(owner, fieldsWithValues, keysWithProducer);
    trackUnknownProps(owner, inputKeys, targetKeys);

    return result;
  };
}

export function createEntityStore(options?: StoreOptions) {
  getStore(options).init();
}
