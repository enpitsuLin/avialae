import { mod } from "../deps.ts";
import { AppContext } from "./createServer.ts";

export interface HMRPayload {
  type: "connected" | "update";
  timestamp: number;
  path: string;
}

const { watchFs, cwd } = Deno;

const root = cwd();

export async function initHMR(sock: WebSocket) {
  sock.onopen = (e) => {
    sock.send(JSON.stringify({ type: "connected", path: "", timestamp: new Date().getTime() } as HMRPayload));
  };

  const watcher = watchFs(root);

  const timeMap = new Map<string, number>();

  for await (const event of watcher) {
    const { kind, paths } = event;

    const timestamp = new Date().getTime();
    const path = paths[0];
    const name = paths[0].replace(root, "");
    const oldTime = timeMap.get(name);

    if (!oldTime || oldTime + 1000 < timestamp) {
      let hmrPayload: HMRPayload | null = null;

      if (kind === "modify") hmrPayload = { timestamp, path: name, type: "update" };

      if (hmrPayload !== null && sock.readyState === WebSocket.OPEN) {
        sock.send(JSON.stringify(hmrPayload));
        console.log(`${mod.blue("[hmr]")} ${mod.blue(kind)} ${path}`);
      }
    }

    timeMap.set(name, timestamp);
  }
}

export function HMRMiddleware({ app, root }: AppContext) {
  app.use(async (ctx, next) => {
    // console.log(ctx.request.url);

    await next();
  });
}
