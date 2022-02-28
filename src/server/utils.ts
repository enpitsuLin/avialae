import { path } from "../deps.ts";

export const isWindows = Deno.build.os === "windows";

export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? id : id);
}
