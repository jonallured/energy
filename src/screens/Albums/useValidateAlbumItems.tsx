import { debounce, difference } from "lodash"
import { useEffect } from "react"
import { Alert } from "react-native"
import { OperationType } from "relay-runtime"
import {
  useSystemFetchQuery,
  UseSystemFetchQueryProps,
} from "system/relay/useSystemFetchQuery"
import { GlobalStore } from "system/store/GlobalStore"

interface UserValidateAlbumProps<TQuery extends OperationType>
  extends UseSystemFetchQueryProps<TQuery> {
  idsToValidate: string[]
  mapResponseToIDs: (data: TQuery["response"]) => string[]
}

export function useValidateAlbumItems<TQuery extends OperationType>({
  query,
  variables,
  idsToValidate,
  mapResponseToIDs,
}: UserValidateAlbumProps<TQuery>) {
  const { data } = useSystemFetchQuery<TQuery>({
    query,
    variables,
    cacheConfig: {
      fetchPolicy: "network-only",
      networkCacheConfig: {
        force: true,
      },
    },
  })

  useEffect(() => {
    if (data) {
      const fetchedIDs = mapResponseToIDs(data)
      const idsToRemove = difference(idsToValidate, fetchedIDs) as string[]

      idsToRemove.forEach((id) => {
        GlobalStore.actions.albums.removeItemFromAlbums(id)
      })

      if (idsToRemove.length > 0) {
        showAlertMessage()
      }
    }
  }, [data])
}

const showAlertMessage = debounce(() => {
  Alert.alert(
    "Items from this collection have been deleted in CMS.",
    "Your album has been updated."
  )
}, 1000)
