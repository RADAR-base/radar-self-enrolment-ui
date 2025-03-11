export const GITHUB_CONFIG = {
  ORGANIZATION_NAME: "RADAR-base",
  REPOSITORY_NAME:
    process.env.GITHUB_REPO_NAME || "radar-self-enrolment-definitions",
  DEFINITIONS_BRANCH: process.env.GITHUB_REPO_BRANCH_NAME || "main",
  MAX_CONTENT_LENGTH: parseInt(
    process.env.GITHUB_RESPONSE_CONTENT_LENGTH || "1000000",
    10,
  ),
  CACHE_DURATION: parseInt(
    process.env.GITHUB_RESPONSE_CACHE_DURATION || "180000",
    10,
  ),
  CACHE_SIZE: parseInt(process.env.GITHUB_RESPONSE_CACHE_SIZE || "50", 10),
  API_URL: "https://api.github.com",
  ACCEPT_HEADER: "application/vnd.github.v3+json",
}

export const GITHUB_AUTH_CONFIG = {
  GITHUB_AUTH_TOKEN: process.env.GITHUB_AUTH_TOKEN || "",
}

export const REMOTE_DEFINITIONS_CONFIG = {
  LANDING_PAGE_DEFINITION_FILE_NAME_CONTENT: "landingpage",
  PROTOCOL_DEFINITION_FILE_NAME_CONTENT: "protocol",
}

export const MP_CONFIG = {
  BASE_URL:
    process.env.MP_CONFIG_BASE_URL || "http://127.0.1.1:8080/managementportal",
  PROJECTS_ENDPOINT: process.env.MP_PROJECTS_ENDPOINT || "api/public/projects",
}
