import { Configuration, OAuth2Api, FrontendApi } from "@ory/client"

const hydra = new OAuth2Api(
  new Configuration({
    basePath: process.env.HYDRA_ADMIN_URL, // ?? 'http://localhost:4445',
  })
)

const kratos = new FrontendApi(
  new Configuration({
    basePath: process.env.KRATOS_PUBLIC_URL, // ?? 'http://localhost:4433',
}))

export { kratos, hydra }