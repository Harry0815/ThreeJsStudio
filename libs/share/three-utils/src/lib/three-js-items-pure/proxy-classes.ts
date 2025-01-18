/**
 * The `InterfaceMethods` type utility filters the members of a given interface or object type `T`.
 * It maps over the keys of `T` and ensures that the resulting type only includes members that are functions.
 * Non-function members are replaced with the `unknown` type.
 *
 * Type Parameters:
 * - `T` - The base object or interface type whose members are being processed.
 *
 * For each key `K` in `T`:
 * - If `T[K]` is a function (i.e., its type extends `(...args: unknown[]) => unknown`), then it remains unchanged.
 * - Otherwise, `T[K]` is replaced by the `unknown` type.
 *
 * This type utility is particularly useful for creating a derivative type that strictly focuses on callable members of an input type.
 */
type InterfaceMethods<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? T[K] : unknown;
};

/**
 * A generic class to enforce implementation of an interface through a Proxy.
 * The `ProxyInterfaceImplementer` ensures that only methods defined in the interface
 * can have implementations assigned to them. Any unimplemented methods, when called,
 * will throw an error.
 *
 * @template T The interface definition that this proxy is enforcing.
 */
class ProxyInterfaceImplementer<T> {
  private readonly dataStore: Record<string, unknown>;
  private methods: InterfaceMethods<T> = {} as InterfaceMethods<T>;

  /**
   * Constructs an instance of the class, initializing methods defined in the interface and
   * returning a proxy to ensure interface method compliance.
   *
   * @param interfaceDefinition - An object defining the methods for the interface. The keys
   * represent method names, while the values should correspond to the expected method implementations
   * of type T.
   * @return Returns a proxied instance where only methods defined in the interface can be accessed
   * or modified, ensuring interface adherence.
   */
  constructor(interfaceDefinition?: { [K in keyof InterfaceMethods<T>]: T[K] }) {
    this.dataStore = {}; // Daten, die intern verwaltet werden

    for (const key in interfaceDefinition) {
      if (typeof interfaceDefinition[key] === 'function') {
        this.methods[key as keyof InterfaceMethods<T>] = interfaceDefinition[key] as InterfaceMethods<T>[keyof T];
      } else {
        this.dataStore[key as string] = interfaceDefinition[key] as unknown;
      }
    }

    return new Proxy(this, {
      get: (target, prop): unknown => {
        if (prop in target.methods) {
          return target.methods[prop as keyof InterfaceMethods<T>];
        }
        if (prop in target.dataStore) {
          return target.dataStore[prop as string];
        }
        throw new Error(`Method ${String(prop)} is not part of the interface.`);
      },
      set: (target, prop, value): boolean => {
        if (typeof value === 'function') {
          if (prop in target.methods) {
            if (typeof value !== 'function') {
              throw new Error(`Only functions can be assigned to method ${String(prop)}.`);
            }
            target.methods[prop as keyof InterfaceMethods<T>] = value as InterfaceMethods<T>[keyof T];
            return true;
          }
          throw new Error(`Cannot add new method ${String(prop)}. Only methods from the interface are allowed.`);
        }
        target.dataStore[prop as string] = value;
        return true;
      },
    });
  }
}

/**
 * Represents an example interface with basic methods and properties.
 *
 * @interface ExampleInterface
 */
interface ExampleInterface {
  ready: boolean;

  sayHello(name: string): string;

  add(a: number, b: number): number;
}

const dynamicObject = new ProxyInterfaceImplementer<ExampleInterface>({
  ready: false,
  sayHello: (_name: string): string => `Default implementation for sayHello`,
  add: (_a: number, _b: number): number => 0,
} as ExampleInterface) as unknown as ExampleInterface;

try {
  console.log(dynamicObject.sayHello('Alice'));
} catch (err) {
  if (err instanceof Error) {
    console.error(err.message); // "Method sayHello is not implemented yet."
  } else {
    console.error('An unknown error occurred.');
  }
}

console.log(dynamicObject.ready);

// Überschreibe die Methoden mit echten Implementierungen
dynamicObject.sayHello = function (name: string): string {
  return `Hello, ${name}! ${this.ready ? 'Ready' : 'Not ready'}`;
};
dynamicObject.add = (a: number, b: number): number => a + b;
dynamicObject.ready = true;

// Rufe die Methoden auf
console.log(dynamicObject.sayHello('Alice')); // "Hello, Alice!"
console.log(dynamicObject.add(2, 3)); // 5
console.log(dynamicObject.ready);

// try {
//   dynamicObject.multiply(2, 3);
// } catch (err) {
//   if (err instanceof Error) {
//     console.error(err.message); // "Method multiply is not part of the interface."
//   } else {
//     console.error('An unknown error occurred.');
//   }
// }
