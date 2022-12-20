export const mapAsync = async <T>(
  items: T[],
  callback: (item: T, index: number) => Promise<any>
) => {
  return await Promise.all(
    items.map((item, index) => {
      return callback(item, index)
    })
  )
}

export const forEachAsync = async <T>(
  items: T[],
  callback: (item: T, index: number) => Promise<any>
) => {
  await Promise.all(
    items.map((item, index) => {
      callback(item, index)
    })
  )
}

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
