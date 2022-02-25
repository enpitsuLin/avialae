import { Router } from "https://deno.land/x/oak@v10.4.0/router.ts";
import { path } from "../deps.ts";
import { decoder } from "../utils.ts";
import { createServer } from "./createServer.ts";
import { HMRMiddleware, initHMR } from "./hmr.ts";

const { cwd, readFileSync } = Deno;

export async function commonServer() {
  const app = createServer();
  const router = new Router();

  router.get("/", (ctx, next) => {
    try {
      const entry = readFileSync(path.join(cwd(), "index.html"));
      ctx.response.body = decoder(entry);
    } catch (err) {
      if ((err as Error).name == "NotFound") {
        console.log("entry index.html not found");
      }
    }
    next();
  });

  app.use(router.routes());
  await app.listen({ port: 4000 });
}

export async function hmrServer() {
  const app = createServer([HMRMiddleware]);

  const router = new Router();

  router.get("/", (ctx, next) => {
    try {
      const entry = readFileSync(path.join(cwd(), "index.html"));

      ctx.response.body = decoder(entry).replace("</body>", '  <script type="module">import "/@client/ws.ts"</script>\n</body>');
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

  await app.listen({ port: 4000 });
}
