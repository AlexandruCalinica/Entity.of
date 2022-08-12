import { getStore } from "../src/core";

describe("getStore", () => {
  beforeAll(() => {
    getStore().destroy();
  });
  afterEach(() => {
    getStore().destroy();
  });

  it("Should init store", () => {
    // given
    const { init } = getStore();

    // act
    init();

    // assert
    expect(getStore().store).toEqual({
      unknown: {},
      mistyped: {},
      entities: {},
      meta: {
        enableWarnings: false,
      },
    });
  });

  it("Should init store with 'enableWarnings' = true", () => {
    // given
    const { init } = getStore({ enableWarnings: true });

    // act
    init();

    // assert
    expect(getStore().store).toEqual({
      unknown: {},
      mistyped: {},
      entities: {},
      meta: {
        enableWarnings: true,
      },
    });
  });

  it("Should register a new owner in the store", () => {
    // given
    const { register, init } = getStore();
    init();

    // act
    register("Entity");
    const { store } = getStore();

    // assert
    expect(store["unknown"]).toEqual({ Entity: {} });
    expect(store["mistyped"]).toEqual({ Entity: {} });
    expect(store["entities"]).toEqual({ Entity: {} });
  });

  it("Should reset store", () => {
    // given
    const { reset, register, init } = getStore();
    init();
    register("Entity");

    // act
    reset();
    const { store } = getStore();

    // assert
    expect(store).toEqual({
      unknown: {},
      mistyped: {},
      entities: {},
      meta: {
        enableWarnings: false,
      },
    });
  });

  it("Should destroy store", () => {
    // given
    const { init, destroy } = getStore();
    init();

    // act
    destroy();

    // assert
    const { store } = getStore();
    expect(store).toBe(undefined);
    expect((globalThis as any)["__ENTITY_OF__"]).toBe(undefined);
  });

  it("Should set store - unknown", () => {
    // given
    const owner = "Entity";
    const { init, register, set } = getStore();

    init();
    register(owner);
    const setUnknownCount = set<number>("unknown", owner, "foo");

    // act
    setUnknownCount(() => 1, 0);
    // assert
    expect(getStore().store["unknown"][owner]).toEqual({ foo: 1 });
    // act
    setUnknownCount((prev) => prev + 1);
    // assert
    expect(getStore().store["unknown"][owner]).toEqual({ foo: 2 });
  });

  it("Should set store - mistyped", () => {
    // given
    const owner = "Entity";
    const { init, register, set } = getStore();

    init();
    register(owner);
    const setMistypedCount = set<number>("mistyped", owner, "foo");

    // act
    setMistypedCount(() => 1, 0);
    // assert
    expect(getStore().store["mistyped"][owner]).toEqual({ foo: 1 });
    // act
    setMistypedCount((prev) => prev + 1);
    // assert
    expect(getStore().store["mistyped"][owner]).toEqual({ foo: 2 });
  });

  it("Should set store - entities", () => {
    // given
    const owner = "Entity";
    const { init, register, setEntity } = getStore();

    init();
    register(owner);

    // act
    setEntity(owner)(() => ({ foo: 1 }));

    // assert
    expect(getStore().store["entities"][owner]).toEqual({ foo: 1 });
  });
});
