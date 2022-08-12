import { extractTargetTypes } from "../src/core";

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
});
