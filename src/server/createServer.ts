import { Application, Router } from "https://deno.land/x/oak@v10.4.0/mod.ts";
import { path, mod } from "../deps.ts";
import { decoder } from "../utils.ts";
import serverMiddleware from "./middleware.ts";

const { cwd, readFileSync } = Deno;

export interface AppContext {
  app: Application;
  root: string;
}

export function createServer(plugins: (({ app, root }: AppContext) => void)[] = []) {
  const app = new Application();
  const root = cwd();
  const context: AppContext = { app, root };

  app.use((ctx, next) => {
    Object.assign(ctx, context);
    return next();
  });
  const router = new Router();

  router.get("/", (ctx, next) => {
    try {
      const entry = readFileSync(path.join(root, "index.html"));
      ctx.response.body = decoder(entry);
    } catch (err) {
      if ((err as Error).name == "NotFound") {
        console.log("entry index.html not found");
      }
    }
    next();
  });

  app.use(router.routes());

  plugins = [...plugins, serverMiddleware];
  plugins.forEach((plugin) => plugin(context));

  app.addEventListener("listen", ({ port }) => {
    console.log(`${mod.blue("Serve")} site on: http://localhost:${port}`);
  });

  return app;
}
