/**
 * Helpers
 */

export const mapAsync = async <T>(items: T[], callback: (item: T) => Promise<any>) => {
  return await Promise.all(
    items.map((item) => {
      return callback(item)
    })
  )
}
