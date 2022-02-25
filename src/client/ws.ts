import { HMRPayload } from "../server/hmr.ts";

const wsp = location.protocol === "https:" ? "wss" : "ws";

const ws = new WebSocket(`${wsp}://localhost:4000/sock`);

ws.addEventListener("message", ({ data }) => {
  const payload: HMRPayload = JSON.parse(data);
  handleMessage(payload);
});

async function handleMessage(payload: HMRPayload) {
  const { timestamp, path, type } = payload;
  switch (type) {
    case "connected":
      console.log(`[hmr] connected.`);
      break;
    case "update":
      await import(`../${path}?t=${timestamp}`).then((mods) => {
        console.log(mods);
      });
      console.log(`[hmr] ${path} updated.`);
      break;
    default:
      break;
  }
}

ws.onerror = (e) => {
  throw e;
};

ws.onclose = () => console.log("[hmr] disconnected.");
