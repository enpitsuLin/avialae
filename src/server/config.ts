import { path } from "../deps.ts";
import { normalizePath } from "./utils.ts";

export interface InlineConfig {
  root?: string;
}

export interface ResolvedConfig extends InlineConfig {
  root: string;
}

// deno-lint-ignore require-await
export async function resolveConfig(inlineConfig: InlineConfig): Promise<ResolvedConfig> {
  const config = inlineConfig;

  // resolve root
  const resolvedRoot = normalizePath(config.root ? path.resolve(config.root) : Deno.cwd());

  return { root: resolvedRoot };
}
