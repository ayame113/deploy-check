const file = Deno.args[0];

if (!file) {
  console.log("Entry point required to execute command");
  console.log(
    `ex) deno run --allow-read --allow-run ${import.meta.url} ./your_code.ts`,
  );

  Deno.exit(0);
}

const fileURL = new URL(file, `file:///${Deno.cwd()}/`);
const typeURL = new URL("./dts/deno.window.d.ts", import.meta.url);
const loader = `import type {} from "${typeURL}";import "${fileURL}";`;
const dataURL = `data:application/typescript;base64,${btoa(loader)}`;
const d = Deno.run({ cmd: [Deno.execPath(), "cache", dataURL] });
await d.status();
