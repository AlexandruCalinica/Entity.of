import { extractInputTypes } from "../src/core";

class MockEntity {
  static of() {}
}
class MockEntity2 {
  static of() {}
}
class MockEntity3 {
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

  it("should return Primitive<Object> if value is a Record<string, Primitive>", () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => ({ MockEntity }),
        value: { b: {} },
      },
    ]);
    const data2 = extractInputTypes([
      {
        key: "a",
        type: () => ({ String } as any),
        value: { b: "hello" },
      },
    ]);
    const data3 = extractInputTypes([
      {
        key: "a",
        type: () => ({ Number } as any),
        value: { b: 1 },
      },
    ]);
    const data4 = extractInputTypes([
      {
        key: "a",
        type: () => ({ Boolean } as any),
        value: { b: true },
      },
    ]);

    expect(data).toEqual({
      a: "Primitive<Object>",
    });
    expect(data2).toEqual({
      a: "Primitive<Object>",
    });
    expect(data3).toEqual({
      a: "Primitive<Object>",
    });
    expect(data4).toEqual({
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

  it("should return Primitive<Record<Boolean|Number|String>> if value is a Record<string, boolean | number | string> and isCustom is true", () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => ({ Boolean, String, Number } as any),
        value: { a: "hello", b: true, c: 1 },
        options: {
          isCustom: true,
        },
      },
    ]);
    const data2 = extractInputTypes([
      {
        key: "a",
        type: () => ({ Boolean } as any),
        value: { b: true },
        options: {
          isCustom: true,
        },
      },
    ]);
    const data3 = extractInputTypes([
      {
        key: "a",
        type: () => ({ Number } as any),
        value: { b: 1 },
        options: {
          isCustom: true,
        },
      },
    ]);
    const data4 = extractInputTypes([
      {
        key: "a",
        type: () => ({ String } as any),
        value: { b: "hello" },
        options: {
          isCustom: true,
        },
      },
    ]);

    expect(data).toEqual({
      a: "Primitive<Record<Boolean|Number|String>>",
    });
    expect(data2).toEqual({
      a: "Primitive<Record<Boolean>>",
    });
    expect(data3).toEqual({
      a: "Primitive<Record<Number>>",
    });
    expect(data4).toEqual({
      a: "Primitive<Record<String>>",
    });
  });

  it("should return Primitive<Record<Boolean|MockEntity|Number|String>> if value is a Record<string, boolean | number | string | MockEntity> and isCustom is true", () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => ({ Boolean, String, Number, MockEntity } as any),
        value: { a: "hello", b: true, c: 1, mock: {} },
        options: {
          isCustom: true,
          producerFields: {
            mock: "MockEntity",
          },
        },
      },
    ]);

    expect(data).toEqual({
      a: "Primitive<Record<Boolean|MockEntity|Number|String>>",
    });
  });

  it("should return Primitive<Record<MockEntity>> if value is a Record<string, MockEntity> and isCustom is true", () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => ({ MockEntity } as any),
        value: { mock: {} },
        options: {
          isCustom: true,
          producerFields: {
            mock: "MockEntity",
          },
        },
      },
    ]);
    const data2 = extractInputTypes([
      {
        key: "a",
        type: () => ({ MockEntity, MockEntity2, MockEntity3 } as any),
        value: { mock1: {}, mock2: {}, mock3: {} },
        options: {
          isCustom: true,
          producerFields: {
            mock1: "MockEntity",
            mock2: "MockEntity2",
            mock3: "MockEntity3",
          },
        },
      },
    ]);

    expect(data).toEqual({
      a: "Primitive<Record<MockEntity>>",
    });
    expect(data2).toEqual({
      a: "Primitive<Record<MockEntity|MockEntity2|MockEntity3>>",
    });
  });

  it("should return Null if value is null, isCustom is true and nullable is true", () => {
    const data = extractInputTypes([
      {
        key: "a",
        type: () => ({ MockEntity } as any),
        value: null,
        options: {
          isCustom: true,
          nullable: true,
          producerFields: {
            mock: "MockEntity",
          },
        },
      },
    ]);
    const data2 = extractInputTypes([
      {
        key: "a",
        type: () => ({ MockEntity, MockEntity2, MockEntity3 } as any),
        value: null,
        options: {
          isCustom: true,
          nullable: true,
          producerFields: {
            mock1: "MockEntity",
            mock2: "MockEntity2",
            mock3: "MockEntity3",
          },
        },
      },
    ]);

    expect(data).toEqual({
      a: "Null",
    });
    expect(data2).toEqual({
      a: "Null",
    });
  });
});
