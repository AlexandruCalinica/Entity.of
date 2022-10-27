import pick from "lodash/pick";
import omit from "lodash/omit";
import forIn from "lodash/forIn";
import difference from "lodash/difference";

export type MixedCtr<T> =
  | Ctr<T>
  | Record<string, Ctr<T>>
  | StringConstructor
  | BooleanConstructor
  | NumberConstructor;

export type StoreOptions = {
  enableWarnings?: boolean;
};

export type FieldOptions = {
  nullable?: boolean;
  optional?: boolean;
  isCustom?: boolean;
  producerFields?: {
    [key: string]: string;
  };
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

export function mapObjectToEntity<T extends object>(
  data: Partial<T>,
  Entity: Ctr<T>
) {
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
  const t = type();

  // Check first () => [Producer] types
  if (Array.isArray(t)) {
    if ((t as any[])[0] === Object) {
      throw new Error(
        `${key} 'type' function should not return an array containing a primitive Object constructor`
      );
    }

    if ((t as any[])[0] === Array) {
      throw new Error(
        `${key} 'type' function should not return an array containing a primitive Array constructor`
      );
    }

    if (typeof (t as any[])[0] === "object" && (t as any[])[0] !== null) {
      const target = Object.values(t[0])[0];

      switch (target) {
        case Object:
          throw new Error(
            `${key} 'type' function should not return an array of records containing primitive Object constructors as values`
          );
        case Array:
          throw new Error(
            `${key} 'type' function should not return an array of records containing primitive Array constructors as values`
          );
        case Number:
          throw new Error(
            `${key} 'type' function should not return an array of records containing primitive Number constructors as values`
          );
        case String:
          throw new Error(
            `${key} 'type' function should not return an array of records containing primitive String constructors as values`
          );
        case Boolean:
          throw new Error(
            `${key} 'type' function should not return an array of records containing primitive Boolean constructors as values`
          );
        default:
          return target.hasOwnProperty(producerName);
      }
    }

    return t[0].hasOwnProperty(producerName);
  }

  if (typeof t === "object" && !Array.isArray(t) && t !== null) {
    const target = Object.values(t) as any[];

    switch (target[0]) {
      case Object:
        throw new Error(
          `${key} 'type' function should not return a record containing a primitive Object constructor as value`
        );
      case Array:
        throw new Error(
          `${key} 'type' function should not return a record containing a primitive Array constructor as value`
        );
      default:
        return (
          target.filter((v) => v.hasOwnProperty(producerName)).length ===
          target.length
        );
    }
  }

  switch (t as any) {
    case Array:
      throw new Error(
        `${key} 'type' function should not return a primitive Array constructor`
      );
    case Object:
      throw new Error(
        `${key} 'type' function should not return a primitive Object constructor`
      );
    case Number:
    case String:
    case Boolean:
      return false;
    default:
      if (!t.hasOwnProperty(producerName)) {
        throw new Error("Missing producer method - of");
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
      if (
        typeof (type() as Ctr<any>[])[0] === "object" &&
        (type() as Ctr<any>[])[0] !== null
      ) {
        return {
          ...acc,
          [key]: (initialData[key] || []).map((item: any) => {
            return Object.entries(item).reduce((acc, curr) => {
              const [k, v] = curr;
              const entity = Object.values(
                (type() as Record<string, Ctr<any>>[])[0]
              )[0];
              return { ...acc, [k]: entity.of(v as any) };
            }, {});
          }),
        };
      }

      return {
        ...acc,
        [key]: (initialData[key] || []).map((v: any) => {
          if (options?.nullable) return v;
          return (type() as Ctr<any>[])[0].of(v);
        }),
      };
    }

    if (
      typeof type() === "object" &&
      !Array.isArray(type()) &&
      type() !== null
    ) {
      return {
        ...acc,
        [key]: Object.entries(initialData[key] || []).reduce((acc, curr) => {
          const [k, v] = curr;
          const entities = Object.values(
            type() as Record<string, Ctr<any>>
          ).filter((v) => v.hasOwnProperty("of"));

          if (options && options?.producerFields) {
            if (options.producerFields[k]) {
              const entity = entities.find(
                (v) => v.name === options?.producerFields?.[k]
              ) as Ctr<any>;

              if (entity) {
                return { ...acc, [k]: entity.of(v as any) };
              }
            }
            return { ...acc, [k]: v };
          }

          if (!entities[0]) return { ...acc, [k]: v };
          return { ...acc, [k]: entities[0].of(v as any) };
        }, {}),
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

    let typeName = Array.isArray(value)
      ? value.length > 0
        ? value[0]?.constructor?.name
        : "Empty"
      : value?.constructor?.name;

    if (
      options?.isCustom &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.values(value).length
    ) {
      const values = Object.entries(value)
        .map(([k, v]) => {
          if (options?.producerFields?.[k]) {
            return options.producerFields[k];
          }
          return (v as any).constructor.name;
        })
        .sort();

      const uniqueValues = [...new Set(values)];
      typeName = `Record<${uniqueValues.join("|")}>`;
    }

    if (Array.isArray(value)) {
      out[key] = `Array<${typeName}>`;
      return out;
    }

    out[key] = `Primitive<${typeName}>`;
    return out;
  }, {} as Record<string, string>);
}

export function extractTargetTypes(fields: (FieldProps & { value: any })[]) {
  const result = fields.reduce((acc, { key, type, options }) => {
    let out: Record<string, string> = { ...acc };

    let typeName = "";

    if (Array.isArray(type())) {
      if (
        typeof (type() as Record<string, MixedCtr<any>>[])[0] === "object" &&
        (type() as Record<string, MixedCtr<any>>[])[0] !== null
      ) {
        typeName = Object.values((type() as MixedCtr<any>[])[0])[0].name;
      } else {
        typeName = (type() as MixedCtr<any>[])[0].name as string;
      }
    } else {
      if (
        typeof type() === "object" &&
        !Array.isArray(type()) &&
        type() !== null
      ) {
        typeName = Object.values(type() as MixedCtr<any>)
          .map((v) => v.name)
          .sort()
          .join("|");
      } else {
        typeName = (type() as MixedCtr<any>).name as string;
      }
    }

    if (options?.nullable) {
      if (Array.isArray(type())) {
        if (typeof (type() as any[])[0] === "object") {
          out[key] = `NullableArray<Record<${typeName}>>`;
          return out;
        }
        out[key] = `NullableArray<${typeName}>`;
        return out;
      }

      if (typeof type() === "object") {
        out[key] = `NullablePrimitive<Record<${typeName}>>`;
        return out;
      }
      out[key] = `NullablePrimitive<${typeName}>`;
      return out;
    }

    if (Array.isArray(type())) {
      if (typeof (type() as any[])[0] === "object") {
        out[key] = `Array<Record<${typeName}>>`;
        return out;
      }
      out[key] = `Array<${typeName}>`;
      return out;
    }

    if (typeof type() === "object") {
      out[key] = `Primitive<Record<${typeName}>>`;
      return out;
    }
    out[key] = `Primitive<${typeName}>`;
    return out;
  }, {} as Record<string, string>);

  return result;
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

    if (
      targetType.startsWith("NullablePrimitive<Record") &&
      targetType.includes("|")
    ) {
      const targetTypes = targetType
        .replace("NullablePrimitive<Record<", "")
        .replace(">>", "")
        .split("|");

      const inputTypes = inputType
        .replace("Primitive<Record<", "")
        .replace(">>", "")
        .split("|") as any[];

      const isSubset = inputTypes.every((t) => targetTypes.includes(t));

      if (isSubset) {
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

    if (targetType.startsWith("Primitive<Record") && targetType.includes("|")) {
      const targetTypes = targetType
        .replace("Primitive<Record<", "")
        .replace(">>", "")
        .split("|");

      const inputTypes = inputType
        .replace("Primitive<Record<", "")
        .replace(">>", "")
        .split("|") as any[];

      const isSubset = inputTypes.every((t) => targetTypes.includes(t));

      if (isSubset) {
        return;
      }
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
  const { store, setEntity, register } = getStore();

  if (!store?.entities) return;
  if (!store.entities[name]) {
    register(name);
  }

  const { allTargetTypes } = getTargetTypes(fields, []);
  const prev = JSON.stringify(allTargetTypes);
  const next = JSON.stringify(getStore().store.entities[name]);

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
