import { Entity, Of } from "../src";

console.clear();

@Entity()
class Bar {
  @Of((t) => t(String))
  plm: string = "";

  static of = Entity.of<Bar>();
}

@Entity()
class Baz {
  @Of((t) =>
    t.custom((v) => {
      return (v as any[]).map((i) => Bar.of({ ...i, test: 1 }));
    })
  )
  bar: Bar[] = [];

  static of = Entity.of<Baz>();
}

@Entity()
class Foo {
  @Of((t) => t.custom((v) => Baz.of(v)))
  address: Baz = Baz.of({});

  static of = Entity.of<Foo>();
}

const foo = Foo.of({
  address: { bar: [{ plm: "salut" }] },
});

console.log(foo.address);
