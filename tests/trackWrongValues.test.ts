import {
  getStore,
  FieldProps,
  produceEntries,
  trackWrongValues,
} from "../src/core";

describe("trackWrongValues", () => {
  beforeEach(() => {
    getStore().resetStore();
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
  };

  const fieldsWithProducer = [
    { key: "address", type: () => Address },
    { key: "hobbies", type: () => [Hobby] },
  ];
  const keysWithProducer = fieldsWithProducer.map(({ key }) => key);
  const producedEntries = produceEntries(data, fieldsWithProducer);
  const producedData = { ...data, ...producedEntries };

  // act

  // assert
  it("Should exist store object on globalThis", () => {
    // asert
    expect(globalThis).toHaveProperty("__s__");
    expect((globalThis as any)["__s__"]).toEqual({
      unknown: {},
      mistyped: {},
      instances: {},
    });
  });

  it("Should assign a store entry when calling with a mistyped value", () => {
    // given
    const wrongData = { ...producedData, id: 1 };
    // act
    trackWrongValues(owner, fields, wrongData, keysWithProducer);
    // asert
    const { store } = getStore();
    expect(store["mistyped"][owner]).toEqual({ id: 1 });
  });

  it("Should increment an existing mistyped entry count", () => {
    // given
    const wrongData = { ...producedData, id: 2 };
    // act
    trackWrongValues(owner, fields, wrongData, keysWithProducer);
    trackWrongValues(owner, fields, wrongData, keysWithProducer);
    // assert
    const { store } = getStore();
    expect(store["mistyped"][owner]).toEqual({ id: 2 });
  });

  it("Should assign a store entry when calling with multiple mistyped values", () => {
    // given
    const wrongData = { ...producedData, id: 1, name: {}, isSingle: 0 };
    // act
    trackWrongValues(owner, fields, wrongData, keysWithProducer);
    // asert
    const { store } = getStore();
    expect(store["mistyped"][owner]).toEqual({ id: 1, name: 1, isSingle: 1 });
  });

  it("Should increment an existing mistyped entry count - multiple values", () => {
    // given
    const wrongData = { ...producedData, id: 1, name: {}, isSingle: 0 };
    // act
    for (let i = 0; i < 1000; i++) {
      trackWrongValues(owner, fields, wrongData, keysWithProducer);
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
