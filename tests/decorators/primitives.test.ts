import { entity, type } from "../../src/decorators";
import { Store } from "../../src/store";

describe("primitive types", () => {
  // given
  @entity()
  class Test {
    @type((t) => t(String))
    a: string = "";

    @type((t) => t(Number))
    b: number = 0;

    @type((t) => t(Boolean))
    c: boolean = false;

    @type((t) => t(String).optional())
    d?: string;

    @type((t) => t(Number).optional())
    e?: number;

    @type((t) => t(Boolean).optional())
    f?: boolean;

    @type((t) => t(String).nullable())
    g: string | null = null;

    @type((t) => t(Number).nullable())
    h: number | null = null;

    @type((t) => t(Boolean).nullable())
    i: boolean | null = null;

    @type((t) => t(String).optional().nullable())
    j?: string | null;

    @type((t) => t(Number).optional().nullable())
    k?: number | null;

    @type((t) => t(Boolean).optional().nullable())
    l?: boolean | null;

    static of = entity.of<Test>();
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
  it("Should parse & output String types", () => {
    expect(test.a).toBe("John");
  });
  it("Should parse & output Number types", () => {
    expect(test.b).toBe(30);
  });
  it("Should parse & output Boolean types", () => {
    expect(test.c).toBe(true);
  });
  it("Should parse & output optional string types", () => {
    expect(test.d).toBe(undefined);
  });
  it("Should parse & output optional number types", () => {
    expect(test.e).toBe(undefined);
  });
  it("Should parse & output optional boolean types", () => {
    expect(test.f).toBe(undefined);
  });
  it("Should parse & output nullable string types", () => {
    expect(test.g).toBe(null);
  });
  it("Should parse & output nullable number types", () => {
    expect(test.h).toBe(null);
  });
  it("Should parse & output nullable boolean types", () => {
    expect(test.i).toBe(null);
  });
  it("Should parse & output optional nullable string types", () => {
    expect(test.j).toBe(null);
  });
  it("Should parse & output optional nullable number types", () => {
    expect(test.k).toBe(null);
  });
  it("Should parse & output optional nullable boolean types", () => {
    expect(test.l).toBe(null);
  });

  // when
  const defaults = Test.of({});

  // then
  it("Should use default values for String types", () => {
    expect(defaults.a).toBe("");
  });
  it("Should use default values for Number types", () => {
    expect(defaults.b).toBe(0);
  });
  it("Should use default values for Boolean types", () => {
    expect(defaults.c).toBe(false);
  });
  it("Should not use default values for optional string types", () => {
    expect(defaults.d).toBe(undefined);
  });
  it("Should not use default values for optional number types", () => {
    expect(defaults.e).toBe(undefined);
  });
  it("Should not use default values for optional boolean types", () => {
    expect(defaults.f).toBe(undefined);
  });
  it("Should use default values for nullable string types", () => {
    expect(defaults.g).toBe(null);
  });
  it("Should use default values for nullable number types", () => {
    expect(defaults.h).toBe(null);
  });
  it("Should use default values for nullable boolean types", () => {
    expect(defaults.i).toBe(null);
  });
  it("Should not use default values for optional nullable string types", () => {
    expect(defaults.j).toBe(undefined);
  });
  it("Should not use default values for optional nullable number types", () => {
    expect(defaults.k).toBe(undefined);
  });
  it("Should not use default values for optional nullable boolean types", () => {
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
  it("Should fail to parse wrong value for String types and fallback on default", () => {
    const store = Store.getInstance();

    expect(failing.a).toBe("");
    expect(store.get("Test", "a", "Number")).toBe(1);
  });
  it("Should fail to parse wrong value for Number types and fallback on default", () => {
    const store = Store.getInstance();

    expect(failing.b).toBe(0);
    expect(store.get("Test", "b", "String")).toBe(1);
  });
  it("Should fail to parse wrong value for Boolean types and fallback on default", () => {
    const store = Store.getInstance();

    expect(failing.c).toBe(false);
    expect(store.get("Test", "c", "Record")).toBe(1);
  });
});
