import { withBasePath } from "./links";

const DEFAULT_GITHUB_RAW_BASE =
  "https://raw.githubusercontent.com/RADAR-base/radar-self-enrolment-definitions/refs/heads/main";

function getGithubRawBase(): string {
  return process.env.NEXT_PUBLIC_GITHUB_RAW_BASE_URL ?? DEFAULT_GITHUB_RAW_BASE;
}

function usesGithubDefinitions(): boolean {
  return (process.env.NEXT_PUBLIC_STUDY_DEFINITION_REPOSITORY ?? "GITHUB") !== "LOCAL";
}

/** Resolve a study resource path or absolute URL for PDF/asset loading. */
export function resolvePdfFileUrl(fileUrl: string): string {
  if (/^https?:\/\//i.test(fileUrl)) {
    return fileUrl;
  }

  const studyResourceMatch = fileUrl.match(/^\/study\/(?:study\/)?([^/]+)\/(.+)$/);
  if (usesGithubDefinitions() && studyResourceMatch) {
    const [, studyId, resourcePath] = studyResourceMatch;
    return `${getGithubRawBase()}/projects/${studyId}/${resourcePath}`;
  }

  const path = withBasePath(fileUrl);
  if (typeof window === "undefined") {
    return path;
  }
  return `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`;
}
