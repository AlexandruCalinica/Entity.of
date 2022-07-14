import { produceEntries, FieldProps } from "../src/core";

describe("produceEntries", () => {
  // given
  class Address {
    static of(data: Partial<Address>) {
      return Object.assign(new Address(), data);
    }
  }
  class Hobby {
    static of(data: Partial<Hobby>) {
      return Object.assign(new Hobby(), data);
    }
  }

  const fieldsWithProducer: FieldProps[] = [
    { key: "address", type: () => Address },
    { key: "hobbies", type: () => [Hobby] },
  ];

  const data: Record<string, any> = {
    id: 1,
    name: "John",
    surname: "Doe",
    address: {
      street: "Industrial Drive",
      nr: "26",
      zip: 123456,
    },
    children: [1, 2, 3],
    isSingle: false,
    hobbies: [
      { id: 1, name: "football" },
      { id: 2, name: "basketball" },
      { id: 3, name: "boxing" },
    ],
  };

  // act
  const entries = produceEntries(data, fieldsWithProducer);
  const address = entries.address;
  const hobbies = entries.hobbies;

  it("Should produce an object containing only Producer fields", () => {
    // assert
    expect(entries).not.toEqual(data);
    expect(entries).toHaveProperty("address");
    expect(entries).toHaveProperty("hobbies");
  });

  it("Produced properties should be instances of Producer constructors", () => {
    // assert
    expect(address).toBeInstanceOf(Address);
    expect(hobbies[0]).toBeInstanceOf(Hobby);
    expect(hobbies[1]).toBeInstanceOf(Hobby);
    expect(hobbies[2]).toBeInstanceOf(Hobby);
  });

  it("Should not alter property values after execution", () => {
    // assert
    expect(address["street"]).toBe("Industrial Drive");
    expect(address["nr"]).toBe("26");
    expect(address["zip"]).toBe(123456);
    expect(hobbies[0]).toEqual({ id: 1, name: "football" });
    expect(hobbies[1]).toEqual({ id: 2, name: "basketball" });
    expect(hobbies[2]).toEqual({ id: 3, name: "boxing" });
  });
});
