import { createProducer, FieldProps, getStore } from "../src/core";

beforeAll(() => {
  getStore().init();
});
afterAll(() => {
  getStore().destroy();
});

describe("createProducer", () => {
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
    { key: "optional", type: () => Number },
  ];

  class Entity {
    id = "";
    name = "";
    address: Address = Address.of({});
    isSingle = false;
    hobbies: Hobby[] = [];
    optional?: number;

    static fields = fields;
    static of(data: Partial<Entity>): Entity {
      return Object.assign(new Entity(), data);
    }
  }

  // act
  const produce = createProducer(Entity as any, "of");

  // assert
  it("Should output a producer Function", () => {
    expect(produce).toBeInstanceOf(Function);
  });

  describe("produceFn", () => {
    it("Should output a produced Entity object", () => {
      // given
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

      // act
      const produced = produce(data);

      // assert
      expect(produced).toEqual(data);
      expect(produced["address"]).toBeInstanceOf(Address);
      expect(produced["hobbies"][0]).toBeInstanceOf(Hobby);
      expect(produced["hobbies"][1]).toBeInstanceOf(Hobby);
      expect(produced["hobbies"][2]).toBeInstanceOf(Hobby);
    });

    it("Should output a default produced Entity object if called with an empty object as input", () => {
      // given
      const data = {};
      // act
      const produced = produce(data);
      // assert
      expect(produced).toEqual({
        id: "",
        name: "",
        address: Address.of({}),
        isSingle: false,
        hobbies: [],
      });
    });

    it("Should ignore unknown input properties", () => {
      // given
      const data = {
        foo: 1,
        baz: [],
        bar: {},
      };
      // act
      const produced = produce(data);
      // assert
      expect(produced).toEqual({
        id: "",
        name: "",
        address: Address.of({}),
        isSingle: false,
        hobbies: [],
      });
    });

    it("Should ignore optional properties with no initializer", () => {
      // given
      const data = {};
      // act
      const produced = produce(data);
      // assert
      expect(produced).not.toHaveProperty("optional");
    });

    it("Should output optional properties if passed as input", () => {
      // given
      const data = { optional: 1 };
      // act
      const produced = produce(data);
      // assert
      expect(produced).toHaveProperty("optional");
    });
  });
});
