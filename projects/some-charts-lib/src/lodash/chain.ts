import map from 'lodash-es/map';
import filter from 'lodash-es/filter';
import mapValues from 'lodash-es/mapValues';
import toPairs from 'lodash-es/toPairs';
import orderBy from 'lodash-es/orderBy';
import groupBy from 'lodash-es/groupBy';
import sortBy from 'lodash-es/sortBy';

const chainableFunctions = {
  map,
  filter,
  toPairs,
  orderBy,
  groupBy,
  sortBy,
};

export const chain = <T>(input: T) => {
  let value: any = input;
  const wrapper = {
    ...mapValues(
      chainableFunctions,
      (f: any) => (...args: any[]) => {
        // lodash always puts input as the first argument
        value = f(value, ...args);
        return wrapper;
      },
    ),
    value: () => value,
  };
  return wrapper;
};
