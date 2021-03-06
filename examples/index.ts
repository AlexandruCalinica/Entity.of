import { mapObjectToEntity, getStore } from "../src/core";
import { Field, Producer, Model } from "../src/decorators";

console.clear();
getStore().initStore();

class Nested {
  @Field(() => String)
  id = "";

  @Field(() => String)
  country = "";

  @Producer
  static of(data: Partial<Nested>): Nested {
    return mapObjectToEntity(data, Nested);
  }
}

@Model
class Entity {
  @Field(() => Nested)
  nested: Nested = Nested.of({});

  @Field(() => String)
  name: string = "";

  @Field(() => [Number])
  optional?: number[];

  @Field(() => [Nested])
  nestedArr: Nested[] = [];

  static of = Model.producerOf<Entity>();
}

// const anyData = { some: "a", every: "b" } as any;
// const unstableData = ({ foo: "baz", bra: "elo" } as unknown) as Entity;
// const serverData = JSON.parse('{ "data": { "val": 1, "prop": 2 } }').data;
// const wrongTypesData = JSON.parse(
//   '{ "nested": 1, "name": {}, "optional": null, foo: 1 }'
// );

// Entity.of(anyData);
// Entity.of(serverData);
// Entity.of(unstableData);
// Entity.of(unstableData);
// Entity.of(wrongTypesData);
// const x = Entity.of({
//   nested: { id: "2", country: "us" },
//   nestedArr: [{ id: "1", country: "ro" }],
//   name: 2,
//   optional: false
// });

// const entity = Entity.of(wrongTypesData);
