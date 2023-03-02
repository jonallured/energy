export function getContentContainerStyle(items: Array<any>) {
  const contentContainerStyle = {
    marginTop: 20,
    paddingHorizontal: items.length ? 0 : 20,
  }

  return contentContainerStyle
}
