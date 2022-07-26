// Source: https://stackoverflow.com/a/18650828
export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) {
    return "0bytes"
  }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["bytes", "kb", "mb", "gb"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const label = parseFloat((bytes / Math.pow(k, i)).toFixed(dm))
  const sizeLabel = sizes[i]

  return `${label}${sizeLabel}`
}
