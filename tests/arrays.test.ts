import { Entity, Of } from "../src/decorators";
import { Store } from "../src/store";

describe("array types", () => {
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
    @Of((t) => t.array(String))
    a: string[] = [];

    @Of((t) => t.array(Number))
    b: number[] = [];

    @Of((t) => t.array(Boolean))
    c: boolean[] = [];

    @Of((t) => t.array(Nested))
    d: Nested[] = [];

    @Of((t) => t.array(t.union(String, Number, Boolean)))
    e: (string | number | boolean)[] = [];

    @Of((t) => t.array(t.union(Nested, Nested2)))
    f: (Nested | Nested2)[] = [];

    @Of((t) => t.array(t.record(String, String)))
    g: Record<string, string>[] = [];

    @Of((t) => t.array(t.record(String, Nested)))
    h: Record<string, Nested>[] = [];

    @Of((t) => t.array(t.array(String)))
    i: string[][] = [];

    @Of((t) => t.array(t.array(Number)))
    j: number[][] = [];

    @Of((t) => t.array(t.array(Boolean)))
    k: boolean[][] = [];

    @Of((t) => t.array(t.array(Nested)))
    l: Nested[][] = [];

    @Of((t) => t.array(t.array(t.union(String, Number, Boolean))))
    m: (string | number | boolean)[][] = [];

    @Of((t) => t.array(t.array(t.union(Nested, Nested2))))
    n: (Nested | Nested2)[][] = [];

    @Of((t) => t.array(t.array(t.record(String, String))))
    o: Record<string, string>[][] = [];

    @Of((t) => t.array(t.array(t.record(String, Nested))))
    p: Record<string, Nested>[][] = [];

    @Of((t) =>
      t.array(t.array(t.record(String, t.union(String, Number, Boolean))))
    )
    q: Record<string, string | number | boolean>[][] = [];

    @Of((t) => t.array(t.array(t.record(String, t.union(Nested, Nested2)))))
    r: Record<string, Nested | Nested2>[][] = [];

    @Of((t) =>
      t.array(t.array(t.union(Nested, Nested2, t.record(String, String))))
    )
    s: (Nested | Nested2 | Record<string, string>)[][] = [];

    @Of((t) => t.array(String).optional().nullable())
    t?: string[] | null;

    static of = Entity.of<Test>();
  }

  // when
  const test = Test.of({
    a: ["John"],
    b: [30],
    c: [true],
    d: [{ name: "John", surname: "Doe" }],
    e: ["John", 30, true],
    f: [
      { name: "John", surname: "Doe" },
      { city: "London", street: "Baker Street" },
    ],
    g: [{ name: "John" }],
    h: [{ name: { name: "John", surname: "Doe" } }],
    i: [["John"]],
    j: [[30]],
    k: [[true]],
    l: [[{ name: "John", surname: "Doe" }]],
    m: [["John", 30, true]],
    n: [
      [{ name: "John", surname: "Doe" }],
      [{ city: "London", street: "Baker Street" }],
    ],
    o: [[{ name: "John" }]],
    p: [[{ name: { name: "John", surname: "Doe" } }]],
    q: [[{ name: "John" }, { age: 30 }, { active: true }]],
    r: [
      [{ name: { name: "John", surname: "Doe" } }],
      [{ address: { city: "London", street: "Baker Street" } }],
    ],
    s: [
      [
        { name: "John", surname: "Doe" },
        { city: "London", street: "Baker Street" },
        { name: "John", street: "Baker Street" },
      ],
    ],
    t: null,
  });

  // then
  it("Should parse & output String[] Ofs", () => {
    expect(test.a).toEqual(["John"]);
  });
  it("Should parse & output Number[] Ofs", () => {
    expect(test.b).toEqual([30]);
  });
  it("Should parse & output Boolean[] Ofs", () => {
    expect(test.c).toEqual([true]);
  });
  it("Should parse & output Nested[] Ofs", () => {
    expect(test.d).toEqual([{ name: "John", surname: "Doe" }]);
    expect(test.d[0]).toBeInstanceOf(Nested);
  });
  it("Should parse & output (String | Number | Boolean)[] Ofs", () => {
    expect(test.e).toEqual(["John", 30, true]);
  });
  it("Should parse & output (Nested | Nested2)[] Ofs", () => {
    expect(test.f).toEqual([
      Nested.of({ name: "John", surname: "Doe" }),
      Nested2.of({ city: "London", street: "Baker Street" }),
    ]);
    expect(test.f[0]).toBeInstanceOf(Nested);
    expect(test.f[1]).toBeInstanceOf(Nested2);
  });
  it("Should parse & output Record<string, string>[] Ofs", () => {
    expect(test.g).toEqual([{ name: "John" }]);
  });
  it("Should parse & output Record<string, Nested>[] Ofs", () => {
    expect(test.h).toEqual([
      { name: Nested.of({ name: "John", surname: "Doe" }) },
    ]);
    expect(test.h[0].name).toBeInstanceOf(Nested);
  });
  it("Should parse & output String[][] Ofs", () => {
    expect(test.i).toEqual([["John"]]);
  });
  it("Should parse & output Number[][] Ofs", () => {
    expect(test.j).toEqual([[30]]);
  });
  it("Should parse & output Boolean[][] Ofs", () => {
    expect(test.k).toEqual([[true]]);
  });
  it("Should parse & output Nested[][] Ofs", () => {
    expect(test.l).toEqual([[Nested.of({ name: "John", surname: "Doe" })]]);
    expect(test.l[0][0]).toBeInstanceOf(Nested);
  });
  it("Should parse & output (String | Number | Boolean)[][] Ofs", () => {
    expect(test.m).toEqual([["John", 30, true]]);
  });
  it("Should parse & output (Nested | Nested2)[][] Ofs", () => {
    expect(test.n).toEqual([
      [Nested.of({ name: "John", surname: "Doe" })],
      [Nested2.of({ city: "London", street: "Baker Street" })],
    ]);
    expect(test.n[0][0]).toBeInstanceOf(Nested);
    expect(test.n[1][0]).toBeInstanceOf(Nested2);
  });
  it("Should parse & output Record<string, string>[][] Ofs", () => {
    expect(test.o).toEqual([[{ name: "John" }]]);
  });
  it("Should parse & output Record<string, Nested>[][] Ofs", () => {
    expect(test.p).toEqual([
      [{ name: Nested.of({ name: "John", surname: "Doe" }) }],
    ]);
    expect(test.p[0][0].name).toBeInstanceOf(Nested);
  });
  it("Should parse & output Record<string, string | number | boolean>[][] Ofs", () => {
    expect(test.q).toEqual([[{ name: "John" }, { age: 30 }, { active: true }]]);
  });
  it("Should parse & output Record<string, Nested | Nested2>[][] Ofs", () => {
    expect(test.r).toEqual([
      [{ name: Nested.of({ name: "John", surname: "Doe" }) }],
      [{ address: Nested2.of({ city: "London", street: "Baker Street" }) }],
    ]);
    expect(test.r[0][0].name).toBeInstanceOf(Nested);
    expect(test.r[1][0].address).toBeInstanceOf(Nested2);
  });
  it("Should parse & output (Nested | Nested2 | Record<string, string>)[][] Ofs", () => {
    expect(test.s).toEqual([
      [
        Nested.of({ name: "John", surname: "Doe" }),
        Nested2.of({ city: "London", street: "Baker Street" }),
        { name: "John", street: "Baker Street" },
      ],
    ]);
    expect(test.s[0][0]).toBeInstanceOf(Nested);
    expect(test.s[0][1]).toBeInstanceOf(Nested2);
  });
  it("Should parse & output optional-nullable Ofs", () => {
    expect(test.t).toBeNull();
  });

  // when
  const defaults = Test.of({});

  // then
  it("Should use default values for String[] Ofs", () => {
    expect(defaults.a).toEqual([]);
  });
  it("Should use default values for Number[] Ofs", () => {
    expect(defaults.b).toEqual([]);
  });
  it("Should use default values for Boolean[] Ofs", () => {
    expect(defaults.c).toEqual([]);
  });
  it("Should use default values for Nested[] Ofs", () => {
    expect(defaults.d).toEqual([]);
  });
  it("Should use default values for (String | Number | Boolean)[] Ofs", () => {
    expect(defaults.e).toEqual([]);
  });
  it("Should use default values for (Nested | Nested2)[] Ofs", () => {
    expect(defaults.f).toEqual([]);
  });
  it("Should use default values for Record<string, string>[] Ofs", () => {
    expect(defaults.g).toEqual([]);
  });
  it("Should use default values for Record<string, Nested>[] Ofs", () => {
    expect(defaults.h).toEqual([]);
  });
  it("Should use default values for String[][] Ofs", () => {
    expect(defaults.i).toEqual([]);
  });
  it("Should use default values for Number[][] Ofs", () => {
    expect(defaults.j).toEqual([]);
  });
  it("Should use default values for Boolean[][] Ofs", () => {
    expect(defaults.k).toEqual([]);
  });
  it("Should use default values for Nested[][] Ofs", () => {
    expect(defaults.l).toEqual([]);
  });
  it("Should use default values for (String | Number | Boolean)[][] Ofs", () => {
    expect(defaults.m).toEqual([]);
  });
  it("Should use default values for (Nested | Nested2)[][] Ofs", () => {
    expect(defaults.n).toEqual([]);
  });
  it("Should use default values for Record<string, string>[][] Ofs", () => {
    expect(defaults.o).toEqual([]);
  });
  it("Should use default values for Record<string, Nested>[][] Ofs", () => {
    expect(defaults.p).toEqual([]);
  });
  it("Should use default values for Record<string, string | number | boolean>[][] Ofs", () => {
    expect(defaults.q).toEqual([]);
  });
  it("Should use default values for Record<string, Nested | Nested2>[][] Ofs", () => {
    expect(defaults.r).toEqual([]);
  });
  it("Should use default values for (Nested | Nested2 | Record<string, string>)[][] Ofs", () => {
    expect(defaults.s).toEqual([]);
  });
  it("Should use default values for optional-nullable Ofs", () => {
    expect(defaults.t).toBeUndefined();
  });

  // when
  const failing = Test.of({
    // @ts-expect-error
    a: [1, false, {}, [], null],
    // @ts-expect-error
    b: [false, "a", {}, [], null],
    // @ts-expect-error
    c: [1, "a", {}, [], null],
    // @ts-expect-error
    d: [1, "a", false, [], null],
    // @ts-expect-error
    e: [{}, [], null],
    // @ts-expect-error
    f: [1, "a", false, {}, [], null],
    // @ts-expect-error
    g: [1, "a", false, {}, [], null],
    // @ts-expect-error
    h: [1, "a", false, {}, [], null],
    // @ts-expect-error
    i: [1, "a", false, {}, [], null],
    // @ts-expect-error
    j: [1, "a", false, {}, [], null],
    // @ts-expect-error
    k: [1, "a", false, {}, [], null],
    // @ts-expect-error
    l: [1, "1", false, {}, [], null],
    // @ts-expect-error
    m: [1, "a", false, {}, [], null],
    // @ts-expect-error
    n: [1, "a", false, {}, [], null],
    // @ts-expect-error
    o: [1, "a", false, {}, [], null],
    // @ts-expect-error
    p: [1, "a", false, {}, [], null],
    // @ts-expect-error
    q: [1, "a", false, {}, [], null, [{}], [{ a: {} }]],
    r: [
      1,
      "a",
      false,
      {},
      [],
      null,
      [{}],
      [{ a: {} }],
      [
        {
          nested: { name: "John", surname: "Doe" },
          fail: { name: false, surname: 1 },
          nested2: { city: "London", street: "Baker Street" },
          fail2: { city: {}, street: [] },
        },
      ],
    ] as any,
    s: [
      1,
      "a",
      false,
      {},
      [],
      null,
      [{}],
      [{ city: 1, street: {} }],
      [{ name: [], surname: true }],
      [{ a: 1 }],
    ] as any,
    t: [1, false, {}, [], null] as any,
  });

  // then

  const store = Store.getInstance();

  it("Should fail when parsing String[] Ofs", () => {
    expect(failing.a).toEqual([]);
    expect(store.get("Test", "a", "Number")).toBe(1);
    expect(store.get("Test", "a", "Boolean")).toBe(1);
    expect(store.get("Test", "a", "Record")).toBe(1);
    expect(store.get("Test", "a", "Array")).toBe(1);
    expect(store.get("Test", "a", "null")).toBe(1);
  });
  it("Should fail when parsing Number[] Ofs", () => {
    expect(failing.b).toEqual([]);
    expect(store.get("Test", "b", "Boolean")).toBe(1);
    expect(store.get("Test", "b", "String")).toBe(1);
    expect(store.get("Test", "b", "Record")).toBe(1);
    expect(store.get("Test", "b", "Array")).toBe(1);
    expect(store.get("Test", "b", "null")).toBe(1);
  });
  it("Should fail when parsing Boolean[] Ofs", () => {
    expect(failing.c).toEqual([]);
    expect(store.get("Test", "c", "String")).toBe(1);
    expect(store.get("Test", "c", "Number")).toBe(1);
    expect(store.get("Test", "c", "Record")).toBe(1);
    expect(store.get("Test", "c", "Array")).toBe(1);
    expect(store.get("Test", "c", "null")).toBe(1);
  });
  it("Should fail when parsing Nested[] Ofs", () => {
    expect(failing.d).toEqual([]);
    expect(store.get("Test", "d", "String")).toBe(1);
    expect(store.get("Test", "d", "Number")).toBe(1);
    expect(store.get("Test", "d", "Boolean")).toBe(1);
    expect(store.get("Test", "d", "Array")).toBe(1);
    expect(store.get("Test", "d", "null")).toBe(1);
  });
  it("Should fail when parsing (String | Number | Boolean)[] Ofs", () => {
    expect(failing.e).toEqual([]);
    expect(store.get("Test", "e", "Record")).toBe(1);
    expect(store.get("Test", "e", "Array")).toBe(1);
    expect(store.get("Test", "e", "null")).toBe(1);
  });
  it("Should fail when parsing (Nested | Nested2)[] Ofs", () => {
    expect(failing.f).toEqual([{}]);
    expect(store.get("Test", "f", "String")).toBe(1);
    expect(store.get("Test", "f", "Number")).toBe(1);
    expect(store.get("Test", "f", "Boolean")).toBe(1);
    expect(store.get("Test", "f", "Array")).toBe(1);
    expect(store.get("Test", "f", "null")).toBe(1);
  });
  it("Should fail when parsing Record<string, string>[] Ofs", () => {
    expect(failing.g).toEqual([{}]);
    expect(store.get("Test", "g", "String")).toBe(1);
    expect(store.get("Test", "g", "Number")).toBe(1);
    expect(store.get("Test", "g", "Boolean")).toBe(1);
    expect(store.get("Test", "g", "Array")).toBe(1);
    expect(store.get("Test", "g", "null")).toBe(1);
  });
  it("Should fail when parsing Record<string, Nested>[] Ofs", () => {
    expect(failing.h).toEqual([{}]);
    expect(store.get("Test", "h", "String")).toBe(1);
    expect(store.get("Test", "h", "Number")).toBe(1);
    expect(store.get("Test", "h", "Boolean")).toBe(1);
    expect(store.get("Test", "h", "Array")).toBe(1);
    expect(store.get("Test", "h", "null")).toBe(1);
  });
  it("Should fail when parsing string[][] Ofs", () => {
    expect(failing.i).toEqual([[]]);
    expect(store.get("Test", "i", "String")).toBe(1);
    expect(store.get("Test", "i", "Number")).toBe(1);
    expect(store.get("Test", "i", "Boolean")).toBe(1);
    expect(store.get("Test", "i", "Record")).toBe(1);
    expect(store.get("Test", "i", "null")).toBe(1);
  });
  it("Should fail when parsing number[][] Ofs", () => {
    expect(failing.j).toEqual([[]]);
    expect(store.get("Test", "j", "String")).toBe(1);
    expect(store.get("Test", "j", "Number")).toBe(1);
    expect(store.get("Test", "j", "Boolean")).toBe(1);
    expect(store.get("Test", "j", "Record")).toBe(1);
    expect(store.get("Test", "j", "null")).toBe(1);
  });
  it("Should fail when parsing boolean[][] Ofs", () => {
    expect(failing.k).toEqual([[]]);
    expect(store.get("Test", "k", "String")).toBe(1);
    expect(store.get("Test", "k", "Number")).toBe(1);
    expect(store.get("Test", "k", "Boolean")).toBe(1);
    expect(store.get("Test", "k", "Record")).toBe(1);
    expect(store.get("Test", "k", "null")).toBe(1);
  });
  it("Should fail when parsing Nested[][] Ofs", () => {
    expect(failing.l).toEqual([[]]);
    expect(store.get("Test", "l", "String")).toBe(1);
    expect(store.get("Test", "l", "Number")).toBe(1);
    expect(store.get("Test", "l", "Boolean")).toBe(1);
    expect(store.get("Test", "l", "Record")).toBe(1);
    expect(store.get("Test", "l", "null")).toBe(1);
  });
  it("Should fail when parsing (String | Number | Boolean)[][] Ofs", () => {
    expect(failing.m).toEqual([[]]);
    expect(store.get("Test", "l", "String")).toBe(1);
    expect(store.get("Test", "l", "Number")).toBe(1);
    expect(store.get("Test", "l", "Boolean")).toBe(1);
    expect(store.get("Test", "m", "Record")).toBe(1);
    expect(store.get("Test", "m", "null")).toBe(1);
  });
  it("Should fail when parsing (Nested | Nested2)[][] Ofs", () => {
    expect(failing.n).toEqual([[]]);
    expect(store.get("Test", "n", "String")).toBe(1);
    expect(store.get("Test", "n", "Number")).toBe(1);
    expect(store.get("Test", "n", "Boolean")).toBe(1);
    expect(store.get("Test", "n", "Record")).toBe(1);
    expect(store.get("Test", "n", "null")).toBe(1);
  });
  it("Should fail when parsing Record<string, string>[][] Ofs", () => {
    expect(failing.o).toEqual([[]]);
    expect(store.get("Test", "o", "String")).toBe(1);
    expect(store.get("Test", "o", "Number")).toBe(1);
    expect(store.get("Test", "o", "Boolean")).toBe(1);
    expect(store.get("Test", "o", "Record")).toBe(1);
    expect(store.get("Test", "o", "null")).toBe(1);
  });
  it("Should fail when parsing Record<string, Nested>[][] Ofs", () => {
    expect(failing.p).toEqual([[]]);
    expect(store.get("Test", "p", "String")).toBe(1);
    expect(store.get("Test", "p", "Number")).toBe(1);
    expect(store.get("Test", "p", "Boolean")).toBe(1);
    expect(store.get("Test", "p", "Record")).toBe(1);
    expect(store.get("Test", "p", "null")).toBe(1);
  });
  it("Should fail when parsing Record<string, string | number | boolean>[][] Ofs", () => {
    expect(failing.q).toEqual([[], [{}], [{}]]);
    expect(store.get("Test", "q", "String")).toBe(1);
    expect(store.get("Test", "q", "Number")).toBe(1);
    expect(store.get("Test", "q", "Boolean")).toBe(1);
    expect(store.get("Test", "q", "Record")).toBe(2);
    expect(store.get("Test", "q", "null")).toBe(1);
  });
  it("Should fail when parsing Record<string, Nested | Nested2>[][] Ofs", () => {
    expect(failing.r).toEqual([
      [],
      [{}],
      [{ a: {} }],
      [
        {
          nested: Nested.of({ name: "John", surname: "Doe" }),
          fail: Nested.of({}),
          nested2: Nested2.of({ city: "London", street: "Baker Street" }),
          fail2: Nested2.of({}),
        },
      ],
    ]);
    expect(store.get("Test", "r", "String")).toBe(1);
    expect(store.get("Test", "r", "Number")).toBe(1);
    expect(store.get("Test", "r", "Boolean")).toBe(1);
    expect(store.get("Test", "r", "Record")).toBe(1);
    expect(store.get("Test", "r", "null")).toBe(1);
    expect(store.get("Nested", "name", "Boolean")).toBe(1);
    expect(store.get("Nested", "surname", "Number")).toBe(1);
    expect(store.get("Nested2", "city", "Record")).toBe(1);
    expect(store.get("Nested2", "street", "Array")).toBe(1);
  });
  it("Should fail when parsing (Nested | Nested2 | Record<string, string>)[][] Ofs", () => {
    expect(failing.s).toEqual([
      [],
      [{}],
      [Nested2.of({})],
      [Nested.of({})],
      [{}],
    ]);
    expect(store.get("Test", "s", "String")).toBe(1);
    expect(store.get("Test", "s", "Number")).toBe(2);
    expect(store.get("Test", "s", "Boolean")).toBe(1);
    expect(store.get("Test", "s", "Record")).toBe(1);
    expect(store.get("Test", "s", "null")).toBe(1);
    expect(store.get("Nested2", "city", "Number")).toBe(1);
    expect(store.get("Nested2", "street", "Record")).toBe(1);
    expect(store.get("Nested", "name", "Array")).toBe(1);
    expect(store.get("Nested", "surname", "Boolean")).toBe(1);
    expect(store.get("Test", "s", "Record<String, Number>")).toBe(1);
  });
  it("Should fail when parsing string[] | null | undefined Ofs", () => {
    expect(failing.t).toEqual([null]);
    expect(store.get("Test", "t", "Number")).toBe(1);
    expect(store.get("Test", "t", "Boolean")).toBe(1);
    expect(store.get("Test", "t", "Record")).toBe(1);
    expect(store.get("Test", "t", "Array")).toBe(1);
  });
});
