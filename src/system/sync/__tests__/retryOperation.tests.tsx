import { retryOperation } from "system/sync/retryOperation"

describe("retryOperation", () => {
  const error = { message: "error" }
  const errors = [error]
  const execute = jest.fn(() => Promise.resolve())
  const onStart = jest.fn()
  const onProgress = jest.fn()
  const shouldRetry = jest.fn(() => true)
  const updateStatus = jest.fn()

  beforeEach(() => {
    execute.mockClear()
    onStart.mockClear()
    onProgress.mockClear()
    shouldRetry.mockClear()
    updateStatus.mockClear()
  })

  it("should execute the given function for each error", async () => {
    await retryOperation({
      errors,
      execute,
      onStart,
      reportProgress: () => onProgress,
      shouldRetry,
      updateStatus,
    })

    expect(execute).toHaveBeenCalledTimes(3)
    expect(execute).toHaveBeenCalledWith(error)
  })

  it("should not execute the given function if there are no errors", async () => {
    await retryOperation({
      errors: [],
      execute,
      onStart,
      reportProgress: () => onProgress,
      shouldRetry,
      updateStatus,
    })

    expect(execute).not.toHaveBeenCalled()
  })

  it("should retry if shouldRetry returns true", async () => {
    shouldRetry.mockReturnValue(true)

    await retryOperation({
      errors,
      execute,
      onStart,
      reportProgress: () => onProgress,
      shouldRetry,
      updateStatus,
    })

    expect(execute).toHaveBeenCalledTimes(3)
    expect(execute).toHaveBeenCalledWith(error)
    expect(shouldRetry).toHaveBeenCalledTimes(3)
  })

  it("should not retry if shouldRetry returns false", async () => {
    shouldRetry.mockReturnValue(false)

    await retryOperation({
      errors,
      execute,
      onStart,
      reportProgress: () => onProgress,
      shouldRetry,
      updateStatus,
    })

    expect(execute).toHaveBeenCalledTimes(1)
    expect(execute).toHaveBeenCalledWith(error)
    expect(shouldRetry).toHaveBeenCalledTimes(1)
  })

  it("should call onStart and updateStatus at the right times", async () => {
    await retryOperation({
      errors,
      execute,
      onStart,
      reportProgress: () => onProgress,
      shouldRetry,
      updateStatus,
    })

    expect(onStart).toHaveBeenCalledTimes(1)
    expect(updateStatus).toHaveBeenCalledTimes(1)
  })

  it("should call reportProgress with the right parameters", async () => {
    await retryOperation({
      errors,
      execute,
      onStart,
      reportProgress: () => onProgress,
      shouldRetry,
      updateStatus,
    })

    expect(onProgress).toHaveBeenCalledTimes(1)
  })

  it("should not retry if max retry attempts have been reached", async () => {
    shouldRetry.mockReturnValue(true)

    await retryOperation({
      errors,
      execute,
      onStart,
      reportProgress: () => onProgress,
      shouldRetry,
      updateStatus,
    })

    expect(shouldRetry).toHaveBeenCalledTimes(3)
  })
})
