import { InstallationsList } from "components/Lists/InstallationsList"
import { TabsScrollView } from "components/Tabs/TabsContent"
import { SelectedItemInstall } from "system/store/Models/SelectModeModel"

interface AlbumInstallsProps {
  images: SelectedItemInstall[]
}

export const AlbumInstalls: React.FC<AlbumInstallsProps> = ({ images }) => {
  return (
    <TabsScrollView>
      <InstallationsList images={images} />
    </TabsScrollView>
  )
}
