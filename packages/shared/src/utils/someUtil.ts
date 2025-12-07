export function print() {
  console.log("Some Util");
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function assertUnreachable(x: never): never {
  throw new Error("Unreachable: " + x);
}
