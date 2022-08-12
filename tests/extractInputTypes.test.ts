import { extractInputTypes } from "../src/core";

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
});
