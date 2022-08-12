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

  const fieldsWithValue: (FieldProps & { value: any })[] = [
    { key: "id", type: () => String, value: "1" },
    { key: "name", type: () => String, value: "John" },
    {
      key: "address",
      type: () => Address,
      value: { street: "Industrial Drive", nr: "26", zip: 123456 },
    },
    { key: "isSingle", type: () => Boolean, value: true },
    {
      key: "hobbies",
      type: () => [Hobby],
      value: [{ id: 1, description: "Football" }],
    },
    { key: "nullField", type: () => String, value: null },
    { key: "nullList", type: () => [String], value: [null, null, null] },
    {
      key: "nullableField",
      type: () => String,
      value: null,
      options: { nullable: true },
    },
    {
      key: "nullableList",
      type: () => [String],
      value: [null, null, null],
      options: { nullable: true },
    },
  ];
  const keysWithProducer = ["address", "hobbies"];

  // act
  const { allTargetTypes, primitiveTargetTypes } = getTargetTypes(
    fieldsWithValue,
    keysWithProducer
  );

  // assert
  it("Should output a dictionary of all target types", () => {
    expect(allTargetTypes).toEqual({
      id: "Primitive<String>",
      name: "Primitive<String>",
      address: "Primitive<Address>",
      isSingle: "Primitive<Boolean>",
      hobbies: "Array<Hobby>",
      nullField: "Primitive<String>",
      nullList: "Array<String>",
      nullableField: "NullablePrimitive<String>",
      nullableList: "NullableArray<String>",
    });
  });

  it("Should output a dictionary of primitive target types", () => {
    expect(primitiveTargetTypes).toEqual({
      id: "Primitive<String>",
      name: "Primitive<String>",
      isSingle: "Primitive<Boolean>",
      nullField: "Primitive<String>",
      nullList: "Array<String>",
      nullableField: "NullablePrimitive<String>",
      nullableList: "NullableArray<String>",
    });
  });
});
