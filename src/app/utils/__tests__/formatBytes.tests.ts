import { formatBytes } from "app/utils/formatBytes"

describe("formatBytes", () => {
  it("should return bytes", () => {
    expect(formatBytes(500)).toBe("500bytes")
    expect(formatBytes(1000)).toBe("1000bytes")
  })

  it("should return kb", () => {
    expect(formatBytes(1024)).toBe("1kb")
    expect(formatBytes(1234)).toBe("1.21kb")
  })

  it("should return mb", () => {
    // 1048576 bytes
    expect(formatBytes(1 * Math.pow(1024, 2))).toBe("1mb")

    // 1572864 bytes
    expect(formatBytes(1.5 * Math.pow(1024, 2))).toBe("1.5mb")

    // 1835008 bytes
    expect(formatBytes(1.75 * Math.pow(1024, 2))).toBe("1.75mb")

    // 2097152 bytes
    expect(formatBytes(2 * Math.pow(1024, 2))).toBe("2mb")
  })

  it("should return gb", () => {
    // 1073741824 bytes
    expect(formatBytes(1 * Math.pow(1024, 3))).toBe("1gb")

    // 1610612736 bytes
    expect(formatBytes(1.5 * Math.pow(1024, 3))).toBe("1.5gb")

    // 1879048192 bytes
    expect(formatBytes(1.75 * Math.pow(1024, 3))).toBe("1.75gb")

    // 2147483648 bytes
    expect(formatBytes(2 * Math.pow(1024, 3))).toBe("2gb")
  })

  it("should return the specified decimals", () => {
    const kb = 1.12345 * 1024
    expect(formatBytes(kb, 5)).toBe("1.12345kb")

    const mb = 1.12345 * Math.pow(1024, 2)
    expect(formatBytes(mb, 3)).toBe("1.123mb")

    const gb = 1.54321 * Math.pow(1024, 3)
    expect(formatBytes(gb, 4)).toBe("1.5432gb")
  })
})
