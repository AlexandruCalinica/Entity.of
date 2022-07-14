import { getInputTypes, produceEntries, FieldProps } from "../src/core";

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
    hobbies: [
      { id: 1, name: "football" },
      { id: 2, name: "basketball" },
      { id: 3, name: "boxing" },
    ],
  };
  const producedEntries = produceEntries(data, fieldsWithProducer);
  const producedData = { ...data, ...producedEntries };
  const keysWithProducers = fieldsWithProducer.map(({ key }) => key);

  // act
  const { allInputTypes, primitiveInputTypes } = getInputTypes(
    producedData,
    keysWithProducers
  );

  // assert
  it("Should output a dictionary of all input types", () => {
    expect(allInputTypes).toEqual({
      id: "Number",
      name: "String",
      surname: "String",
      address: "Address",
      children: ["Number", "Number", "Number"],
      isSingle: "Boolean",
      hobbies: ["Hobby", "Hobby", "Hobby"],
    });
  });

  it("Should output a dictionary of primitive input types", () => {
    expect(primitiveInputTypes).toEqual({
      id: "Number",
      name: "String",
      surname: "String",
      children: ["Number", "Number", "Number"],
      isSingle: "Boolean",
    });
  });
});
