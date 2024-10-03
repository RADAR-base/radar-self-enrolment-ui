import { Configuration, FrontendApi } from "@ory/client"
import { edgeConfig } from "@ory/integrations/next"

const localConfig = {
  basePath: `${process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL}/api/.ory`,
  baseOptions: {
    withCredentials: true,
  },
}

export default new FrontendApi(
  new Configuration(
    localConfig,
  ),
)
