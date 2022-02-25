import { createServer } from "./createServer.ts";
import { initHMR } from "./hmr.ts";

export async function commonServer() {}

export async function hmrServer() {
  const app = createServer();
  app.use(async (ctx, next) => {
    if (ctx.request.url.pathname == "/sock") {
      const sock = await ctx.upgrade();
      initHMR(sock);
    }
    await next();
  });
  await app.listen({ port: 4000 });
}
