import createCLI from "./src/cli/index.ts";

if (import.meta.main) {
  createCLI(Deno.args);
}
