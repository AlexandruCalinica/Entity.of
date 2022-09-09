import { trackEntity, getStore } from "../src/core";

class MockEntity {
  static of() {}
}

describe("trackEntity", () => {
  beforeAll(() => {
    getStore().init();
  });
  beforeEach(() => {
    getStore().reset();
    getStore().register("Entity");
  });
  afterAll(() => {
    getStore().destroy();
  });

  it("should track targetTypes", () => {
    trackEntity("Entity", [
      { key: "id", type: () => String, value: "1" },
      { key: "name", type: () => String, value: "John" },
      { key: "age", type: () => Number, value: 29 },
      { key: "isMarried", type: () => Boolean, value: false },
      { key: "address", type: () => MockEntity, value: {} },
      { key: "hobbies", type: () => ({ MockEntity }), value: {} },
      { key: "friends", type: () => [{ MockEntity }], value: [] },
      {
        key: "optional",
        type: () => String,
        value: undefined,
        options: { optional: true },
      },
      {
        key: "nullable",
        type: () => String,
        value: null,
        options: { nullable: true },
      },
      {
        key: "nullableOptional",
        type: () => String,
        value: null,
        options: { nullable: true, optional: true },
      },
      {
        key: "optionalArray",
        type: () => [MockEntity],
        value: undefined,
        options: { optional: true },
      },
      {
        key: "optionalNullableArray",
        type: () => [MockEntity],
        value: null,
        options: { optional: true, nullable: true },
      },
      {
        key: "optionalRecord",
        type: () => ({ MockEntity }),
        value: undefined,
        options: { optional: true },
      },
      {
        key: "optionalNullableRecord",
        type: () => ({ MockEntity }),
        value: null,
        options: { optional: true, nullable: true },
      },
      {
        key: "optionalArrayOfRecords",
        type: () => [{ MockEntity }],
        value: undefined,
        options: { optional: true },
      },
      {
        key: "optionalNullableArrayOfRecords",
        type: () => [{ MockEntity }],
        value: null,
        options: { optional: true, nullable: true },
      },
    ]);

    expect(getStore().store["entities"]).not.toBeUndefined();
    expect(getStore().store["entities"]).toHaveProperty("Entity");
    expect(getStore().store["entities"]["Entity"]).toEqual({
      id: "Primitive<String>",
      name: "Primitive<String>",
      age: "Primitive<Number>",
      isMarried: "Primitive<Boolean>",
      address: "Primitive<MockEntity>",
      hobbies: "Primitive<Record<MockEntity>>",
      friends: "Array<Record<MockEntity>>",
      optional: "Primitive<String>",
      nullable: "NullablePrimitive<String>",
      nullableOptional: "NullablePrimitive<String>",
      optionalArray: "Array<MockEntity>",
      optionalNullableArray: "NullableArray<MockEntity>",
      optionalRecord: "Primitive<Record<MockEntity>>",
      optionalNullableRecord: "NullablePrimitive<Record<MockEntity>>",
      optionalArrayOfRecords: "Array<Record<MockEntity>>",
      optionalNullableArrayOfRecords: "NullableArray<Record<MockEntity>>",
    });
  });
});
