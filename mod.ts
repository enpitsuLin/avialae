import { commonServer, hmrServer } from "./src/server/index.ts";
const { args } = Deno;

if (import.meta.main) {
  hmrServer();
}
