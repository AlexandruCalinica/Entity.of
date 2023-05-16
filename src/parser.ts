import { Log } from "./logger";
import { clone, capitalize } from "./utils";
import { T, EntityConstructor, ParseMeta } from "./types";

function parseArray(type: T, value: unknown, meta: ParseMeta): any {
  if (type.value.startsWith("Array")) {
    if (!Array.isArray(value)) {
      Log.mismatch({
        expected: type,
        received: value,
        entityName: meta.owner,
        property: meta.key,
      });

      // valueIsNotArray
      return;
    }

    for (const val of value) {
      const targetTypes = Object.keys(type.entities ?? {});
      const valueType = (() => {
        if (typeof val === "object") {
          if (val === null) return "null";
          if (Array.isArray(val)) return "Array";

          const valueKeys = Object.keys(val as any);
          let valueIsEntity = false;
          let entityName: string | null = null;

          for (const name in type.entities) {
            if (["String", "Number", "Boolean"].includes(name)) continue;

            const entity = type.entities[name] as EntityConstructor;
            const entityTypeFields = Object.keys(entity.types);

            if (entityTypeFields.length !== valueKeys.length) {
              valueIsEntity = false;
            }

            for (const key in val as any) {
              if (!entity.types[key]) {
                valueIsEntity = false;
                break;
              }

              valueIsEntity = true;
            }

            if (valueIsEntity) {
              entityName = entity.name;
              break;
            }
          }

          if (valueIsEntity && entityName) return entityName;

          return "Record";
        }
        return capitalize(typeof val);
      })();

      if (targetTypes.includes(valueType)) {
        continue;
      }

      if (valueType === "Record") {
        const recordValType = capitalize(typeof Object.values(val)[0]);
        const ArrayRecordType = `Array<Record<String, ${recordValType}>>`;

        if (type.value === ArrayRecordType) continue;
      }

      Log.mismatch({
        expected: type,
        received: { overwrite: `Array<${valueType}>` },
        entityName: meta.owner,
        property: meta.key,
      });
    }

    const strippedType = type.value.replace("Array<", "").replace(">", "");
    const arrLength = (value as any[]).length;

    for (let i = 0; i < arrLength; i++) {
      (value as any[])[i] = parse(
        { ...type, value: strippedType },
        (value as any[])[i],
        meta
      );
    }
  }

  if (Array.isArray(value)) {
    return value.filter((v) => v !== undefined);
  }
  return value;
}

function parseRecord(type: T, value: unknown, meta: ParseMeta): any {
  if (type.value.startsWith("Record")) {
    if (typeof value !== "object" || Array.isArray(value) || value === null) {
      Log.mismatch({
        expected: type,
        received: value,
        entityName: meta.owner,
        property: meta.key,
      });
      return "__mismatch__";
    }

    // check primitive record values for mismatch
    for (const key in value) {
      const splittedType = type.value.split(", ");

      const recordValueType = splittedType?.[1];
      const inputType = capitalize(typeof (value as any)[key]);

      if (
        recordValueType?.includes(inputType) ||
        !["String", "Number", "Boolean"].includes(inputType)
      ) {
        continue;
      }

      Log.mismatch({
        expected: type,
        received: { overwrite: `${splittedType[0]}, ${inputType}>` },
        entityName: meta.owner,
        property: meta.key,
      });
    }

    const strippedType = (() => {
      let arr = type.value.replace("Record<", "").replace(">", "").split(", ");
      arr.shift();
      return arr.join(", ");
    })();

    for (const key in value as any) {
      (value as any)[key] = parse(
        { ...type, value: strippedType },
        (value as any)[key],
        meta
      );
    }
  }
}

function parseArrayUnion(
  t: string,
  type: T,
  value: unknown,
  meta: ParseMeta
): any {
  if (Array.isArray(value)) {
    if (!t.startsWith("Array")) {
      Log.mismatch({
        expected: type,
        received: value,
        entityName: meta.owner,
        property: meta.key,
      });
      return "__mismatch__";
    }

    const strippedType = t.replace("Array<", "").replace(">", "");
    const arrLength = (value as any[]).length;

    for (let i = 0; i < arrLength; i++) {
      if (typeof (value as any[])[i] !== "object") {
        continue;
      }

      (value as any[])[i] = parse(
        { ...type, value: strippedType },
        (value as any[])[i],
        meta
      );
    }

    return value;
  }
}

function parseBasicUnion(
  t: string,
  type: T,
  value: unknown,
  meta: ParseMeta
): any {
  if (
    !["String", "Number", "Boolean"].includes(t) &&
    type?.entities?.[t] &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    value !== null
  ) {
    return parse({ ...type, value: t }, value, meta);
  }

  Log.mismatch({
    expected: type,
    received: value,
    entityName: meta.owner,
    property: meta.key,
  });
  return "__mismatch__";
}

