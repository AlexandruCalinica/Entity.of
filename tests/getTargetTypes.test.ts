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
    {
      key: "recordOfHobbies",
      type: () => ({ Hobby }),
      value: { a: { id: 1, description: "Football" } },
    },
    {
      key: "customRecord",
      type: () => ({ String, Boolean, Number, Address } as any),
      value: {
        a: "a",
        b: true,
        c: 1,
        d: { street: "Industrial Drive", nr: "26", zip: 123456 },
      },
      options: {
        isCustom: true,
        producerFields: {
          d: "Address",
        },
      },
    },
    {
      key: "nullableCustomRecord",
      type: () => ({ String, Boolean, Number, Address } as any),
      value: null,
      options: {
        nullable: true,
        isCustom: true,
        producerFields: {
          d: "Address",
        },
      },
    },
    {
      key: "optionalCustomRecord",
      type: () => ({ String, Boolean, Number, Address } as any),
      value: undefined,
      options: {
        optional: true,
        isCustom: true,
        producerFields: {
          d: "Address",
        },
      },
    },
    {
      key: "optionalNullableCustomRecord",
      type: () => ({ String, Boolean, Number, Address } as any),
      value: null,
      options: {
        nullable: true,
        optional: true,
        isCustom: true,
        producerFields: {
          d: "Address",
        },
      },
    },
    {
      key: "arrayOfRecordsOfHobbies",
      type: () => [{ Hobby }],
      value: [{ a: { id: 1, description: "Football" } }],
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
    {
      key: "optionalField",
      type: () => String,
      value: undefined,
      options: { optional: true },
    },
    {
      key: "optionalFieldList",
      type: () => [String],
      value: undefined,
      options: { optional: true },
    },
    {
      key: "optionalNullableField",
      type: () => String,
      value: undefined,
      options: { optional: true, nullable: true },
    },
    {
      key: "optionalNullableFieldList",
      type: () => [String],
      value: undefined,
      options: { optional: true, nullable: true },
    },
    {
      key: "optionalRecord",
      type: () => ({ Hobby }),
      value: undefined,
      options: { optional: true },
    },
    {
      key: "optionalNullableRecord",
      type: () => ({ Hobby }),
      value: null,
      options: { optional: true, nullable: true },
    },
    {
      key: "optionalArrayOfRecords",
      type: () => [{ Hobby }],
      value: undefined,
      options: { optional: true },
    },
    {
      key: "optionalNullableArrayOfRecords",
      type: () => [{ Hobby }],
      value: null,
      options: { optional: true, nullable: true },
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
      recordOfHobbies: "Primitive<Record<Hobby>>",
      customRecord: "Primitive<Record<Address|Boolean|Number|String>>",
      nullableCustomRecord:
        "NullablePrimitive<Record<Address|Boolean|Number|String>>",
      optionalCustomRecord: "Primitive<Record<Address|Boolean|Number|String>>",
      optionalNullableCustomRecord:
        "NullablePrimitive<Record<Address|Boolean|Number|String>>",
      arrayOfRecordsOfHobbies: "Array<Record<Hobby>>",
      nullField: "Primitive<String>",
      nullList: "Array<String>",
      nullableField: "NullablePrimitive<String>",
      nullableList: "NullableArray<String>",
      optionalField: "Primitive<String>",
      optionalFieldList: "Array<String>",
      optionalNullableField: "NullablePrimitive<String>",
      optionalNullableFieldList: "NullableArray<String>",
      optionalRecord: "Primitive<Record<Hobby>>",
      optionalNullableRecord: "NullablePrimitive<Record<Hobby>>",
      optionalArrayOfRecords: "Array<Record<Hobby>>",
      optionalNullableArrayOfRecords: "NullableArray<Record<Hobby>>",
    });
  });

  it("Should output a dictionary of primitive target types", () => {
    expect(primitiveTargetTypes).toEqual({
      id: "Primitive<String>",
      name: "Primitive<String>",
      isSingle: "Primitive<Boolean>",
      nullField: "Primitive<String>",
      nullList: "Array<String>",
      recordOfHobbies: "Primitive<Record<Hobby>>",
      customRecord: "Primitive<Record<Address|Boolean|Number|String>>",
      nullableCustomRecord:
        "NullablePrimitive<Record<Address|Boolean|Number|String>>",
      optionalCustomRecord: "Primitive<Record<Address|Boolean|Number|String>>",
      optionalNullableCustomRecord:
        "NullablePrimitive<Record<Address|Boolean|Number|String>>",
      arrayOfRecordsOfHobbies: "Array<Record<Hobby>>",
      nullableField: "NullablePrimitive<String>",
      nullableList: "NullableArray<String>",
      optionalField: "Primitive<String>",
      optionalFieldList: "Array<String>",
      optionalNullableField: "NullablePrimitive<String>",
      optionalNullableFieldList: "NullableArray<String>",
      optionalRecord: "Primitive<Record<Hobby>>",
      optionalNullableRecord: "NullablePrimitive<Record<Hobby>>",
      optionalArrayOfRecords: "Array<Record<Hobby>>",
      optionalNullableArrayOfRecords: "NullableArray<Record<Hobby>>",
    });
  });
});
