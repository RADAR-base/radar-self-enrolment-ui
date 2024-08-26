export const GITHUB_CONFIG = {
  ORGANIZATION_NAME: "RADAR-base",
  REPOSITORY_NAME:
    process.env.GITHUB_REPO_NAME || "radar-self-enrolment-definitions",
  DEFINITIONS_BRANCH: process.env.GITHUB_REPO_BRANCH_NAME || "test",
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
  CONSENT_VERSION: "v1",
  ELIGIBILITY_VERSION: "v1",
  STUDY_INFO_VERSION: "v1",

  CONSENT_DEFINITION_FILE_NAME_CONTENT: "consent",
  ELIGIBILITY_DEFINITION_FILE_NAME_CONTENT: "eligibility",
  STUDY_INFO_DEFINITION_FILE_NAME_CONTENT: "study_info",
}

export const MP_CONFIG = {
  BASE_URL:
    process.env.MP_CONFIG_BASE_URL || "http://127.0.1.1:8080/managementportal",
  PROJECTS_ENDPOINT: process.env.MP_PROJECTS_ENDPOINT || "api/public/projects",
}