function parseRecordOrEntityUnion(
  t: string,
  type: T,
  value: unknown,
  meta: ParseMeta
): any {
  if (typeof value === "object" && !Array.isArray(value) && value !== null) {
    if (["String", "Number", "Boolean"].includes(t)) {
      Log.mismatch({
        expected: type,
        received: value,
        entityName: meta.owner,
        property: meta.key,
      });
      return "__mismatch__";
    }

    const valueKeys = Object.keys(value as any);
    let valueIsEntity = false;

    for (const name in type.entities) {
      if (["String", "Number", "Boolean"].includes(name)) continue;

      const entity = type.entities[name] as EntityConstructor;
      const entityTypeFields = Object.keys(entity.types);

      if (entityTypeFields.length !== valueKeys.length) {
        valueIsEntity = false;
      }

      for (const key in value as any) {
        if (!entity.types[key]) {
          valueIsEntity = false;
          break;
        }

        valueIsEntity = true;
      }

      if (valueIsEntity) {
        return parse({ ...type, value: name }, value, meta);
      }
    }

    if (t.startsWith("Record") || !valueIsEntity) {
      const strippedType = (() => {
        if (!valueIsEntity) {
          let recordType = "";
          const types = type.value.split(" | ");

          for (const name of types) {
            if (!name.startsWith("Record")) continue;
            recordType = name;
          }

          return recordType;
        }

        let arr = t.replace("Record<", "").replace(">", "").split(", ");
        arr.shift();
        return arr.join(", ");
      })();

      // check primitive record values for mismatch
      for (const key in value) {
        const splittedType = strippedType.split(", ");

        const recordValueType = splittedType?.[1];
        const inputType = (() => {
          if (typeof (value as any)[key] === "object") {
            if (value === null) return "null";
            if (Array.isArray((value as any)[key])) {
              return "Array";
            }
            return "Record";
          }

          return capitalize(typeof (value as any)[key]);
        })();

        if (
          recordValueType?.includes(inputType) ||
          ["String", "Number", "Boolean"].includes(inputType)
        ) {
          continue;
        }

        Log.mismatch({
          expected: type,
          received: { overwrite: `${splittedType[0]}, ${inputType}>` },
          entityName: meta.owner,
          property: meta.key,
        });

        delete (value as any)[key];
      }

      if (Object.values(value as any).every((v) => typeof v === "object")) {
        for (const key in value as any) {
          (value as any)[key] = parse(
            { ...type, value: strippedType },
            (value as any)[key],
            meta
          );
        }
      } else {
        value = parse({ ...type, value: strippedType }, value, meta);
      }

      return value;
    }
  }
}

function parseUnion(type: T, value: unknown, meta: ParseMeta): any {
  if (
    type.value.includes(" | ") &&
    !type.value.startsWith("Record") &&
    !type.value.startsWith("Array")
  ) {
    const types = type.value.split(" | ");
    const typesLength = types.length;

    let out: any;

    for (let i = 0; i < typesLength; i++) {
      const t = types[i];

      // if value is a non-object primitive
      if (
        typeof value !== "object" &&
        types.includes(capitalize(typeof value))
      ) {
        break;
      }

      // if value is a record or an entity
      out = parseRecordOrEntityUnion(t, type, value, meta);
      if (out) return out;
      // if value is an array
      out = parseArrayUnion(t, type, value, meta);
      if (out) return out;
      // if value is either a non-object primitive or an entity
      out = parseBasicUnion(t, type, value, meta);
      if (out) return out;
    }
  }
}

function parsePrimitive(type: T, value: unknown, meta: ParseMeta): boolean {
  if (
    (typeof value === "object" &&
      ["String", "Number", "Boolean"].includes(type.value)) ||
    (typeof value === "string" && !type.value.includes("String")) ||
    (typeof value === "number" && !type.value.includes("Number")) ||
    (typeof value === "boolean" && !type.value.includes("Boolean"))
  ) {
    Log.mismatch({
      expected: type,
      received: value,
      entityName: meta.owner,
      property: meta.key,
    });

    return true;
  }
  return false;
}

function parse(type: T, value: unknown, meta: ParseMeta): any {
  let next = clone(value);
  if (type.mapper && type.value === "custom") return type.mapper(next);

  if (type.isOptional && value === undefined) return;
  if (type.isNullable && value === null) return next;

  const array = parseArray(type, next, meta);
  if (array === undefined) return;

  const record = parseRecord(type, next, meta);
  if (record === "__mismatch__") return;

  const union = parseUnion(type, next, meta);
  if (union === "__mismatch__") return;
  if (union) next = union;

  if (type.entities) {
    const typeName = type.value;
    const entities = type.entities;
    const entity = entities[typeName] as EntityConstructor;

    if (entity && Object.hasOwn(entity, "of")) {
      // parse record values
      if (typeof next === "object" && !Array.isArray(next) && next !== null) {
        if (Object.values(next as any).every((v) => typeof v !== "object")) {
          next = entity.of(next as any);
          return next;
        }

        let isMismatching = false;
        for (const key in next) {
          if (
            ["String", "Number", "Boolean"].includes(
              (entity.types[key] as T).value
            )
          ) {
            isMismatching = true;
            Log.mismatch({
              expected: entity.types[key] as T,
              received: next[key],
              entityName: typeName,
              property: key,
            });
            (next as any)[key] = undefined;
          } else {
            (next as any)[key] = entity.of(
              (next as Record<string, Partial<unknown>>)[key]
            );
          }
        }
        if (!isMismatching) return next;
      }

      // parse singles entity values
      if (typeof next === "object" && !Array.isArray(next) && next !== null) {
        next = entity.of(next as Partial<unknown>);
        return next;
      } else {
        Log.mismatch({
          expected: type,
          received: value,
          entityName: meta.owner,
          property: meta.key,
        });
        return;
      }
    }
  }

  if (parsePrimitive(type, next, meta)) return;

  if (Array.isArray(next)) {
    return next.filter((v) => v !== undefined);
  }
  if (typeof next === "object" && next !== null) {
    for (const key in next) {
      if (next[key] === undefined) delete next[key];
    }
  }

  return next;
}

export { parse };
