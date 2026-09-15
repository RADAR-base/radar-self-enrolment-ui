import { withBasePath } from "./links";

const DEFAULT_GITHUB_RAW_BASE =
  "https://raw.githubusercontent.com/RADAR-base/radar-self-enrolment-definitions/refs/heads/main";

function getGithubRawBase(): string {
  return process.env.NEXT_PUBLIC_GITHUB_RAW_BASE_URL ?? DEFAULT_GITHUB_RAW_BASE;
}

function usesGithubDefinitions(): boolean {
  return (process.env.NEXT_PUBLIC_STUDY_DEFINITION_REPOSITORY ?? "GITHUB") !== "LOCAL";
}

/** Proxy an external URL through the /api/github route so it becomes same-origin. */
function proxyUrl(externalUrl: string): string {
  const proxyPath = withBasePath(`/api/github?url=${encodeURIComponent(externalUrl)}`);
  if (typeof window === "undefined") {
    return proxyPath;
  }
  return `${window.location.origin}${proxyPath.startsWith("/") ? proxyPath : `/${proxyPath}`}`;
}

/** Resolve a study resource path or absolute URL, proxying external GitHub URLs through /api/github. */
export function resolveResourceUrl(fileUrl: string): string {
  if (/^https?:\/\//i.test(fileUrl)) {
    return proxyUrl(fileUrl);
  }

  const studyResourceMatch = fileUrl.match(/^\/study\/(?:study\/)?([^/]+)\/(.+)$/);
  if (usesGithubDefinitions() && studyResourceMatch) {
    const [, studyId, resourcePath] = studyResourceMatch;
    const githubUrl = `${getGithubRawBase()}/projects/${studyId}/${resourcePath}`;
    return proxyUrl(githubUrl);
  }

  const path = withBasePath(fileUrl);
  if (typeof window === "undefined") {
    return path;
  }
  return `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`;
}
