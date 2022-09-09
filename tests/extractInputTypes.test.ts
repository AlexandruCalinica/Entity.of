import { extractInputTypes } from "../src/core";

class MockEntity {
  static of() {}
}

describe("extractInputTypes", () => {
  it('should return "Null" if value is null', () => {
    const data = extractInputTypes([
      { key: "a", type: () => String, value: null },
    ]);

    expect(data).toEqual({ a: "Null" });
  });

  it('should return "Null" if value is null and Field is nullable', () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => String,
        value: null,
        options: { nullable: true },
      },
    ]);

    expect(data).toEqual({ a: "Null" });
  });

  it('should return "Null" if value is null, Field is nullable and optional', () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => String,
        value: null,
        options: { nullable: true, optional: true },
      },
    ]);

    expect(data).toEqual({ a: "Null" });
  });

  it('should return "Array<Null>" if value is Array and contains null', () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => String,
        value: [null],
      },
    ]);

    expect(data).toEqual({ a: "Array<Null>" });
  });

  it('should return "Array<Null>" if value is Array, contains null and Field is nullable', () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => String,
        value: [null],
        options: { nullable: true },
      },
    ]);

    expect(data).toEqual({ a: "Array<Null>" });
  });

  it('should return "Array<Null>" if value is Array, contains null Field, is nullable and optional', () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => String,
        value: [null],
        options: { nullable: true, optional: true },
      },
    ]);

    expect(data).toEqual({ a: "Array<Null>" });
  });

  it('should return "Array<Type>" if value is Array', () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => String,
        value: ["hello"],
      },
    ]);

    expect(data).toEqual({ a: "Array<String>" });
  });

  it('should return "Primitive<Type>" if value is not Array', () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => String,
        value: "hello",
      },
    ]);

    expect(data).toEqual({ a: "Primitive<String>" });
  });

  it("should return Array<Empty> if value is and empty array", () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => [String],
        value: [],
      },
    ]);

    expect(data).toEqual({ a: "Array<Empty>" });
  });

  it("should not return a type entry if value is undefined and field is optional", () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => String,
        value: undefined,
        options: { optional: true },
      },
    ]);

    expect(data).toEqual({});
  });

  it("should not return a type entry if value is undefined and field is optional and nullable", () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => String,
        value: undefined,
        options: { optional: true, nullable: true },
      },
    ]);

    expect(data).toEqual({});
  });

  it("should return Primitive<undefined> if value is undefined and field is not optional", () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => String,
        value: undefined,
      },
    ]);

    expect(data).toEqual({
      a: "Primitive<undefined>",
    });
  });

  it("should return Primitive<undefined> if value is undefined and field is nullable and not optional", () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => String,
        value: undefined,
        options: { nullable: true },
      },
    ]);

    expect(data).toEqual({
      a: "Primitive<undefined>",
    });
  });

  it("should return Primitive<Record> if value is a Record<string, Primitive>", () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => ({ MockEntity }),
        value: { b: {} },
      },
    ]);

    expect(data).toEqual({
      a: "Primitive<Object>",
    });
  });

  it("should return Array<Record> if value is a Record<string, Primitive>[]", () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => [{ MockEntity }],
        value: [{ b: {} }],
      },
    ]);

    expect(data).toEqual({
      a: "Array<Object>",
    });
  });
});
