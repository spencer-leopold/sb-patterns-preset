import { AnyConfiguration, Properties } from './definition';

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 * @param objects Two or more objects to merge.
 * @returns A single, merged object.
 */
export function mergeDeep(
  ...objects: (AnyConfiguration | Properties)[]
): AnyConfiguration | Properties {
  const isObject = (obj: any) => obj && typeof obj === 'object';

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, {});
}

/**
 * Checks if a value **is** null or undefined.
 * @param value The value to evaluate.
 * @returns Whether the value **is** null or undefined.
 */
export function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
  return typeof value === 'undefined' || value === null;
}
