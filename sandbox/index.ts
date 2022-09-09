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

@Entity
class WithRecord {
  @Of(() => ({ Profile }))
  record: Record<string, Profile> = {};

  @Of(() => [{ Profile }], { nullable: true })
  recordArray: Record<string, Profile>[] = [];

  static of = Entity.of<WithRecord>();
}

const x = WithRecord.of({
  record: {
    a: {
      address: "123",
      age: 123,
    },
  },
  recordArray: [
    {
      a: {
        address: "123",
        age: 123,
      },
    },
    {
      1: {
        address: "123",
        age: 12,
      },
    },
  ],
});
// const y = WithRecord.of({});
// console.log(y);

const s = getStore();
console.log(JSON.stringify(s.store, null, 2));
