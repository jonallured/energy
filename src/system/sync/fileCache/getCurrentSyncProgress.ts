import { JSON_FILES } from "system/sync/fileCache/constants"
import { getFileFromCache } from "system/sync/fileCache/getFileFromCache"

export interface RelaySyncProgress {
  currentStep: number
}

export const getCurrentSyncProgress = async () => {
  const initialState: RelaySyncProgress = {
    currentStep: -1,
  }

  try {
    const syncProgress = await getFileFromCache({
      filename: JSON_FILES.syncProgress,
      type: "json",
    })

    // No sync present
    if (!syncProgress) {
      return initialState
    }

    // Found existing sync
    const currentSyncProgress: RelaySyncProgress = JSON.parse(syncProgress)
    return currentSyncProgress

    // If there's an error, be sure to return safe initial state
  } catch (_error) {
    return initialState
  }
}
