import { type, entity } from "../src";

console.clear();

@entity()
class Profile {
  @type((t) => t(String))
  name: string = "";

  @type((t) => t(String))
  surname: string = "";

  static of = entity.of<Profile>();
}

@entity()
class Address {
  @type((t) => t(String))
  street: string = "";

  @type((t) => t.union(t.record(String, String), Address))
  foo: Record<string, string> | Address = {};

  @type((t) => t(String))
  city: string = "";

  static of = entity.of<Address>();
}
@entity()
class User {
  @type((t) => t.union(Address, t.record(String, String)))
  a: Address | Record<string, string> = Address.of({});

  static of = entity.of<User>();
}

const x = User.of({
  // @ts-ignore
  a: { keke: null },
});
console.log(x.a);
