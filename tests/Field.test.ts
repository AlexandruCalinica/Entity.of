import { Of } from "../src/decorators";

expect.extend({
  toContainObject(received, argument) {
    const pass = this.equals(
      received,
      expect.arrayContaining([expect.objectContaining(argument)])
    );

    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} not to contain object ${this.utils.printExpected(argument)}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} to contain object ${this.utils.printExpected(argument)}`,
        pass: false,
      };
    }
  },
});

describe("Of", () => {
  // given
  class User {}
  const stringFn = () => String;
  const numberFn = () => Number;
  const booleanFn = () => Boolean;
  const stringArrFn = () => [String];
  const numberArrFn = () => [Number];
  const booleanArrFn = () => [Boolean];
  const producerFn = () => User;
  const producerArrFn = () => [User];
  const producerRecordFn = () => ({ User });
  const producerRecordArrFn = () => [{ User }];

  const stringDecorator = Of(stringFn);
  const numberDecorator = Of(numberFn);
  const booleanDecorator = Of(booleanFn);
  const stringArrDecorator = Of(stringArrFn);
  const numberArrDecorator = Of(numberArrFn);
  const booleanArrDecorator = Of(booleanArrFn);
  const producerDecorator = Of(producerFn);
  const producerArrDecorator = Of(producerArrFn);
  const producerRecordDecorator = Of(producerRecordFn);
  const producerRecordArrDecorator = Of(producerRecordArrFn);

  it("Should add one/more class properties to a constructor static fields array", () => {
    // given
    class Entity {}
    // act
    stringDecorator(Entity, "name");
    numberDecorator(Entity, "age");
    booleanDecorator(Entity, "isSingle");
    stringArrDecorator(Entity, "books");
    numberArrDecorator(Entity, "numbers");
    booleanArrDecorator(Entity, "friends");
    producerDecorator(Entity, "user");
    producerArrDecorator(Entity, "users");
    producerRecordDecorator(Entity, "userRecord");
    producerRecordArrDecorator(Entity, "userRecordArr");
    // assert
    expect(Entity.constructor).toHaveProperty("fields");
    expect((Entity.constructor as any)["fields"]).toHaveLength(10);
    expect((Entity.constructor as any)["fields"]).toContainObject({
      key: "name",
      type: stringFn,
    });
    expect((Entity.constructor as any)["fields"]).toContainObject({
      key: "age",
      type: numberFn,
    });
    expect((Entity.constructor as any)["fields"]).toContainObject({
      key: "isSingle",
      type: booleanFn,
    });
    expect((Entity.constructor as any)["fields"]).toContainObject({
      key: "books",
      type: stringArrFn,
    });
    expect((Entity.constructor as any)["fields"]).toContainObject({
      key: "numbers",
      type: numberArrFn,
    });
    expect((Entity.constructor as any)["fields"]).toContainObject({
      key: "friends",
      type: booleanArrFn,
    });
    expect((Entity.constructor as any)["fields"]).toContainObject({
      key: "user",
      type: producerFn,
    });
    expect((Entity.constructor as any)["fields"]).toContainObject({
      key: "users",
      type: producerArrFn,
    });
    expect((Entity.constructor as any)["fields"]).toContainObject({
      key: "userRecord",
      type: producerRecordFn,
    });
    expect((Entity.constructor as any)["fields"]).toContainObject({
      key: "userRecordArr",
      type: producerRecordArrFn,
    });
  });

  it("Should throw if type fn is returning Object", () => {});
  it("Should throw if type fn is returning Array", () => {});
  it("Should throw if type fn is returning [Object]", () => {});
  it("Should throw if type fn is returning [Array]", () => {});
  it("Should throw if a duplicate Field.key is encountered", () => {});
  it("Should register multi-primitive array types", () => {});
  it("Should register multi-producer array types", () => {});
});
