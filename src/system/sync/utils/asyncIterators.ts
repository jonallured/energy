/**
 * This is usually used to debug async code, but can be used in regular code to
 * run async code in a linear fashion.
 */
export const forEachAsyncLinear = async <T>(
  items: T[],
  callback: (item: T, index: number) => Promise<any>
) => {
  for (const [index, item] of items.entries()) {
    await callback(item, index)
  }
}
