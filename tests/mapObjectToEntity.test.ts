import { mapObjectToEntity, FieldProps } from "../src/core";

describe("mapObjectToEntity", () => {
  // given
  class Entity {
    id = 0;
    name = "";
    isSingle = false;
    optional?: number;

    static fields: FieldProps[] = [
      { key: "id", type: () => String },
      { key: "name", type: () => String },
      { key: "isSingle", type: () => Boolean },
      { key: "optional", type: () => Number },
    ];
  }

  it("Should output the same object as the input with typed constructor", () => {
    // given
    const data: Entity = {
      id: 1,
      name: "Alex",
      isSingle: true,
    };
    // act
    const output = mapObjectToEntity(data, Entity as any);
    // assert
    expect(output).toEqual(data);
    expect(output).toBeInstanceOf(Entity);
  });

  it("Should default on the Entity initializers if input is an empty object", () => {
    // given
    const data = {};
    // act
    const output = mapObjectToEntity(data, Entity as any);
    // assert
    expect(output).toEqual({
      id: 0,
      name: "",
      isSingle: false,
    });
    expect(output).toBeInstanceOf(Entity);
  });

  it("Should omit optional properties if they're not passed in the input", () => {
    // given
    const data = {};
    // act
    const output = mapObjectToEntity(data, Entity as any);
    // assert
    expect(output).not.toHaveProperty("optional");
  });

  it("Should include optional properties if they're passed in input", () => {
    // given
    const data = { optional: 1 };
    // act
    const output = mapObjectToEntity(data, Entity as any);
    // assert
    expect(output).toHaveProperty("optional");
    expect(output["optional"]).toBe(1);
  });

  it("Should ignore unknown properties passed as input", () => {
    // given
    const data = { foo: 1, baz: 2 };
    // act
    const output = mapObjectToEntity(data, Entity as any);
    // assert
    expect(output).not.toHaveProperty("foo");
    expect(output).not.toHaveProperty("baz");
  });
});
