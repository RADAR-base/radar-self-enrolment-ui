export function isAbsolutePath(path: string): boolean {
  return path.startsWith("/") || /^\w+:/.test(path);
}

export function withBasePath(path: string): string {
  if (path.at(0) == '/') {
    return (process.env.NEXT_PUBLIC_BASEPATH ?? '') + path
  }
  return path
}