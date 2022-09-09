import { FieldProps, isProducerField } from "../src/core";

describe("isProducerField", () => {
  // given arrangement
  const producerName = "of";
  class MockedProducer {
    static of() {}
  }

  it("Should return true if Field.type has static producer method", () => {
    // given
    const producerField: FieldProps = {
      key: "foo",
      type: () => MockedProducer,
    };

    // act
    const isProducer = isProducerField(producerField, producerName);

    // assert
    expect(isProducer).toBe(true);
  });

  it("Should return true if Field.type is an ", () => {
    // given
    const producerField: FieldProps = {
      key: "foo",
      type: () => ({ MockedProducer }),
    };

    // act
    const isProducer = isProducerField(producerField, producerName);

    // assert
    expect(isProducer).toBe(true);
  });

  it("Should return false if Field.type returns a Primitive", () => {
    // given
    const primitiveField: FieldProps = {
      key: "foo",
      type: () => String,
    };

    // act
    const isProducer = isProducerField(primitiveField, producerName);

    // assert
    expect(isProducer).toBe(false);
  });

  it("Should throw if Field.type: () => Array", () => {
    // given
    const withArray: FieldProps = { key: "foo", type: () => Array };
    const checkIsProducer = () => isProducerField(withArray, producerName);

    // act and assert
    expect(checkIsProducer).toThrow();
  });

  it("Should throw if Field.type: () => Object", () => {
    // given
    const withObject: FieldProps = { key: "foo", type: () => Object as any };
    const checkIsProducer = () => isProducerField(withObject, producerName);

    // act and assert
    expect(checkIsProducer).toThrow();
  });

  it("Should throw if Field.type: () => [Object]", () => {
    // given
    const withArrayOfObjects: FieldProps = {
      key: "foo",
      type: () => [Object as any],
    };
    const checkIsProducer = () =>
      isProducerField(withArrayOfObjects, producerName);

    // act and assert
    expect(checkIsProducer).toThrow();
  });

  it("Should throw if Field.type: () => [Array]", () => {
    // given
    const withArrayOfArrays: FieldProps = {
      key: "foo",
      type: () => [Array as any],
    };
    const checkIsProducer = () =>
      isProducerField(withArrayOfArrays, producerName);

    // act and assert
    expect(checkIsProducer).toThrow();
  });

  it("Should throw if Field.type returns a Producer with missing static producer method", () => {
    // given
    class Mock {}
    const withMissingOf: FieldProps = {
      key: "foo",
      type: () => Mock as any,
    };
    const checkIsProducer = () => isProducerField(withMissingOf, producerName);

    // act and assert
    expect(checkIsProducer).toThrow();
  });

  it("Should throw if Field.type: () => ({ Object })", () => {
    // given
    const withObject: FieldProps = {
      key: "foo",
      type: () => ({ Object } as any),
    };
    const checkIsProducer = () => isProducerField(withObject, producerName);

    // act and assert
    expect(checkIsProducer).toThrow();
  });

  it("Should throw if Field.type: () => ({ Array })", () => {
    // given
    const withArray: FieldProps = {
      key: "foo",
      type: () => ({ Array } as any),
    };
    const checkIsProducer = () => isProducerField(withArray, producerName);

    // act and assert
    expect(checkIsProducer).toThrow();
  });

  it("Should throw if Field.type: () => ({ Number })", () => {
    // given
    const withNumber: FieldProps = {
      key: "foo",
      type: () => ({ Number } as any),
    };
    const checkIsProducer = () => isProducerField(withNumber, producerName);

    // act and assert
    expect(checkIsProducer).toThrow();
  });

  it("Should throw if Field.type: () => ({ String })", () => {
    // given
    const withString: FieldProps = {
      key: "foo",
      type: () => ({ String } as any),
    };
    const checkIsProducer = () => isProducerField(withString, producerName);

    // act and assert
    expect(checkIsProducer).toThrow();
  });

  it("Should throw if Field.type: () => ({ Boolean })", () => {
    // given
    const withBoolean: FieldProps = {
      key: "foo",
      type: () => ({ Boolean } as any),
    };
    const checkIsProducer = () => isProducerField(withBoolean, producerName);

    // act and assert
    expect(checkIsProducer).toThrow();
  });

  it("Should throw if Field.type: () => [{ Object }]", () => {
    // given
    const withArrayOfObjects: FieldProps = {
      key: "foo",
      type: () => [{ Object } as any],
    };
    const checkIsProducer = () =>
      isProducerField(withArrayOfObjects, producerName);

    // act and assert
    expect(checkIsProducer).toThrow();
  });

  it("Should throw if Field.type: () => [{ Array }]", () => {
    // given
    const withArrayOfObjectsWithArrays: FieldProps = {
      key: "foo",
      type: () => [{ Array } as any],
    };
    const checkIsProducer = () =>
      isProducerField(withArrayOfObjectsWithArrays, producerName);

    // act and assert
    expect(checkIsProducer).toThrow();
  });

  it("Should throw if Field.type: () => [{ Number }]", () => {
    // given
    const withArrayOfObjectsWithNumbers: FieldProps = {
      key: "foo",
      type: () => [{ Number } as any],
    };
    const checkIsProducer = () =>
      isProducerField(withArrayOfObjectsWithNumbers, producerName);

    // act and assert
    expect(checkIsProducer).toThrow();
  });

  it("Should throw if Field.type: () => [{ String }]", () => {
    // given
    const withArrayOfObjectsWithStrings: FieldProps = {
      key: "foo",
      type: () => [{ String } as any],
    };
    const checkIsProducer = () =>
      isProducerField(withArrayOfObjectsWithStrings, producerName);

    // act and assert
    expect(checkIsProducer).toThrow();
  });

  it("Should throw if Field.type: () => [{ Boolean }]", () => {
    // given
    const withArrayOfObjectsWithBooleans: FieldProps = {
      key: "foo",
      type: () => [{ Boolean } as any],
    };
    const checkIsProducer = () =>
      isProducerField(withArrayOfObjectsWithBooleans, producerName);

    // act and assert
    expect(checkIsProducer).toThrow();
  });
});
