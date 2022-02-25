import { path } from "./deps.ts";
const { emit, cwd } = Deno;
const root = cwd();

export function decoder(b: Uint8Array) {
  return new TextDecoder().decode(b);
}

export async function transform(source: string) {
  const result = await emit(source, {
    compilerOptions: { jsx: "react", lib: ["dom", "dom.iterable", "deno.ns", "deno.unstable"] }
  });
  return result;
}

export function getLocalFile(file: string) {
  return ("file:///" + file).replaceAll(/\\/g, "/");
}

export function genCssCode(id: string, css: string) {
  const code =
    `import { updateStyle } from "/@module/client/client.ts";\n` +
    `const css = ${JSON.stringify(css)}\n` +
    `updateStyle("${id}",css)`;
  return code;
}
