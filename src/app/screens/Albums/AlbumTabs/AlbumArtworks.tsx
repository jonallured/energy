import { ArtworksList } from "app/components/Lists/ArtworksList"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useAlbum } from "app/screens/Albums/useAlbum"

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
