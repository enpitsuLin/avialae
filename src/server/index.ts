import { createServer } from "./createServer.ts";

export async function commonServer() {
  const app = createServer();
  await app.listen({ port: 4000 });
}

export async function hmrServer() {
  //TODO(@enpitsulin) HMR Server
}
