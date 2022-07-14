import pick from "lodash/pick";
import omit from "lodash/omit";
import forIn from "lodash/forIn";
import difference from "lodash/difference";

type MixedCtr<T> =
  | Ctr<T>
  | StringConstructor
  | BooleanConstructor
  | NumberConstructor;

export type FieldProps = {
  key: string;
  type: (() => MixedCtr<any>) | (() => MixedCtr<any>[]);
};

export type Ctr<T> = {
  new (...args: any[]): T;
  fields?: FieldProps[];
  of: (data: Partial<T>) => T;
};

export function getStore() {
  const store = (globalThis as any).__s__;

  function initStore() {
    if (!(globalThis as any).__s__) {
      (globalThis as any).__s__ = {
        unknown: {},
        mistyped: {},
        instances: {},
      };
    }
  }

  function registerEntity(owner: string) {
    let store = {
      ...(globalThis as any).__s__,
    };

    if (!store.unknown[owner]) {
      store = { ...store, unknown: { ...store.unknown, [owner]: {} } };
    }

    if (!store.mistyped[owner]) {
      store = { ...store, mistyped: { ...store.mistyped, [owner]: {} } };
    }

    if (!store.instances[owner]) {
      store = {
        ...store,
        instances: { ...store.instances, [owner]: {} },
      };
    }

    (globalThis as any).__s__ = store;
  }

  function setStore<T>(
    type: "unknown" | "mistyped" | "instances",
    owner: string,
    key: string
  ) {
    return function (updater: (prev: T) => T, initial?: T) {
      let _s = (globalThis as any).__s__;

      _s[type][owner][key] = updater(
        (_s[type][owner][key] as T) || (initial as T)
      );
    };
  }

  function resetStore() {
    (globalThis as any).__s__ = {
      unknown: {},
      mistyped: {},
      instances: {},
    };
  }

  function destroyStore() {
    delete (globalThis as any).__s__;
  }

  return {
    store,
    setStore,
    initStore,
    resetStore,
    destroyStore,
    registerEntity,
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
  const { store, registerEntity, setStore } = getStore();

  if (keysDiff.length) {
    const key = JSON.stringify(keysDiff);
    const setUnknownCount = setStore<number>("unknown", owner, key);

    if (!store[owner]) {
      registerEntity(owner);
    }

    setUnknownCount((count) => {
      if (count === 0) {
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
  return fieldsWithProducer.reduce((prev, { key, type }) => {
    if (Array.isArray(type())) {
      return {
        ...prev,
        [key]: (initialData[key] || []).map((v: any) =>
          (type() as Ctr<any>[])[0].of(v)
        ),
      };
    }

    return {
      ...prev,
      [key]: (type() as Ctr<any>).of(initialData[key]),
    };
  }, {});
}

export function getInputTypes(
  producedData: Record<string, any>,
  keysWithProducer: string[]
) {
  const allInputTypes: Record<string, any> = Object.entries(
    producedData
  ).reduce((prev, [key, value]) => {
    if (Array.isArray(value)) {
      return {
        ...prev,
        [key]: (value as any[]).map((v) => v.constructor.name),
      };
    }
    return { ...prev, [key]: (value as any).constructor.name };
  }, {});

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
  fields: FieldProps[],
  keysWithProducer: string[]
) {
  const allTargetTypes: Record<string, any> = fields.reduce(
    (prev, { key, type }) => {
      if (Array.isArray(type())) {
        return { ...prev, [key]: [(type() as any[])[0].name] };
      }
      return { ...prev, [key]: (type() as any).name };
    },
    {}
  );

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
  fields: FieldProps[],
  producedData: Record<string, any>,
  keysWithProducer: string[]
) {
  const { primitiveInputTypes } = getInputTypes(producedData, keysWithProducer);
  const { allTargetTypes, primitiveTargetTypes } = getTargetTypes(
    fields,
    keysWithProducer
  );

  const { store, registerEntity, setStore, initStore } = getStore();
  initStore();

  if (!store?.mistyped[owner]) {
    registerEntity(owner);
  }

  forIn(primitiveInputTypes, (v, k) => {
    const setMistypedCount = setStore<number>("mistyped", owner, k);

    if (Array.isArray(v)) {
      if (v.some((v) => !primitiveTargetTypes[k].includes(v))) {
        setMistypedCount((count) => {
          if (count === 0) {
            console.warn(
              `<${owner}.${k}: ${allTargetTypes[k]}> property received a mistyped value: ${v}`
            );
          }

          return count + 1;
        }, 0);
      }
      return;
    }

    if (primitiveTargetTypes[k] !== v) {
      setMistypedCount((count) => {
        if (count === 0) {
          console.warn(
            `<${owner}.${k}: ${allTargetTypes[k]}> property received a mistyped value: ${v}`
          );
        }

        return count + 1;
      }, 0);

      return;
    }
  });
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

    trackWrongValues(owner, fields, producedData, keysWithProducer);
    trackUnknownProps(owner, inputKeys, targetKeys);

    return callBack
      ? callBack(producedData)
      : mapObjectToEntity(producedData, target);
  };
}
