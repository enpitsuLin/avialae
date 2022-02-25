import { createServer } from "./createServer.ts";
import { HMRMiddleware, initHMR } from "./hmr.ts";

export async function commonServer() {
  const app = createServer();
  await app.listen({ port: 4000 });
}

export async function hmrServer() {
  const app = createServer([HMRMiddleware]);
  app.use(async (ctx, next) => {
    if (ctx.request.url.pathname == "/sock") {
      const sock = await ctx.upgrade();
      initHMR(sock);
    }
    await next();
  });
  await app.listen({ port: 4000 });
}
