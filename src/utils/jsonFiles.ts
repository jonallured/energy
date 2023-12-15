import appJsonFile from "../../app.json"

type AppConfig = {
  name: string
  version: string
  isAndroidBeta: boolean
  codePushReleaseName: string
  codePushDist: string
}

export const appJson = () => appJsonFile as AppConfig
