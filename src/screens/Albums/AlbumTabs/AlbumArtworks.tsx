import { ArtworksList } from "components/Lists/ArtworksList"
import { TabsScrollView } from "components/Tabs/TabsContent"
import { useAlbum } from "screens/Albums/useAlbum"

interface AlbumArtworksProps {
  albumId: string
}

export const AlbumArtworks: React.FC<AlbumArtworksProps> = ({ albumId }) => {
  const { artworks } = useAlbum({ albumId })

  return (
    <TabsScrollView>
      <ArtworksList artworks={artworks} isStatic />
    </TabsScrollView>
  )
}
