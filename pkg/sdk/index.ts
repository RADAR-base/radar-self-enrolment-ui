import { Configuration, FrontendApi } from "@ory/client"
import { edgeConfig } from "@ory/integrations/next"

const localConfig = {
  basePath: process.env.KRATOS_PUBLIC_URL,
  baseOptions: {
    withCredentials: true,
  },
}

export default new FrontendApi(
  new Configuration(process.env.KRATOS_PUBLIC_URL ? localConfig : edgeConfig),
)
