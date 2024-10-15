import { Configuration, FrontendApi } from "@ory/client"
import { edgeConfig } from "@ory/integrations/next"
import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()
const { basePath } = publicRuntimeConfig

const localConfig = {
  basePath: `${basePath}/api/.ory`,
  baseOptions: {
    withCredentials: true,
  },
}

export default new FrontendApi(new Configuration(localConfig))
