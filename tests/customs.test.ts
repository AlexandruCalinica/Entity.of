import { Entity, Of } from "../src/decorators";

describe("custom types", () => {
  // given
  @Entity()
  class Test {
    @Of((t) =>
      t.custom((v) => {
        if (typeof v === "boolean") return "boolean";
        if (typeof v === "number") return "number";
        if (typeof v === "string") return "string";
        return "unknown";
      })
    )
    a: unknown = "";

    static of = Entity.of<Test>();
  }

  // when
  const test = Test.of({ a: true });
  const test2 = Test.of({ a: 1 });
  const test3 = Test.of({ a: "john" });
  const test4 = Test.of({ a: {} });

  // then
  it("should parse & output custom types", () => {
    expect(test.a).toBe("boolean");
    expect(test2.a).toBe("number");
    expect(test3.a).toBe("string");
    expect(test4.a).toBe("unknown");
  });

  // when
  const defaults = Test.of({});

  // then
  it("should use default value", () => {
    expect(defaults.a).toBe("");
  });
});
