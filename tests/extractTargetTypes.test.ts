import { extractTargetTypes } from "../src/core";

class MockEntity {
  static of() {}
}

describe("extractTargetTypes", () => {
  it('should return "NullablePrimitive<Type>" if Field is nullable', () => {
    const data = extractTargetTypes([
      {
        key: "a",
        type: () => String,
        value: null,
        options: { nullable: true },
      },
    ]);

    expect(data).toEqual({ a: "NullablePrimitive<String>" });
  });

  it('should return "NullableArray<Type>" if type is Array and Field is nullable', () => {
    const data = extractTargetTypes([
      {
        key: "a",
        type: () => [String],
        value: [null],
        options: { nullable: true },
      },
    ]);

    expect(data).toEqual({ a: "NullableArray<String>" });
  });

  it('should return "Array<Type>" if type is Array', () => {
    const data = extractTargetTypes([
      {
        key: "a",
        type: () => [String],
        value: ["hello"],
      },
    ]);

    expect(data).toEqual({ a: "Array<String>" });
  });

  it('should return "Primitive<Type>" if type is not Array', () => {
    const data = extractTargetTypes([
      {
        key: "a",
        type: () => String,
        value: "hello",
      },
    ]);

    expect(data).toEqual({ a: "Primitive<String>" });
  });

  it("should return Primitive<Type> if type is not Array and field is optional", () => {
    const data = extractTargetTypes([
      {
        key: "a",
        type: () => String,
        value: "hello",
        options: { optional: true },
      },
    ]);

    expect(data).toEqual({ a: "Primitive<String>" });
  });

  it("should return NullablePrimitive<Type> if type is not Array and field is nullable and optional", () => {
    const data = extractTargetTypes([
      {
        key: "a",
        type: () => String,
        value: null,
        options: { nullable: true, optional: true },
      },
    ]);

    expect(data).toEqual({ a: "NullablePrimitive<String>" });
  });

  it("should return Array<Type> if type is Array and field is optional", () => {
    const data = extractTargetTypes([
      {
        key: "a",
        type: () => [String],
        value: ["hello"],
        options: { optional: true },
      },
    ]);

    expect(data).toEqual({ a: "Array<String>" });
  });

  it("should return NullableArray<Type> if type is Array and field is nullable and optional", () => {
    const data = extractTargetTypes([
      {
        key: "a",
        type: () => [String],
        value: [null],
        options: { nullable: true, optional: true },
      },
    ]);

    expect(data).toEqual({ a: "NullableArray<String>" });
  });

  it("should return NullableArray<Record<Type>> if type is an Array containing a record of Primitive and field is nullable", () => {
    const data = extractTargetTypes([
      {
        key: "a",
        type: () => [{ MockEntity }],
        value: [null],
        options: { nullable: true },
      },
    ]);

    expect(data).toEqual({ a: "NullableArray<Record<MockEntity>>" });
  });

  it("should return NullablePrimitive<Record<Type>> if type is a Record containing a Primtive and field is nullable", () => {
    const data = extractTargetTypes([
      {
        key: "a",
        type: () => ({ MockEntity }),
        value: null,
        options: { nullable: true },
      },
    ]);

    expect(data).toEqual({ a: "NullablePrimitive<Record<MockEntity>>" });
  });

  it("should return NullableArray<Record<Type>> if type is an Array containing a record of Primitive and field is nullable and optional", () => {
    const data = extractTargetTypes([
      {
        key: "a",
        type: () => [{ MockEntity }],
        value: [null],
        options: { nullable: true, optional: true },
      },
    ]);

    expect(data).toEqual({ a: "NullableArray<Record<MockEntity>>" });
  });

  it("should return NullablePrimitive<Record<Type>> if type is a Record containing a Primtive and field is nullable and optional", () => {
    const data = extractTargetTypes([
      {
        key: "a",
        type: () => ({ MockEntity }),
        value: null,
        options: { nullable: true, optional: true },
      },
    ]);

    expect(data).toEqual({ a: "NullablePrimitive<Record<MockEntity>>" });
  });

  it("should return Array<Record<Type>> if type is an Array containing a record of Primitive and field is optional", () => {
    const data = extractTargetTypes([
      {
        key: "a",
        type: () => [{ MockEntity }],
        value: undefined,
        options: { optional: true },
      },
    ]);

    expect(data).toEqual({ a: "Array<Record<MockEntity>>" });
  });

  it("should return Primitive<Record<Type>> if type is a Record containing a Primtive and field is optional", () => {
    const data = extractTargetTypes([
      {
        key: "a",
        type: () => ({ MockEntity }),
        value: undefined,
        options: { optional: true },
      },
    ]);

    expect(data).toEqual({ a: "Primitive<Record<MockEntity>>" });
  });

  it("should return Array<Record<Type>> if type is an Array containing a record of Primitive", () => {
    const data = extractTargetTypes([
      {
        key: "a",
        type: () => [{ MockEntity }],
        value: [{ b: {} }],
      },
    ]);

    expect(data).toEqual({ a: "Array<Record<MockEntity>>" });
  });

  it("should return Primitive<Record<Type>> if type is a Record containing a Primitive", () => {
    const data = extractTargetTypes([
      {
        key: "a",
        type: () => ({ MockEntity }),
        value: { b: {} },
      },
    ]);

    expect(data).toEqual({ a: "Primitive<Record<MockEntity>>" });
  });
});
