export function prettyPrint(object: unknown): void {
  console.dir(object, { depth: Infinity, colors: true });
}
