import { FieldProps, getInputTypes, produceEntries } from "../src/core";

describe("getInputTypes", () => {
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

  const fieldsWithProducer: FieldProps[] = [
    { key: "address", type: () => Address },
    { key: "hobbies", type: () => [Hobby] },
  ];

  const fields: FieldProps[] = [
    { key: "id", type: () => Number },
    { key: "name", type: () => String },
    { key: "surname", type: () => String },
    { key: "address", type: () => Address },
    { key: "children", type: () => [Number] },
    { key: "isSingle", type: () => Boolean },
    { key: "nullField", type: () => String },
    { key: "nullList", type: () => [String] },
    { key: "nullableField", type: () => String, options: { nullable: true } },
    { key: "nullableList", type: () => [String], options: { nullable: true } },
    { key: "hobbies", type: () => [Hobby] },
  ];

  const data: Record<string, any> = {
    id: 1,
    name: "John",
    surname: "Doe",
    address: {
      street: "Industrial Drive",
      nr: "26",
      zip: 123456,
    },
    children: [1, 2, 3],
    isSingle: false,
    nullField: null,
    nullList: [null, null, null],
    nullableField: null,
    nullableList: [null, null, null],
    hobbies: [
      { id: 1, name: "football" },
      { id: 2, name: "basketball" },
      { id: 3, name: "boxing" },
    ],
  };
  const producedEntries = produceEntries(data, fieldsWithProducer);
  const producedData = { ...data, ...producedEntries };
  const keysWithProducers = fieldsWithProducer.map(({ key }) => key);

  const fieldsWithValues = fields.map((field) => ({
    ...field,
    value: producedData[field.key],
  }));

  // act
  const { allInputTypes, primitiveInputTypes } = getInputTypes(
    fieldsWithValues,
    keysWithProducers
  );

  // assert
  it("Should output a dictionary of all input types", () => {
    expect(allInputTypes).toEqual({
      id: "Primitive<Number>",
      name: "Primitive<String>",
      surname: "Primitive<String>",
      address: "Primitive<Address>",
      children: "Array<Number>",
      isSingle: "Primitive<Boolean>",
      nullField: "Null",
      nullList: "Array<Null>",
      nullableField: "Null",
      nullableList: "Array<Null>",
      hobbies: "Array<Hobby>",
    });
  });

  it("Should output a dictionary of primitive input types", () => {
    expect(primitiveInputTypes).toEqual({
      id: "Primitive<Number>",
      name: "Primitive<String>",
      surname: "Primitive<String>",
      children: "Array<Number>",
      isSingle: "Primitive<Boolean>",
      nullField: "Null",
      nullList: "Array<Null>",
      nullableField: "Null",
      nullableList: "Array<Null>",
    });
  });
});
