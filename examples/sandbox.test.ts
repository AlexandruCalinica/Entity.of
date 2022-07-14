// @ts-ignore
import { Field, Model } from "../dist/index.js";

@Model
class Entity {
  @Field(() => String)
  name = "";

  static of = Model.producerOf<Entity>();
}

describe("sandbox", () => {
  const entity = Entity.of({ name: "Alex" });

  it("test 1", () => {
    expect(entity).toEqual({ name: "Alex" });
  });
});
