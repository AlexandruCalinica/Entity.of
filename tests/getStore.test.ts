import { getStore } from "../src/core";

describe("getStore", () => {
  beforeAll(() => {
    getStore().destroyStore();
  });
  afterEach(() => {
    getStore().destroyStore();
  });

  it("Should init store", () => {
    // given
    const { initStore } = getStore();

    // act
    initStore();

    // assert
    expect(getStore().store).toEqual({
      unknown: {},
      mistyped: {},
      instances: {},
    });
  });

  it("Should register a new owner in the store", () => {
    // given
    const { registerEntity, initStore } = getStore();
    initStore();

    // act
    registerEntity("Entity");
    const { store } = getStore();

    // assert
    expect(store["unknown"]).toEqual({ Entity: {} });
    expect(store["mistyped"]).toEqual({ Entity: {} });
    expect(store["instances"]).toEqual({ Entity: {} });
  });

  it("Should reset store", () => {
    // given
    const { resetStore, registerEntity, initStore } = getStore();
    initStore();
    registerEntity("Entity");

    // act
    resetStore();
    const { store } = getStore();

    // assert
    expect(store).toEqual({
      unknown: {},
      mistyped: {},
      instances: {},
    });
  });

  it("Should destroy store", () => {
    // given
    const { initStore, destroyStore } = getStore();
    initStore();

    // act
    destroyStore();

    // assert
    const { store } = getStore();
    expect(store).toBe(undefined);
    expect((globalThis as any)["__s__"]).toBe(undefined);
  });

  it("Should set store - unknown", () => {
    // given
    const owner = "Entity";
    const { initStore, registerEntity, setStore } = getStore();

    initStore();
    registerEntity(owner);
    const setUnknownCount = setStore<number>("unknown", owner, "foo");

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
    const { initStore, registerEntity, setStore } = getStore();

    initStore();
    registerEntity(owner);
    const setMistypedCount = setStore<number>("mistyped", owner, "foo");

    // act
    setMistypedCount(() => 1, 0);
    // assert
    expect(getStore().store["mistyped"][owner]).toEqual({ foo: 1 });
    // act
    setMistypedCount((prev) => prev + 1);
    // assert
    expect(getStore().store["mistyped"][owner]).toEqual({ foo: 2 });
  });

  it("Should set store - instances", () => {
    // given
    const owner = "Entity";
    const { initStore, registerEntity, setStore } = getStore();

    initStore();
    registerEntity(owner);
    const setInstancesCount = setStore<number>("instances", owner, "foo");

    // act
    setInstancesCount(() => 1, 0);
    // assert
    expect(getStore().store["instances"][owner]).toEqual({ foo: 1 });
    // act
    setInstancesCount((prev) => prev + 1);
    // assert
    expect(getStore().store["instances"][owner]).toEqual({ foo: 2 });
  });
});
