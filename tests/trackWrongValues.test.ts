import {
  getStore,
  FieldProps,
  produceEntries,
  trackWrongValues,
} from "../src/core";

describe("trackWrongValues", () => {
  beforeEach(() => {
    getStore().reset();
  });
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

  const owner = "Entity";
  const fields: FieldProps[] = [
    { key: "id", type: () => String },
    { key: "name", type: () => String },
    { key: "address", type: () => Address },
    { key: "isSingle", type: () => Boolean },
    { key: "hobbies", type: () => [Hobby] },
    {
      key: "bestFriendNullable",
      type: () => String,
      options: { nullable: true },
    },
    {
      key: "bestFriendOptional",
      type: () => String,
      options: { optional: true },
    },
    { key: "friendsIds", type: () => [String], options: { optional: true } },
    {
      key: "friendsIdsNullable",
      type: () => [String],
      options: { optional: true, nullable: true },
    },
  ];
  const data = {
    id: "1",
    name: "Alex",
    address: {
      street: "Industrial Drive",
      nr: 1,
    },
    isSingle: false,
    hobbies: [
      { id: 1, name: "football" },
      { id: 2, name: "basketball" },
      { id: 3, name: "boxing" },
    ],
    bestFriendNullable: null,
    bestFriendOptional: undefined,
    friendsIds: [],
    friendsIdsNullable: [null],
  };

  const fieldsWithProducer = [
    { key: "address", type: () => Address },
    { key: "hobbies", type: () => [Hobby] },
  ];
  const keysWithProducer = fieldsWithProducer.map(({ key }) => key);
  const producedEntries = produceEntries(data, fieldsWithProducer);
  const producedData = { ...data, ...producedEntries };
  const fieldsWithValues = fields.map((field) => ({
    ...field,
    value: producedData[field.key as keyof typeof data],
  }));

  // act

  // assert
  it("Should exist store object on globalThis", () => {
    // asert
    expect(globalThis).toHaveProperty("__ENTITY_OF__");
    expect((globalThis as any)["__ENTITY_OF__"]).toEqual({
      unknown: {},
      mistyped: {},
      entities: {},
      meta: {
        enableWarnings: false,
      },
    });
  });

  it("Should assign a store entry when calling with a mistyped value", () => {
    // given
    const alteredFields = fieldsWithValues.map((field) => {
      if (field.key === "id") return { ...field, value: 1 };
      return field;
    });
    // act
    trackWrongValues(owner, alteredFields, keysWithProducer);
    // asert
    const { store } = getStore();
    expect(store["mistyped"][owner]).toEqual({ id: 1 });
  });

  it("Should increment an existing mistyped entry count", () => {
    // given
    const alteredFields = fieldsWithValues.map((field) => {
      if (field.key === "id") return { ...field, value: 2 };
      return field;
    });
    // act
    trackWrongValues(owner, alteredFields, keysWithProducer);
    trackWrongValues(owner, alteredFields, keysWithProducer);
    // assert
    const { store } = getStore();
    expect(store["mistyped"][owner]).toEqual({ id: 2 });
  });

  it("Should assign a store entry when calling with multiple mistyped values", () => {
    // given
    const alteredFields = fieldsWithValues.map((field) => {
      if (field.key === "id") return { ...field, value: 1 };
      if (field.key === "name") return { ...field, value: {} };
      if (field.key === "isSingle") return { ...field, value: 0 };
      return field;
    });
    // act
    trackWrongValues(owner, alteredFields, keysWithProducer);
    // asert
    const { store } = getStore();
    expect(store["mistyped"][owner]).toEqual({ id: 1, name: 1, isSingle: 1 });
  });

  it("Should increment an existing mistyped entry count - multiple values", () => {
    // given
    const alteredFields = fieldsWithValues.map((field) => {
      if (field.key === "id") return { ...field, value: 1 };
      if (field.key === "name") return { ...field, value: {} };
      if (field.key === "isSingle") return { ...field, value: 0 };
      return field;
    });
    // act
    for (let i = 0; i < 1000; i++) {
      trackWrongValues(owner, alteredFields, keysWithProducer);
    }
    // asert
    const { store } = getStore();
    expect(store["mistyped"][owner]).toEqual({
      id: 1000,
      name: 1000,
      isSingle: 1000,
    });
  });
});
