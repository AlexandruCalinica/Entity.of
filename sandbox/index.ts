import { Entity, Of } from "../src";

console.clear();

@Entity()
class Profile {
  @Of((t) => t(String))
  name: string = "";

  @Of((t) => t(String))
  surname: string = "";

  static of = Entity.of<Profile>();
}

@Entity()
class Address {
  @Of((t) => t(String))
  street: string = "";

  @Of((t) => t.union(t.record(String, String), Address))
  foo: Record<string, string> | Address = {};

  @Of((t) => t(String))
  city: string = "";

  static of = Entity.of<Address>();
}

interface Foo<T> {
  of(data: Partial<T>): T;
}
class Foo<T> {
  static of<T>(data: Partial<T>) {
    return new Foo();
  }
}
@Entity()
class User extends Foo<User> {
  @Of((t) => t.array(t.record(String, Number)))
  a: Record<string, number>[] = [];

  static of = Entity.of<User>();
}

const x = User.of({
  a: [{ a: 1, b: 2 }],
  // @ts-ignore
  // k: {},
});
console.log(x.a);
