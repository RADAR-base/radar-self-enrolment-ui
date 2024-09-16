export function isAbsolutePath(path: string): boolean {
  return path.startsWith("/") || /^\w+:/.test(path);
}