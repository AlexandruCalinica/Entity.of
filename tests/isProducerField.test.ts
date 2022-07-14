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
});
