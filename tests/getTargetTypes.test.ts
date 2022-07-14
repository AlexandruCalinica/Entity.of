import { getTargetTypes, FieldProps } from "../src/core";

describe("getTargetTypes", () => {
  // given
  class Address {
    static of(data: Partial<Address>) {
      return Object.assign(new Address(), data);
    }
  }
  class Hobby {
    static of(data: Partial<Hobby>) {
      return Object.assign(new Hobby(), data);
    }
  }

  const fields: FieldProps[] = [
    { key: "id", type: () => String },
    { key: "name", type: () => String },
    { key: "address", type: () => Address },
    { key: "isSingle", type: () => Boolean },
    { key: "hobbies", type: () => [Hobby] },
  ];
  const keysWithProducer = ["address", "hobbies"];

  // act
  const { allTargetTypes, primitiveTargetTypes } = getTargetTypes(
    fields,
    keysWithProducer
  );

  // assert
  it("Should output a dictionary of all target types", () => {
    expect(allTargetTypes).toEqual({
      id: "String",
      name: "String",
      address: "Address",
      isSingle: "Boolean",
      hobbies: ["Hobby"],
    });
  });

  it("Should output a dictionary of primitive target types", () => {
    expect(primitiveTargetTypes).toEqual({
      id: "String",
      name: "String",
      isSingle: "Boolean",
    });
  });
});
