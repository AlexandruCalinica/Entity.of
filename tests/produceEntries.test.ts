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
    { key: "nestedAddressRecord", type: () => ({ Address }) },
    { key: "nestedArrayOfHobbyRecord", type: () => [{ Hobby }] },
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
    nestedAddressRecord: {
      a: {
        street: "Industrial Drive",
        nr: "26",
        zip: 123456,
      },
      b: {
        street: "Industrial Drive",
        nr: "26",
        zip: 123456,
      },
    },
    nestedArrayOfHobbyRecord: [
      {
        a: { id: 1, name: "football" },
        b: { id: 2, name: "basketball" },
        c: { id: 3, name: "boxing" },
      },
      {
        a: { id: 1, name: "football" },
        b: { id: 2, name: "basketball" },
        c: { id: 3, name: "boxing" },
      },
    ],
  };

  // act
  const entries = produceEntries(data, fieldsWithProducer);
  const address = entries.address;
  const hobbies = entries.hobbies;
  const nestedAddressRecord = entries.nestedAddressRecord;
  const nestedArrayOfHobbyRecord = entries.nestedArrayOfHobbyRecord;

  it("Should produce an object containing only Producer fields", () => {
    // assert
    expect(entries).not.toEqual(data);
    expect(entries).toHaveProperty("address");
    expect(entries).toHaveProperty("hobbies");
    expect(entries).toHaveProperty("nestedAddressRecord");
    expect(entries).toHaveProperty("nestedArrayOfHobbyRecord");
  });

  it("Produced properties should be instances of Producer constructors", () => {
    // assert
    expect(address).toBeInstanceOf(Address);
    expect(hobbies[0]).toBeInstanceOf(Hobby);
    expect(hobbies[1]).toBeInstanceOf(Hobby);
    expect(hobbies[2]).toBeInstanceOf(Hobby);
    expect(nestedAddressRecord.a).toBeInstanceOf(Address);
    expect(nestedAddressRecord.b).toBeInstanceOf(Address);
    expect(nestedArrayOfHobbyRecord[0].a).toBeInstanceOf(Hobby);
    expect(nestedArrayOfHobbyRecord[0].b).toBeInstanceOf(Hobby);
    expect(nestedArrayOfHobbyRecord[0].c).toBeInstanceOf(Hobby);
    expect(nestedArrayOfHobbyRecord[1].a).toBeInstanceOf(Hobby);
    expect(nestedArrayOfHobbyRecord[1].b).toBeInstanceOf(Hobby);
    expect(nestedArrayOfHobbyRecord[1].c).toBeInstanceOf(Hobby);
  });

  it("Should not alter property values after execution", () => {
    // assert
    expect(address["street"]).toBe("Industrial Drive");
    expect(address["nr"]).toBe("26");
    expect(address["zip"]).toBe(123456);
    expect(hobbies[0]).toEqual({ id: 1, name: "football" });
    expect(hobbies[1]).toEqual({ id: 2, name: "basketball" });
    expect(hobbies[2]).toEqual({ id: 3, name: "boxing" });
    expect(nestedAddressRecord.a["street"]).toBe("Industrial Drive");
    expect(nestedAddressRecord.a["nr"]).toBe("26");
    expect(nestedAddressRecord.a["zip"]).toBe(123456);
    expect(nestedAddressRecord.b["street"]).toBe("Industrial Drive");
    expect(nestedAddressRecord.b["nr"]).toBe("26");
    expect(nestedAddressRecord.b["zip"]).toBe(123456);
    expect(nestedArrayOfHobbyRecord[0].a).toEqual({ id: 1, name: "football" });
    expect(nestedArrayOfHobbyRecord[0].b).toEqual({
      id: 2,
      name: "basketball",
    });
    expect(nestedArrayOfHobbyRecord[0].c).toEqual({ id: 3, name: "boxing" });
    expect(nestedArrayOfHobbyRecord[1].a).toEqual({ id: 1, name: "football" });
    expect(nestedArrayOfHobbyRecord[1].b).toEqual({
      id: 2,
      name: "basketball",
    });
    expect(nestedArrayOfHobbyRecord[1].c).toEqual({ id: 3, name: "boxing" });
  });
});
