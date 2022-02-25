import { path } from "../deps.ts";
import { genCssCode, decoder, getLocalFile, transform, baseDir } from "../utils.ts";
import { AppContext } from "./createServer.ts";

export default function serverMiddleware({ app, root }: AppContext) {
  app.use(async (ctx, next) => {
    const { url } = ctx.request;
    if (url.pathname.startsWith("/@")) {
      const filename = url.pathname.match(/\/@(.+)/)?.[1] as string;
      const origin = path.join(baseDir, filename);
      const filePath = getLocalFile(origin);
      console.log(filePath);

      ctx.response.type = "text/javascript";
      ctx.response.body = "";

      try {
        const { files } = await transform(filePath);

        ctx.response.type = "text/javascript";
        ctx.response.body = files[`${filePath}.js`];
      } catch (error) {
        console.log(error);
      }
    } else if (url.pathname.match(/.[t|j]sx?$/)) {
      const origin = path.join(root, url.pathname);
      const filePath = getLocalFile(origin);

      try {
        const { files } = await transform(filePath);

        ctx.response.type = "text/javascript";
        ctx.response.body = files[`${filePath}.js`];
      } catch (error) {
        console.log(error);
      }
    } else if (url.pathname.endsWith(".css")) {
      const origin = path.join(root, url.pathname);
      const css = decoder(await Deno.readFileSync(origin));

      ctx.response.type = "text/javascript";
      ctx.response.body = genCssCode(url.pathname, css);
    }
    await next();
  });
}
