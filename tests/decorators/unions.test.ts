import { entity, type } from "../../src/decorators";
import { Store } from "../../src/store";

describe("union types", () => {
  // given
  @entity()
  class Nested {
    @type((t) => t(String))
    name: string = "";

    @type((t) => t(String))
    surname: string = "";

    static of = entity.of<Nested>();
  }

  @entity()
  class Nested2 {
    @type((t) => t(String))
    city: string = "";

    @type((t) => t(String))
    street: string = "";

    static of = entity.of<Nested2>();
  }

  @entity()
  class Test {
    @type((t) => t.union(String, Number, Boolean))
    a: string | number | boolean = "";

    @type((t) => t.union(Nested, Nested2))
    b: Nested | Nested2 = Nested.of({});

    @type((t) => t.union(Nested, t.record(String, String)))
    c: Nested | Record<string, string> = {};

    @type((t) => t.union(Nested, Nested2).optional().nullable())
    d?: Nested | Nested2 | null;

    static of = entity.of<Test>();
  }

  // when
  const test = Test.of({
    a: "John",
    b: { name: "John", surname: "Doe" },
    c: { name: "John", surname: "Doe" },
    d: null,
  });

  // then
  it("should parse & output primitive unions", () => {
    expect(test.a).toBe("John");
  });
  it("should parse & output entity unions", () => {
    expect(test.b).toEqual(Nested.of({ name: "John", surname: "Doe" }));
    expect(test.b).toBeInstanceOf(Nested);
  });
  it("should parse & output record & entity unions", () => {
    expect(test.c).toEqual(Nested.of({ name: "John", surname: "Doe" }));
    expect(test.c).toBeInstanceOf(Nested);
  });
  it("should parse & output optional & nullable unions", () => {
    expect(test.d).toBeNull();
  });

  // when
  const test2 = Test.of({
    a: 30,
    b: { city: "London", street: "Baker Street" },
    c: { name: "John", surname: "Doe", random: "2" },
    d: { city: "London", street: "Baker Street" },
  });

  // then
  it("should parse & output primitive unions", () => {
    expect(test2.a).toBe(30);
  });
  it("should parse & output entity unions", () => {
    expect(test2.b).toEqual(
      Nested2.of({ city: "London", street: "Baker Street" })
    );
    expect(test2.b).toBeInstanceOf(Nested2);
  });
  it("should parse & output record & entity unions", () => {
    expect(test2.c).toEqual({ name: "John", surname: "Doe", random: "2" });
    expect(test2.c).toBeInstanceOf(Object);
  });
  it("should parse & output optional & nullable unions", () => {
    expect(test2.d).toEqual(
      Nested2.of({ city: "London", street: "Baker Street" })
    );
    expect(test2.d).toBeInstanceOf(Nested2);
  });

  // when
  const test3 = Test.of({
    a: true,
    d: { name: "John", surname: "Doe" },
  });

  // then
  it("should parse & output primitive unions", () => {
    expect(test3.a).toBe(true);
  });
  it("should parse & output optional & nullable unions", () => {
    expect(test3.d).toEqual(Nested.of({ name: "John", surname: "Doe" }));
    expect(test3.d).toBeInstanceOf(Nested);
  });

  // when
  const defaults = Test.of({});

  // then
  it("should parse & output primitive unions", () => {
    expect(defaults.a).toBe("");
  });
  it("should parse & output entity unions", () => {
    expect(defaults.b).toEqual(Nested.of({}));
    expect(defaults.b).toBeInstanceOf(Nested);
  });
  it("should parse & output record & entity unions", () => {
    expect(defaults.c).toEqual({});
  });

  // when
  const fails = Test.of({
    // @ts-expect-error
    a: {},
    // @ts-expect-error
    b: { city: {}, street: {} },
    // @ts-expect-error
    c: { foo: [], baz: {}, bar: null },
    // @ts-expect-error
    d: { name: {}, surname: [] },
  });

  const store = Store.getInstance();

  it("should fail on invalid string | number | boolean unions", () => {
    expect(fails.a).toBe("");

    expect(store.get("Test", "a", "Record")).toBe(1);
  });
  it('should fail on invalid "Nested | Nested2" unions', () => {
    expect(fails.b).toEqual(Nested2.of({}));

    expect(store.get("Nested2", "city", "Record")).toBe(1);
    expect(store.get("Nested2", "street", "Record")).toBe(1);
  });
  it('should fail on invalid "Nested | Record<string, string>" unions', () => {
    expect(fails.c).toEqual({});

    expect(store.get("Test", "c", "Record<String, Array>")).toBe(1);
    expect(store.get("Test", "c", "Record<String, Record>")).toBe(2);
  });
  it('should fail on invalid "Nested | Nested2" optional & nullable unions', () => {
    expect(fails.d).toEqual(Nested.of({}));

    expect(store.get("Nested", "name", "Record")).toBe(1);
    expect(store.get("Nested", "surname", "Array")).toBe(1);
  });
});
