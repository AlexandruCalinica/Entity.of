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
    { key: "entity", type: () => Address },
    { key: "entityList", type: () => [Hobby] },
  ];

  const fields: FieldProps[] = [
    { key: "number", type: () => Number },
    { key: "string", type: () => String },
    { key: "entity", type: () => Address },
    { key: "numberList", type: () => [Number] },
    { key: "bool", type: () => Boolean },
    { key: "entityList", type: () => [Hobby] },
    { key: "recordOfEntites", type: () => ({ Hobby }) },
    {
      key: "customRecord",
      type: () => ({ String, Number, Boolean, Address } as any),
      options: { isCustom: true, producerFields: { d: "Address" } },
    },
    {
      key: "nullableCustomRecord",
      type: () => ({ String, Number, Boolean, Address } as any),
      options: {
        isCustom: true,
        producerFields: { d: "Address" },
        nullable: true,
      },
    },
    {
      key: "optionalCustomRecord",
      type: () => ({ String, Number, Boolean, Address } as any),
      options: {
        isCustom: true,
        producerFields: { d: "Address" },
        optional: true,
      },
    },
    { key: "arrayOfRecordsOfEntites", type: () => [{ Hobby }] },
    { key: "nullField", type: () => String },
    { key: "nullList", type: () => [String] },
    { key: "nullableField", type: () => String, options: { nullable: true } },
    { key: "nullableList", type: () => [String], options: { nullable: true } },
    { key: "optionalField", type: () => String, options: { optional: true } },
    { key: "optionalList", type: () => [String], options: { optional: true } },
    {
      key: "optionalListWithEmptyDefault",
      type: () => [String],
      options: { optional: true },
    },
    {
      key: "optionalListWithDefaultValues",
      type: () => [String],
      options: { optional: true },
    },
    {
      key: "optionalNullableList",
      type: () => [String],
      options: { optional: true, nullable: true },
    },
    {
      key: "optionalNullableListWithNull",
      type: () => [String],
      options: { optional: true, nullable: true },
    },
    {
      key: "optionalNullableListWithEmptyDefault",
      type: () => [String],
      options: { optional: true, nullable: true },
    },
    {
      key: "optionalNullableListWithDefaultNulls",
      type: () => [String],
      options: { optional: true, nullable: true },
    },
    {
      key: "optionalNullableListWithDefaultValues",
      type: () => [String],
      options: { optional: true, nullable: true },
    },
  ];

  const data: Record<string, any> = {
    number: 1,
    string: "John",
    entity: {
      street: "Industrial Drive",
      nr: "26",
      zip: 123456,
    },
    numberList: [1, 2, 3],
    bool: false,
    entityList: [
      { id: 1, name: "football" },
      { id: 2, name: "basketball" },
      { id: 3, name: "boxing" },
    ],
    recordOfEntites: {
      a: { id: 1, name: "football" },
      b: { id: 2, name: "basketball" },
      c: { id: 3, name: "boxing" },
    },
    customRecord: {
      a: "hello",
      b: 1,
      c: false,
      d: { street: "Industrial Drive", nr: "26", zip: 123456 },
    },
    nullableCustomRecord: null,
    optionalCustomRecord: undefined,
    arrayOfRecordsOfEntites: [
      { a: { id: 1, name: "football" } },
      { b: { id: 2, name: "basketball" } },
      { c: { id: 3, name: "boxing" } },
    ],
    nullField: null,
    nullList: [null, null, null],
    nullableField: null,
    nullableList: [null, null, null],
    optionalField: undefined,
    optionalList: undefined,
    optionalListWithEmptyDefault: [],
    optionalListWithDefaultValues: ["1", "2", "3"],
    optionalNullableList: undefined,
    optionalNullableListWithNull: null,
    optionalNullableListWithEmptyDefault: [],
    optionalNullableListWithDefaultNulls: [null, null, null],
    optionalNullableListWithDefaultValues: ["1", "2", "3"],
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
      number: "Primitive<Number>",
      string: "Primitive<String>",
      entity: "Primitive<Address>",
      numberList: "Array<Number>",
      bool: "Primitive<Boolean>",
      nullField: "Null",
      nullList: "Array<Null>",
      nullableField: "Null",
      nullableList: "Array<Null>",
      entityList: "Array<Hobby>",
      recordOfEntites: "Primitive<Object>",
      customRecord: "Primitive<Record<Address|Boolean|Number|String>>",
      nullableCustomRecord: "Null",
      arrayOfRecordsOfEntites: "Array<Object>",
      optionalListWithEmptyDefault: "Array<Empty>",
      optionalListWithDefaultValues: "Array<String>",
      optionalNullableListWithNull: "Null",
      optionalNullableListWithEmptyDefault: "Array<Empty>",
      optionalNullableListWithDefaultNulls: "Array<Null>",
      optionalNullableListWithDefaultValues: "Array<String>",
    });
  });

  it("Should output a dictionary of primitive input types", () => {
    expect(primitiveInputTypes).toEqual({
      number: "Primitive<Number>",
      string: "Primitive<String>",
      numberList: "Array<Number>",
      bool: "Primitive<Boolean>",
      nullField: "Null",
      nullList: "Array<Null>",
      nullableField: "Null",
      nullableList: "Array<Null>",
      recordOfEntites: "Primitive<Object>",
      customRecord: "Primitive<Record<Address|Boolean|Number|String>>",
      nullableCustomRecord: "Null",
      arrayOfRecordsOfEntites: "Array<Object>",
      optionalListWithEmptyDefault: "Array<Empty>",
      optionalListWithDefaultValues: "Array<String>",
      optionalNullableListWithNull: "Null",
      optionalNullableListWithEmptyDefault: "Array<Empty>",
      optionalNullableListWithDefaultNulls: "Array<Null>",
      optionalNullableListWithDefaultValues: "Array<String>",
    });
  });
});
