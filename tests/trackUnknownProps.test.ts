import {
  trackUnknownProps,
  produceEntries,
  getStore,
  FieldProps,
} from "../src/core";

describe("trackUnknownProps", () => {
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

  const targetKeys = fields.map(({ key }) => key);
  const fieldsWithProducer = [
    { key: "address", type: () => Address },
    { key: "hobbies", type: () => [Hobby] },
  ];
  const keysWithProducer = fieldsWithProducer.map(({ key }) => key);
  const producedEntries = produceEntries(data, fieldsWithProducer);
  const producedData = { ...data, ...producedEntries };

  it("Should exist store object on globalThis", () => {
    // asert
    expect(globalThis).toHaveProperty("__s__");
    expect((globalThis as any)["__s__"]).toEqual({
      unknown: {},
      mistyped: {},
      instances: {},
    });
  });

  it("Should assign a store entry when calling with an unknown property", () => {
    // given
    const unknownData = { ...producedData, randomProperty: {} };
    const inputKeys = Object.keys(unknownData);
    // act
    trackUnknownProps(owner, inputKeys, targetKeys);
    // assert
    const { store } = getStore();
    expect(store.unknown[owner]).toEqual({ '["randomProperty"]': 1 });
  });

  it("Should increment an existing unknown entry count", () => {
    // given
    const unknownData = { ...producedData, randomProperty: {} };
    const inputKeys = Object.keys(unknownData);
    // act
    trackUnknownProps(owner, inputKeys, targetKeys);
    trackUnknownProps(owner, inputKeys, targetKeys);
    // assert
    const { store } = getStore();
    expect(store.unknown[owner]).toEqual({ '["randomProperty"]': 2 });
  });

  it("Should assign a store entry when calling with multiple unknown properties", () => {
    // given
    const unknownData = {
      ...producedData,
      randomProperty: {},
      foo: [],
      baz: null,
    };
    const inputKeys = Object.keys(unknownData);
    // act
    trackUnknownProps(owner, inputKeys, targetKeys);
    // assert
    const { store } = getStore();
    expect(store.unknown[owner]).toEqual({
      '["randomProperty","foo","baz"]': 1,
    });
  });

  it("Should increment an existing unknown entry count - multiple props", () => {
    // given
    const unknownData = {
      ...producedData,
      randomProperty: {},
      foo: [],
      baz: null,
    };
    const inputKeys = Object.keys(unknownData);
    // act
    for (let i = 0; i < 1000; i++) {
      trackUnknownProps(owner, inputKeys, targetKeys);
    }
    // assert
    const { store } = getStore();
    expect(store.unknown[owner]).toEqual({
      '["randomProperty","foo","baz"]': 1000,
    });
  });
});
