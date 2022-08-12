import { Entity, Of, createEntityStore } from "../src";
console.clear();

createEntityStore();

@Entity
class User {
  @Of(() => String)
  name: string = "";

  @Of(() => [Number], { nullable: true })
  nums: (number | null)[] | null = null;

  @Of(() => String, { nullable: true })
  email: string | null = null;

  static of = Entity.of<User>();
}

User.of({});
