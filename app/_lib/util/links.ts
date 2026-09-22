export function isAbsolutePath(path: string): boolean {
  return path.startsWith("/") || /^\w+:/.test(path);
}

export function getBasePath(): string {
  if (typeof window !== 'undefined') {
    return (window as any).__BASE_PATH__ ?? ''
  }
  return process.env.NEXT_PUBLIC_BASEPATH ?? ''
}

export function withBasePath(path: string): string {
  if (path.at(0) == '/') {
    return getBasePath() + path
  }
  return path
}
