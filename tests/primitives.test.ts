import { Entity, Of } from "../src/decorators";
import { Store } from "../src/store";

describe("primitive types", () => {
  // given
  @Entity()
  class Test {
    @Of((t) => t(String))
    a: string = "";

    @Of((t) => t(Number))
    b: number = 0;

    @Of((t) => t(Boolean))
    c: boolean = false;

    @Of((t) => t(String).optional())
    d?: string;

    @Of((t) => t(Number).optional())
    e?: number;

    @Of((t) => t(Boolean).optional())
    f?: boolean;

    @Of((t) => t(String).nullable())
    g: string | null = null;

    @Of((t) => t(Number).nullable())
    h: number | null = null;

    @Of((t) => t(Boolean).nullable())
    i: boolean | null = null;

    @Of((t) => t(String).optional().nullable())
    j?: string | null;

    @Of((t) => t(Number).optional().nullable())
    k?: number | null;

    @Of((t) => t(Boolean).optional().nullable())
    l?: boolean | null;

    static of = Entity.of<Test>();
  }

  // when
  const test = Test.of({
    a: "John",
    b: 30,
    c: true,
    d: undefined,
    e: undefined,
    f: undefined,
    g: null,
    h: null,
    i: null,
    j: null,
    k: null,
    l: null,
  });

  // then
  it("Should parse & output String Ofs", () => {
    expect(test.a).toBe("John");
  });
  it("Should parse & output Number Ofs", () => {
    expect(test.b).toBe(30);
  });
  it("Should parse & output Boolean Ofs", () => {
    expect(test.c).toBe(true);
  });
  it("Should parse & output optional string Ofs", () => {
    expect(test.d).toBe(undefined);
  });
  it("Should parse & output optional number Ofs", () => {
    expect(test.e).toBe(undefined);
  });
  it("Should parse & output optional boolean Ofs", () => {
    expect(test.f).toBe(undefined);
  });
  it("Should parse & output nullable string Ofs", () => {
    expect(test.g).toBe(null);
  });
  it("Should parse & output nullable number Ofs", () => {
    expect(test.h).toBe(null);
  });
  it("Should parse & output nullable boolean Ofs", () => {
    expect(test.i).toBe(null);
  });
  it("Should parse & output optional nullable string Ofs", () => {
    expect(test.j).toBe(null);
  });
  it("Should parse & output optional nullable number Ofs", () => {
    expect(test.k).toBe(null);
  });
  it("Should parse & output optional nullable boolean Ofs", () => {
    expect(test.l).toBe(null);
  });

  // when
  const defaults = Test.of({});

  // then
  it("Should use default values for String Ofs", () => {
    expect(defaults.a).toBe("");
  });
  it("Should use default values for Number Ofs", () => {
    expect(defaults.b).toBe(0);
  });
  it("Should use default values for Boolean Ofs", () => {
    expect(defaults.c).toBe(false);
  });
  it("Should not use default values for optional string Ofs", () => {
    expect(defaults.d).toBe(undefined);
  });
  it("Should not use default values for optional number Ofs", () => {
    expect(defaults.e).toBe(undefined);
  });
  it("Should not use default values for optional boolean Ofs", () => {
    expect(defaults.f).toBe(undefined);
  });
  it("Should use default values for nullable string Ofs", () => {
    expect(defaults.g).toBe(null);
  });
  it("Should use default values for nullable number Ofs", () => {
    expect(defaults.h).toBe(null);
  });
  it("Should use default values for nullable boolean Ofs", () => {
    expect(defaults.i).toBe(null);
  });
  it("Should not use default values for optional nullable string Ofs", () => {
    expect(defaults.j).toBe(undefined);
  });
  it("Should not use default values for optional nullable number Ofs", () => {
    expect(defaults.k).toBe(undefined);
  });
  it("Should not use default values for optional nullable boolean Ofs", () => {
    expect(defaults.l).toBe(undefined);
  });

  // when
  const failing = Test.of({
    // @ts-ignore
    a: 1,
    // @ts-ignore
    b: "1",
    // @ts-ignore
    c: {},
  });

  // then
  it("Should fail to parse wrong value for String Ofs and fallback on default", () => {
    const store = Store.getInstance();

    expect(failing.a).toBe("");
    expect(store.get("Test", "a", "Number")).toBe(1);
  });
  it("Should fail to parse wrong value for Number Ofs and fallback on default", () => {
    const store = Store.getInstance();

    expect(failing.b).toBe(0);
    expect(store.get("Test", "b", "String")).toBe(1);
  });
  it("Should fail to parse wrong value for Boolean Ofs and fallback on default", () => {
    const store = Store.getInstance();

    expect(failing.c).toBe(false);
    expect(store.get("Test", "c", "Record")).toBe(1);
  });
});
