import PromisePool, { OnProgressCallback, Stoppable } from "@supercharge/promise-pool"

const MAX_RETRY_ATTEMPTS = 2

interface RetryOperationProps<T> {
  errors: T[]
  execute: (operation: any, index: number, pool: Stoppable) => Promise<any>
  onStart: () => void
  shouldRetry: () => boolean
  updateStatus: () => void
  reportProgress: () => OnProgressCallback<any>
}

export const retryOperation = async <T>({
  errors,
  execute,
  onStart,
  reportProgress,
  shouldRetry,
  updateStatus,
}: RetryOperationProps<T>) => {
  if (errors.length === 0) {
    return
  }

  updateStatus()

  let retryAttempt = 0

  const retry = async () => {
    onStart()

    await PromisePool.for(errors)
      .onTaskStarted(reportProgress() as any)
      .process(async (operation, index, pool) => {
        return await execute(operation, index, pool)
      })

    // After the requests above execute, check if there are any new errors
    // that have been populated and if so, retry again
    if (shouldRetry()) {
      if (retryAttempt < MAX_RETRY_ATTEMPTS) {
        retryAttempt += 1
        await retry()
      } else {
        console.log(["[retryOperation] Max retry attempts reached."])
      }
    }
  }

  await retry()
}
