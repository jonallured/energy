export function getContentContainerStyle(items: Array<any> = []) {
  const contentContainerStyle = {
    paddingHorizontal: items.length ? 0 : 20,
  }

  return contentContainerStyle
}
