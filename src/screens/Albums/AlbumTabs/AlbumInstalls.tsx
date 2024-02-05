import { Tabs } from "@artsy/palette-mobile"
import { InstallationsList } from "components/Lists/InstallationsList"
import { useAlbum } from "screens/Albums/useAlbum"
import { useTrackScreen } from "system/hooks/useTrackScreen"

interface AlbumInstallsProps {
  albumId: string
}

export const AlbumInstalls: React.FC<AlbumInstallsProps> = ({ albumId }) => {
  useTrackScreen({ name: "AlbumInstalls", type: "Album" })

  const { installs } = useAlbum({ albumId })

  return (
    <Tabs.ScrollView>
      <InstallationsList images={installs} />
    </Tabs.ScrollView>
  )
}
