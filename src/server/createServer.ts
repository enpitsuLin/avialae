import { Application, Router } from "https://deno.land/x/oak@v10.4.0/mod.ts";
import { mod } from "../deps.ts";
import serverMiddleware from "./middleware.ts";

const { cwd } = Deno;

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

  plugins = [...plugins, serverMiddleware];
  plugins.forEach((plugin) => plugin(context));

  app.addEventListener("listen", ({ port }) => {
    console.log(`${mod.blue("Serve")} site on: http://localhost:${port}`);
  });

  return app;
}
