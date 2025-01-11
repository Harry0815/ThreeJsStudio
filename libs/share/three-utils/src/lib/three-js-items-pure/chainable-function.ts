import { mouseSupport } from '@three-js-studio/three-utils';

type InternalData = Record<string, unknown>;

interface Chainable {
  chain: (chainable: Chainable, func: (currentData: InternalData) => InternalData) => Chainable;
  getResult: () => InternalData;
}

const createChainable = (initializedData: InternalData): Chainable => {
  let data: InternalData = { ...initializedData }; // Internes Objekt

  const chain = (chainable: Chainable, func: (currentData: InternalData) => InternalData): Chainable => {
    data = { ...data, ...func(data) }; // Nutzt bestehende Daten und erweitert sie
    return chainable;
  };

  const getResult = (): InternalData => {
    return data;
  };

  return {
    chain,
    getResult,
  };
};

const result = createChainable({ foo: 1 });

result
  .chain(result, (data) => ({ bar: data.foo + 1, ...mouseSupport(undefined) })) // Dynamischer Chain
  .chain(result, (data) => ({ baz: data.bar + 1 })) // Weiterer dynamischer Chain
  .chain(result, (data) => ({ qux: data.baz * 2 })); // Noch ein Chain

console.log(result.getResult());
