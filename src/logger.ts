import { T } from "./types";
import { Store } from "./store";
import { capitalize } from "./utils";

export class Log {
  message: string;
  expected: string;
  received: string;

  constructor(message: string, options: { expected?: T; received: unknown }) {
    this.message = message;
    this.expected = options.expected?.value ?? "";
    this.received = (() => {
      if (typeof options.received === "object") {
        if (options.received === null) return "null";
        if (Object.hasOwn(options.received, "overwrite")) {
          return (options.received as any).overwrite;
        }
        if (Array.isArray(options.received)) return "Array";
        return "Record";
      }
      return capitalize(typeof options.received);
    })();
  }

  private static timer: any;

  static mismatch(options: {
    expected: T;
    received: unknown;
    entityName: string;
    property: string;
  }) {
    clearTimeout(Log.timer);

    const warn = new Log("Type Mismatch!", {
      expected: options.expected,
      received: options.received,
    });
    const { entityName, property } = options;
    const { message, expected, received } = warn;

    const store = Store.getInstance();
    store.set(entityName, property, received);

    if (store.get(entityName, property, received) > 1) return;

    setTimeout(() => {
      const count = store.get(entityName, property, received);

      if (typeof window === "undefined") {
        console.log(
          `${count} x ${message} :: Entity "\x1b[93m${entityName}\x1b[0m" :: Property "\x1b[93m${property}\x1b[0m" :: Expected \x1b[92m${expected}\x1b[0m :: Received \x1b[91m${received}\x1b[0m`
        );
      } else {
        console.log(
          `${count} x ${message} :: Entity "%c${entityName}%c" :: Property "%c${property}%c" :: Expected %c${expected}%c :: Received %c${received}`,
          `color: yellow;`,
          `color: initial;`,
          `color: yellow;`,
          `color: initial;`,
          `color: green;`,
          `color: initial;`,
          `color: red;`
        );
      }
    }, 500);
  }

  static unknown(options: {
    entityName: string;
    property: string;
    received: unknown;
  }) {
    const warn = new Log("Unknown Property!", {
      received: options.received,
    });
    const { entityName, property } = options;
    const { message, received } = warn;

    const store = Store.getInstance();
    store.set(entityName, property, received);

    if (store.get(entityName, property, received) > 1) return;

    setTimeout(() => {
      const count = store.get(entityName, property, received);

      if (typeof window === "undefined") {
        console.log(
          `${count} x ${message} :: Entity "\x1b[93m${entityName}\x1b[0m" :: Property \x1b[91m${property}: ${received}\x1b[0m`
        );
      } else {
        console.log(
          `${count} x ${message} :: Entity "%c${entityName}%c" :: Property %c${property}`,
          `color: yellow;`,
          `color: initial;`,
          `color: yellow;`,
          `color: initial;`,
          `color: green;`,
          `color: initial;`,
          `color: red;`
        );
      }
    }, 500);
  }
}
