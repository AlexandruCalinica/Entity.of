import { trackEntity, getStore } from "../src/core";

describe("trackEntity", () => {
  beforeAll(() => {
    getStore().init();
  });
  beforeEach(() => {
    getStore().reset();
    getStore().register("Entity");
  });
  afterAll(() => {
    getStore().destroy();
  });

  it("should track targetTypes", () => {
    trackEntity("Entity", [
      { key: "id", type: () => String, value: "1" },
      { key: "name", type: () => String, value: "John" },
    ]);

    expect(getStore().store["entities"]).not.toBeUndefined();
    expect(getStore().store["entities"]).toHaveProperty("Entity");
    expect(getStore().store["entities"]["Entity"]).toEqual({
      id: "Primitive<String>",
      name: "Primitive<String>",
    });
  });
});
