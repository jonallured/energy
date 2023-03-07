import { InstallationsList } from "app/components/Lists/InstallationsList"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { SelectedItemInstall } from "app/system/store/Models/SelectModeModel"

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
