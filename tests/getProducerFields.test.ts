import { getProducerFields, FieldProps } from "../src/core";

expect.extend({
  toContainObject(received, argument) {
    const pass = this.equals(
      received,
      expect.arrayContaining([expect.objectContaining(argument)])
    );

    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} not to contain object ${this.utils.printExpected(argument)}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} to contain object ${this.utils.printExpected(argument)}`,
        pass: false,
      };
    }
  },
});

describe("getProducerFields", () => {
  // given arrangement
  // Producer
  class MockFoo {
    static of() {}
  }
  // Producer
  class MockBaz {
    static of() {}
  }
  const producerName = "of";
  const fields: FieldProps[] = [
    { key: "foo", type: () => String }, // Primitive
    { key: "faz", type: () => Number }, // Primitive
    { key: "far", type: () => Boolean }, // Primitive
    { key: "baz", type: () => [String] }, // Primitive
    { key: "bar", type: () => MockFoo }, // Producer
    { key: "bax", type: () => [MockBaz] }, // Producer
    { key: "bah", type: () => ({ MockBaz }) }, // Producer
    { key: "bap", type: () => [{ MockBaz }] }, // Producer
    {
      key: "bac",
      type: () => ({ MockBaz, MockFoo }),
      options: { isCustom: true },
    }, // Producer
    {
      key: "bal",
      type: () => ({ MockBaz, MockFoo, String, Number, Boolean }),
      options: { isCustom: true },
    }, // Producer
  ];

  // act
  const output = getProducerFields(fields, producerName);

  // assert
  it("Should return only Producer fields", () => {
    expect(output).toHaveLength(5);
    expect(output).toContainObject({ key: "bar" });
    expect(output).toContainObject({ key: "bax" });
    expect(output).toContainObject({ key: "bah" });
    expect(output).toContainObject({ key: "bap" });
    expect(output).toContainObject({ key: "bac" });
  });

  it("Should not return Primitive fields", () => {
    expect(output).not.toContainObject({ key: "baz" });
    expect(output).not.toContainObject({ key: "far" });
    expect(output).not.toContainObject({ key: "faz" });
    expect(output).not.toContainObject({ key: "foo" });
    expect(output).not.toContainObject({ key: "bal" });
  });

  it("Should not alter any Field properties", () => {
    // `bar`
    expect(output[0].type.name).toBe("type");
    expect(output[0].type).toBeInstanceOf(Function);
    expect(output[0].type()).toBe(MockFoo);
    // `bax`
    expect(output[1].type.name).toBe("type");
    expect(output[1].type).toBeInstanceOf(Function);
    expect((output[1].type() as any[])[0]).toBe(MockBaz);
  });

  it("Should throw if a Producer field is missing the static producer method", () => {
    // given
    class MockBar {}
    const _fields: FieldProps[] = [
      ...fields,
      { key: "foo", type: () => MockBar as any },
    ];

    // act
    const getOutput = () => getProducerFields(_fields, producerName);

    // assert
    expect(getOutput).toThrow();
  });

  it("Should throw if Field.type returns an Array", () => {
    // given
    const _fields: FieldProps[] = [
      ...fields,
      { key: "foo", type: () => Object as any },
    ];

    // act
    const getOutput = () => getProducerFields(_fields, producerName);

    // assert
    expect(getOutput).toThrow();
  });

  it("Should throw if Field.type returns an Object", () => {
    // given
    const _fields: FieldProps[] = [
      ...fields,
      { key: "foo", type: () => Array as any },
    ];

    // act
    const getOutput = () => getProducerFields(_fields, producerName);

    // assert
    expect(getOutput).toThrow();
  });

  it("Should throw if Field.type returns an [Object]", () => {
    // given
    const _fields: FieldProps[] = [
      ...fields,
      { key: "foo", type: () => [Object] as any },
    ];

    // act
    const getOutput = () => getProducerFields(_fields, producerName);

    // assert
    expect(getOutput).toThrow();
  });

  it("Should throw if any Field.type returns an [Array]", () => {
    // given
    const _fields: FieldProps[] = [
      ...fields,
      { key: "foo", type: () => [Array as any] },
    ];

    // act
    const getOutput = () => getProducerFields(_fields, producerName);

    // assert
    expect(getOutput).toThrow();
  });

  it("Should throw if any Field.type returns a {Object}", () => {
    // given
    const _fields: FieldProps[] = [
      ...fields,
      { key: "foo", type: () => ({ Object } as any) },
    ];

    // act
    const getOutput = () => getProducerFields(_fields, producerName);

    // assert
    expect(getOutput).toThrow();
  });

  it("Should throw if any Field.type returns a {Array}", () => {
    // given
    const _fields: FieldProps[] = [
      ...fields,
      { key: "foo", type: () => ({ Array } as any) },
    ];

    // act
    const getOutput = () => getProducerFields(_fields, producerName);

    // assert
    expect(getOutput).toThrow();
  });

  it("Should throw if any Field.type return [{Object}]", () => {
    // given
    const _fields: FieldProps[] = [
      ...fields,
      { key: "foo", type: () => [{ Object } as any] },
    ];

    // act
    const getOutput = () => getProducerFields(_fields, producerName);

    // assert
    expect(getOutput).toThrow();
  });

  it("Should throw if any Field.type return [{Array}]", () => {
    // given
    const _fields: FieldProps[] = [
      ...fields,
      { key: "foo", type: () => [{ Array } as any] },
    ];

    // act
    const getOutput = () => getProducerFields(_fields, producerName);

    // assert
    expect(getOutput).toThrow();
  });
});
