import { Application, Router } from "https://deno.land/x/oak@v10.4.0/mod.ts";
import { path, mod } from "../deps.ts";
import { InlineConfig, resolveConfig } from "./config.ts";
import { decoder } from "../utils.ts";
import { initHMR } from "./hmr.ts";
import serverMiddleware from "./middleware.ts";

const { readFileSync } = Deno;

export interface AppContext {
  app: Application;
  root: string;
}

export async function createServer(inlineConfig: InlineConfig = {}) {
  const config = await resolveConfig(inlineConfig);
  const root = config.root;
  const app = new Application();

  const context: AppContext = { app, root };

  app.use((ctx, next) => {
    Object.assign(ctx, context);
    return next();
  });

  const router = new Router();

  router.get("/", (ctx, next) => {
    try {
      const entry = readFileSync(path.join(root, "index.html"));

      ctx.response.body = decoder(entry).replace(
        "</body>",
        '  <script type="module">import "/@client/ws.ts"</script>\n</body>'
      );
    } catch (err) {
      if ((err as Error).name == "NotFound") {
        console.log("entry index.html not found");
      }
    }
    next();
  });

  router.get("/sock", async (ctx, next) => {
    const sock = await ctx.upgrade();
    initHMR(sock);
    next();
  });

  app.use(router.routes());

  const plugins = [serverMiddleware];
  plugins.forEach((plugin) => plugin(context));

  app.addEventListener("listen", ({ port }) => {
    console.log(`${mod.blue("[Avialae]")} dev server running at: http://localhost:${port}`);
  });

  return app;
}
