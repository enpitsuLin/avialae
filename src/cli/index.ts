import { serve } from "../server/index.ts";
import Denomander from "https://deno.land/x/denomander/mod.ts";

export default function createCLI(args: string[]) {
  const cli = new Denomander({
    app_name: "Avialae",
    app_description: "simple dev server",
    app_version: "0.0.2"
  });

  // dev
  cli
    .command("dev", "start dev server")
    .alias("serve")
    .option("--host [host]", `[string] specify hostname`)
    .option("--port <port>", `[number] specify prot`)
    .action(async ({ root, port = 4000 }: { root: string; port: number }) => {
      await serve({ root, port });
    });

  cli.parse(args);
  return cli;
}
