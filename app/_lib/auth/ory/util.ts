export const getCsrfToken = (flow: any) => {
  return flow.ui?.nodes?.find((e: any) => e.attributes?.name == "csrf_token").attributes?.value
}