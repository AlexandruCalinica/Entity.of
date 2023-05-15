import { Entity, Of } from "../src/decorators";
import { Store } from "../src/store";

describe("record types", () => {
  // given
  @Entity()
  class Nested {
    @Of((t) => t(String))
    name: string = "";

    @Of((t) => t(String))
    surname: string = "";

    static of = Entity.of<Nested>();
  }

  @Entity()
  class Nested2 {
    @Of((t) => t(String))
    city: string = "";

    @Of((t) => t(String))
    street: string = "";

    static of = Entity.of<Nested2>();
  }

  @Entity()
  class Test {
    @Of((t) => t.record(String, String))
    a: Record<string, string> = {};

    @Of((t) => t.record(String, Number))
    b: Record<string, number> = {};

    @Of((t) => t.record(String, Boolean))
    c: Record<string, boolean> = {};

    @Of((t) => t.record(String, t.record(String, String)))
    d: Record<string, Record<string, string>> = {};

    @Of((t) => t.record(String, t.array(String)))
    e: Record<string, string[]> = {};

    @Of((t) => t.record(String, Nested))
    f: Record<string, Nested> = {};

    @Of((t) => t.record(String, t.union(String, Number, Boolean)))
    g: Record<string, string | number | boolean> = {};

    @Of((t) => t.record(String, t.union(Nested, Nested2)))
    h: Record<string, Nested | Nested2> = {};

    @Of((t) =>
      t.record(String, t.union(Nested, Nested2, t.record(String, String)))
    )
    i: Record<string, Nested | Nested2 | Record<string, string>> = {};

    @Of((t) =>
      t.record(
        String,
        t.record(String, t.union(Nested, Nested2, t.record(String, String)))
      )
    )
    j: Record<
      string,
      Record<string, Nested | Nested2 | Record<string, string>>
    > = {};

    @Of((t) =>
      t.record(
        String,
        t.array(t.union(Nested, Nested2, t.record(String, String)))
      )
    )
    k: Record<string, (Nested | Nested2 | Record<string, string>)[]> = {};

    @Of((t) =>
      t.record(
        String,
        t.record(
          String,
          t.array(t.union(Nested, Nested2, t.record(String, String)))
        )
      )
    )
    l: Record<
      string,
      Record<string, (Nested | Nested2 | Record<string, string>)[]>
    > = {};

    @Of((t) => t.record(String, String).optional().nullable())
    m?: Record<string, string> | null;

    static of = Entity.of<Test>();
  }

  // when
  const test = Test.of({
    a: { name: "John" },
    b: { age: 30 },
    c: { isAdult: true },
    d: { name: { first: "John", last: "Doe" } },
    e: { data: ["John", "Doe"] },
    f: { data: { name: "John", surname: "Doe" } },
    g: { name: "John", age: 30, isAdult: true },
    h: {
      ent1: { name: "John", surname: "Doe" },
      ent2: { city: "Iasi", street: "Arcu" },
    },
    i: {
      ent1: { name: "John", surname: "Doe" },
      ent2: { city: "Iasi", street: "Arcu" },
      rec1: { name: "John", street: "Arcu" },
    },
    j: {
      foo: {
        ent1: { name: "John", surname: "Doe" },
        ent2: { city: "Iasi", street: "Arcu" },
        rec1: { name: "John", street: "Arcu" },
      },
    },
    k: {
      foo: [
        { name: "John", surname: "Doe" },
        { city: "Iasi", street: "Arcu" },
        { name: "John", street: "Arcu" },
      ],
    },
    l: {
      foo: {
        bar: [
          { name: "John", surname: "Doe" },
          { city: "Iasi", street: "Arcu" },
          { name: "John", street: "Arcu" },
        ],
      },
    },
    m: null,
  });

  // then
  it("should parse & output records of strings", () => {
    expect(test.a).toEqual({ name: "John" });
  });
  it("should parse & output records of numbers", () => {
    expect(test.b).toEqual({ age: 30 });
  });
  it("should parse & output records of booleans", () => {
    expect(test.c).toEqual({ isAdult: true });
  });
  it("should parse & output records of records of strings", () => {
    expect(test.d).toEqual({ name: { first: "John", last: "Doe" } });
  });
  it("should parse & output records of arrays of strings", () => {
    expect(test.e).toEqual({ data: ["John", "Doe"] });
  });
  it("should parse & output records of Entities", () => {
    expect(test.f).toEqual({ data: { name: "John", surname: "Doe" } });
    expect(test.f.data).toBeInstanceOf(Nested);
  });
  it("should parse & output records of primitive unions", () => {
    expect(test.g).toEqual({ name: "John", age: 30, isAdult: true });
  });
  it("should parse & output records of entity unions", () => {
    expect(test.h).toEqual({
      ent1: Nested.of({ name: "John", surname: "Doe" }),
      ent2: Nested2.of({ city: "Iasi", street: "Arcu" }),
    });
    expect(test.h.ent1).toBeInstanceOf(Nested);
    expect(test.h.ent2).toBeInstanceOf(Nested2);
  });
  it("should parse & output records of entity unions and records", () => {
    expect(test.i).toEqual({
      ent1: Nested.of({ name: "John", surname: "Doe" }),
      ent2: Nested2.of({ city: "Iasi", street: "Arcu" }),
      rec1: { name: "John", street: "Arcu" },
    });
    expect(test.i.ent1).toBeInstanceOf(Nested);
    expect(test.i.ent2).toBeInstanceOf(Nested2);
    expect(test.i.rec1).toBeInstanceOf(Object);
  });
  it("should parse & output records of records of entity unions and records", () => {
    expect(test.j).toEqual({
      foo: {
        ent1: Nested.of({ name: "John", surname: "Doe" }),
        ent2: Nested2.of({ city: "Iasi", street: "Arcu" }),
        rec1: { name: "John", street: "Arcu" },
      },
    });
    expect(test.j.foo.ent1).toBeInstanceOf(Nested);
    expect(test.j.foo.ent2).toBeInstanceOf(Nested2);
    expect(test.j.foo.rec1).toBeInstanceOf(Object);
  });
  it("should parse & output records of arrays of entity unions and records", () => {
    expect(test.k).toEqual({
      foo: [
        Nested.of({ name: "John", surname: "Doe" }),
        Nested2.of({ city: "Iasi", street: "Arcu" }),
        { name: "John", street: "Arcu" },
      ],
    });
    expect(test.k.foo[0]).toBeInstanceOf(Nested);
    expect(test.k.foo[1]).toBeInstanceOf(Nested2);
    expect(test.k.foo[2]).toBeInstanceOf(Object);
  });
  it("should parse & output records of records of arrays of entity unions and records", () => {
    expect(test.l).toEqual({
      foo: {
        bar: [
          Nested.of({ name: "John", surname: "Doe" }),
          Nested2.of({ city: "Iasi", street: "Arcu" }),
          { name: "John", street: "Arcu" },
        ],
      },
    });
    expect(test.l.foo.bar[0]).toBeInstanceOf(Nested);
    expect(test.l.foo.bar[1]).toBeInstanceOf(Nested2);
    expect(test.l.foo.bar[2]).toBeInstanceOf(Object);
  });
  it("should parse & output optional-nullable records", () => {
    expect(test.m).toBeNull();
  });

  // when
  const defaults = Test.of({});

  // then
  it("should use default values for records of strings", () => {
    expect(defaults.a).toEqual({});
  });
  it("should use default values for records of numbers", () => {
    expect(defaults.b).toEqual({});
  });
  it("should use default values for records of booleans", () => {
    expect(defaults.c).toEqual({});
  });
  it("should use default values for records of records of strings", () => {
    expect(defaults.d).toEqual({});
  });
  it("should use default values for records of arrays of strings", () => {
    expect(defaults.e).toEqual({});
  });
  it("should use default values for records of Entities", () => {
    expect(defaults.f).toEqual({});
  });
  it("should use default values for records of primitive unions", () => {
    expect(defaults.g).toEqual({});
  });
  it("should use default values for records of entity unions", () => {
    expect(defaults.h).toEqual({});
  });
  it("should use default values for records of entity unions and records", () => {
    expect(defaults.i).toEqual({});
  });
  it("should use default values for records of records of entity unions and records", () => {
    expect(defaults.j).toEqual({});
  });
  it("should use default values for records of arrays of entity unions and records", () => {
    expect(defaults.k).toEqual({});
  });
  it("should use default values for records of records of arrays of entity unions and records", () => {
    expect(defaults.l).toEqual({});
  });
  it("should use default values for optional-nullable records", () => {
    expect(defaults.m).toBeUndefined();
  });

  // when
  const fail = Test.of({
    // @ts-expect-error
    a: { foo: 1, baz: false, bar: {}, bag: [] },
    // @ts-expect-error
    b: { foo: "1", baz: false, bar: {}, bag: [] },
    // @ts-expect-error
    c: { foo: "1", baz: 1, bar: {}, bag: [] },
    // @ts-expect-error
    d: { a: { foo: 1, baz: false, bar: {}, bag: [] } },
    // @ts-expect-error
    e: { a: [1, false, {}, []] },
    // @ts-expect-error
    f: { a: { name: 1, surname: false } },
    // @ts-expect-error
    g: { a: {}, b: [], c: null },
    // @ts-expect-error
    h: { a: { city: 1, street: false }, b: { name: [], surname: {} } },
    i: {
      ent1: { name: false, surname: 1 },
      ent2: { city: [], street: {} },
      rec1: { name: [], street: {} },
    } as any,
    j: {
      a: {
        ent1: { name: false, surname: 1 },
        ent2: { city: [], street: {} },
        rec1: { name: [], street: {} },
      },
    } as any,
    k: {
      a: [
        { city: {}, street: null },
        { name: {}, surname: null },
        { name: 2, street: 1 },
      ],
    } as any,
  });

  const store = Store.getInstance();

  it("Should fail on invalid Record<string, string>", () => {
    expect(fail.a).toEqual({});

    expect(store.get("Test", "a", "Record<String, Number>")).toBe(1);
    expect(store.get("Test", "a", "Record<String, Boolean>")).toBe(1);
    expect(store.get("Test", "a", "Number")).toBe(1);
    expect(store.get("Test", "a", "Boolean")).toBe(1);
    expect(store.get("Test", "a", "Record")).toBe(1);
    expect(store.get("Test", "a", "Array")).toBe(1);
  });
  it("Should fail on invalid Record<string, number>", () => {
    expect(fail.b).toEqual({});

    expect(store.get("Test", "b", "Record<String, String>")).toBe(1);
    expect(store.get("Test", "b", "Record<String, Boolean>")).toBe(1);
    expect(store.get("Test", "b", "String")).toBe(1);
    expect(store.get("Test", "b", "Boolean")).toBe(1);
    expect(store.get("Test", "b", "Record")).toBe(1);
    expect(store.get("Test", "b", "Array")).toBe(1);
  });
  it("Should fail on invalid Record<string, boolean>", () => {
    expect(fail.c).toEqual({});

    expect(store.get("Test", "c", "Record<String, String>")).toBe(1);
    expect(store.get("Test", "c", "Record<String, Number>")).toBe(1);
    expect(store.get("Test", "c", "String")).toBe(1);
    expect(store.get("Test", "c", "Number")).toBe(1);
    expect(store.get("Test", "c", "Record")).toBe(1);
    expect(store.get("Test", "c", "Array")).toBe(1);
  });
  it("Should fail on invalid Record<string, Record<string, string>>", () => {
    expect(fail.d).toEqual({ a: {} });

    expect(store.get("Test", "d", "Record<String, Number>")).toBe(1);
    expect(store.get("Test", "d", "Record<String, Boolean>")).toBe(1);
    expect(store.get("Test", "d", "Number")).toBe(1);
    expect(store.get("Test", "d", "Boolean")).toBe(1);
    expect(store.get("Test", "d", "Record")).toBe(1);
    expect(store.get("Test", "d", "Array")).toBe(1);
  });
  it("Should fail on invalid Record<string, Array<string>>", () => {
    expect(fail.e).toEqual({ a: [] });

    expect(store.get("Test", "e", "Array<Number>")).toBe(1);
    expect(store.get("Test", "e", "Array<Boolean>")).toBe(1);
    expect(store.get("Test", "e", "Array<Record>")).toBe(1);
    expect(store.get("Test", "e", "Array<Array>")).toBe(1);
    expect(store.get("Test", "e", "Number")).toBe(1);
    expect(store.get("Test", "e", "Boolean")).toBe(1);
    expect(store.get("Test", "e", "Record")).toBe(1);
    expect(store.get("Test", "e", "Array")).toBe(1);
  });
  it("Should fail on invalid Record<string, Nested>", () => {
    expect(fail.f).toEqual({ a: Nested.of({}) });

    expect(store.get("Nested", "name", "Number")).toBe(1);
    expect(store.get("Nested", "surname", "Boolean")).toBe(1);
  });
  it("Should fail on invalid Record<string, string | number | boolean>", () => {
    expect(fail.g).toEqual({});

    expect(store.get("Test", "g", "Record")).toBe(1);
    expect(store.get("Test", "g", "Array")).toBe(1);
  });
  it("Should fail on invalid Record<string, Nested | Nested2>", () => {
    expect(fail.h).toEqual({ a: Nested2.of({}), b: Nested.of({}) });

    expect(store.get("Nested", "name", "Array")).toBe(1);
    expect(store.get("Nested", "surname", "Record")).toBe(1);
    expect(store.get("Nested2", "city", "Number")).toBe(1);
    expect(store.get("Nested2", "street", "Boolean")).toBe(1);
  });
  it("Should fail on invalid Record<string, Nested | Nested2 | Record<string, string>>", () => {
    expect(fail.i).toEqual({
      ent1: Nested.of({}),
      ent2: Nested2.of({}),
      rec1: {},
    });

    expect(store.get("Nested", "name", "Array")).toBe(1);
    expect(store.get("Nested", "surname", "Record")).toBe(1);
    expect(store.get("Nested2", "city", "Number")).toBe(1);
    expect(store.get("Nested2", "street", "Boolean")).toBe(1);
    expect(store.get("Test", "i", "Record<String, Record>")).toBe(1);
    expect(store.get("Test", "i", "Record<String, Array>")).toBe(1);
  });
  it("Should fail on invalid Record<string, Record<string, Nested | Nested2 | Record<string, string>>>", () => {
    expect(fail.j).toEqual({
      a: { ent1: Nested.of({}), ent2: Nested2.of({}), rec1: {} },
    });

    expect(store.get("Nested", "name", "Array")).toBe(1);
    expect(store.get("Nested", "surname", "Record")).toBe(1);
    expect(store.get("Nested2", "city", "Number")).toBe(1);
    expect(store.get("Nested2", "street", "Boolean")).toBe(1);
    expect(store.get("Test", "j", "Record<String, Record>")).toBe(1);
    expect(store.get("Test", "j", "Record<String, Array>")).toBe(1);
  });
  it("Should fail on invalid Record<string, Record<string, (Nested | Nested2 | Record<string, string>)[]>", () => {
    expect(fail.k).toEqual({
      a: [Nested2.of({}), Nested.of({}), {}],
    });

    expect(store.get("Nested", "name", "Record")).toBe(1);
    expect(store.get("Nested", "surname", "null")).toBe(1);
    expect(store.get("Nested2", "street", "null")).toBe(1);
    expect(store.get("Nested2", "city", "Record")).toBe(1);
    expect(store.get("Test", "k", "Record<String, Number>")).toBe(2);
  });
});
