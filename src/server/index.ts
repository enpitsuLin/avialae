import { createServer } from "./createServer.ts";

export async function serve({ root, port }: { root?: string; port: number }) {
  const app = await createServer({ root });

  await app.listen({ port });
}
