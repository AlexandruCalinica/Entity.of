import { Entity, Of, createEntityStore } from "../src";
import { getStore } from "../src/core";

console.clear();

createEntityStore();

@Entity
class Profile {
  @Of(() => String, { optional: true })
  address?: string;

  @Of(() => Number, { optional: true })
  age?: number;

  static of = Entity.of<Profile>();
}

@Entity
class User {
  @Of(() => String)
  name: string = "";

  @Of(() => [Number], { nullable: true })
  nums: (number | null)[] | null = null;

  @Of(() => String, { nullable: true })
  email: string | null = null;

  @Of(() => [Profile], { optional: true, nullable: true })
  profile?: (Profile | null)[] | null;

  @Of(() => [String], { optional: true })
  optionalStringArray?: string[] = [];

  static of = Entity.of<User>();
}

User.of({ profile: [null] });

const s = JSON.stringify(getStore().store, null, 2);
console.log("Store -->", s);
